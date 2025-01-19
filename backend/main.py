import base64
import uuid
from typing import Optional
from fastapi import FastAPI, HTTPException, Request, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from img import upload_image
from db import Database, MessageCreate
# from llm.steps import run_pipeline, new_prompt
from llm.core import openscad, followup, GenerationRequest, FollowupRequest

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

@app.get("/api/project/{project_id}/scad_parameters")
async def get_scad_parameters(project_id: int):
    db = await Database.new()
    project = await db.get_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    # fetch the latest message with an artifact
    # some messages may not have artifacts
    artifact = None
    for message in reversed(project.messages):
        artifact = await db.get_artifact_by_message(message.id)
        if artifact:
            break
    if artifact is None:
        return {"parameters": None, "openscad_code": None}
    return {"parameters": artifact["parameters"], "openscad_code": artifact["openscad_code"]}

class ScadParameters(BaseModel):
    parameters: str
    openscad_code: str

@app.patch("/api/project/{project_id}/scad_parameters")
async def update_scad_parameters(project_id: int, params: ScadParameters):
    db = await Database.new()
    project = await db.get_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    # fetch the latest message with an artifact
    # some messages may not have artifacts
    artifact = None
    latest_message_id = None
    for message in reversed(project.messages):
        artifact = await db.get_artifact_by_message(message.id)
        if artifact:
            latest_message_id = message.id
            break
    if artifact is None:
        raise HTTPException(status_code=404, detail="No artifact found in project")
    return await db.update_artifact_by_message(latest_message_id, params.openscad_code, params.parameters)
    

@app.post("/api/initial_message/{project_id}")
async def post_initial_message(
    project_id: int,
    description: str = Form(...),
    image_url: Optional[str] = Form(None),
    image_data: Optional[UploadFile] = Form(None),
    image_media_type: Optional[str] = Form(None)
):
    db = await Database.new()
    project = await db.get_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    file_content = await image_data.read() if image_data else None

    file_url = await upload_image(file_content, f"{uuid.uuid4()}.{image_data.filename.split('.')[-1]}") if file_content else image_url if image_url else None
        
    # Convert file content to Base64
    base64_content = base64.b64encode(file_content).decode("utf-8") if file_content else None
    
    summary, parameters, openscad_code = await openscad(GenerationRequest(
        description=description,
        image_url=image_url,
        image_data=base64_content,
        image_media_type=image_media_type
    ))

    # add message to database
    await db.add_message(MessageCreate(is_user=True, content=description, project_id=project_id, image_url=file_url))
    message = await db.add_message(MessageCreate(is_user=False, content=summary, project_id=project_id))
    await db.create_artifact(openscad_code, parameters, message["id"])

    print("Result:", parameters, openscad_code)

    return {"parameters": parameters, "openscad_code": openscad_code}

@app.post("/api/followup_message/{project_id}")
async def post_followup_message(
    request: Request,
    project_id: int,
    # original_prompt: str = Form(...),
    # openscad_output: str = Form(...),
    instructions: str = Form(...),
    image_url: Optional[str] = Form(None),
    image_data: Optional[UploadFile] = Form(None),
    image_media_type: Optional[str] = Form(None),
):
    db = await Database.new()
    project = await db.get_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    print("Project messages", project.messages)
    
    original_prompt = project.messages[0].content
    openscad_output = await db.get_artifact_by_message(sorted(project.messages, key=lambda x: x.id)[-1].id)
    
    file_content = await image_data.read() if image_data else None

    file_url = await upload_image(file_content, f"{uuid.uuid4()}.{image_data.filename.split('.')[-1]}") if file_content else image_url if image_url else None
        
    base64_content = base64.b64encode(file_content).decode("utf-8") if file_content else None
    
    request = FollowupRequest(
        original_prompt=original_prompt,
        openscad_output=openscad_output["openscad_code"],
        instructions=instructions,
        image_url=image_url,
        image_data=base64_content,
        image_media_type=image_media_type
    )
    explanation, new_code, parameters = await followup(request)

    # add message to database
    await db.add_message(MessageCreate(is_user=True, content=instructions, project_id=project_id, image_url=file_url))
    message = await db.add_message(MessageCreate(is_user=False, content=explanation, project_id=project_id))
    await db.create_artifact(new_code, parameters, message["id"])

    print("Result:", new_code, parameters)

    return {"parameters": parameters, "openscad_code": new_code}

@app.get("/api/artifact/{message_id}")
async def get_artifact(message_id: int):
    db = await Database.new()
    artifact = await db.get_artifact_by_message(message_id)
    if not artifact:
        raise HTTPException(status_code=404, detail="Artifact not found")
    return artifact

@app.patch("/api/artifact/{artifact_id}")
async def update_artifact(artifact_id: int, openscad_code: str, parameters: str):
    db = await Database.new()
    return await db.update_artifact_by_message(artifact_id, parameters, openscad_code)

@app.post("/api/artifact/{message_id}")
async def create_artifact(message_id: int, openscad_code: str, parameters: str):
    db = await Database.new()
    return await db.create_artifact(openscad_code, parameters, message_id)
