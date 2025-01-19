import os
from azure.storage.blob.aio import BlobServiceClient
from dotenv import load_dotenv

load_dotenv()

AZURE_CONNECTION_STRING = os.environ.get("AZURE_STORAGE_CONNECTION_STRING")
CONTAINER_NAME = "images"

async def upload_image(image_data: bytes, filename: str) -> str:
    blob_service_client = BlobServiceClient.from_connection_string(AZURE_CONNECTION_STRING)
    blob_client = blob_service_client.get_blob_client(container=CONTAINER_NAME, blob=filename)
    await blob_client.upload_blob(image_data, overwrite=True)
    return blob_client.url

if __name__ == "__main__":
    import asyncio

    async def main():
        with open("random.jpeg", "rb") as f:
            image_data = f.read()
        url = await upload_image(image_data, "random.jpeg")
        print(url)

    asyncio.run(main())