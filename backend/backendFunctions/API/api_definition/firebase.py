from firebase_admin import credentials, firestore, initialize_app
import json
import os
#from dotenv import load_dotenv #--> for local testing

#load_dotenv() #--> for local testing; you need to set the expected environment variable FIREBASE_CREDENTIALS_JSON in an .env file

#Firebase initialisieren, firebase-admin-SDK Schlüssel liegt in Umgebungsvariable FIREBASE_CREDENTIALS_JSON

cred = credentials.Certificate(json.loads(os.getenv("FIREBASE_CREDENTIALS_JSON")))

initialize_app(cred, {
    "storageBucket":"edukit-tp.firebasestorage.app"
})

db = firestore.client()