import typing
import sqlmodel
from sqlmodel import SQLModel
from fastapi import FastAPI, Depends
import os
from dotenv import load_dotenv

load_dotenv()

postgres_sql = os.getenv("DATABASE")
secret_key = os.getenv("SECRET_KEY")
algorithm = os.getenv("ALGORITHM")
expire_time = os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")
cloudin_api = os.getenv("CLOUDINARY_URL")
engine = sqlmodel.create_engine(postgres_sql, echo=True, pool_pre_ping=True)
