from fastapi import FastAPI
import firebase_admin
from firebase_admin import credentials, firestore
from pydantic import BaseModel
from typing import Dict

api = FastAPI()

#Firebase initialisieren, firebase-admin-SDK Schlüssel muss hier abgelegt werden

cred = credentials.Certificate("***HIER EIGENEN SCHLÜSSEL JSON EINFÜGEN***")
firebase_admin.initialize_app(cred)

db = firestore.client()

#Datenmodell User
class User(BaseModel):
    user_id: str
    user_name: str
    user_mail: str
    user_password:str
    user_profile_picture: str
    user_game_info: dict # muss weiter angepasst werden

# Datenmodell für generisches User-Update
class UserUpdating(BaseModel):
    user_updates: Dict[str, str | int | float | bool | dict]

@api.get("/")
async def root():
    return {"message": "API works!"}


#Handling von user-Daten

#einen User anfragen
@api.get("/users/{user_id}")
async def get_user(user_id: str):
    doc_ref = db.collection("users").document(user_id)
    doc = doc_ref.get()
    if doc.exists:
        return doc.to_dict()
    else:
        return {"error": "User nicht gefunden"}

#User-Informationen anfragen   
@api.get("/users/{user_id}/{field}")
def get_field(user_id: str, field: str):
    user_doc = db.collection("users").document(user_id).get()
    if user_doc.exists:
        data = user_doc.to_dict()
        if field in data:
            return {field: data[field]}
        return {"error": f"Feld '{field}' nicht gefunden"}
    return {"error": "User nicht gefunden"}

#neuen User erzeugen
@api.post("/users/{user_id}")
async def create_user(user_id: str, user_data: dict):
    doc_ref = db.collection("users").document(user_id)
    doc_ref.set(user_data)
    return {"status": "User gespeichert"}


#User-Informationen (allgemein) updaten
@api.post("/users/{user_id}/update")
def update_user(user_id: str, user_updating: UserUpdating):
    user_ref = db.collection("users").document(user_id)
    user_ref.set(user_updating.user_updates, merge=True)  # 🔁 nur die angegebenen Felder werden aktualisiert
    return {"status": f"Update für {user_id}", "updated": user_updating.user_updates}


#User löschen
@api.delete("/users/{user_id}")
def delete_user(user_id:str):
    user_ref = db.collection("users").document(user_id)
    if user_ref.get().exists:
        user_ref.delete()
        return {"status" : f"User {user_id} gelöscht"}
    return {"error": "User nicht gefunden"}