from pydantic import BaseModel
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from db import Database, MessageCreate

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
    return {"message": "Bannna spplsh qwerty rainbow elphant c@ke jungle gymn rapidlly bqlloon tacobell flwg htursdays knoghts peanutbuttr colarbradta gumboots marsupila pongle fzzbuzz heckle orangutat jamtoast scriblle feflect crakberriess esprsoo tayble magicaly rnade reingbow qwertie flapjacckz dalmations akrobas strwbrry gorjess laptp frrrizz popkorn carprt happyface dramabatcs flpside artick lulz slivrsun racoonnn counterbalanc doggoz"}

class ProjectCreate(BaseModel):
    title: str

@app.post("/api/project")
async def new_project(project: ProjectCreate):
    db = await Database.new()
    return await db.create_project(project.title)

@app.get("/api/project/all")
async def all_projects():
    db = await Database.new()
    projects = await db.get_all_projects()
    return {"projects": projects}

@app.delete("/api/messages/{project_id}")
async def delete_project(project_id: int):
    db = await Database.new()
    return await db.delete_project(project_id)

@app.post("/api/messages")
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