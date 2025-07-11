from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import users, ai_model, statistics

api = FastAPI(
    title="API für das Teamprojekt EDUKIT",
    description="Diese API dient der Kommunikation von Frontend und Backend im Teamprojekt EDUKIT. Sie " \
    "erlaubt den Umgang mit Nutzerdaten, Spielinhalten bzw. erzeugten Lernfragen sowie Spielstatistiken." \
    "Diese Swagger-Documentation ist unter api.edukit-tp.me/docs erreichbar und ermöglicht eine Übersicht über die verschiedenen Endpunkte.\n Unten sind alle Endpunkte aufgelistet: "
)
api.include_router(users.router)
api.include_router(ai_model.router)
api.include_router(statistics.router)

allowed_origins_for_api_requests = [
"https://www.edukit-tp.me",
"https://edukit-tp.me",
"https://edukit-tp.web.app"
"https://edukit-tp.firebaseapp.com"
]

api.add_middleware(
    CORSMiddleware,
    allow_origins = allowed_origins_for_api_requests,
    allow_credentials = True,
    allow_methods = ["*"],
    allow_header = ["*"],
)

@api.get("/")
async def root():
    return {"message": "API works!"}


