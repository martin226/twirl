import os
from azure.storage.blob.aio import BlobServiceClient
from supabase._async.client import AsyncClient as Client

AZURE_CONNECTION_STRING = "<your_azure_connection_string>"
CONTAINER_NAME = "<your_container_name>"

async def upload_image_to_azure(supabase: Client, image_path: str, supabase_table: str):
    # Initialize Azure Blob client asynchronously
    blob_service_client = BlobServiceClient.from_connection_string(AZURE_CONNECTION_STRING)
    container_client = blob_service_client.get_container_client(CONTAINER_NAME)

    # Generate a unique filename (you can customize this)
    filename = os.path.basename(image_path)
    blob_client = container_client.get_blob_client(filename)

    # Upload the image asynchronously to Azure Blob Storage
    async with blob_client.upload_blob(open(image_path, "rb"), overwrite=True) as upload:
        pass

    # Get the public URL of the uploaded image
    blob_url = f"https://{blob_service_client.account_name}.blob.core.windows.net/{CONTAINER_NAME}/{filename}"

    # Store the blob URL in the Supabase table
    response = await supabase.table(supabase_table).insert({"image_url": blob_url}).execute()
    return response