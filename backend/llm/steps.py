import base64
from anthropic import AsyncAnthropic
import os
from dotenv import load_dotenv
import httpx
from llm import prompts

load_dotenv()

client = AsyncAnthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY"),
)


async def step_0(description: str, image_data: str, image_media_type: str):
    message = await client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=8192,
        temperature=1,
        messages=[
            {
                "role": "user",
                "content": [prompts.threejs_gen[0](), prompts.threejs_gen[1](description), prompts.threejs_gen[2](image_data, image_media_type)],
            },
            {
                "role": "assistant",
                "content": [{"type": "text", "text": "<model_planning>"}],
            },
        ],
    )
    print("Step 0 message:", message.content[0].text)
    return message.content[0].text.split("<threejs_output>")[1].rstrip().rstrip("</threejs_output>"), description, image_data, image_media_type

async def step_1(threejs_output: str, original_prompt: str, image_data: str, image_media_type: str):
    message = await client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=8192,
        temperature=0,
        messages=[
            {
                "role": "user",
                "content": [prompts.threejs_to_openscad[0](), prompts.threejs_to_openscad[1](threejs_output, original_prompt), prompts.threejs_to_openscad[2](image_data, image_media_type)],
            },
            {
                "role": "assistant",
                "content": [{"type": "text", "text": "<conversion_analysis>"}],
            },
        ],
    )
    return message.content[0].text.split("<openscad_output>")[1].rstrip().rstrip("</openscad_output>"), original_prompt, image_data, image_media_type

async def add_message(original_prompt: str, openscad_output: str, instructions: str, image_media_type: str, image_data: str):
    message = await client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=8192,
        temperature=0,
        messages=[
            {
                "role": "user",
                "content": [prompts.followup[0](original_prompt, openscad_output, instructions), prompts.followup[1](image_media_type, image_data)],
            },
            {
                "role": "assistant",
                "content": [{"type": "text", "text": "<modified_script>"}],
            }
        ],
    )
    return message.content[0].text

# the result of each step is passed as the arguments to the next step

async def fetch_and_encode_image(image_url):
    async with httpx.AsyncClient() as client:
        response = await client.get(image_url)
        return base64.standard_b64encode(response.content).decode("utf-8")

async def run_pipeline(description: str, image_url: str, image_media_type: str):
    image_data = await fetch_and_encode_image(image_url)
    result = await step_0(description, image_data, image_media_type)
    result = await step_1(*result)
    return result

