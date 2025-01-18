import base64
import httpx
import anthropic

client = anthropic.Anthropic(
    # defaults to os.environ.get("ANTHROPIC_API_KEY")
)

openscad_output = """// Bookshelf with Books\n// All dimensions in millimeters\n\n// Global resolution\n$fn = 50;\n\n// Main dimensions\nshelf_width = 1000;    // 100cm\nshelf_height = 1800;   // 180cm\nshelf_depth = 300;     // 30cm\nthickness = 20;        // 2cm\nnum_shelves = 5;\nshelf_spacing = (shelf_height - thickness) / (num_shelves + 1);\n\n// Book dimensions\nbook_height = 250;     // 25cm\nmin_book_width = 150;  // 15cm\nmax_book_width = 250;  // 25cm\nbook_depth = 200;      // 20cm\n\n// Module for basic bookshelf structure\nmodule bookshelf_structure() {\n    // Back panel\n    translate([-shelf_width/2, -shelf_height/2, -shelf_depth/2])\n        cube([shelf_width, shelf_height, thickness]);\n    \n    // Side panels\n    translate([-shelf_width/2, -shelf_height/2, -shelf_depth/2])\n        cube([thickness, shelf_height, shelf_depth]);\n    translate([shelf_width/2 - thickness, -shelf_height/2, -shelf_depth/2])\n        cube([thickness, shelf_height, shelf_depth]);\n    \n    // Horizontal shelves\n    for(i = [0:num_shelves]) {\n        translate([-shelf_width/2, -shelf_height/2 + i * shelf_spacing, -shelf_depth/2])\n            cube([shelf_width, thickness, shelf_depth]);\n    }\n    \n    // Top molding\n    translate([-(shelf_width/2 + 20), shelf_height/2, -(shelf_depth/2 + 10)])\n        cube([shelf_width + 40, 40, shelf_depth + 20]);\n}\n\n// Module for a single book\nmodule book(width) {\n    cube([width, book_height, book_depth]);\n}\n\n// Module for books on one shelf\nmodule shelf_books(shelf_y) {\n    usable_width = shelf_width - 2 * thickness - 100; // 10cm margin\n    spacing = usable_width / 6;\n    \n    for(i = [0:5]) {\n        // Pseudo-random book width based on position\n        book_width = min_book_width + \n            ((((i * 13) + (shelf_y * 7)) % (max_book_width - min_book_width)));\n        \n        translate([\n            -shelf_width/2 + thickness + 50 + spacing * i + (spacing - book_width)/2,\n            shelf_y,\n            -shelf_depth/2 + thickness\n        ])\n            book(book_width);\n    }\n}\n\n// Create complete bookshelf with books\nmodule complete_bookshelf() {\n    // Main structure\n    bookshelf_structure();\n    \n    // Add books to each shelf\n    for(shelf = [1:num_shelves]) {\n        shelf_y = -shelf_height/2 + shelf * shelf_spacing;\n        shelf_books(shelf_y);\n    }\n}\n\n// Generate the final model\ncomplete_bookshelf();"""
original_prompt = "Generate a model of a bookshelf."
image_url = "https://www.teppermans.com/media/catalog/product/cache/dc6cf9a5412b42a580c35d565f479b38/4/2/426422_1.jpg"
image_media_type = "image/jpeg"
image_data = base64.standard_b64encode(httpx.get(image_url).content).decode("utf-8")
instructions = "Fix the code. The books in each shelf should have different colors."

