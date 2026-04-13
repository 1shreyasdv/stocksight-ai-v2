from fastapi import APIRouter
import requests
import os

router = APIRouter()

@router.get("/news")
def get_news():
    try:
        api_key = os.getenv("GNEWS_API_KEY")
        url = f"https://gnews.io/api/v4/search?q=stock%20market&lang=en&max=10&apikey={api_key}"
        res = requests.get(url)
        return res.json()
    except Exception as e:
        return {"error": str(e)}
