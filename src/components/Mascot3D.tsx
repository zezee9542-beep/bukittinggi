import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, type RefObject } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Clone, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const MODEL_URL = '/textured.glb';

function TrackingModel({ pointerRef }: { pointerRef: RefObject<THREE.Vector2> }) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL_URL);
  const model = useMemo(() => scene.clone(true), [scene]);

  useLayoutEffect(() => {
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const longestSide = Math.max(size.x, size.y, size.z) || 1;
    const scale = 2.55 / longestSide;

    model.position.set(-center.x, -center.y, -center.z);
    model.scale.setScalar(scale);

    model.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      object.castShadow = false;
      object.receiveShadow = false;
      object.frustumCulled = true;
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      materials.forEach((material) => {
        material.transparent = false;
        material.depthWrite = true;
        material.side = THREE.DoubleSide;
        if (material instanceof THREE.MeshStandardMaterial) {
          material.roughness = Math.min(material.roughness, 0.78);
          material.metalness = 0;
        }
        material.needsUpdate = true;
      });
    });
  }, [model]);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const pointer = pointerRef.current;
    const damping = 1 - Math.exp(-delta * 6.5);

    // The GLB has no head bone, so use a very small root rotation rather than
    // translating it left/right. This reads as “looking” while preventing the
    // full-body spin that happened with unrestricted pointer rotation.
    const targetPitch = THREE.MathUtils.clamp(pointer.y * 0.09, -0.09, 0.09);
    const targetYaw = THREE.MathUtils.clamp(pointer.x * 0.18, -0.18, 0.18);
    const targetQuaternion = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(targetPitch, targetYaw, 0, 'YXZ'),
    );

    group.quaternion.slerp(targetQuaternion, damping);
    group.position.x = THREE.MathUtils.lerp(group.position.x, 0, damping);
    group.position.y = THREE.MathUtils.lerp(group.position.y, -0.08, damping);
  });

  return (
    <group ref={groupRef} position={[0, -0.08, 0]}>
      <Clone object={model} />
    </group>
  );
}

function MascotFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-full bg-[#7B1F2A] text-xs font-semibold text-[#F9CE65] shadow-[0_12px_34px_rgba(24,5,7,0.36)]">
      RB
    </div>
  );
}

export default function Mascot3D() {
  const pointerRef = useRef(new THREE.Vector2());

  // Track the whole viewport, so the mascot follows the visitor even when
  // their cursor is nowhere near its small canvas in the bottom corner.
  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      pointerRef.current.set(
        THREE.MathUtils.clamp((event.clientX / window.innerWidth) * 2 - 1, -1, 1),
        THREE.MathUtils.clamp(-((event.clientY / window.innerHeight) * 2 - 1), -1, 1),
      );
    };
    const resetPointer = () => pointerRef.current.set(0, 0);

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('blur', resetPointer);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('blur', resetPointer);
    };
  }, []);

  return (
    <Suspense fallback={<MascotFallback />}>
      <Canvas
        className="pointer-events-none h-full w-full"
        camera={{ position: [0, 0.08, 3.45], fov: 30, near: 0.1, far: 100 }}
        dpr={[1, 1.5]}
        frameloop="always"
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: false }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.setClearColor(0x000000, 0);
          gl.autoClear = true;
          gl.clear();
        }}
      >
        <hemisphereLight args={['#fff8ea', '#40212b', 3.5]} />
        <ambientLight intensity={2.4} />
        <directionalLight position={[3, 4, 5]} intensity={3.8} />
        <directionalLight position={[-3, 2, 3]} intensity={2.1} color="#ffd9b3" />
        <TrackingModel pointerRef={pointerRef} />
      </Canvas>
    </Suspense>
  );
}


