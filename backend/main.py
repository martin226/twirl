from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from db import Database, MessageCreate, ProjectCreate

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/api/new-project/")
async def new_project(title: str):
    db = await Database.new()
    return await db.create_project(title)

@app.get("/api/all-projects/")
async def all_projects():
    db = await Database.new()
    projects = await db.get_all_projects()
    return {"projects": projects.data}

@app.delete("/api/delete-project/")
async def delete_project(project_id: int):
    db = await Database.new()
    return await db.delete_project(project_id)

@app.post("/api/add-message/")
async def add_message(message: MessageCreate):
    db = await Database.new()
    return await db.add_message(message)

@app.get("/api/project/{project_id}")
async def get_project(project_id: int):
    db = await Database.new()
    project = await db.get_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project