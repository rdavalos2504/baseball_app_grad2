from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI
from sqlmodel import Session, select
from models import Batting, Teams, People, engine

app = FastAPI()


@app.get("/years")
async def get_years():
    with Session(engine) as session:
        result = session.exec(select(Teams.yearID).distinct().order_by(Teams.yearID))
        return result.all()

@app.get("/teams")
async def get_teams(year: int):
    with Session(engine) as session:
        result = session.exec(
            select(Teams.lgID, Teams.name)
            .where(Teams.yearID == year)
            .order_by(Teams.lgID, Teams.name)
        )
        leagues: dict[str, list[str]] = {}
        for lg, name in result.all():
            league = lg if lg else "Other"
            leagues.setdefault(league, []).append(name)
        return leagues

app.mount("/", StaticFiles(directory="static", html=True), name="static")
