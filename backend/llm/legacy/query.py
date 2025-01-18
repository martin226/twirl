import anthropic

client = anthropic.Anthropic(
    # defaults to os.environ.get("ANTHROPIC_API_KEY")
    api_key="",
)

CAD_PROMPT = "Create a totebag with UoftHacks in the front, with a zipper on top and a pocket on the back. The totebag should be made of canvas and have a width of 15 inches, a height of 12 inches, and a depth of 5 inches. The front pocket should be 8 inches wide and 10 inches high. The zipper should be 12 inches long and the totebag should have two handles that are 20 inches long."

message = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=64,
    temperature=0,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": f"You will be given a CAD generation prompt. Your task is to convert this prompt into a general image search query. Here's how to proceed:\n\n1. Here is the CAD generation prompt:\n<cad_prompt>\n{CAD_PROMPT}\n</cad_prompt>\n\n2. Process the prompt by following these steps:\n   a. Identify the main object or concept in the prompt.\n   b. Remove specific measurements, materials, or detailed instructions.\n   c. Simplify the language to make it more general.\n   d. Remove all descriptors and only keep the main object.\n\n3. Create an image search query based on the processed prompt:\n   a. Keep the query brief and focused on the main object or concept.\n   b. If the object is likely to have 3D model images available online, add \"3d model\" to the query.\n   c. Avoid including highly specific details that might limit search results.\n   d. The image search query should be less than 3 words.\n\n4. Output your image search query inside <query> tags. Provide ONLY the query, with no additional text or explanation.\n\nExample:\nInput: \"Create a model of a cube with a sphere inside\"\nOutput: <query>cube with sphere inside 3d model</query>\n\nExample:\nInput: \"Generate a model of a hollow cylinder with a 5mm wall thickness\"\nOutput: <query>hollow cylinder 3d model</query>\n\nExample:\nInput: \"Create a dining table\"\nOutput: <query>dining table 3d model</query>"
                }
            ]
        }
    ]
)
print(message.content)