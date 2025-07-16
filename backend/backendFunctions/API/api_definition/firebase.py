from firebase_admin import credentials, firestore, initialize_app
import json
import os
from dotenv import load_dotenv

load_dotenv()

#Firebase initialisieren, firebase-admin-SDK Schlüssel liegt in Umgebungsvariable FIREBASE_CREDENTIALS_JSON

cred = credentials.Certificate(json.loads(os.getenv("FIREBASE_CREDENTIALS_JSON")))
initialize_app(cred, {
    "storageBucket":"gs://edukit-tp.firebasestorage.app"
})

db = firestore.client()