from fastapi import APIRouter, Query, HTTPException
from typing import Optional
from firebase import db
import requests
import datetime
import traceback
import logging

logger = logging.Logger("uvicorn")



router = APIRouter(
    prefix ="/statistics",
    tags = ["statistics"],
)

#Hole die aktuelle Highscore-Liste, bestehend aus Rang, Username und Highscore-Punktzahl
@router.get("/get-current-leaderboard")
async def get_current_leaderboard():
    try:
        stat_ref = db.collection("statistics")
        latest_doc = stat_ref.order_by("timestamp", direction = "DESCENDING").limit(1).get()
        logger.info(len(latest_doc))
        if not latest_doc:
            return {"error: Kein Leaderboard verfügbar"}
        else: 
            leaderboard_dict = latest_doc[0].to_dict()
            leaderboard_list = leaderboard_dict["leaderboard"]
            print("TestPRINT")
            print("DICT-------")
            print(leaderboard_dict)
            print("LIST-----")
            print(leaderboard_list)
            logger.info("TestLOGGER")
            logger.info(leaderboard_list)
            #print(latest_doc[0].to_dict())
            return leaderboard_list#latest_doc[0].to_dict()
            
    except Exception as e:
        print("🔥 Fehler beim Laden des Leaderboards:", e)
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

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