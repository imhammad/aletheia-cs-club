"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const PARTICLE_COUNT = 200;
const particles = Array.from({ length: PARTICLE_COUNT }).map((_, i) => i);

export default function IntroReveal() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      // 0. Initial Setup
      gsap.set(".intro-particle", {
        x: 0,
        y: () => (Math.random() - 0.5) * h, // Spread along the vertical crack
        scale: () => Math.random() * 1.5 + 0.5,
        opacity: 0,
      });

      const tl = gsap.timeline();

      // 1. Text and crack fade in
      tl.fromTo(
        ".intro-text",
        { opacity: 0, scale: 0.9, filter: "blur(10px)" },
        { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.2, ease: "power2.out" }
      )
        // Hold for a moment
        .to({}, { duration: 0.8 })
        
        // Text and crack fade out quickly
        .to(".intro-content", { opacity: 0, duration: 0.4, ease: "power2.inOut" })
        
        // 2. THE CYCLONE CHARGE
        // We create a label called "charge" that starts exactly here
        .addLabel("charge")
        
        // Fade particles in fast
        .to(".intro-particle", { opacity: 0.8, duration: 0.2 }, "charge")
        
        // Spin the entire container for the vortex effect
        .to(".particle-wrapper", {
          rotation: 360,
          transformOrigin: "center center",
          duration: 1.2,
          ease: "power2.inOut",
        }, "charge")
        
        // Pull particles into the DBZ energy ring
        .to(".intro-particle", {
          x: (i) => Math.cos((i / PARTICLE_COUNT) * Math.PI * 2) * (Math.random() * 120 + 60),
          y: (i) => Math.sin((i / PARTICLE_COUNT) * Math.PI * 2) * (Math.random() * 120 + 60),
          duration: 1.0,
          ease: "back.out(1.2)",
        }, "charge")
        
        // 3. THE SPLIT & BURST
        // We create a label called "split" that starts after a tiny 0.1s hold at peak charge
        .addLabel("split", "+=0.1")
        
        // Black doors slide away
        .to(".intro-left", { xPercent: -100, duration: 1.2, ease: "power4.inOut" }, "split")
        .to(".intro-right", { xPercent: 100, duration: 1.2, ease: "power4.inOut" }, "split")
        
        // The energy ball explodes to the two sides
        .to(".intro-particle", {
          x: (i) => {
            const isLeft = i % 2 === 0;
            const distance = (Math.random() * w * 0.6) + (w * 0.3);
            return isLeft ? -distance : distance;
          },
          y: () => (Math.random() - 0.5) * h * 0.8,
          scale: () => Math.random() * 4 + 1,
          opacity: 0,
          duration: 1.2,
          ease: "power3.out",
        }, "split")
        
        // 4. Cleanup
        .set(containerRef.current, { display: "none" });
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-transparent"
    >
      {/* Left Half */}
      <div className="intro-left absolute top-0 left-0 w-1/2 h-full bg-[#0a0a0a]" />

      {/* Right Half */}
      <div className="intro-right absolute top-0 right-0 w-1/2 h-full bg-[#0a0a0a]" />

      {/* Particle Shatter Overlay */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-30">
        <g className="particle-wrapper">
          {particles.map((id) => (
            <circle
              key={id}
              className="intro-particle"
              cx="50%" 
              cy="50%" 
              r="2"
              fill="var(--color-accent)" 
            />
          ))}
        </g>
      </svg>

      {/* Center Content: Crack, Smoke, Text */}
      <div className="intro-content absolute inset-0 flex items-center justify-center flex-col z-10 pointer-events-none">
        <svg
          className="absolute top-0 bottom-0 w-[30px] h-full left-1/2 -translate-x-1/2 z-0"
          viewBox="0 0 20 100"
          preserveAspectRatio="none"
        >
          <polyline
            points="10,0 16,15 6,35 14,50 8,70 12,85 10,100"
            fill="none"
            stroke="white"
            strokeWidth="0.5"
            className="drop-shadow-[0_0_8px_rgba(255,255,255,0.9)] opacity-80"
          />
        </svg>

        <div className="absolute w-[50vw] h-[50vh] bg-accent/20 rounded-full blur-[100px] animate-pulse z-0" />

        <h1 className="intro-text font-display text-3xl md:text-5xl font-bold text-white tracking-[0.3em] uppercase relative z-20 text-center px-4">
          Aletheia <br className="md:hidden" /> Presents
        </h1>
      </div>
    </div>
  );
}