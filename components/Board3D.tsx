
import React, { Suspense, useMemo, useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import ChessPiece3D from './ChessPiece3D';
import { THEMES, SQUARE_SIZE } from '../constants';

interface Board3DProps {
  fen: string;
  onSquareClick: (square: string) => void;
  selectedSquare: string | null;
  validMoves: string[];
  theme: 'classic' | 'marble' | 'dark';
}

interface DeathData {
  id: string;
  type: 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
  color: 'w' | 'b';
  position: [number, number, number];
  startTime: number;
}

// Animated Square component for better feedback
const AnimatedSquare: React.FC<{
  name: string;
  x: number;
  z: number;
  color: string;
  isLight: boolean;
  isSelected: boolean;
  isValid: boolean;
  onClick: (square: string) => void;
  envMapIntensity: number;
}> = ({ name, x, z, color, isLight, isSelected, isValid, onClick, envMapIntensity }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null!);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.elapsedTime;
    
    if (isSelected) {
      // Float effect for selected square
      meshRef.current.position.y = 0.05 + Math.sin(time * 4) * 0.02;
      materialRef.current.emissiveIntensity = 0.5 + Math.sin(time * 6) * 0.3;
    } else if (isValid) {
      // Subtle heartbeat for valid moves
      meshRef.current.position.y = 0;
      materialRef.current.emissiveIntensity = 0.3 + Math.sin(time * 8) * 0.2;
    } else {
      meshRef.current.position.y = 0;
      materialRef.current.emissiveIntensity = 0;
    }
  });

  return (
    <mesh 
      ref={meshRef}
      position={[x, 0, z]} 
      receiveShadow
      onClick={(e) => { e.stopPropagation(); onClick(name); }}
    >
      <boxGeometry args={[SQUARE_SIZE, 0.1, SQUARE_SIZE]} />
      <meshStandardMaterial 
        ref={materialRef}
        color={isSelected ? '#f59e0b' : isValid ? '#10b981' : color}
        roughness={0.9} // Flat matte look
        metalness={0.0} // No metallic shine
        emissive={isSelected ? '#f59e0b' : isValid ? '#10b981' : 'black'}
        envMapIntensity={0.0} // No environment reflections
      />
    </mesh>
  );
};

// Particle system for the "dust" effect
const CapturedParticles: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const count = 12;
  const mesh = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 0.5 + Math.random() * 1.5;
      const speed = 0.01 + Math.random() / 100;
      const xDir = (Math.random() - 0.5) * 2;
      const zDir = (Math.random() - 0.5) * 2;
      temp.push({ t, factor, speed, xDir, zDir });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    particles.forEach((particle, i) => {
      let { t, factor, speed, xDir, zDir } = particle;
      t = particle.t += speed / 2;
      const s = Math.cos(t);
      
      dummy.position.set(
        position[0] + xDir * t * factor,
        position[1] + t * factor * 2 - (t * t * 2.5), // Falling arc
        position[2] + zDir * t * factor
      );
      dummy.scale.set(s, s, s);
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.04, 8, 8]} />
      <meshStandardMaterial color="#d4af37" emissive="#d4af37" emissiveIntensity={2} transparent opacity={0.6} />
    </instancedMesh>
  );
};

// Component for a piece that has been captured and is "dying"
const CapturedPieceEffect: React.FC<DeathData & { theme: any, onComplete: (id: string) => void }> = ({ id, type, color, position, theme, onComplete }) => {
  const group = useRef<THREE.Group>(null!);
  const startTime = useRef(Date.now());
  const duration = 1200; // ms

  useFrame(() => {
    const elapsed = Date.now() - startTime.current;
    const progress = Math.min(elapsed / duration, 1);
    
    if (group.current) {
      // Physics: Fall and rotate
      group.current.position.y = position[1] - (9.8 * Math.pow(progress, 2) * 0.5); 
      group.current.rotation.x += 0.05;
      group.current.rotation.z += 0.03;
      group.current.scale.set(1 - progress, 1 - progress, 1 - progress);
    }

    if (progress >= 1) {
      onComplete(id);
    }
  });

  return (
    <group ref={group} position={position}>
      <ChessPiece3D 
        type={type} 
        color={color} 
        position={[0, 0, 0]} 
        theme={theme} 
        isSelected={false} 
      />
      <CapturedParticles position={[0, 0, 0]} />
    </group>
  );
};

