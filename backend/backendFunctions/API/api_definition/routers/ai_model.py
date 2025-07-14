from fastapi import APIRouter, Query, UploadFile, File, Form
from firebase_admin import storage
from pydantic import BaseModel
from firebase import db
from typing import Optional, Dict, List, Literal
from google.cloud import firestore
from enum import Enum
import json
import tempfile


router = APIRouter (
    prefix = "/ai-model",
    tags=["AI-Model"]
)

class GameUnit(BaseModel):
    id: str
    title:str    
    content: str
    answers: List[str]    
    chapter: str    
    lecture: str
    module: str
    difficulty: Optional[str] = None
    language: Literal ["de", "en"]
    type: Literal ["memory", "gapfill", "quiz"]

class GameUnitUpdates(BaseModel):
    updates: Dict[str, str | None]

#einen neuen Spielinhalt anlegen
@router.post("/add-new-game-unit")
async def new_game_unit (unit: GameUnit):
    unit_doc_ref = db.collection("ai-model").document(unit.id)
    unit_doc_ref.set({
        unit.model_dump()
     }, 
    merge=True)
    return {"status: new game unit successfully implemented."}

#einen Spielinhalt löschen (durch id-Übergabe)
@router.delete("/delete-game-unit/{unit_id}")
async def delete_game_unit (unit_id: str):
    query = db.collection("ai-model").where("id", "==", unit_id).stream()
    docs = list(query)
    if docs:
        docs[0].reference.delete()
    return {"status: game unit deleted."}

#einen Spielinhalt verändern
@router.update("/update-game-unit/{unit_id}")
async def update_game_unit(unit_id: str, guup: GameUnitUpdates):
    query = db.collection("ai-model").where("id", "==", unit_id).stream()
    docs = list(query)
    if docs:
        docs[0].reference.set(guup.updates, merge = True)
    return {"status: game unit updated."}

#einen Spielinhalt vollständig bekommen
@router.get("/fetch-game-units")
async def fetch_game_units(
    id: Optional [str] = Query(None),
    title: Optional [str] = Query(None),  
    #content: Optional [str],
    #answer: Optional [str],    
    chapter: Optional [str] =  Query(None),   
    lecture: Optional [str] = Query(None),
    module: Optional [str] = Query(None),
    difficulty: Optional[str] = Query(None),
    language: Optional[str] =  Query(None),
    type: Optional [str] =  Query(None)
    ):
    filters = []
    if (id):
        filters.append(("id", "==", id))
    if (title):
        filters.append(("title", "==", title))
    if (chapter):
        filters.append(("chapter", "==", chapter))
    if (lecture):
        filters.append(("lecture", "==", lecture))
    if (module):
        filters.append(("module", "==", module))
    if (difficulty):
        filters.append(("difficulty", "==", difficulty))
    if (language):
        filters.append(("language", "==", language))
    if (type):
        filters.append(("type", "==", type))
    
    units_doc_ref = db.collection("ai-model")
    for field, op, value in filters:
        units_doc_ref = units_doc_ref.where(field, op, value)
    
    results = [doc.to_dict() for doc in units_doc_ref.stream()]
    return results
    

#Ein PDF in firebase hochladen

@router.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...),
                     module: str = Form(...),
                     lecture: str = Form(...),
                     chapter: str = Form(...)):
    if file.content_type != "application/pdf":
        return {"error": "Nur PDF-Dateien erlaubt"}

    bucket = storage.bucket()
    blob = bucket.blob(f"pdfs/{module}/{lecture}/{chapter}{file.filename}")

    # Temporäre Datei zum Hochladen
    with tempfile.NamedTemporaryFile() as temp:
        content = await file.read()
        temp.write(content)
        temp.flush()
        blob.upload_from_filename(temp.name, content_type="application/pdf")

    url = blob.public_url
    return {"url": url, "status": "saved pdf successfully"}



# class Language(str, Enum):
#     de = "de"
#     en = "en"

# class Answer(BaseModel):
#     answer_text: str
#     is_correct: bool

# class Module(BaseModel):
#     name: str

# class Lecture(BaseModel):
#     name:str

