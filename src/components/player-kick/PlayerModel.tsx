"use client";

import { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function PlayerModel({
  progressRef,
  enterStart,
  animEnd,
}: {
  progressRef: React.MutableRefObject<number>;
  enterStart: number;
  animEnd: number;
}) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/models/player.glb");
  const { actions, mixer } = useAnimations(animations, group);

  useEffect(() => {
    const firstAction = Object.values(actions)[0];
    if (firstAction) {
      firstAction.reset().play();
      firstAction.paused = true; // we drive time manually via scroll
    }
  }, [actions]);

  useFrame(() => {
    const g = group.current;
    const firstAction = Object.values(actions)[0];
    if (!g || !firstAction) return;

    const p = progressRef.current;
    const clip = firstAction.getClip();
    const localRaw = (p - enterStart) / (animEnd - enterStart);
    const local = Math.min(Math.max(localRaw, 0), 1);

    // Scrub the clip's playback time directly to match scroll position
    firstAction.time = local * clip.duration;
    mixer.update(0);

    // Runs in from far/top-right, growing as he approaches the camera
    const startPos = { x: 3.5, y: 1.2, z: -13 };
    const endPos = { x: 0.4, y: -1.2, z: -3 };
    g.position.set(
      startPos.x + (endPos.x - startPos.x) * local,
      startPos.y + (endPos.y - startPos.y) * local,
      startPos.z + (endPos.z - startPos.z) * local
    );

    const startScale = 0.7;
    const endScale = 2.2;
    g.scale.setScalar(startScale + (endScale - startScale) * local);

    // Math.PI / 2 or -Math.PI / 2
    g.rotation.y = 0;

    g.visible = p >= enterStart - 0.02;
  });

  return <primitive ref={group} object={scene} />;
}

useGLTF.preload("/models/player.glb");