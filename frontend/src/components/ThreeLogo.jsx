import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
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
}) {
  // Keep aspect by controlling container height; width auto
  return (
    <div style={{ height, width: height, aspectRatio: '1 / 1' }} className="inline-block overflow-visible">
      <Canvas camera={{ position: [0, 0, 2.2], fov: 45 }} dpr={[1, 2]}
        style={{ height: '100%', width: '100%' }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 3, 3]} intensity={1.2} />
        <Suspense fallback={null}>
          <Model url={src} scale={1.1} />
          <Environment preset="city" />
          {orbit && <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.2} />}
        </Suspense>
      </Canvas>
    </div>
  );
}

ThreeLogo.propTypes = {
  src: PropTypes.string,
  height: PropTypes.number,
  orbit: PropTypes.bool,
};

// Drei GLTF loader needs this for static bundlers
useGLTF.preload('/models/Anonymous.glb');
