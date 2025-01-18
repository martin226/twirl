from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from azure.cognitiveservices.search.imagesearch import ImageSearchClient
from azure.cognitiveservices.search.websearch.models import SafeSearch
from msrest.authentication import CognitiveServicesCredentials

subscription_key = "9043ce489bf840d4af621be0bfaa1a15"

# Instantiate the client and replace with your endpoint.
# client = WebSearchClient(endpoint="https://api.bing.microsoft.com/v7.0/search", credentials=CognitiveServicesCredentials(subscription_key))

client = ImageSearchClient(
     endpoint="https://api.bing.microsoft.com",
     credentials=CognitiveServicesCredentials(subscription_key),
)

# Hotfix SDK 
client.config.base_url = "{Endpoint}/v7.0"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class Query(BaseModel):
    user_query: str

@app.post("/api/images")
async def search_images(query: Query):
    try:
        image_data = client.images.search(query="Whatever", count=6)
        print("\r\nSearched for Query: \" Whatever \"")

        '''
        Images
        If the search response contains images, the first result's name and url
        are printed.
        '''

        if image_data.value:
            print("\r\nImage Results: {} Images Found!".format(len(image_data.value)))
            image_urls = [img.content_url for img in image_data.value[:6]]
            return {"image_urls": image_urls}
        else:
            print("Didn't find any images...")
            return{"image_urls": []}

    except Exception as err:
        print("Encountered exception. {}".format(err))
        raise HTTPException(status_code=500, detail=f"Error occurred: {str(err)}")