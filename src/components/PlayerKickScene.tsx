"use client";

import { Suspense, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PlayerModel from "./player-kick/PlayerModel";
import Ball from "./player-kick/Ball";

gsap.registerPlugin(ScrollTrigger);

const Canvas = dynamic(
  () => import("@react-three/fiber").then((mod) => mod.Canvas),
  { ssr: false }
);

// PlayerKickScene.tsx

const ENTER_START = 0.03;
const KICK_START = 0.23; // Spawns the ball earlier, perfectly synced with the forward swing
const ANIM_END = 0.38;   
const IMPACT = 0.46;
const DIRT_END = 0.62;
const TEXT_IN = 0.52;

const PARTICLE_COUNT = 40;
const PARTICLE_SEEDS = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  angle: (i * 2.399963) % (Math.PI * 2),
  distance: 120 + ((i * 47) % 260),
  fall: 60 + ((i * 31) % 140),
  isGrass: i % 2 === 0,
}));

export default function PlayerKickScene() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [showScene, setShowScene] = useState(false);
  const progressRef = useRef(0);
  const flashRef = useRef<HTMLDivElement>(null);
  const particleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top bottom",
        once: true,
        onEnter: () => setShowScene(true),
      });

      gsap.to(progressRef, {
        current: 1,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${window.innerHeight * 4}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        },
      });

      function render() {
        const p = progressRef.current;

        if (flashRef.current) {
          const flashT = Math.max(0, 1 - Math.abs(p - IMPACT) / 0.05);
          flashRef.current.style.opacity = String(flashT * 0.9);
        }

        particleRefs.current.forEach((el, i) => {
          if (!el) return;
          const seed = PARTICLE_SEEDS[i];
          const t = Math.min(Math.max((p - IMPACT) / (DIRT_END - IMPACT), 0), 1);
          const fadeOut = Math.max(0, 1 - Math.max(0, (p - DIRT_END) / 0.06));
          const opacity = t > 0 ? Math.min(t * 4, 1) * fadeOut : 0;

          const x = Math.cos(seed.angle) * seed.distance * t;
          const y = Math.sin(seed.angle) * seed.distance * 0.5 * t + seed.fall * t * t;

          el.style.transform = `translate(${x}px, ${y}px)`;
          el.style.opacity = opacity.toFixed(2);
        });

        if (textRef.current) {
          const textT = Math.min(Math.max((p - TEXT_IN) / 0.15, 0), 1);
          textRef.current.style.opacity = String(textT);
          textRef.current.style.transform = `scale(${0.7 + textT * 0.3})`;
        }
      }

      gsap.ticker.add(render);
      return () => {
        gsap.ticker.remove(render);
      };
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative min-h-screen overflow-hidden bg-background">
      {showScene && (
        <div className="absolute inset-0">
          <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
            <ambientLight intensity={0.7} />
            <directionalLight position={[3, 5, 4]} intensity={1.1} />
            <directionalLight position={[-4, 1, 2]} intensity={0.5} color="#e37b3f" />

            <Suspense fallback={null}>
              <PlayerModel progressRef={progressRef} enterStart={ENTER_START} animEnd={ANIM_END} />
              <Ball
                progressRef={progressRef}
                enterStart={ENTER_START}
                animEnd={ANIM_END}
                kickStart={KICK_START}
                kickEnd={IMPACT}
              />
            </Suspense>
          </Canvas>
        </div>
      )}

      <div
        ref={flashRef}
        aria-hidden="true"
        className="absolute inset-0 bg-foreground pointer-events-none"
        style={{ opacity: 0 }}
      />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
          <div
            key={i}
            ref={(el) => {
              particleRefs.current[i] = el;
            }}
            className="absolute w-2 h-2 rounded-full"
            style={{
              backgroundColor: PARTICLE_SEEDS[i].isGrass ? "#6b7a4a" : "#8a6a4a",
              opacity: 0,
            }}
          />
        ))}
      </div>

      <div
        ref={textRef}
        className="absolute inset-0 flex items-center justify-center px-6 pointer-events-none"
        style={{ opacity: 0 }}
      >
        <h2 className="font-display text-5xl md:text-7xl font-bold text-foreground text-center">
          Aletheia lands everywhere.
        </h2>
      </div>
    </section>
  );
}