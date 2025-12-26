import typing
from datetime import datetime
from sqlmodel import SQLModel, Field, TIMESTAMP, Column, text

class Users(SQLModel, table=True):
    __tablename__ = "users"
    id : int | None = Field(primary_key=True, default=None)
    username : str
    password_hash : str
    creation_date : datetime = Field(sa_column=Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("CURRENT_TIMESTAMP")))

class Memory(SQLModel, table=True):
    __tablename__ = "memory"
    id : int | None = Field(primary_key=True, default=None)
    memory_name : str
    memory_info : str
    memory_img_url : str
    memory_date : datetime = Field(sa_column=Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("CURRENT_TIMESTAMP")))
    user_id : int | None = Field(foreign_key="users.id", ondelete="CASCADE", default=None)