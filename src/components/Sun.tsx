import React, { useRef, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { useTexture } from '@react-three/drei';
import ErrorBoundary from './ErrorBoundary';

function SunBody() {
  const sunRef = useRef<Mesh>(null);
  // Using a more reliable URL or at least one that we can catch if it fails
  const texture = useTexture("https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/planets/sun.jpg");
  const noiseTexture = useTexture("https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/terrain/grasslight-big_nm.jpg");

  useFrame(() => {
    if (sunRef.current) {
      sunRef.current.rotation.y += 0.002;
    }
  });

  return (
    <mesh ref={sunRef}>
      <sphereGeometry args={[8, 64, 64]} />
      <meshStandardMaterial 
        map={texture}
        bumpMap={noiseTexture}
        bumpScale={0.1}
        emissive="#ffcc33" 
        emissiveIntensity={2} 
        color="#ffcc33" 
      />
    </mesh>
  );
}

export default function Sun() {
  const glowRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime) * 0.05);
    }
  });

  const fallbackSun = (
    <mesh>
      <sphereGeometry args={[8, 32, 32]} />
      <meshStandardMaterial emissive="#ffcc33" emissiveIntensity={2} color="#ffcc33" />
    </mesh>
  );

  return (
    <group>
      {/* Core */}
      <ErrorBoundary fallback={fallbackSun}>
        <Suspense fallback={fallbackSun}>
          <SunBody />
        </Suspense>
      </ErrorBoundary>

      {/* Glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[8.5, 64, 64]} />
        <meshBasicMaterial 
          color="#ff9900" 
          transparent 
          opacity={0.15} 
        />
      </mesh>

      {/* Outer Halo */}
      <mesh>
        <sphereGeometry args={[10, 64, 64]} />
        <meshBasicMaterial 
          color="#ff6600" 
          transparent 
          opacity={0.05} 
        />
      </mesh>
    </group>
  );
}
