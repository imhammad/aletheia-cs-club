"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getBallTransform } from "./playerTransform";

function createBallTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#f2ede7";
    ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = "#161513";
    const spots: [number, number][] = [
      [40, 40], [180, 30], [90, 100], [200, 120], [30, 160],
      [150, 190], [220, 210], [70, 220], [120, 60],
    ];
    spots.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 18, 0, Math.PI * 2);
      ctx.fill();
    });
  }
  return new THREE.CanvasTexture(canvas);
}

export default function Ball({
  progressRef,
  enterStart,
  animEnd,
  kickStart,
  kickEnd,
}: {
  progressRef: React.MutableRefObject<number>;
  enterStart: number;
  animEnd: number;
  kickStart: number;
  kickEnd: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useMemo(() => createBallTexture(), []);

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = getBallTransform(
      progressRef.current,
      enterStart,
      animEnd,
      kickStart,
      kickEnd
    );

    mesh.visible = t.visible;
    if (!t.visible) return;

    mesh.position.set(t.x, t.y, t.z);
    mesh.scale.setScalar(t.scale);
    mesh.rotation.x += 0.3;
    mesh.rotation.y += 0.2;
  });

return (
    <mesh ref={meshRef} visible={false} renderOrder={999}>
      <sphereGeometry args={[0.3, 24, 24]} />
      <meshStandardMaterial 
        map={texture} 
        roughness={0.5} 
        depthTest={false} 
      />
    </mesh>
  );
}