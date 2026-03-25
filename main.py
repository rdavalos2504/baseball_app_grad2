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
            select(Teams.lgID, Teams.teamID, Teams.name)
            .where(Teams.yearID == year)
            .order_by(Teams.lgID, Teams.name)
        )
        leagues: dict[str, list[dict[str, str]]] = {}
        for lg, team_id, name in result.all():
            league = lg if lg else "Other"
            leagues.setdefault(league, []).append({"teamID": team_id, "name": name})
        return leagues

@app.get("/players")
async def get_players(year: int, teamID: str):
    with Session(engine) as session:
        result = session.exec(
            select(People.nameFirst, People.nameLast)
            .join(Batting, Batting.playerID == People.playerID)
            .where(Batting.yearID == year, Batting.teamID == teamID)
            .distinct()
            .order_by(People.nameLast, People.nameFirst)
        )
        return [{"firstName": first, "lastName": last} for first, last in result.all()]

app.mount("/", StaticFiles(directory="static", html=True), name="static")
