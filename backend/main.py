from .models import Users, Memory
from .database import engine, secret_key, algorithm, expire_time
from sqlmodel import SQLModel, Session, select
from fastapi import FastAPI, Depends, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Annotated, List
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from fastapi.responses import JSONResponse
import jwt
from jwt.exceptions import InvalidTokenError
from datetime import timedelta, datetime, timezone
from .storage import uploadImage, get_url


app = FastAPI()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
# Our React routing, this is for CORS to ensure connection with FastAPI - Run 'fastapi dev main.py'
origins = [
    "http://localhost:5173",
    "localhost:5173",
    "http://127.0.0.1:5173"
]
app.add_middleware(CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Pydantic Models
class LoginData(BaseModel):
    username : str
    password : str
class Token(BaseModel):
    access_token : str
    token_type : str


def create_access_token(data: dict, expire_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    if expire_delta:
        expire = datetime.now(timezone.utc) + expire_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, secret_key, algorithm=algorithm)
    return encoded_jwt


# Our encryption context - Argon2
pwcontext = CryptContext(schemes=["argon2"])
def get_password_hash(password) -> str:
    return pwcontext.hash(password)


# Getting session and closing it after every call
def get_session():
    with Session(engine, autocommit=False, autoflush=False) as session:
        yield session

# Get current user
async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], session : Session = Depends(get_session)):
    try:
        payload = jwt.decode(token, secret_key, algorithms=[algorithm])
    except InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=403, detail="Token expired!")
    user = session.exec(select(Users).where(Users.username == payload.get("sub"))).first()
    if user is not None:
        return user
    else:
        raise HTTPException(status_code=401, detail="User not found.")

@app.get("/users/me")
async def read_users_me(current_user = Depends(get_current_user)):
    return current_user

@app.post("/signup")
async def signup(data : LoginData, session : Session = Depends(get_session)):
    user = session.exec(select(Users).where(Users.username == data.username)).first()
    if user is not None:
        return JSONResponse(status_code=400, content={"Status": "Invalid username or password"})
    else:
        hashed = get_password_hash(data.password)
        new_user = Users(username=data.username, password_hash=hashed) # type: ignore
        session.add(new_user)
        session.commit()
        session.refresh(new_user)
        return {"Status": "Account Created."}

@app.post("/login")
async def login(data : LoginData, session : Session = Depends(get_session)):
    db_user = session.exec(select(Users).where(Users.username == data.username)).first()

    if db_user is not None:
        result : bool = pwcontext.verify(data.password, db_user.password_hash)
        if result:
            token = create_access_token(data={"sub": db_user.username}, expire_delta=timedelta(minutes=int(expire_time)))
            return {"access_token": token, "token_type": "bearer"}
        else:
            return JSONResponse(status_code=400, content={"Status": "Invalid username or password."})
    else:
        return JSONResponse(status_code=400, content={"Status": "Invalid username or password."})

@app.post("/memory")
async def create_memory(memoryName : str = Form(),
                        memoryInfo : str = Form(),
                        memoryImage : UploadFile = File(),
                        date : datetime = Form(),
                        current_user = Depends(get_current_user),
                        session : Session = Depends(get_session)):
    response = uploadImage(memoryImage.file)
    if response is None:
        return JSONResponse(status_code=400, content={"Status": "Unable to upload files"})
    
    img_url = get_url(response)
    if img_url is None:
        return JSONResponse(status_code=400, content={"Status": "Unable to find file's url"})
    
    new_memory = Memory(memory_name=memoryName, memory_info=memoryInfo, memory_img_url=img_url, memory_date=date, user_id=current_user.id)
    session.add(new_memory)
    session.commit()
    session.refresh(new_memory)
    return {"Status": "New memory added!"}

def select_current_memory(session : Session, user_id : int):
    memoryObj = session.exec(select(Memory.id, Memory.memory_name, Memory.memory_info, Memory.memory_date, Memory.memory_img_url).where(Memory.user_id == user_id)).all() # type: ignore
    if memoryObj is None:
        return JSONResponse(status_code=400, content={"Status": "No Details given."})
    return memoryObj



@app.get("/get_memory", response_model=List[Memory])
async def get_memory(current_user = Depends(get_current_user),
                     session : Session = Depends(get_session)):
    memoryObj = select_current_memory(session, current_user.id)
    
    return memoryObj

@app.delete("/delete_memory/{memory_id}")
async def delete_memory(memory_id : int, current_user = Depends(get_current_user),
                     session : Session = Depends(get_session)):
    memory = session.exec(select(Memory).where(Memory.id == memory_id)).first()
    if not memory:
        raise HTTPException(status_code=404, detail="Memory not found.")
    
    if memory.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You are not authorized to perform this action.")
    
    session.delete(memory)
    session.commit()
    return {"Status": "Memory deleted"}