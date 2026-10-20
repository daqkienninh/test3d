
import { Suspense, useMemo, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Center,
  ContactShadows,
  Environment,
  Html,
  OrbitControls,
  useGLTF,
} from "@react-three/drei";
import * as THREE from "three";

function LetterModel() {
  const { scene } = useGLTF("/models/letter.glb");

  const model = useMemo(() => scene.clone(true), [scene]);

  const { scale, center } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    const maxDimension = Math.max(size.x, size.y, size.z);

    return {
      scale: maxDimension > 0 ? 2.5 / maxDimension : 1,
      center: center.toArray(),
    };
  }, [model]);

  return (
    <group scale={scale}>
      <primitive
        object={model}
        position={center.map((value) => -value)}
      />
    </group>
  );
}

function LoadingModel() {
  return (
    <Html center>
      <div className="loading">
        Đang tải sản phẩm...
      </div>
    </Html>
  );
}

export default function LetterViewer() {
  const controlsRef = useRef(null);

  return (
    <div className="viewer">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true }}
      >
        <color attach="background" args={["#f5f5f2"]} />

        <ambientLight intensity={0.8} />

        <directionalLight
          position={[4, 6, 5]}
          intensity={2}
        />

        <Suspense fallback={<LoadingModel />}>
          <Center>
            <LetterModel />
          </Center>

          <Environment preset="studio" />

          <ContactShadows
            position={[0, -1.2, 0]}
            opacity={0.25}
            scale={8}
            blur={2}
          />
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          makeDefault
          enableDamping
          autoRotate
          autoRotateSpeed={1.5}
          minDistance={2}
          maxDistance={8}
        />
      </Canvas>

      <button
        type="button"
        className="reset-view"
        onClick={() => controlsRef.current?.reset()}
      >
        Đặt lại góc nhìn
      </button>
    </div>
  );
}

useGLTF.preload("/models/letter.glb");
