import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, type RefObject } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Clone, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const MODEL_URL = '/textured.glb';

// Preload GLB model in background for fast initialization
useGLTF.preload(MODEL_URL);

function TrackingModel({ pointerRef, onLoaded }: { pointerRef: RefObject<THREE.Vector2>; onLoaded?: () => void }) {
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

    if (onLoaded) onLoaded();
  }, [model, onLoaded]);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const pointer = pointerRef.current;
    const damping = 1 - Math.exp(-delta * 6.5);

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

function MascotAvatarFallback() {
  return (
    <div className="relative flex h-full w-full items-center justify-center rounded-full bg-gradient-to-b from-[#7B1F2A] via-[#5A161E] to-[#3B0E14] border-2 border-[#F9CE65]/60 shadow-[0_12px_34px_rgba(24,5,7,0.48)] overflow-hidden animate-pulse">
      <div className="flex flex-col items-center justify-center text-center select-none p-1">
        {/* Minang Deta / Crown Icon */}
        <div className="relative mb-[2px]">
          <svg width="28" height="24" viewBox="0 0 28 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
            <path d="M14 2L2 14L6 22H22L26 14L14 2Z" fill="#F9CE65" stroke="#7B1F2A" strokeWidth="1.5" />
            <path d="M14 6L8 15H20L14 6Z" fill="#7B1F2A" />
            <circle cx="14" cy="11" r="2" fill="#F9CE65" />
          </svg>
        </div>
        {/* Mascot Face Details */}
        <div className="flex gap-1.5 items-center my-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F9CE65] shadow-[0_0_6px_#F9CE65]"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#F9CE65] shadow-[0_0_6px_#F9CE65]"></span>
        </div>
        <span className="text-[9px] font-bold tracking-wider text-[#F9CE65] uppercase leading-none mt-0.5">
          Rancak
        </span>
      </div>
    </div>
  );
}

export default function Mascot3D() {
  const pointerRef = useRef(new THREE.Vector2());

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
    <Suspense fallback={<MascotAvatarFallback />}>
      <Canvas
        className="pointer-events-none h-full w-full transition-opacity duration-500 ease-out opacity-100"
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



