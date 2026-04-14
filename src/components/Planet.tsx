import React, { useRef, useMemo, Suspense } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Group, Mesh, Vector3, DoubleSide } from 'three';
import { Text, Html, useTexture } from '@react-three/drei';
import { PlanetData, MoonData } from '../data';
import { cn } from '../lib/utils';
import ErrorBoundary from './ErrorBoundary';

interface PlanetProps {
  data: PlanetData;
  timeSpeed: number;
  onClick: () => void;
  isSelected: boolean;
  onMoonClick: (moon: MoonData) => void;
  selectedMoon: MoonData | null;
}

// Helper component to handle texture loading errors
function TextureMesh({ textureUrl, radius, color, isSelected, name }: { textureUrl?: string, radius: number, color: string, isSelected: boolean, name: string }) {
  // Only call useTexture if we have a valid URL
  const texture = useTexture(textureUrl || "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg");
  
  // Generic noise texture for "spots" and surface detail
  const noiseTexture = useTexture("https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/terrain/grasslight-big_nm.jpg");
  noiseTexture.repeat.set(4, 4);
  noiseTexture.wrapS = noiseTexture.wrapT = 1000; // RepeatWrapping

  return (
    <mesh 
      name={`planet-${name}`}
      castShadow 
      receiveShadow
    >
      <sphereGeometry args={[radius, 64, 64]} />
      <meshStandardMaterial 
        map={textureUrl ? texture : null}
        bumpMap={noiseTexture}
        bumpScale={0.15}
        color={textureUrl ? "white" : color} 
        roughness={0.8} 
        metalness={0.1} 
        emissive={color}
        emissiveIntensity={isSelected ? 0.5 : 0.05}
        flatShading={!textureUrl} // Make rotation visible on fallback
      />
    </mesh>
  );
}

