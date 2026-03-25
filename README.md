# Baseball Stats App

A web application for exploring historical baseball statistics, built with FastAPI and SQLModel.

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/rdavalos2504/baseball_app_grad2.git
   cd baseball_app_grad2
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Create the database (only needed once):
   ```bash
   python create_database.py
   ```

4. Run the app:
   ```bash
   uvicorn main:app --reload
   ```

5. Open http://127.0.0.1:8000 in your browser.

## API Endpoints

| Endpoint | Parameters | Description |
|----------|-----------|-------------|
| `GET /years` | — | Returns all available seasons |
| `GET /teams` | `year` (int) | Returns teams grouped by league for the given year |
| `GET /players` | `year` (int), `teamID` (str) | Returns first and last names of players on a team that year |
