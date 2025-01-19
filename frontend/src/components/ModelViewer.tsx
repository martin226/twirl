import { OrbitControls, Grid, GizmoHelper, GizmoViewport, Sky, TransformControls } from '@react-three/drei';
import { useFrame, useLoader } from '@react-three/fiber';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { usePdrStore } from '../contexts/store';
import { BufferGeometry, Color, Float32BufferAttribute } from 'three';

function MySky() {
    const [sunPosition, setSunPosition] = useState([100, 20, 100]);
    const sunAngle = useRef(0);

    useFrame((_, delta) => {
        const speed = Math.PI * 2 * 0.01;
        sunAngle.current = (sunAngle.current + speed * delta) % (Math.PI * 2);
        const x = 100 * Math.cos(sunAngle.current);
        const y = 50 * Math.sin(sunAngle.current);
        const z = 100 * Math.sin(sunAngle.current);
        setSunPosition([x, y, z]);
    });

    return (
        <Sky sunPosition={sunPosition as [number, number, number]} />
    );
}

function GradientMaterial() {
    const materialRef = useRef(null);
    const [time, setTime] = useState(0);

    useFrame((_, dt) => {
        setTime((time) => time + dt);
        // if (materialRef.current) materialRef.current.uniforms.time.value = time;
    });

    // Custom shader for gradient
    const gradientShader = {
        uniforms: {
            color1: { value: new Color(0xff0000) }, // Start color
            color2: { value: new Color(0x0000ff) }, // End color
            time: { value: time } // Time uniform for animation
        },
        vertexShader: `
            varying float vY;
            void main() {
            vY = position.y; // Pass the Y position to the fragment shader
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 color1;
            uniform vec3 color2;
            uniform float time;
            varying float vY;
            void main() {
            // Use sine wave to make gradient colors dynamic
            float offset = sin(time + vY * 3.14159) * 0.5 + 0.5;
            vec3 color = mix(color1, color2, offset);
            gl_FragColor = vec4(color, 1.0);
            }
        `
    };
  
    return (
      <shaderMaterial
        ref={materialRef}
        attach="material"
        args={[gradientShader]}
        transparent
      />
    );
  }

function STLModel({ url }: any) {
    if (!url) {
        return null;
    }
    const geometry = useLoader(STLLoader, url);

    console.log("Geometry", geometry);

    return (
        <mesh scale={[0.01, 0.01, 0.01]} rotation={[-Math.PI / 2, 0, 0]} geometry={Array.isArray(geometry) ? geometry[0] : geometry}>
            <GradientMaterial />
        </mesh>
    );
}

export default function ModelViewer() {
    const [hovered, setHover] = useState(false)
    const [active, setActive] = useState(false)
    const [url, setUrl] = useState<string | null>(null);
    const { worker } = usePdrStore();

    const onMessage = (e: any) => {
        const { outputFile, output } = e.data;

        console.log("Received output", output);
        setUrl(URL.createObjectURL(new Blob([output], { type: "application/octet-stream" })));
    }

    useEffect(() => {
        if (!worker) {
            return;
        }

        worker.addEventListener('message', onMessage);

        return () => {
            worker.removeEventListener('message', onMessage)
        }
    }, [worker]);

    return (
        <>
            <OrbitControls makeDefault />
            <ambientLight />
            <MySky />
            {/* <Sky ref={skyRef} distance={450000} sunPosition={[0, 10, 10]} inclination={0} azimuth={0.25} /> */}
            {/* <Sky
                distance={450000} 
                sunPosition={[0, -1, -10]} 
                inclination={0} 
                azimuth={0.25} 
                mieCoefficient={0.005}
                mieDirectionalG={0.8}
                rayleigh={6}
                turbidity={10}
            /> */}
            <Grid args={[50, 50]} cellColor={0xff0000} />
            <GizmoHelper
                alignment="top-right"
                margin={[80, 80]}
            >
                <GizmoViewport axisColors={['red', 'green', 'blue']} labelColor="black" />
            </GizmoHelper>
            <TransformControls>
                <STLModel url={url} />
            </TransformControls>
            {/* <STLModelWithControls stlPath={url} /> */}
            {/* <Suspense fallback={null}> */}
            {/* </Suspense> */}
            <mesh
                position={[5, 0, 5]}
                scale={active ? 1.5 : 1}
                onClick={() => {
                    worker?.postMessage({ scadCode: `
// Christmas Tree with Decorations
// All dimensions in millimeters

// Main Parameters
tree_height = 300;
base_width = 200;
num_layers = 5;
trunk_height = 30;
trunk_width = 40;
ornament_size = 10;
num_ornaments = 15;
star_size = 30;
quality = 50;

// Set minimum angle for smooth curves
$fn = quality;

// Colors
trunk_color = [0.45, 0.25, 0.15];
tree_color = [0.2, 0.8, 0.3];
star_color = [1, 0.8, 0];
ornament_colors = [[1, 0, 0], [0, 0, 1], [1, 1, 0], [1, 0.5, 0], [1, 0, 1]];

// Module for tree trunk
module trunk() {
  color(trunk_color)
    cylinder(h=trunk_height, r=trunk_width/2, $fn=8);
}

// Module for a single tree layer
module tree_layer(size, height, layer_height) {
  color(tree_color)
    hull() {
      translate([0, 0, height])
        cylinder(r=0.1, h=0.1);
      translate([0, 0, height-layer_height])
        cylinder(r=size/2, h=0.1);
    }
}

// Module for ornament
module ornament(x, y, z) {
  color_index = rands(0, len(ornament_colors)-0.01, 1)[0];
  color(ornament_colors[floor(color_index)])
    translate([x, y, z])
      sphere(r=ornament_size/2);
}

// Module for star topper
module star() {
  color(star_color)
    hull() {
      translate([0, 0, tree_height-star_size/2])
        sphere(r=star_size/6);
      translate([0, 0, tree_height])
        cylinder(r=0.1, h=0.1);
    }
}

// Main tree assembly
module christmas_tree() {
  // Trunk
  trunk();
  
  // Tree layers
  layer_height = (tree_height - trunk_height) / num_layers;
  for(i = [0:num_layers-1]) {
    current_height = trunk_height + (i+1) * layer_height;
    current_width = base_width * (1 - i/num_layers);
    tree_layer(current_width, current_height, layer_height);
  }
  
  // Ornaments
  for(i = [0:num_ornaments-1]) {
    angle = rands(0, 360, 1)[0];
    height = rands(trunk_height + layer_height, tree_height - star_size, 1)[0];
    radius = rands(0, base_width/3, 1)[0];
    ornament(radius * cos(angle), radius * sin(angle), height);
  }
  
  // Star
  star();
}

// Generate the tree
christmas_tree();
                    `, outputFile: "tree.stl" });
                }}
            >
                {/* onClick={(event) => setActive(!active)}
                onPointerOver={(event) => setHover(true)}
                onPointerOut={(event) => setHover(false)}> */}
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
            </mesh>
        </>
    );
}