import base64
from anthropic import AsyncAnthropic
import os
from dotenv import load_dotenv
import httpx
from llm import prompts
from pydantic import BaseModel
from typing import Optional

load_dotenv()

client = AsyncAnthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY"),
)

async def fetch_and_encode_image(image_url):
    async with httpx.AsyncClient() as client:
        response = await client.get(image_url)
        return base64.standard_b64encode(response.content).decode("utf-8")

class GenerationRequest(BaseModel):
    description: str
    image_url: Optional[str] = None
    image_data: Optional[str] = None
    image_media_type: Optional[str] = None

    # def validate(self, values):
    #     if values.get("image_url") is None and values.get("image_data") is None:
    #         raise ValueError("Either image_url or image_data must be provided")
    #     return values

async def openscad(gen_request: GenerationRequest):
    description = gen_request.description

    image_data = gen_request.image_data if gen_request.image_data else await fetch_and_encode_image(gen_request.image_url) if gen_request.image_url else None
    image_media_type = gen_request.image_media_type

    user_content = [
        prompts.openscad_core["user"][0](),
        prompts.openscad_core["user"][1](description)
    ]

    # image is optional
    if image_data is not None:
        if image_media_type is None:
            print("How does image_media_type not exist when image_data does?")
        else:
            user_content.append(prompts.openscad_core["user"][2](image_data, image_media_type))

    message = await client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=8192,
        temperature=0.5,
        system=prompts.openscad_core["system"],
        messages=[
            {
                "role": "user",
                "content": user_content,
            },
            {
                "role": "assistant",
                "content": prompts.openscad_core["assistant"],
            },
        ],
    )
    print("Step 0 message:", message.content[0].text)
    parameters = message.content[0].text.split("<parameters>")[1].split("</parameters>")[0]
    # since the XML returned by the LLM is sometimes invalid, we are just going to find the text in between the <openscad_output> tags
    openscad_code = message.content[0].text.split("<openscad_output>")[1].split("</openscad_output>")[0]
    return [parameters, openscad_code]

class FollowupRequest(BaseModel):
    original_prompt: str
    openscad_output: str
    instructions: str
    image_url: Optional[str] = None
    image_data: Optional[str] = None
    image_media_type: Optional[str] = None

    # def validate(self, values):
    #     if values.get("image_url") is None and values.get("image_data") is None:
    #         raise ValueError("Either image_url or image_data must be provided")
    #     return values

async def followup(followup_request: FollowupRequest):
    original_prompt = followup_request.original_prompt
    openscad_output = followup_request.openscad_output
    instructions = followup_request.instructions

    image_data = followup_request.image_data if followup_request.image_data else await fetch_and_encode_image(followup_request.image_url) if followup_request.image_url else None
    image_media_type = followup_request.image_media_type

    user_content = [
        prompts.followup_core["user"][0](original_prompt, openscad_output, instructions),
    ]

    if image_data is not None:
        if image_media_type is None:
            print("How does image_media_type not exist when image_data does?")
        else:
            user_content.append(prompts.followup_core["user"][1](image_data, image_media_type))
    
    message = await client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=8192,
        temperature=0.5,
        system=prompts.followup_core["system"],
        messages=[
            {
                "role": "user",
                "content": user_content,
            },
            {
                "role": "assistant",
                "content": prompts.followup_core["assistant"],
            },
        ],
    )
    print("Step 1 message:", message.content[0].text)
    return message.content[0].text.split("<openscad_output>")[1].split("</openscad_output>")[0]

