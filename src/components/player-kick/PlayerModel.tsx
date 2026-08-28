"use client";

import { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getPlayerTransform } from "./playerTransform";

// The Mixamo clip contains run + kick + extra footage afterward, we only
// want to ever play through the kick, never into what comes after it.
const CLIP_TRIM = 0.585;

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
      firstAction.paused = true;
    }
  }, [actions]);

  useFrame(() => {
    const g = group.current;
    const firstAction = Object.values(actions)[0];
    if (!g || !firstAction) return;

    const p = progressRef.current;
    const clip = firstAction.getClip();
    const { x, y, z, scale, local } = getPlayerTransform(p, enterStart, animEnd);

    firstAction.time = local * clip.duration * CLIP_TRIM;
    mixer.update(0);

    g.position.set(x, y, z);
    g.scale.setScalar(scale);
    g.rotation.y = 0;
    g.visible = p >= enterStart - 0.02;
  });

  return <primitive ref={group} object={scene} />;
}

useGLTF.preload("/models/player.glb");