# class Chapter(BaseModel):
#     name:str

# class Question(BaseModel):
#     id: str
#     #title:str
#     content: str
#     answers: List[Answer]
#     chapter: str
#     lecture: str
#     module: str
#     difficulty: Optional[str] = None
#     type: Optional[str] = None
#     language: Language

# #Memory Gapfill Erweiterung !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

# async def firestore_refs_for_new_question (question_id: str) -> any:
#     ai_model_doc_ref = db.collection("ai-model")
#     modul_doc_ref = ai_model_doc_ref.collection("Module").document(question.module)
#     vorlesung_doc_ref = modul_doc_ref.collection("Vorlesungen").document(question.lecture)
#     kapitel_doc_ref = vorlesung_doc_ref.collection("Kapitel").document(question.chapter)
#     quiz_questions_doc_ref = kapitel_doc_ref.collection("Spielinhalte").document("Quiz-Fragen-Doc")
#     return quiz_questions_doc_ref

# async def firestore_refs_for_get_requests(module_name:str, lecture_name:str, chapter_name:str):
#     ref = db.collection("ai-model")
#     ref = ref.collection("Module").document(module_name)
#     if(lecture_name):
#         ref = ref.collection("Vorlesungen").document(lecture_name)
#         if(chapter_name):
#             ref = ref.collection("Kapitel").document(chapter_name)
#     return ref

# #quiz: eine neue Frage anlegen
# @router.post("/quiz/add-new-question")
# async def new_question (question: Question):

#     quiz_questions_doc_ref = await firestore_refs_for_new_question(question)
#     quiz_questions_doc_ref.set({
#         question.id: question.model_dump_json() #ArrayUnion([question.model_dump_json()])
#     }, 
#     merge=True)


# #quiz: eine Frage löschen (basierend auf question_id)
# @router.post("/quiz/delete-question/{question_id}")
# async def new_question (question_id: str):
    
#     quiz_questions_doc_ref = await firestore_refs_for_new_question(question_id)
#     quiz_questions_doc_ref.update({
#         question.id: firestore.DELETE_FIELD #ArrayUnion([question.model_dump_json()])
#     }, 
#     merge=True)

# #quiz: alle Fragen anfordern (entsprechend gewähltem Modul/VL/Kapitel)
# @router.get("/quiz/get-questions/{module_name}/{lecture_name}/{chapter_name}/get-questions", response_model = [Question])
# async def get_questions(module_name: str, lecture_name: str, chapter_name: str):
#     ref = await firestore_refs_for_get_requests(module_name, lecture_name, chapter_name)
#     questions = ref.collection("Spielinhalte").document("Quiz-Fragen-Doc").get()
#     if questions.exists:
#         return questions
#     else:
#         return {"error: Keine Fragen gefunden"}


# #allgemein: alle Module, die vorliegen, anfordern
# @router.get("/general/get-all-modules", response_model = [Module])
# async def get_modules():
#     ref = db.collection("ai-model")
#     modules = [module.id for module in ref.stream()]
#     if modules != []:
#         return modules
#     else:
#         return {"error: Keine Module gefunden"}

# #allgemein: alle Vorlesungen eines Moduls anfordern
# @router.get("/general/get-questions/{module_name}/get-all-lectures", response_model = [Lecture])
# async def get_question(module_name: str):
#     ref = await firestore_refs_for_get_requests(module_name, None, None)
#     lectures = [lecture.id for lecture in ref.stream()]
#     if ref.exists:
#         return lectures
#     else:
#         return {"error: Keine Vorlesungen gefunden"}

# #allgemein: alle Kapitel einer Vorlesung eines Moduls anfordern
# @router.get("/general/get-questions/{module_name}/{lecture_name}/get-all-chapters", response_model = [Chapter])
# async def get_question(module_name: str, lecture_name: str):
#     ref = await firestore_refs_for_get_requests(module_name, lecture_name, None)
#     chapters = [chapter.id for chapter in ref.stream()]
#     if ref.exists:
#         return chapters
#     else:
#         return {"error: Keine Vorlesungen gefunden"}
    

