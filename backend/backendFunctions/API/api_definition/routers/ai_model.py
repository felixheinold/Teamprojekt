from fastapi import APIRouter
from pydantic import BaseModel
from firebase import db
from typing import Optional, Dict, List
from google.cloud import firestore
from google.cloud.firestore_v1 import ArrayUnion
from enum import Enum
import json


router = APIRouter (
    prefix = "/ai-model",
    tags=["AI-Model"]
)

class Language(str, Enum):
    de = "de"
    en = "en"

class Answer(BaseModel):
    answer_text: str
    is_correct: bool

class Question(BaseModel):
    id: str
    content: str
    answers: List[Answer]
    chapter: str
    lecture: str
    module: str
    difficulty: Optional[str] = None
    type: Optional[str] = None
    language: Language



#eine neue Frage anlegen
@router.post("/single-new-question")
async def new_question (question: Question):
    modul_doc_ref = db.collection("Module").document(question.module)
    vorlesung_doc_ref = modul_doc_ref.collection("Vorlesungen").document(question.lecture)
    kapitel_doc_ref = vorlesung_doc_ref.collection("Kapitel").document(question.chapter)

    kapitel_doc_ref.set({
        "Fragen": ArrayUnion([question.model_dump_json()])
    }, 
    merge=True)

#mehrere neue Fragen anlegen