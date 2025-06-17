from fastapi import APIRouter
from firebase import db


router = APIRouter(
    prefix ="/users",
    tags = ["Users"],
)