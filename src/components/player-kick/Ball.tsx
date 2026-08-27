"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

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
  kickStart,
  kickEnd,
}: {
  progressRef: React.MutableRefObject<number>;
  kickStart: number;
  kickEnd: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useMemo(() => createBallTexture(), []);

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const p = progressRef.current;

    if (p < kickStart || p > kickEnd) {
      mesh.visible = false;
      return;
    }

    mesh.visible = true;
    const local = (p - kickStart) / (kickEnd - kickStart);
    const eased = local * local; // accelerates — slow start, rockets forward

    mesh.position.set(0.5 - eased * 0.5, -0.8 + eased * 0.4, -3 + eased * 7);
    mesh.scale.setScalar(0.15 + eased * 0.9);
    mesh.rotation.x += 0.3;
    mesh.rotation.y += 0.2;
  });

  return (
    <mesh ref={meshRef} visible={false}>
      <sphereGeometry args={[0.3, 24, 24]} />
      <meshStandardMaterial map={texture} roughness={0.5} />
    </mesh>
  );
}