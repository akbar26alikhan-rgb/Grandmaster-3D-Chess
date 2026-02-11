
import React, { useMemo } from 'react';
import * as THREE from 'three';

interface ChessPiece3DProps {
  type: 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
  color: 'w' | 'b';
  position: [number, number, number];
  theme: any;
  isSelected: boolean;
}

const ChessPiece3D: React.FC<ChessPiece3DProps> = ({ type, color, position, theme, isSelected }) => {
  const materialColor = color === 'w' ? theme.pieceWhite : theme.pieceBlack;
  const accentColor = theme.accent || '#d4af37';

  const pieceGeometry = useMemo(() => {
    const parts = [];
    const isBlack = color === 'b';
    
    // Boosted Metallic Materials
    const mat = <meshStandardMaterial 
      color={materialColor} 
      roughness={0.12} // Slightly more roughness to catch light better
      metalness={1.0} 
      envMapIntensity={2.5} // Significant boost for visibility
      emissive={isBlack ? '#111' : '#222'} // Subtle glow to prevent total black-out
      emissiveIntensity={0.2}
    />;
    
    const accentMat = <meshStandardMaterial 
      color={accentColor} 
      roughness={0.1} 
      metalness={1.0} 
      envMapIntensity={2.0}
    />;

    // Elite Multi-Tiered Base
    parts.push(
      <mesh key="base-1" position={[0, 0.03, 0]} castShadow>
        <cylinderGeometry args={[0.38, 0.45, 0.06, 32]} />
        {mat}
      </mesh>,
      isBlack && (
        <mesh key="base-gold-ring" position={[0, 0.07, 0]} castShadow>
          <cylinderGeometry args={[0.39, 0.39, 0.02, 32]} />
          {accentMat}
        </mesh>
      ),
      <mesh key="base-2" position={[0, 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.38, 0.08, 32]} />
        {mat}
      </mesh>
    );

    // Decorative Neck Ring
    const addCollar = (y: number, radius: number) => {
      parts.push(
        <mesh key={`collar-${y}`} position={[0, y, 0]} castShadow>
          <cylinderGeometry args={[radius + 0.02, radius + 0.02, 0.04, 32]} />
          {isBlack ? accentMat : mat}
        </mesh>
      );
    };

    switch (type) {
      case 'p': // Pawn
        parts.push(
          <mesh key="p-neck" position={[0, 0.25, 0]} castShadow>
            <cylinderGeometry args={[0.12, 0.25, 0.3, 32]} />
            {mat}
          </mesh>,
          <mesh key="p-head" position={[0, 0.48, 0]} castShadow>
            <sphereGeometry args={[0.2, 32, 32]} />
            {mat}
          </mesh>
        );
        addCollar(0.38, 0.15);
        break;

      case 'r': // Rook
        parts.push(
          <mesh key="r-body" position={[0, 0.35, 0]} castShadow>
            <cylinderGeometry args={[0.22, 0.28, 0.5, 32]} />
            {mat}
          </mesh>,
          <mesh key="r-top" position={[0, 0.65, 0]} castShadow>
            <cylinderGeometry args={[0.3, 0.3, 0.15, 32]} />
            {mat}
          </mesh>
        );
        addCollar(0.58, 0.25);
        break;

      case 'n': // Knight - Slender, Detailed
        parts.push(
          <mesh key="n-body" position={[0, 0.3, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.28, 0.3, 32]} />
            {mat}
          </mesh>,
          <mesh key="n-neck" position={[0, 0.5, 0.05]} rotation={[0.45, 0, 0]} castShadow>
            <boxGeometry args={[0.18, 0.5, 0.3]} />
            {mat}
          </mesh>,
          <mesh key="n-head" position={[0, 0.78, 0.2]} rotation={[-0.2, 0, 0]} castShadow>
            <boxGeometry args={[0.16, 0.25, 0.4]} />
            {mat}
          </mesh>,
          <mesh key="n-ear-l" position={[0.06, 0.9, 0.1]} castShadow>
            <boxGeometry args={[0.04, 0.1, 0.04]} />
            {mat}
          </mesh>,
          <mesh key="n-ear-r" position={[-0.06, 0.9, 0.1]} castShadow>
            <boxGeometry args={[0.04, 0.1, 0.04]} />
            {mat}
          </mesh>
        );
        break;

      case 'b': // Bishop
        parts.push(
          <mesh key="b-neck" position={[0, 0.4, 0]} castShadow>
            <cylinderGeometry args={[0.12, 0.22, 0.6, 32]} />
            {mat}
          </mesh>,
          <mesh key="b-head" position={[0, 0.75, 0]} castShadow>
            <sphereGeometry args={[0.18, 32, 32]} scale={[1, 1.6, 1]} />
            {mat}
          </mesh>,
          <mesh key="b-finial" position={[0, 0.98, 0]} castShadow>
            <sphereGeometry args={[0.05, 16, 16]} />
            {mat}
          </mesh>
        );
        addCollar(0.6, 0.15);
        break;

      case 'q': // Queen
        parts.push(
          <mesh key="q-neck" position={[0, 0.5, 0]} castShadow>
            <cylinderGeometry args={[0.12, 0.28, 0.9, 32]} />
            {mat}
          </mesh>,
          <mesh key="q-crown" position={[0, 1.0, 0]} castShadow>
            <cylinderGeometry args={[0.3, 0.18, 0.2, 32]} />
            {mat}
          </mesh>,
          <mesh key="q-top" position={[0, 1.15, 0]} castShadow>
            <sphereGeometry args={[0.12, 16, 16]} />
            {mat}
          </mesh>
        );
        addCollar(0.85, 0.15);
        break;

      case 'k': // King
        parts.push(
          <mesh key="k-neck" position={[0, 0.55, 0]} castShadow>
            <cylinderGeometry args={[0.14, 0.32, 1.0, 32]} />
            {mat}
          </mesh>,
          <mesh key="k-crown" position={[0, 1.15, 0]} castShadow>
            <cylinderGeometry args={[0.35, 0.25, 0.25, 32]} />
            {mat}
          </mesh>,
          <group position={[0, 1.45, 0]}>
            <mesh castShadow><boxGeometry args={[0.08, 0.3, 0.08]} />{mat}</mesh>
            <mesh position={[0, 0.06, 0]} castShadow><boxGeometry args={[0.2, 0.08, 0.08]} />{mat}</mesh>
          </group>
        );
        addCollar(0.95, 0.18);
        break;
    }
    return parts;
  }, [type, materialColor, color, accentColor]);

  return (
    <group 
        position={position} 
        rotation={color === 'b' ? [0, Math.PI, 0] : [0, 0, 0]}
        scale={isSelected ? [1.25, 1.3, 1.25] : [1.1, 1.1, 1.1]}
    >
      {pieceGeometry}
      {isSelected && (
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.55, 0.62, 48]} />
            <meshBasicMaterial color="#f59e0b" transparent opacity={0.9} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
};

export default ChessPiece3D;
