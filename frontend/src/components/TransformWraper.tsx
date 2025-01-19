import { useEffect, useRef, useState } from 'react';
import { TransformControls } from '@react-three/drei';
import { useThree } from '@react-three/fiber';

const TransformControlsWrapper = ({ children }: { children: React.ReactNode }) => {
//   const [isHovered, setIsHovered] = useState(false);
  const [mode, setMode] = useState('translate');
  const [showControls, setShowControls] = useState(false);
  const controlsRef = useRef();
  const targetRef = useRef();
  const { gl } = useThree();

  useEffect(() => {
    const controls = controlsRef.current;
    if (controls) {
      const callback = (event: any) => {
        if (event.type === 'dblclick') {
          setMode((prevMode) => {
            switch (prevMode) {
              case 'translate':
                return 'rotate';
              case 'rotate':
                return 'scale';
              default:
                return 'translate';
            }
          });
        }
      };

      gl.domElement.addEventListener('dblclick', callback);
      return () => gl.domElement.removeEventListener('dblclick', callback);
    }
  }, [gl.domElement]);

  return (
    <>
      <group 
        ref={targetRef as any}
      >
        {children}
      </group>
      {/* {showControls && ( */}
        <TransformControls
          ref={controlsRef as any}
          mode={mode as any }
          object={targetRef.current}
        //   onPointerOver={handlePointerOver}
        //   onPointerOut={handlePointerOut}
          visible={showControls}
        />
      {/* )} */}
    </>
  );
};

export default TransformControlsWrapper;