"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MorphingOrb from "./hero/MorphingOrb";
import ParticleField from "./hero/ParticleField";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const SUBTITLE_TEXT = "A CS club community of builders, thinkers, and AI explorers.";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Entrance and Scroll timelines
  useGSAP(
    () => {
      // 1. Entrance Animation (Meteor Crash)
      const tl = gsap.timeline({ delay: 0.3 });

      tl.from(".hero-eyebrow", {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power3.out",
      })
        .from(
          ".hero-word",
          {
            opacity: 0,
            y: 40,
            rotateX: -40,
            stagger: 0.08,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.3"
        )
        // Meteor crash effect for the subtitle words
        .from(
          ".meteor-word",
          {
            opacity: 0,
            y: -300,
            z: 400,
            scale: 3,
            rotateX: 90,
            stagger: 0.08,
            duration: 1.2,
            ease: "bounce.out",
          },
          "-=0.4"
        )
        .from(
          ".hero-orb",
          { opacity: 0, scale: 0.7, duration: 1, ease: "power3.out" },
          "-=0.9"
        )
        .from(".hero-scroll-cue", { opacity: 0, duration: 0.6 }, "-=0.2");

      // 2. Scroll Animation (Immediate Shatter and Fall)
      if (!prefersReducedMotion) {
        const scrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "40% top", // Ends earlier so it shatters on less scroll
            scrub: 1, 
          },
        });

        // Falls down immediately into pieces
        scrollTl.to(".meteor-word", {
          y: "100vh",
          rotationZ: "random(-120, 120)",
          rotationX: "random(-90, 90)",
          opacity: 0,
          duration: 2,
          stagger: 0.02,
          ease: "power2.in",
        });
      }
    },
    { scope: containerRef, dependencies: [prefersReducedMotion] }
  );

  // Cursor parallax
  useGSAP(
    () => {
      if (prefersReducedMotion) return;

      const xTo = gsap.quickTo(orbRef.current, "x", {
        duration: 0.8,
        ease: "power3",
      });
      const yTo = gsap.quickTo(orbRef.current, "y", {
        duration: 0.8,
        ease: "power3",
      });

      function handleMouseMove(e: MouseEvent) {
        const rect = containerRef.current!.getBoundingClientRect();
        const relX = (e.clientX - rect.left) / rect.width - 0.5;
        const relY = (e.clientY - rect.top) / rect.height - 0.5;
        xTo(relX * 40);
        yTo(relY * 40);
      }

      const node = containerRef.current;
      node?.addEventListener("mousemove", handleMouseMove);
      return () => node?.removeEventListener("mousemove", handleMouseMove);
    },
    { scope: containerRef, dependencies: [prefersReducedMotion] }
  );

  return (
    <section
      ref={containerRef}
      id="top"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6"
    >
      {/* Ambient grid background */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <ParticleField />

      {/* Meteor Subtitle (Positioned below navbar) */}
      <div className="absolute top-24 left-0 w-full flex justify-center flex-wrap gap-x-4 md:gap-x-6 gap-y-2 px-6 z-20 [perspective:1000px]">
        {SUBTITLE_TEXT.split(" ").map((word, index) => (
          <span
            key={index}
            className="meteor-word inline-block font-body text-accent font-bold text-2xl md:text-4xl"
          >
            {word}
          </span>
        ))}
      </div>

      {/* Morphing glass orb */}
      <div
        ref={orbRef}
        className="hero-orb absolute w-[420px] h-[420px] md:w-[560px] md:h-[560px] opacity-70 blur-[2px]"
      >
        <MorphingOrb />
      </div>

      {/* Glass panel overlay for depth */}
      <div className="absolute w-[300px] h-[300px] rounded-full bg-surface/30 backdrop-blur-2xl border border-border/50" />

      <div className="relative z-10 flex flex-col items-center text-center gap-5">
        <p className="hero-eyebrow font-mono text-sm text-accent-light tracking-widest uppercase">
          Aletheia CS Club
        </p>

        <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground leading-tight [perspective:800px]">
          <span className="hero-word inline-block">Truth,</span>{" "}
          <span className="hero-word inline-block text-accent">
            Engineered.
          </span>
        </h1>
      </div>

      <div className="hero-scroll-cue absolute bottom-10 flex flex-col items-center gap-2">
        <span className="font-mono text-xs text-muted tracking-widest uppercase">
          Scroll
        </span>
        <div className="w-px h-10 bg-gradient-to-b from-accent to-transparent" />
      </div>
    </section>
  );
}