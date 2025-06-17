from fastapi import FastAPI
from routers import users, ai_model, statistics

api = FastAPI(
    title="API für das Teamprojekt EDUKIT",
    description="Diese API dient der Kommunikation von Frontend und Backend im Teamprojekt EDUKIT.Sie " \
    "erlaubt den Umgang mit Nutzerdaten, Spielinhalten bzw. erzeugten Lernfragen sowie Spielstatistiken." \
    "Diese Swagger-Documentation ist unter api.edukit-tp.me/docs erreichbar und ermöglicht eine Übersicht über die verschiedenen Endpunkte."
)
api.include_router(users.router)
api.include_router(ai_model.router)
api.include_router(statistics.router)

@api.get("/")
async def root():
    return {"message": "API works!"}


