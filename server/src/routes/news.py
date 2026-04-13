from fastapi import APIRouter
import requests
import os

router = APIRouter()

GNEWS_API_KEY = os.getenv("GNEWS_API_KEY")

@router.get("/news")
def get_news():
    try:
        url = f"https://gnews.io/api/v4/search?q=stock market&lang=en&max=10&apikey={GNEWS_API_KEY}"
        res = requests.get(url)
        return res.json()
    except Exception as e:
        return {"error": str(e)}
