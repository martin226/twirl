import { OrbitControls, Grid, GizmoHelper, GizmoViewport, Sky } from '@react-three/drei';
import { useFrame, useLoader } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { usePdrStore } from '../contexts/store';
import { Color } from 'three';

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
    const materialRef = useRef();
  
    // Custom shader for gradient
    const gradientShader = {
      uniforms: {
        uColor1: { value: new Color(0x00ff00) }, // Start color
        uColor2: { value: new Color(0x0000ff) }, // End color
      },
      vertexShader: `
        varying vec3 vPosition;
        void main() {
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vPosition;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        void main() {
          float mixFactor = (vPosition.y + 1.0) / 2.0;
          gl_FragColor = vec4(mix(uColor1, uColor2, mixFactor), 1.0);
        }
      `,
    };
  
    return (
      <shaderMaterial
        ref={materialRef}
        attach="material"
        args={[gradientShader]}
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
        <mesh geometry={Array.isArray(geometry) ? geometry[0] : geometry}>
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
            <STLModel url={url} />
            <mesh
                scale={active ? 1.5 : 1}
                onClick={(event) => setActive(!active)}
                onPointerOver={(event) => setHover(true)}
                onPointerOut={(event) => setHover(false)}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
            </mesh>
        </>
    );
}