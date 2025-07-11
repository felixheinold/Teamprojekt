from firebase_admin import credentials, firestore, initialize_app
import json
import os

#Firebase initialisieren, firebase-admin-SDK Schlüssel liegt in Umgebungsvariable FIREBASE_CREDENTIALS_JSON

cred = credentials.Certificate(json.loads(os.getenv("FIREBASE_CREDENTIALS_JSON")))
initialize_app(cred)

db = firestore.client()