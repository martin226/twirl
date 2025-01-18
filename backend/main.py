from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from db import Database, MessageCreate
from llm.steps import run_pipeline, new_prompt

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

@app.post("/api/project")
async def new_project(title: str):
    db = await Database.new()
    return await db.create_project(title)

@app.get("/api/project/all")
async def all_projects():
    db = await Database.new()
    projects = await db.get_all_projects()
    return {"projects": projects.data}

@app.delete("/api/messages/{project_id}")
async def delete_project(project_id: int):
    db = await Database.new()
    return await db.delete_project(project_id)

@app.post("/api/messages")
async def add_message(message: MessageCreate):
    # this api
    db = await Database.new()
    return await db.add_message(message)

@app.get("/api/project/{project_id}")
async def get_project(project_id: int):
    db = await Database.new()
    project = await db.get_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

class InitialMessage(BaseModel):
    description: str
    image_url: str
    image_media_type: str

@app.post("/api/initial_message/{project_id}")
async def get_initial_message(project_id: int, msg: InitialMessage):
    db = await Database.new()
    project = await db.get_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # result = await run_pipeline(msg.description, msg.image_url, msg.image_media_type)
    result = await new_prompt(msg.description, msg.image_url, msg.image_media_type)

    print("Result:", result)

    return result

@app.get("/api/artifact/{message_id}")
async def get_artifact(message_id: int):
    db = await Database.new()
    artifact = await db.get_artifact_by_message(message_id)
    if not artifact:
        raise HTTPException(status_code=404, detail="Artifact not found")
    return artifact

@app.patch("/api/artifact/{artifact_id}")
async def update_artifact(artifact_id: int, openscad_code: str):
    db = await Database.new()
    return await db.update_artifact_by_message(artifact_id, openscad_code)

@app.post("/api/artifact/{message_id}")
async def create_artifact(message_id: int, openscad_code: str):
    db = await Database.new()
    return await db.create_artifact(openscad_code, message_id)