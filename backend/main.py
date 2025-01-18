from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from backend.db import Database, MessageCreate

from azure.cognitiveservices.search.imagesearch import ImageSearchClient
from azure.cognitiveservices.search.websearch.models import SafeSearch
from msrest.authentication import CognitiveServicesCredentials
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("CORS Middleware Applied")

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

subscription_key = "9043ce489bf840d4af621be0bfaa1a15"

# Instantiate the client and replace with your endpoint.
# client = WebSearchClient(endpoint="https://api.bing.microsoft.com/v7.0/search", credentials=CognitiveServicesCredentials(subscription_key))

client = ImageSearchClient(
     endpoint="https://api.bing.microsoft.com",
     credentials=CognitiveServicesCredentials(subscription_key),
)

class Query(BaseModel):
    user_query: str


@app.post("/api/images")
async def search_images(ope : Query):
    try:
        image_data = client.images.search(ope, count=6)

        '''
        Images
        If the search response contains images, the first result's name and url
        are printed.
        '''

        if image_data.value:
            print("\r\nImage Results: {} Images Found!".format(len(image_data.value)))
            image_names = [img.name for img in image_data.value[:30]]
            image_urls = [img.content_url for img in image_data.value[:30]]
            return {"image_names": image_names, "image_urls": image_urls}
        else:
            print("Didn't find any images...")
            return{"image_names": [], "image_urls": []}

    except Exception as err:
        print("Encountered exception. {}".format(err))
        raise HTTPException(status_code=500, detail=f"Error occurred: {str(err)}")

# Hotfix SDK 
client.config.base_url = "{Endpoint}/v7.0"


