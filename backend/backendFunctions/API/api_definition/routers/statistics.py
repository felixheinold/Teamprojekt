from fastapi import APIRouter, Query
from typing import Optional
from firebase import db
import requests
import datetime


router = APIRouter(
    prefix ="/statistics",
    tags = ["statistics"],
)

#Hole die aktuelle Highscore-Liste, bestehend aus Rang, Username und Highscore-Punktzahl
@router.get("/get-current-leaderboard")
async def get_current_leaderboard():
    stat_ref = db.collection("statistics")
    latest_doc = stat_ref.order_by("__name__", direction = "DESCENDING").limit(1).get()
    if latest_doc:
        return latest_doc[0].to_dict()
    else: 
        return None

#async def get_current_leaderboard (limit: Optional[int] = Query(default = 10, ge=1)):
#     leaderboard_ref = db.collection("statistics").document(datetime.utcnow().isoformat())
#     query = db.collection("users").order_by("user_game_information.highscore", direction = "DESCENDING")
#     if limit:
#         query.limit(limit)
#     order = query.stream()
#     result = []
#     for i, ord in enumerate(order, start = 1):
#         data = ord.to_dict()
#         result.append({"user_rank": i,
#                        "user_name": data.get("user_name", "unknown"),
#                        "user_highscore": data.get("user_game_information", {}).get("highscore", 0)
#                     })
#     leaderboard_ref.set({
#         "leaderboard": result
#     })
#     return result