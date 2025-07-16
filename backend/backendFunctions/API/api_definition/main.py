from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import users, ai_model, statistics

api = FastAPI(
    title="API für das Teamprojekt EDUKIT",
    description="Diese API dient der Kommunikation von Frontend und Backend im Teamprojekt EDUKIT. Sie "
                "erlaubt den Umgang mit Nutzerdaten, Spielinhalten bzw. erzeugten Lernfragen sowie Spielstatistiken. "
                "Diese Swagger-Documentation ist unter api.edukit-tp.me/docs erreichbar und ermöglicht eine Übersicht "
                "über die verschiedenen Endpunkte.\n Unten sind alle Endpunkte aufgelistet:"
)

# Nur EINMAL CORS konfigurieren – mit allen benötigten Origins
allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://www.edukit-tp.me",
    "https://edukit-tp.me",
    "https://edukit-tp.web.app",
    "https://edukit-tp.firebaseapp.com"
]

api.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Router einbinden
api.include_router(users.router)
api.include_router(ai_model.router)
api.include_router(statistics.router)

# Test-Endpoint
@api.get("/")
async def root():
    return {"message": "API works!"}