async def new_prompt(description: str, image_url: str, image_media_type: str):
    image_data = await fetch_and_encode_image(image_url)
    result = await client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=8192,
        temperature=0.5,
        system="You are Imagine, an expert AI assistant specializing in generating highly accurate, error-free OpenSCAD scripts based on textual descriptions or images of 3D objects. Your task is to create precise, functional 3D models that can be directly imported into OpenSCAD without runtime errors.\n\nOpenSCAD v2021.01 Cheat Sheet (these are the only language features available)\nSyntax\nvar = value;\nvar = cond ? value_if_true : value_if_false;\nvar = function (x) x + x;\nmodule name(…) { … }\nname();\nfunction name(…) = …\nname();\ninclude <….scad>\nuse <….scad>\n\nConstants\nundef: undefined value\nPI: mathematical constant π (~3.14159)\n\nOperators\nAddition: n + m\nSubtraction: n - m\nMultiplication: n * m\nDivision: n / m\nModulo: n % m\nExponentiation: n ^ m\nLogical: &&, ||, !\nComparisons: <, <=, ==, !=, >=, >\n\nSpecial Variables\n$fa: minimum angle\n$fs: minimum size\n$fn: number of fragments\n$t: animation step\n$children: number of module children\n\nModifier Characters\n*: disable\n!: show only\n#: highlight/debug\n%: transparent/background\n\n2D/3D Shapes\nCircle: circle(radius | d=diameter)\nSquare: square(size, center)\nPolygon: polygon([points], [paths])\nSphere: sphere(radius | d=diameter)\nCube: cube(size, center)\nCylinder: cylinder(h, r|d, center)\nPolyhedron: polyhedron(points, faces, convexity)\n\nTransformations\nTranslate: translate([x, y, z])\nRotate: rotate([x, y, z])\nScale: scale([x, y, z])\nMirror: mirror([x, y, z])\nColor: color(\"name\", alpha)\nOffset: offset(r|delta, chamfer)\nHull: hull()\nMinkowski: minkowski()\n\nBoolean Operations\nunion(), difference(), intersection()\n\nLists\nCreate: list = […, …, …];\nIndex: list[2], list.z\n\nMathematical Functions\nabs, sign, sin, cos, tan, acos, asin, atan, pow, sqrt, log, etc.\n\nOther Functions\nconcat, lookup, str, chr, version, len, render, etc.\n\nPlease follow these guidelines to create the OpenSCAD script:\n\n1. Analyze the Input:\n   - For textual descriptions, carefully extract all dimensions, shapes, features, and spatial relationships.\n   - For images, if provided, interpret the 3D structure as accurately as possible. Request additional angles if necessary.\n\n2. Planning Phase:\n   Wrap your detailed plan for creating the OpenSCAD 3D model inside <model_planning> tags. It's OK for this section to be quite long.\n   a. Extract all features and relationships from the input.\n   b. Organize these features into a structured plan for the OpenSCAD model.\n   c. Sketch out the basic structure of the OpenSCAD script, including main objects and functions.\n   d. Identify potential challenges in implementing the model and how to address them.\n   e. Outline the relationships and hierarchy between different OpenSCAD objects.\n   f. Consider performance optimizations for complex models.\n   g. Consider what variables to parameterize to enable increased customizability.\n   h. Summarize the structured plan to ensure alignment with the user's intent.\n\n3. Dimensions and Units:\n   - Use millimeters (mm) as the default unit unless otherwise specified.\n   - If units are ambiguous, make reasonable assumptions based on context.\n   - When given ranges, use random but realistic values within the specified range.\n\n4. Script Structure:\n   - Use 2 spaces for indentation.\n   - Organize the script into logical sections:\n     a. Header comments describing the model\n     b. Variable definitions for key dimensions\n     c. Function and module definitions\n     d. Main script execution block\n\n5. Verification:\n   - Check for syntax errors.\n   - Ensure all modules and variables are used correctly.\n   - Validate that the generated script will execute without additional user input.\n\n6. Simplicity and Accuracy:\n   - Prioritize coherence and accuracy over detail.\n   - Create simpler, low-poly versions of models where possible.\n   - Ensure all components are correctly positioned and rotated, even if it means sacrificing some complexity.\n\n7. Verification:\n   - Check for syntax errors.\n   - Ensure all objects and variables are used correctly.\n   - Validate that the generated script will execute without additional user input.\n\nAfter completing the planning phase, provide your OpenSCAD code inside <openscad_output> tags. Remember to provide a complete, executable OpenSCAD script that can be directly compiled without errors.",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "<examples>\n<example>\n<description>\nCreate a model of a cube with a sphere inside it\n</description>\n<ideal_output>\n<model_planning>\n1. Key Features:\n   - Outer cube container\n   - Inner sphere that fits within the cube\n   - The sphere should be centered within the cube\n\n2. Dimensions:\n   - Will use a 100mm cube as the outer container (good visible size)\n   - Sphere diameter will be slightly smaller than cube (80mm) to ensure clear visibility\n\n3. Approach:\n   - Use difference() operation to make cube hollow\n   - Use union() to combine shapes\n   - Center all objects for proper alignment\n   - Use descriptive variables for maintainability\n\n4. Structure:\n   - Define main dimensions as variables\n   - Create main shapes using basic primitives\n   - Center everything at origin\n   - Use transparancy for better visualization of inner sphere\n\n5. Optimization:\n   - Simple shapes, no complex operations needed\n   - Basic primitives will render quickly\n   - No need for modules due to simplicity\n</model_planning>\n\n<openscad_output>\n// Cube with Sphere Inside\n// All dimensions in millimeters\n\n// Main dimensions\ncube_size = 100;  // Size of the outer cube\nsphere_diameter = 80;  // Diameter of the inner sphere\n\n// Create the model\ndifference() {\n  union() {\n    // Outer cube\n    #cube([cube_size, cube_size, cube_size], center=true);\n    \n    // Inner sphere\n    sphere(d=sphere_diameter);\n  }\n}\n</openscad_output>\n</ideal_output>\n</example>\n<example>\n<description>\nGenerate a model of a hollow cylinder with a 5mm wall thickness\n</description>\n<ideal_output>\n<model_planning>\n1. Features Analysis:\n   - Shape: Hollow cylinder\n   - Wall thickness: 5mm\n   - Need to determine reasonable dimensions for height and diameter\n   \n2. Implementation Approach:\n   - Will use difference() operation between two cylinders\n   - Outer cylinder will be larger\n   - Inner cylinder will be smaller by 2 * wall thickness\n   - Will use variables for all key dimensions for easy modification\n   \n3. Dimensions (reasonable assumptions):\n   - Height: 50mm (typical useful height)\n   - Outer diameter: 30mm (reasonable size for handling)\n   - Wall thickness: 5mm (as specified)\n   - Inner diameter: Outer diameter - (2 * wall thickness) = 20mm\n\n4. Structure:\n   - Define variables at top\n   - Use difference() to subtract inner cylinder from outer cylinder\n   - Center all objects for easy manipulation\n</model_planning>\n\n<openscad_output>\n// Hollow Cylinder with 5mm Wall Thickness\n// All dimensions in millimeters\n\n// Key dimensions\nheight = 50;          // Height of the cylinder\nouter_diameter = 30;  // Outer diameter\nwall_thickness = 5;   // Wall thickness\ninner_diameter = outer_diameter - (2 * wall_thickness);  // Calculate inner diameter\n\n// Create hollow cylinder\ndifference() {\n  // Outer cylinder\n  cylinder(h = height, d = outer_diameter, center = true, $fn = 100);\n  \n  // Inner cylinder (subtracted)\n  cylinder(h = height + 1, d = inner_diameter, center = true, $fn = 100);\n}\n</openscad_output>\n</ideal_output>\n</example>\n<example>\n<description>\nCreate a dining table\n</description>\n<ideal_output>\n<model_planning>\n1. Features to include:\n- Table top (rectangular surface)\n- Four table legs\n- Support structure under the table top\n- Reasonable dimensions for a dining table\n\n2. Dimensions (using standard dining table measurements):\n- Table top: 150cm × 90cm × 4cm (1500mm × 900mm × 40mm)\n- Height: 75cm (750mm)\n- Legs: 8cm × 8cm (80mm × 80mm)\n- Support beams: 6cm × 4cm (60mm × 40mm)\n\n3. Structure:\n- Create modules for:\n  * Table top\n  * Table legs\n  * Support structure\n- Use variables for key dimensions to allow easy customization\n- Position legs at corners with small inset\n- Add support beams connecting legs\n\n4. Approach:\n- Use simple cubes for basic shapes\n- Position legs using translations\n- Create support frame under table top\n- Ensure all components align properly\n\n5. Optimizations:\n- Use modules to reduce code duplication\n- Keep geometry simple for better performance\n- Use variables for easy customization\n</model_planning>\n\n<openscad_output>\n// Dining Table Model\n// All dimensions in millimeters\n\n// Main dimensions\ntable_length = 1500;\ntable_width = 900;\ntable_height = 750;\ntable_top_thickness = 40;\n\n// Leg dimensions\nleg_width = 80;\nleg_height = table_height - table_top_thickness;\nleg_inset = 50;  // Distance from edge\n\n// Support beam dimensions\nsupport_width = 60;\nsupport_height = 40;\n\n// Module for table leg\nmodule table_leg() {\n  cube([leg_width, leg_width, leg_height]);\n}\n\n// Module for support beam\nmodule support_beam(length) {\n  cube([length, support_width, support_height]);\n}\n\n// Main assembly\nmodule dining_table() {\n  // Table top\n  cube([table_length, table_width, table_top_thickness]);\n  \n  // Table legs\n  translate([leg_inset, leg_inset, -leg_height])\n    table_leg();\n  \n  translate([table_length - leg_width - leg_inset, leg_inset, -leg_height])\n    table_leg();\n  \n  translate([leg_inset, table_width - leg_width - leg_inset, -leg_height])\n    table_leg();\n  \n  translate([table_length - leg_width - leg_inset, \n            table_width - leg_width - leg_inset, \n            -leg_height])\n    table_leg();\n  \n  // Support structure\n  // Long support beams\n  translate([leg_inset + leg_width/2, leg_inset + leg_width/2, -support_height])\n    support_beam(table_length - leg_width - 2*leg_inset);\n  \n  translate([leg_inset + leg_width/2, \n            table_width - leg_width/2 - leg_inset, \n            -support_height])\n    support_beam(table_length - leg_width - 2*leg_inset);\n  \n  // Cross support beams\n  translate([leg_inset + leg_width/2, leg_inset + leg_width/2, -support_height])\n    rotate([0, 0, 90])\n      support_beam(table_width - leg_width - 2*leg_inset);\n  \n  translate([table_length - leg_width/2 - leg_inset, \n            leg_inset + leg_width/2, \n            -support_height])\n    rotate([0, 0, 90])\n      support_beam(table_width - leg_width - 2*leg_inset);\n}\n\n// Create the table\ndining_table();\n</openscad_output>\n</ideal_output>\n</example>\n</examples>\n\n"
                    },
                    {
                        "type": "text",
                        "text": f"Here is the description of the 3D object you need to model:\n\n<description>\n{description}\n</description>\n\nRemember to provide a complete, executable OpenSCAD script that can be directly copied and pasted into OpenSCAD without errors."
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
                        "text": "<model_planning>"
                    }
                ]
            }
        ]
    )
    return result.content[0].text.split("<openscad_output>")[1].rstrip().rstrip("</openscad_output>")