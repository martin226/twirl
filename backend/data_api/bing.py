# Import required modules.
from azure.cognitiveservices.search.imagesearch import ImageSearchClient
from azure.cognitiveservices.search.websearch.models import SafeSearch
from msrest.authentication import CognitiveServicesCredentials

# Replace with your subscription key.
subscription_key = "9043ce489bf840d4af621be0bfaa1a15"

# Instantiate the client and replace with your endpoint.
# client = WebSearchClient(endpoint="https://api.bing.microsoft.com/v7.0/search", credentials=CognitiveServicesCredentials(subscription_key))

client = ImageSearchClient(
     endpoint="https://api.bing.microsoft.com",
     credentials=CognitiveServicesCredentials(subscription_key),
)

# Hotfix SDK 
client.config.base_url = "{Endpoint}/v7.0"

try:
     # Make a request. Replace Yosemite if you'd like.
     image_data = client.images.search(query="Whatever", count=6)
     print("\r\nSearched for Query: \" Whatever \"")

     '''
     Images
     If the search response contains images, the first result's name and url
     are printed.
     '''

     if image_data.value:
          print("\r\nImage Results: {} Images Found!".format(len(image_data.value)))

          for i in range (6):
               found_image = image_data.value[i]
               print(str(i+1)+") Thumbnail URL: {} ".format(found_image.thumbnail_url))
               print(str(i+1)+") Image URL: {} ".format(found_image.content_url))

     else:
         print("Didn't find any images...")

         
except Exception as err:
     print("Encountered exception. {}".format(err))