# Replace placeholders like {{THREEJS_OUTPUT}} with real values,
# because the SDK does not support variables.
message = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=8192,
    temperature=0.5,
    system="You are Imagine, an expert AI assistant specializing in generating highly accurate, error-free OpenSCAD scripts based on textual descriptions or images of 3D objects. Your task is to modify OpenSCAD scripts based on user instructions. Your goal is to understand the original design, interpret the user's modification requests, and update the script accordingly.\n\nIMPORTANT: these are the only language features available in OpenSCAD:\nSyntax\nvar = value;\nvar = cond ? value_if_true : value_if_false;\nvar = function (x) x + x;\nmodule name(…) { … }\nname();\nfunction name(…) = …\nname();\ninclude <….scad>\nuse <….scad>\n\nConstants\nundef: undefined value\nPI: mathematical constant π (~3.14159)\n\nOperators\nAddition: n + m\nSubtraction: n - m\nMultiplication: n * m\nDivision: n / m\nModulo: n % m\nExponentiation: n ^ m\nLogical: &&, ||, !\nComparisons: <, <=, ==, !=, >=, >\n\nSpecial Variables\n$fa: minimum angle\n$fs: minimum size\n$fn: number of fragments\n$t: animation step\n$children: number of module children\n\nModifier Characters\n*: disable\n!: show only\n#: highlight/debug\n%: transparent/background\n\n2D/3D Shapes\nCircle: circle(radius | d=diameter)\nSquare: square(size, center)\nPolygon: polygon([points], [paths])\nSphere: sphere(radius | d=diameter)\nCube: cube(size, center)\nCylinder: cylinder(h, r|d, center)\nPolyhedron: polyhedron(points, faces, convexity)\n\nTransformations\nTranslate: translate([x, y, z])\nRotate: rotate([x, y, z])\nScale: scale([x, y, z])\nMirror: mirror([x, y, z])\nColor: color(\"name\", alpha)\nOffset: offset(r|delta, chamfer)\nHull: hull()\nMinkowski: minkowski()\n\nBoolean Operations\nunion(), difference(), intersection()\n\nLists\nCreate: list = […, …, …];\nIndex: list[2], list.z\n\nMathematical Functions\nabs, sign, sin, cos, tan, acos, asin, atan, pow, sqrt, log, etc.\n\nOther Functions\nconcat, lookup, str, chr, version, len, render, etc.\n\nTo modify the script, follow these steps:\n\n1. Carefully analyze the original prompt and the current OpenSCAD script to understand the design's purpose and structure.\n\n2. Review the user's modification instructions and identify the specific changes requested.\n\n3. Make the necessary modifications to the OpenSCAD script, ensuring that:\n   a. The changes align with the user's instructions\n   b. The overall structure and functionality of the script remain intact\n   c. The modifications are implemented efficiently and logically\n\n4. If any requested modifications are unclear, impossible, or conflict with the original design, make your best judgment to interpret and implement them. Note these instances for later explanation.\n\n5. After making the modifications, review the entire script to ensure consistency and proper functionality.\n\nPresent your modified OpenSCAD script within <modified_script> tags.\n\nAfter the modified script, provide an explanation of the changes you made and any potential issues or considerations within <explanation> tags. Include:\n- A summary of the modifications implemented\n- Any assumptions or interpretations you made regarding unclear instructions\n- Potential impacts on the model's functionality or appearance\n- Any parts of the user's instructions that couldn't be implemented, and why\n\nIf you encounter any errors or issues while modifying the script, explain them within <issues> tags after your explanation.\n\nThen, list all parameters and parameter groups that should be customizable by the user inside <parameters> tags. Return this as a single JSON array. \n\nIMPORTANT: the following are properties and types of parameters and parameter groups. Adhere to these closely.\nEach parameter is a JSON object with the following properties:\n- group (boolean, false)\n- name (string)\n- type (string, \"slider|checkbox|none\")\n- min_value (number, if type is slider)\n- max_value (number, if type is slider)\n- value (number if type is slider or none, boolean if checkbox)\n\nEach parameter group is a JSON object with the following properties:\n- group (boolean, true)\n- name (string)\n- parameters (array of parameters and parameter groups)\n\nTranslations should all be type none. Sizes should be type slider.  Group parameters belonging to the same component. Parameter groups may be nested, meaning they may contain further parameter groups. For example, Table Legs may be a parameter group containing Table Leg #1, containing Translation and Rotation. Ensure you include ALL parameters of the script, not just the ones that have been modified.",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": f"Here's the original prompt used to generate the OpenSCAD script:\n<original_prompt>\n{original_prompt}\n</original_prompt>\n\nHere's the current OpenSCAD script:\n<openscad_script>\n{openscad_output}\n</openscad_script>\n\nThe user has provided the following instructions for modifying the script:\n<user_instructions>\n{instructions}\n</user_instructions>\n\n\nRemember to maintain the original script's structure and naming conventions where possible, and ensure that your modifications are clear and well-commented."
                },
                {
                    "type": "image",
                    "source": {
                        "type": "base64",
                        "media_type": image_media_type,
                        "data": image_data
                    }
                },
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
print(message.content[0].text)
