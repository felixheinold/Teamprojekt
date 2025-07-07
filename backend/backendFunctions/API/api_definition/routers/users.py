from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, List
from firebase import db
import datetime

router = APIRouter(
    prefix ="/users",
    tags = ["Users"],
)

#Datenmodell Game_Type
class Game_Type(BaseModel):
    total_games: int
    total_points: int
    best_Score: int
    accuracy: float #Prozentzahl: Berechnung überlegen
    last_played: str
    repetition_content: List[str] #alle IDs von Fragen, Memory-Paaren //oder Satz mit Lücken, die User wiederholen will

# Datenmodell User Game Information
class User_Game_Information(BaseModel):
    highscore: int #wir müssen alles einheitlich bepunkten!
    highscore_table_ranking: int #an welcher Stelle in Bestenliste
    total_points: int #alle punkte aus allen Spielen jemals
    daily_points_goal: int
    quiz: Game_Type
    memory: Game_Type
    gapfill: Game_Type

#Datenmodell User
class User(BaseModel):
    user_id: str
    user_mail: str
    user_name: str
    user_profile_picture: str
    profile_creation_date: str
    last_login_date: str
    login_count: int
    total_login_time: str
    preferred_language: str # nur “de” oder “en”
    preferred_theme: str # nur “dark” oder “ light"
    user_game_information: User_Game_Information


#Datenmodell für User-Erzeugung durch Firebase Auth
class CreateUser(BaseModel):
    id: str
    email: str
    name: str

# Datenmodell für generisches User-Update
class GeneralUserUpdating(BaseModel):
    user_updates: Dict[str, str | int | float | bool | dict]

# Datenmodell für User Game Info Updates, aber nur übergeordnete Game-Infos
class GeneralGameUserUpdating(BaseModel):
    user_updates: Dict[str, str | int | float | bool | dict]

# Datenmodell für User-Updates in einzelnen Spielkategorien
class SpecificGameUserUpdating(BaseModel):
    user_updates: Dict[str, str | int | float | bool | dict]

#Handling von user-Daten

#einen User anfragen
@router.get("/{user_id}")
async def get_user(user_id: str):
    doc_ref = db.collection("users").document(user_id)
    doc = doc_ref.get()
    if doc.exists:
        return doc.to_dict()
    else:
        return {"error": "User nicht gefunden"}
    

#User-Informationen anfragen   
@router.get("/{user_id}/{field}")
def get_field(user_id: str, field: str):
    user_doc = db.collection("users").document(user_id).get()
    if user_doc.exists:
        data = user_doc.to_dict()
        if field in data:
            return {field: data[field]}
        return {"error": f"Feld '{field}' nicht gefunden"}
    return {"error": "User nicht gefunden"}


#neuen User erzeugen
@router.post("/new-user")
async def create_user(create_user: CreateUser):
    user =  User(
        create_user.id,
        create_user.email,
        create_user.name,
        profile_creation_date=str(datetime.utcnow()),
        last_login_date=str(datetime.utcnow()),
        login_count=1,
        total_login_time="1",
        preferred_language="de",
        preferred_theme="light",
        user_game_information=User_Game_Information(
            highscore=0,
            highscore_table_ranking=0,
            total_points=0,
            daily_points_goal=10,
            quiz=Game_Type(total_games = 0, total_points = 0, best_Score = 0, accuracy = 0.0 , last_played = "", repetition_content = []),  
            memory=Game_Type(total_games = 0, total_points = 0, best_Score = 0, accuracy = 0.0 , last_played = "", repetition_content = []),
            gapfill=Game_Type(total_games = 0, total_points = 0, best_Score = 0, accuracy = 0.0 , last_played = "", repetition_content = [])
        )
    )
    doc_ref = db.collection("users").document(user.user_id)
    doc_ref.set(user.model_dump_json())
    return {"status": "User gespeichert"}


#User-Informationen (allgemein) updaten
@router.post("/{user_id}/update-general-info")
def update_user(user: User, user_updating: GeneralUserUpdating):
    user_ref = db.collection("users").document(user.user_id)
    user_ref.set(user_updating.user_updates, merge=True)  # 🔁 nur die angegebenen Felder werden aktualisiert
    return {"status": f"Update für {user.user_id}", "updated": user_updating.user_updates}


#User-Spielinformationen updaten
@router.post ("/{user_id}/update-general-game-info")
def update_gen_game_info(user_id: str, updating: GeneralGameUserUpdating):
    user_ref = db.collection("users").document(user_id)

    update_data = {
        f"user_game_information.{key}": value
        for key, value in updating.model_dump(exclude_none=True).items()
    }
    user_ref.update(update_data, merge = True)
    return {"status": "user game info updated"}

#User-Spielinformationen eines spezifischen Spieltyps updaten
#@router.post ("/{user_id}/update-general-game-info")

#User löschen
@router.delete("/{user_id}")
def delete_user(user_id:str):
    user_ref = db.collection("users").document(user_id)
    if user_ref.get().exists:
        user_ref.delete()
        return {"status" : f"User {user_id} gelöscht"}
    return {"error": "User nicht gefunden"}