const Board3D: React.FC<Board3DProps> = ({ fen, onSquareClick, selectedSquare, validMoves, theme }) => {
  const currentTheme = THEMES[theme];
  const [deathRow, setDeathRow] = useState<DeathData[]>([]);
  const prevBoardRef = useRef<any[]>([]);

  const squares = useMemo(() => {
    const s = [];
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        const sqName = `${files[f]}${8 - r}`;
        const isLight = (r + f) % 2 === 0;
        s.push({
          name: sqName,
          x: f - 3.5,
          z: r - 3.5,
          color: isLight ? currentTheme.light : currentTheme.dark,
          isLight
        });
      }
    }
    return s;
  }, [currentTheme]);

  const boardArray = useMemo(() => {
    const rows = fen.split(' ')[0].split('/');
    const result = [];
    for (let r = 0; r < 8; r++) {
      let f = 0;
      for (const char of rows[r]) {
        if (isNaN(parseInt(char))) {
          result.push({
            type: char.toLowerCase(),
            color: char === char.toUpperCase() ? 'w' : 'b',
            rank: 7 - r,
            file: f,
            id: `${char}-${r}-${f}-${Date.now()}` // Unique-ish ID
          });
          f++;
        } else {
          f += parseInt(char);
        }
      }
    }
    return result;
  }, [fen]);

  // Capture Detection
  useEffect(() => {
    if (prevBoardRef.current.length > 0) {
      prevBoardRef.current.forEach(prevP => {
        const isStillThere = boardArray.find(currP => 
          currP.rank === prevP.rank && currP.file === prevP.file && currP.type === prevP.type && currP.color === prevP.color
        );

        if (!isStillThere) {
          const movingToThisSquare = boardArray.find(currP => {
              const prevEquivalent = prevBoardRef.current.find(p => p.type === currP.type && p.color === currP.color && p.rank === currP.rank && p.file === currP.file);
              return !prevEquivalent && currP.rank === prevP.rank && currP.file === prevP.file;
          });

          if (movingToThisSquare) {
            setDeathRow(prev => [...prev, {
              id: `death-${Date.now()}-${Math.random()}`,
              type: prevP.type,
              color: prevP.color,
              position: [prevP.file - 3.5, 0.05, (7 - prevP.rank) - 3.5],
              startTime: Date.now()
            }]);
          }
        }
      });
    }
    prevBoardRef.current = boardArray;
  }, [boardArray]);

  const removeDeath = (id: string) => {
    setDeathRow(prev => prev.filter(d => d.id !== id));
  };

  return (
    <Canvas shadows className="w-full h-full">
      <PerspectiveCamera makeDefault position={[0, 10, 8]} fov={45} />
      <OrbitControls 
        makeDefault 
        enablePan={false} 
        minPolarAngle={0} 
        maxPolarAngle={Math.PI / 2.1} 
        minDistance={5} 
        maxDistance={15}
      />
      
      <Suspense fallback={null}>
        <Environment preset="city" />
        <ambientLight intensity={0.6} />
        
        <spotLight 
          position={[10, 18, 10]} 
          angle={0.25} 
          penumbra={0.8} 
          intensity={6} 
          castShadow 
          shadow-mapSize={2048}
        />

        <pointLight position={[-10, 12, -10]} intensity={2.5} color="#ffffff" />
        <directionalLight position={[0, 5, -10]} intensity={1.5} color="#cbd5e1" />

        {/* Board Frame - Matte */}
        <mesh position={[0, -0.2, 0]} receiveShadow>
          <boxGeometry args={[9.4, 0.45, 9.4]} />
          <meshStandardMaterial color={currentTheme.board} roughness={0.9} metalness={0.0} />
        </mesh>
        
        {/* Trim - Matte */}
        <mesh position={[0, -0.05, 0]} receiveShadow>
          <boxGeometry args={[9.0, 0.2, 9.0]} />
          <meshStandardMaterial color="#444" roughness={0.9} metalness={0.0} />
        </mesh>

        {/* Squares with animation - Matte */}
        {squares.map((sq) => (
          <AnimatedSquare
            key={sq.name}
            name={sq.name}
            x={sq.x}
            z={sq.z}
            color={sq.color}
            isLight={sq.isLight}
            isSelected={selectedSquare === sq.name}
            isValid={validMoves.includes(sq.name)}
            onClick={onSquareClick}
            envMapIntensity={0.0}
          />
        ))}

        {/* Active Pieces */}
        {boardArray.map((p) => {
           const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
           const squareName = `${files[p.file]}${p.rank + 1}`;
           const isSelected = selectedSquare === squareName;
           
           return (
            <ChessPiece3D 
              key={p.id}
              type={p.type as any}
              color={p.color as any}
              position={[p.file - 3.5, 0.05, (7 - p.rank) - 3.5]}
              theme={currentTheme}
              isSelected={isSelected}
            />
           );
        })}

        {/* Captured Pieces Animations */}
        {deathRow.map((death) => (
          <CapturedPieceEffect 
            key={death.id} 
            {...death} 
            theme={currentTheme} 
            onComplete={removeDeath} 
          />
        ))}

        <ContactShadows resolution={1024} scale={15} blur={2.5} opacity={0.65} far={10} color="#000000" />
      </Suspense>
    </Canvas>
  );
};

export default Board3D;
