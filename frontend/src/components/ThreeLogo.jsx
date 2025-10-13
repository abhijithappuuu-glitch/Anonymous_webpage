import { Suspense, useMemo, useEffect, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, OrbitControls, useGLTF } from '@react-three/drei';
import PropTypes from 'prop-types';

// Simple wrapper to load and render a GLB model
function Model({ url, scale = 1, rotation = [0, 0, 0] }) {
  const { scene } = useGLTF(url);
  const cloned = useMemo(() => scene.clone(true), [scene]);
  return <primitive object={cloned} scale={scale} rotation={rotation} />;
}

Model.propTypes = {
  url: PropTypes.string.isRequired,
  scale: PropTypes.oneOfType([PropTypes.number, PropTypes.array]),
  rotation: PropTypes.array,
};

export default function ThreeLogo({
  src = '/models/Anonymous.glb',
  height = 48,
  orbit = false,
  rotate = true,
  reverse = true,
  speed = 0.6, // radians per second (approx.)
  reverseIntervalMs = 4000,
  direction = 1, // 1: clockwise, -1: anticlockwise
  modelScale = 1.0,
  cameraZ = 2.2,
}) {
  // Inner rotator must live inside Canvas to use R3F hooks
  const Rotator = ({ children }) => {
    const ref = useRef();
    const [dir, setDir] = useState(direction);

    useEffect(() => {
      if (!reverse) return;
      const id = setInterval(() => setDir((d) => -d), reverseIntervalMs);
      return () => clearInterval(id);
    }, [reverse, reverseIntervalMs]);

    useFrame((_, delta) => {
      if (rotate && ref.current && !orbit) {
        ref.current.rotation.y += dir * speed * delta;
      }
    });

    return <group ref={ref}>{children}</group>;
  };

  // Keep aspect by controlling container height; width auto.
  // Accept numeric (px) or string (%, rem) for height to support responsive containers.
  const size = typeof height === 'number' ? `${height}px` : height;
  return (
    <div style={{ height: size, width: size, aspectRatio: '1 / 1' }} className="inline-block overflow-visible">
      <Canvas camera={{ position: [0, 0, cameraZ], fov: 45 }} dpr={[1, 2]} gl={{ alpha: true }}
        style={{ height: '100%', width: '100%', background: 'transparent' }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 3, 3]} intensity={1.2} />
        <Suspense fallback={null}>
          <Rotator>
            <Model url={src} scale={modelScale} />
          </Rotator>
          <Environment preset="city" />
          {orbit && (
            <OrbitControls
              enableZoom={false}
              autoRotate
              autoRotateSpeed={direction * (speed * 2)}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}

ThreeLogo.propTypes = {
  src: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  orbit: PropTypes.bool,
  rotate: PropTypes.bool,
  reverse: PropTypes.bool,
  speed: PropTypes.number,
  reverseIntervalMs: PropTypes.number,
  direction: PropTypes.oneOf([1, -1]),
  modelScale: PropTypes.number,
  cameraZ: PropTypes.number,
};

// Drei GLTF loader needs this for static bundlers
useGLTF.preload('/models/Anonymous.glb');
