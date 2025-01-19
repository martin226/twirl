from supabase._async.client import AsyncClient as Client, create_client
import os
from dotenv import load_dotenv
from pydantic import BaseModel
from datetime import datetime
import asyncio
from typing import List, Optional

load_dotenv()

async def create_supabase() -> Client:
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_KEY")
    return await create_client(url, key)

class MessageCreate(BaseModel):
    is_user: bool
    content: str
    project_id: int
    image_url: Optional[str] = None

class ArtifactCreate(BaseModel):
    openscad_code: str
    parameters: str # jsonb

class MessageResponse(BaseModel):
    id: int
    is_user: bool
    content: str
    project_id: int
    image_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class ProjectCreate(BaseModel):
    title: str

class ProjectResponse(BaseModel):
    id: int
    title: str
    created_at: datetime
    messages: List[MessageResponse] = []

    class Config:
        from_attributes = True

class Database:
    client: Client

    # use await Database.new() to create a new instance
    @classmethod
    async def new(cls):
        self = cls()
        self.client = await create_supabase()
        return self
    
    async def create_artifact(self, openscad_code: str, parameters: str, message_id: int):
        response = await self.client.table("artifacts").insert({"openscad_code": openscad_code, "parameters": parameters,"message_id": message_id}).execute()
        return response.data
    
    async def get_artifact(self, artifact_id: int):
        artifact = await self.client.table("artifacts").select("*").eq("id", artifact_id).execute()
        return artifact.data[0] if artifact.data else None
    
    async def get_artifact_by_message(self, message_id: int):
        artifact = await self.client.table("artifacts").select("*").eq("message_id", message_id).execute()
        return artifact.data[0] if artifact.data else None
    
    async def update_artifact(self, artifact_id: int, openscad_code: str, parameters: str):
        response = await self.client.table("artifacts").update({"openscad_code": openscad_code, "parameters": parameters}).eq("id", artifact_id).execute()
        return response.data[0] if response.data else None
    
    async def update_artifact_by_message(self, message_id: int, openscad_code: str, parameters: str):
        response = await self.client.table("artifacts").update({"openscad_code": openscad_code, "parameters": parameters}).eq("message_id", message_id).execute()
        return response.data[0] if response.data else None

    async def create_project(self, title: str):
        response = await self.client.table("project").insert({"title": title}).execute()
        return ProjectResponse(id=response.data[0]["id"], title=title, created_at=response.data[0]["created_at"])

    async def get_all_projects(self):
        projects = await self.client.table("project").select("*").execute()
        # messages to each project
        for project in projects.data:
            messages = await self.client.table("messages").select("*").eq("project_id", project["id"]).order("created_at").execute()
            project["messages"] = messages.data
        return projects.data

    async def add_message(self, message_data: MessageCreate):
        response = await self.client.table("messages").insert(message_data.model_dump()).execute()
        return response.data[0] if response.data else None

    async def get_project(self, project_id: int):
        project = await self.client.table("project").select("*").eq("id", project_id).execute()
        messages = await self.client.table("messages").select("*").eq("project_id", project_id).order("created_at").execute()
        return ProjectResponse(id=project.data[0]["id"], title=project.data[0]["title"], created_at=project.data[0]["created_at"], messages=messages.data) if project.data else None
    
    async def delete_projects(self, ids: List[int]):
        return await self.client.table("project").delete().in_("id", ids).execute()
    
    async def delete_project(self, id: int):
        return await self.client.table("project").delete().eq("id", id).execute()

if __name__ == "__main__":
    async def main():
        db = await Database.new()
        project = await db.create_project("Test Project")
        message = await db.add_message(MessageCreate(is_user=True, content="Hello!", project_id=project.id))

        test_get_project = await db.get_project(project.id)
        print(test_get_project)

        artifact = await db.create_artifact("module test() { echo(\"Hello, world!\"); }", message["id"])
        print(artifact)

        await db.delete_project(project.id)

    asyncio.run(main())