export default function Planet({ data, timeSpeed, onClick, isSelected, onMoonClick, selectedMoon }: PlanetProps) {
  const planetRef = useRef<Group>(null);
  const orbitRef = useRef<Group>(null);

  // Random initial orbit position
  const initialOrbit = useMemo(() => Math.random() * Math.PI * 2, []);

  const { camera } = useThree();

  // Dynamic orbit visibility based on zoom
  const [orbitOpacity, setOrbitOpacity] = React.useState(0.1);
  const [orbitWidth, setOrbitWidth] = React.useState(0.05);

  useFrame((state) => {
    const time = state.clock.getElapsedTime() * timeSpeed;
    
    if (orbitRef.current) {
      orbitRef.current.rotation.y = initialOrbit + time * data.orbitSpeed;
    }
    
    if (planetRef.current) {
      // Self rotation
      planetRef.current.rotation.y += data.rotationSpeed * timeSpeed;
    }

    // Adjust orbit visibility based on camera distance
    const distance = camera.position.length();
    const targetOpacity = isSelected ? 0.6 : Math.min(0.4, (distance / 400) * 0.3 + 0.1);
    const targetWidth = isSelected ? 0.2 : Math.min(0.3, (distance / 500) * 0.2 + 0.08);
    
    setOrbitOpacity(targetOpacity);
    setOrbitWidth(targetWidth);
  });

  return (
    <group ref={orbitRef}>
      <group 
        position={[data.distance, 0, 0]} 
        name={`planet-${data.name}`}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
      >
        {/* Planet Body with Texture Handling */}
        <group ref={planetRef}>
          <ErrorBoundary fallback={
            <mesh>
              <sphereGeometry args={[data.radius, 32, 32]} />
              <meshStandardMaterial 
                color={data.color} 
                emissive={data.color} 
                emissiveIntensity={0.2} 
                flatShading={true} 
              />
            </mesh>
          }>
            <Suspense fallback={
              <mesh>
                <sphereGeometry args={[data.radius, 32, 32]} />
                <meshStandardMaterial 
                  color={data.color} 
                  emissive={data.color} 
                  emissiveIntensity={0.2} 
                  flatShading={true}
                />
              </mesh>
            }>
              <TextureMesh 
                textureUrl={data.textureUrl} 
                radius={data.radius} 
                color={data.color} 
                isSelected={isSelected}
                name={data.name}
              />
            </Suspense>
          </ErrorBoundary>

          {/* Rings for Saturn */}
          {data.hasRings && (
            <mesh rotation={[Math.PI / 2.5, 0, 0]}>
              <ringGeometry args={[data.radius * 1.4, data.radius * 2.2, 64]} />
              <meshStandardMaterial 
                color={data.ringColor} 
                transparent 
                opacity={0.6} 
                side={DoubleSide} 
              />
            </mesh>
          )}
        </group>

        {/* Planet Label */}
        <Html position={[0, data.radius + 1, 0]} center distanceFactor={20}>
          <div className={cn(
            "px-2 py-1 rounded border border-white/10 backdrop-blur-sm transition-all duration-300 whitespace-nowrap pointer-events-none",
            isSelected ? "bg-blue-500/40 border-blue-400 scale-110" : "bg-black/40 opacity-40"
          )}>
            <span className="text-[10px] uppercase tracking-widest font-bold text-white">
              {data.name}
            </span>
          </div>
        </Html>

        {/* Moons - Only show if planet is selected or zoom is close */}
        {isSelected && data.moons.map((moon) => (
          <Moon 
            key={moon.name} 
            data={moon} 
            timeSpeed={timeSpeed} 
            onClick={() => onMoonClick(moon)}
            isSelected={selectedMoon?.name === moon.name}
          />
        ))}
      </group>

      {/* Orbit Path */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[data.distance - orbitWidth, data.distance + orbitWidth, 256]} />
        <meshBasicMaterial 
          color={data.color} 
          transparent 
          opacity={orbitOpacity} 
          side={DoubleSide} 
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function MoonBody({ textureUrl, radius, color, isSelected }: { textureUrl?: string, radius: number, color: string, isSelected: boolean }) {
  const moonTexture = useTexture(textureUrl || "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/moon_1024.jpg");
  const noiseTexture = useTexture("https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/terrain/grasslight-big_nm.jpg");

  return (
    <meshStandardMaterial 
      map={textureUrl ? moonTexture : null}
      bumpMap={noiseTexture}
      bumpScale={0.02}
      color={textureUrl ? "white" : color}
      emissive={color}
      emissiveIntensity={isSelected ? 0.8 : 0.2}
      flatShading={!textureUrl}
    />
  );
}

function Moon({ data, timeSpeed, onClick, isSelected }: { data: MoonData, timeSpeed: number, onClick: () => void, isSelected: boolean }) {
  const moonRef = useRef<Mesh>(null);
  const orbitRef = useRef<Group>(null);
  const initialOrbit = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime() * timeSpeed;
    if (orbitRef.current) {
      orbitRef.current.rotation.y = initialOrbit + time * data.orbitSpeed;
    }
    if (moonRef.current) {
      moonRef.current.rotation.y += 0.01 * timeSpeed;
    }
  });

  return (
    <group ref={orbitRef}>
      <mesh 
        position={[data.distance, 0, 0]} 
        ref={moonRef} 
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        castShadow 
        receiveShadow
      >
        <sphereGeometry args={[data.radius, 32, 32]} />
        <ErrorBoundary fallback={
          <meshStandardMaterial color={data.color} emissive={data.color} emissiveIntensity={0.2} flatShading={true} />
        }>
          <Suspense fallback={
            <meshStandardMaterial color={data.color} emissive={data.color} emissiveIntensity={0.2} flatShading={true} />
          }>
            <MoonBody 
              textureUrl={data.textureUrl} 
              radius={data.radius} 
              color={data.color} 
              isSelected={isSelected} 
            />
          </Suspense>
        </ErrorBoundary>
        
        {/* Moon Label */}
        <Html position={[0, data.radius + 0.5, 0]} center distanceFactor={10}>
          <div className={cn(
            "px-1.5 py-0.5 rounded border border-white/10 backdrop-blur-sm transition-all duration-300 whitespace-nowrap pointer-events-none",
            isSelected ? "bg-white/20 border-white/40 scale-110" : "bg-black/40 opacity-40"
          )}>
            <span className="text-[8px] uppercase tracking-widest text-white">
              {data.name}
            </span>
          </div>
        </Html>
      </mesh>

      {/* Moon Orbit Path */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[data.distance - 0.02, data.distance + 0.02, 64]} />
        <meshBasicMaterial color="white" transparent opacity={0.1} side={DoubleSide} />
      </mesh>
    </group>
  );
}
