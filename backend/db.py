from supabase._async.client import AsyncClient as Client, create_client
import os
from dotenv import load_dotenv
from pydantic import BaseModel
from datetime import datetime
import asyncio
from typing import List
load_dotenv()

async def create_supabase() -> Client:
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_KEY")
    return await create_client(url, key)

class MessageCreate(BaseModel):
    is_user: bool
    content: str
    project_id: int

class MessageResponse(BaseModel):
    id: int
    is_user: bool
    content: str
    project_id: int
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

    async def get_client(self):
        self.client = await create_supabase()
        return self.client

    async def create_project(self, title: str):
        response = await self.client.table("project").insert({"title": title}).execute()
        return ProjectResponse(id=response.data[0]["id"], title=title, created_at=response.data[0]["created_at"])

    async def get_all_projects(self):
        projects = await self.client.table("project").select("*").execute()
        # get all messages for each project
        for project in projects.data:
            messages = await self.client.table("messages").select("*").eq("project_id", project["id"]).execute()
            project["messages"] = messages.data
        return projects.data

    async def add_message(self, message_data: MessageCreate):
        response = await self.client.table("messages").insert(message_data.model_dump()).execute()
        return response.data

    async def get_project(self, project_id: int):
        project = await self.client.table("project").select("*").eq("id", project_id).execute()
        messages = await self.client.table("messages").select("*").eq("project_id", project_id).execute()
        return ProjectResponse(id=project.data[0]["id"], title=project.data[0]["title"], created_at=project.data[0]["created_at"], messages=messages.data) if project.data else None
    
    async def delete_projects(self, ids: List[int]):
        return await self.client.table("project").delete().in_("id", ids).execute()
    
    async def delete_project(self, id: int):
        return await self.client.table("project").delete().eq("id", id).execute()

if __name__ == "__main__":
    async def main():
        db = await Database.new()
        project = await db.create_project("Test Project")
        await db.add_message(MessageCreate(is_user=True, content="Hello!", project_id=project.id))

        test_get_project = await db.get_project(project.id)
        print(test_get_project)

        await db.delete_project(project.id)

    asyncio.run(main())