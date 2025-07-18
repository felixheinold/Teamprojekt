from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, List, Optional, Any
from firebase import db
from datetime import datetime
from fastapi import HTTPException
from pydantic import ValidationError



router = APIRouter(
    prefix="/users",
    tags=["users"],
)

# Datenmodell Game_Type
class Game_Type(BaseModel):
    total_games: int
    total_points: int
    max_points: int
    best_Score: int
    accuracy: float
    last_played: str
    repetition_content: List[str]
    answered_correctly_content: List[str]

# Datenmodell User Game Information
class User_Game_Information(BaseModel):
    highscore: int
    highscore_table_ranking: int
    total_points: int
    daily_points_goal: int
    quiz: Game_Type
    memory: Game_Type
    gapfill: Game_Type

# Datenmodell User
class User(BaseModel):
    user_id: str
    user_mail: str 
    user_name: str
    user_profile_picture: str
    profile_creation_date: str
    last_login_date: str
    login_count: int
    total_login_time: str
    preferred_language: str
    preferred_theme: str
    user_game_information: User_Game_Information

# Datenmodell für User-Erzeugung durch Firebase Auth
class CreateUser(BaseModel):
    id: str
    email: str
    name: str
    picture: str

# Allgemeines User-Update
class GeneralUserUpdating(BaseModel):
    user_updates: Dict[str, Any]

# Übergeordnetes Game-Update
class GeneralGameUserUpdating(BaseModel):
    user_updates: Dict[str, Any]

# Spezifisches Game-Update
class SpecificGameUserUpdating(BaseModel):
    user_updates: Dict[str, Any]


# === ROUTES ===

# GET: Nutzerdaten holen
@router.get("/{user_id}")
def get_user(user_id: str, field: Optional[str] = None):
    user_doc = db.collection("users").document(user_id).get()
    if not user_doc.exists:
        raise HTTPException(status_code=404, detail="User nicht gefunden")
    
    data = user_doc.to_dict()
    
    if field:
        if field in data:
            return {field: data[field]}
        else:
            raise HTTPException(status_code=404, detail=f"Feld '{field}' nicht gefunden")
    
    return data


# POST: Neuen Nutzer anlegen
@router.post("/new-user")
async def create_user(create_user: CreateUser):
    now = datetime.utcnow().isoformat()
    user = User(
        user_id=create_user.id,
        user_mail=create_user.email,
        user_name=create_user.name,
        user_profile_picture=create_user.picture,
        profile_creation_date=now,
        last_login_date=now,
        login_count=0,
        total_login_time="0",
        preferred_language="de",
        preferred_theme="light",
        user_game_information=User_Game_Information(
            highscore=0,
            highscore_table_ranking=0,
            total_points=0,
            daily_points_goal=10,
            quiz=Game_Type(total_games = 0, total_points = 0, max_points = 0, best_Score = 0, accuracy = 0.0 , last_played = "", repetition_content = [], answered_correctly_content=[]),  
            memory=Game_Type(total_games = 0, total_points = 0, max_points = 0, best_Score = 0, accuracy = 0.0 , last_played = "", repetition_content = [], answered_correctly_content=[]),
            gapfill=Game_Type(total_games = 0, total_points = 0, max_points = 0, best_Score = 0, accuracy = 0.0 , last_played = "", repetition_content = [], answered_correctly_content=[])
        )
    )
    doc_ref = db.collection("users").document(user.user_id)
    doc_ref.set(user.model_dump())
    return {"status": "User gespeichert"}


# PUT: Ganzen Nutzer aktualisieren
@router.put("/update-whole-user/{user_id}")
def update_whole_user(user_id: str, user_updating: User):
    try:
        # Falls das Objekt bereits User ist, kann man skippen – ansonsten validieren:
        parsed = User(**user_updating.dict())
    except ValidationError as e:
        print("VALIDIERUNGSFEHLER:", e)
        raise HTTPException(status_code=422, detail=e.errors())

    db.collection("users").document(user_id).set(parsed.dict(), merge=True)
    return {"status": "User gespeichert", "updated": parsed.dict()}


#User-Informationen (allgemein) updaten
@router.put("/update-general-info/{user_id}")
def update_user(user_id: str, user_updating: GeneralUserUpdating):
    db.collection("users").document(user_id).set(user_updating.user_updates, merge=True)
    return {"status": f"Update für {user_id}", "updated": user_updating.user_updates}


# PUT: Übergeordnete Game-Info aktualisieren
@router.put("/update-general-game-info/{user_id}")
def update_gen_game_info(user_id: str, updating: GeneralGameUserUpdating):
    update_data = {
        f"user_game_information.{key}": value
        for key, value in updating.user_updates.items()
    }
    db.collection("users").document(user_id).update(update_data)
    return {"status": f"Update für {user_id}", "updated": updating.user_updates}


# PUT: Spezifische Game-Kategorie aktualisieren
@router.put("/update-specific-game-info/{user_id}/{game_type}")
def update_spec_game_info(user_id: str, game_type: str, updating: SpecificGameUserUpdating):
    update_data = {
        f"user_game_information.{game_type}.{key}": value
        for key, value in updating.user_updates.items()
    }
    db.collection("users").document(user_id).update(update_data)
    return {"status": f"Update für {user_id}", "updated": updating.user_updates}


# DELETE: Nutzer löschen
@router.delete("/{user_id}")
def delete_user(user_id: str):
    user_ref = db.collection("users").document(user_id)
    if user_ref.get().exists:
        user_ref.delete()
        return {"status": f"User {user_id} gelöscht"}
    else:
        raise HTTPException(status_code=404, detail="User nicht gefunden")
