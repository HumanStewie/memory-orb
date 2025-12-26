from sqlmodel import SQLModel
from datetime import datetime

class UserPublic(SQLModel):
    id: int
    username: str
    creation_date : datetime

class UserCreate(SQLModel):
    username: str
    password: str