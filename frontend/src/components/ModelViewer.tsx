import { OrbitControls, Grid, GizmoHelper, GizmoViewport, Sky, TransformControls } from '@react-three/drei';
import { useFrame, useLoader } from '@react-three/fiber';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { usePdrStore } from '../contexts/store';
import { BufferGeometry, Color, Float32BufferAttribute } from 'three';
import TransformControlsWrapper from './TransformWraper';

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
            {/* <TransformControls> */}
            <TransformControlsWrapper>
                <STLModel url={url} />
            </TransformControlsWrapper>
            {/* </TransformControls> */}
            {/* <STLModelWithControls stlPath={url} /> */}
            {/* <Suspense fallback={null}> */}
            {/* </Suspense> */}
        </>
    );
}