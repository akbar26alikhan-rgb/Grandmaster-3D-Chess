
import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
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

const Board3D: React.FC<Board3DProps> = ({ fen, onSquareClick, selectedSquare, validMoves, theme }) => {
  const currentTheme = THEMES[theme];

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
            file: f
          });
          f++;
        } else {
          f += parseInt(char);
        }
      }
    }
    return result;
  }, [fen]);

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
        
        {/* Main dramatic key light */}
        <spotLight 
          position={[10, 18, 10]} 
          angle={0.25} 
          penumbra={0.8} 
          intensity={6} 
          castShadow 
          shadow-mapSize={2048}
        />

        {/* Opposite fill light for visibility in shadows */}
        <pointLight position={[-10, 12, -10]} intensity={2.5} color="#ffffff" />
        
        {/* Rim light from behind for silhouette definition */}
        <directionalLight position={[0, 5, -10]} intensity={1.5} color="#cbd5e1" />

        {/* Decorative Board Frame */}
        <mesh position={[0, -0.2, 0]} receiveShadow>
          <boxGeometry args={[9.4, 0.45, 9.4]} />
          <meshStandardMaterial color={currentTheme.board} roughness={0.15} metalness={0.7} />
        </mesh>
        
        {/* Shiny Trim */}
        <mesh position={[0, -0.05, 0]} receiveShadow>
          <boxGeometry args={[9.0, 0.2, 9.0]} />
          <meshStandardMaterial color="#666" roughness={0.05} metalness={1.0} />
        </mesh>

        {/* Squares */}
        {squares.map((sq) => {
          const isSelected = selectedSquare === sq.name;
          const isValid = validMoves.includes(sq.name);
          return (
            <mesh 
              key={sq.name} 
              position={[sq.x, 0, sq.z]} 
              receiveShadow
              onClick={(e) => { e.stopPropagation(); onSquareClick(sq.name); }}
            >
              <boxGeometry args={[SQUARE_SIZE, 0.1, SQUARE_SIZE]} />
              <meshStandardMaterial 
                color={isSelected ? '#f59e0b' : isValid ? '#10b981' : sq.color}
                roughness={sq.isLight ? 0.05 : 0.35} // Reduced dark square roughness for smoother reflections
                metalness={sq.isLight ? 1.0 : 0.2}  // Slight metalness for dark squares to catch environment
                emissive={isSelected ? '#f59e0b' : isValid ? '#10b981' : 'black'}
                emissiveIntensity={isSelected || isValid ? 0.4 : 0}
                envMapIntensity={sq.isLight ? 3.0 : 1.8} // Significantly increased for premium reflections
              />
            </mesh>
          );
        })}

        {/* Pieces */}
        {boardArray.map((p, i) => {
           const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
           const squareName = `${files[p.file]}${p.rank + 1}`;
           const isSelected = selectedSquare === squareName;
           
           return (
            <ChessPiece3D 
              key={`${p.type}-${p.color}-${i}`}
              type={p.type as any}
              color={p.color as any}
              position={[p.file - 3.5, 0.05, (7 - p.rank) - 3.5]}
              theme={currentTheme}
              isSelected={isSelected}
            />
           );
        })}

        <ContactShadows resolution={1024} scale={15} blur={2.5} opacity={0.65} far={10} color="#000000" />
      </Suspense>
    </Canvas>
  );
};

export default Board3D;
