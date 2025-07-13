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

class Module(BaseModel):
    name: str

class Lecture(BaseModel):
    name:str

class Chapter(BaseModel):
    name:str

class Question(BaseModel):
    id: str
    #title:str
    content: str
    answers: List[Answer]
    chapter: str
    lecture: str
    module: str
    difficulty: Optional[str] = None
    type: Optional[str] = None
    language: Language

#Memory Gapfill Erweiterung !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

async def firestore_refs_for_new_question (question: Question) -> any:
    ai_model_doc_ref = db.collection("ai-model")
    modul_doc_ref = ai_model_doc_ref.collection("Module").document(question.module)
    vorlesung_doc_ref = modul_doc_ref.collection("Vorlesungen").document(question.lecture)
    kapitel_doc_ref = vorlesung_doc_ref.collection("Kapitel").document(question.chapter)
    quiz_questions_doc_ref = kapitel_doc_ref.collection("Spielinhalte").document("Quiz-Fragen-Doc")
    return quiz_questions_doc_ref

async def firestore_refs_for_get_requests(module: Module, lecture: Lecture, chapter: Chapter):
    ref = db.collection("ai-model")
    ref = ref.collection("Module").document(module.name)
    if(lecture):
        ref = ref.collection("Vorlesungen").document(lecture.name)
        if(chapter):
            ref = ref.collection("Kapitel").document(chapter.name)
    return ref

#quiz: eine neue Frage anlegen
@router.post("/quiz/add-new-question")
async def new_question (question: Question):

    quiz_questions_doc_ref = await firestore_refs_for_new_question(question)
    quiz_questions_doc_ref.set({
        question.id: question.model_dump_json() #ArrayUnion([question.model_dump_json()])
    }, 
    merge=True)


#quiz: eine Frage löschen (basierend auf question_id)
@router.post("/quiz/delete-question")
async def new_question (question: Question):
    
    quiz_questions_doc_ref = await firestore_refs_for_new_question(question)
    quiz_questions_doc_ref.update({
        question.id: firestore.DELETE_FIELD #ArrayUnion([question.model_dump_json()])
    }, 
    merge=True)

#quiz: alle Fragen anfordern (entsprechend gewähltem Modul/VL/Kapitel)
@router.get("/quiz/get-questions/{module}/{lecture}/{chapter}/get-questions")
async def get_question(module: Module, lecture: Lecture, chapter: Chapter):
    ref = await firestore_refs_for_get_requests(module, lecture, chapter)
    questions = ref.collection("Spielinhalte").document("Quiz-Fragen-Doc").get()
    if questions.exists:
        return questions
    else:
        return {"error: Keine Fragen gefunden"}


#allgemein: alle Module, die vorliegen, anfordern
@router.get("/general/get-all-modules")
async def get_question():
    ref = db.collection("ai-model")
    modules = [module.id for module in ref.stream()]
    if modules != []:
        return modules
    else:
        return {"error: Keine Module gefunden"}

#allgemein: alle Vorlesungen eines Moduls anfordern
@router.get("/general/get-questions/{module}/get-all-lectures")
async def get_question(module: Module):
    ref = await firestore_refs_for_get_requests(module, None, None)
    lectures = [lecture.id for lecture in ref.stream()]
    if ref.exists:
        return lectures
    else:
        return {"error: Keine Vorlesungen gefunden"}

#allgemein: alle Kapitel einer Vorlesung eines Moduls anfordern
@router.get("/general/get-questions/{module}/{lecture}/get-all-chapters")
async def get_question(module: Module, lecture: Lecture):
    ref = await firestore_refs_for_get_requests(module, lecture, None)
    chapters = [chapter.id for chapter in ref.stream()]
    if ref.exists:
        return chapters
    else:
        return {"error: Keine Vorlesungen gefunden"}
    

