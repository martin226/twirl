import base64
import httpx
import anthropic

client = anthropic.Anthropic(
    # defaults to os.environ.get("ANTHROPIC_API_KEY")
)

openscad_output = """// Pine Tree Model\n// All dimensions maintained from original units\n\n// Global resolution for cones\n$fn = 8;  // Match ThreeJS 8-sided cones\n\n// Tree parameters\ntrunk_width = 10;  // Scaled up for better visibility\ntrunk_height = 40;\ntrunk_y_pos = 20;\n\n// Module for tree trunk\nmodule trunk() {\n    color("brown")\n    cube([trunk_width, trunk_width, trunk_height], center=true);\n}\n\n// Module for foliage layer\nmodule foliage_layer(radius, height) {\n    color("green")\n    cylinder(h=height, r1=radius, r2=0, center=false);\n}\n\n// Module for complete tree\nmodule pine_tree() {\n    // Position trunk\n    translate([0, 0, trunk_y_pos])\n        trunk();\n    \n    // Foliage layers data\n    // [radius, height, y_position]\n    layers = [\n        [40, 20, 40],    // Bottom layer\n        [35, 20, 55],\n        [30, 18, 68],\n        [25, 16, 80],\n        [20, 14, 90],\n        [15, 12, 100],\n        [10, 10, 110]    // Top layer\n    ];\n    \n    // Create all foliage layers\n    for (layer = layers) {\n        translate([0, 0, layer[2]])\n            foliage_layer(layer[0], layer[1]);\n    }\n}\n\n// Create the tree\npine_tree();"""
original_prompt = "Generate a model of pine tree."
image_url = "https://media.sketchfab.com/models/c1d140fc15bd40928989d0ca79365e13/thumbnails/465f602c45454d8f813cc54198930c24/76d9c131a5314d98bf271617a3a43378.jpeg"
image_media_type = "image/jpeg"
image_data = base64.standard_b64encode(httpx.get(image_url).content).decode("utf-8")
instructions = "Modify the pine tree model to include a treehouse platform around the trunk. The platform should be a square with sides of 30 units, positioned 10 units above the ground. The platform should be centered around the trunk and should not intersect with the foliage. Further, parameterize the number of foliage layers and their dimensions to allow for easy customization."

# Replace placeholders like {{THREEJS_OUTPUT}} with real values,
# because the SDK does not support variables.
message = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=8192,
    temperature=0,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": f"You are an AI assistant tasked with modifying OpenSCAD scripts based on user instructions. Your goal is to understand the original design, interpret the user's modification requests, and update the script accordingly.\n\nHere's the original prompt used to generate the OpenSCAD script:\n<original_prompt>\n{original_prompt}\n</original_prompt>\n\nHere's the current OpenSCAD script:\n<openscad_script>\n{openscad_output}\n</openscad_script>\n\nThe user has provided the following instructions for modifying the script:\n<user_instructions>\n{instructions}\n</user_instructions>\n\nTo modify the script, follow these steps:\n\n1. Carefully analyze the original prompt and the current OpenSCAD script to understand the design's purpose and structure.\n\n2. Review the user's modification instructions and identify the specific changes requested.\n\n3. Make the necessary modifications to the OpenSCAD script, ensuring that:\n   a. The changes align with the user's instructions\n   b. The overall structure and functionality of the script remain intact\n   c. The modifications are implemented efficiently and logically\n\n4. If any requested modifications are unclear, impossible, or conflict with the original design, make your best judgment to interpret and implement them. Note these instances for later explanation.\n\n5. After making the modifications, review the entire script to ensure consistency and proper functionality.\n\nPresent your modified OpenSCAD script within <modified_script> tags.\n\nAfter the modified script, provide an explanation of the changes you made and any potential issues or considerations within <explanation> tags. Include:\n- A summary of the modifications implemented\n- Any assumptions or interpretations you made regarding unclear instructions\n- Potential impacts on the model's functionality or appearance\n- Any parts of the user's instructions that couldn't be implemented, and why\n\nIf you encounter any errors or issues while modifying the script, explain them within <issues> tags after your explanation.\n\nRemember to maintain the original script's structure and naming conventions where possible, and ensure that your modifications are clear and well-commented."
                },
                {
                    "type": "image",
                    "source": {
                        "type": "base64",
                        "media_type": image_media_type,
                        "data": image_data
                    }
                }
            ]
        },
        {
            "role": "assistant",
            "content": [
                {
                    "type": "text",
                    "text": "<modified_script>"
                }
            ]
        }
    ]
)
print(message.content)