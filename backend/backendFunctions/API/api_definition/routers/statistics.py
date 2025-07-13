from fastapi import APIRouter
from firebase import db


router = APIRouter(
    prefix ="/statistics",
    tags = ["statistics"],
)