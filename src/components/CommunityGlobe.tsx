"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

const STAGE_SIZE = 380;
const CENTER = 190;
const SPHERE_R = 140;
const N_MERIDIANS = 6;

const LATITUDES = [
  { cy: 190, rx: 140, ry: 38 },
  { cy: 140, rx: 112, ry: 28 },
  { cy: 240, rx: 112, ry: 28 },
  { cy: 95, rx: 62, ry: 15 },
  { cy: 285, rx: 62, ry: 15 },
];

const NODES: [number, number][] = [
  [130, 110],
  [250, 90],
  [90, 190],
  [290, 170],
  [150, 260],
  [230, 270],
  [190, 150],
  [110, 230],
];

const MESSAGES = [
  "What is Aletheia?",
  "Aletheia changed my life!",
  "Built my first neural net here.",
  "From zero to shipped in a semester.",
  "Found my people here.",
  "Truth, Engineered. Literally.",
];

const SPACING = 0.65; // how much each message overlaps the previous one
const DURATION = 1; // how long each message's pop-in/out takes
const CYCLE_LENGTH = (MESSAGES.length - 1) * SPACING + DURATION;
const CYCLE_SPEED = 0.0055; // units per frame — controls loop pace
const IDLE_ROTATION_SPEED = 0.0025; // radians per frame — slower than before

function bubbleEnvelope(index: number, progress: number) {
  const start = index * SPACING;
  const local = (progress - start) / DURATION;
  if (local <= 0 || local >= 1) return 0;
  return Math.sin(local * Math.PI);
}

export default function CommunityGlobe() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const meridianRefs = useRef<(SVGEllipseElement | null)[]>([]);
  const nodeRefs = useRef<(SVGCircleElement | null)[]>([]);
  const bubbleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const glowRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (prefersReducedMotion) return;

      let idlePhase = 0;
      let cycleProgress = 0;

      function render() {
        idlePhase += IDLE_ROTATION_SPEED;
        cycleProgress = (cycleProgress + CYCLE_SPEED) % CYCLE_LENGTH;

        meridianRefs.current.forEach((el, i) => {
          if (!el) return;
          const rx =
            SPHERE_R *
            Math.abs(Math.cos(idlePhase + (i * Math.PI) / N_MERIDIANS));
          el.setAttribute("rx", rx.toFixed(2));
        });

        nodeRefs.current.forEach((el, i) => {
          if (!el) return;
          const pulse = 0.4 + 0.3 * Math.sin(idlePhase * 3 + i * 1.7);
          el.setAttribute("opacity", pulse.toFixed(2));
        });

        bubbleRefs.current.forEach((el, i) => {
          if (!el) return;
          const env = bubbleEnvelope(i, cycleProgress);
          const angle = (i / MESSAGES.length) * Math.PI * 2 - Math.PI / 2;
          const radius = SPHERE_R * (1.15 + 0.45 * env);
          const x = CENTER + Math.cos(angle) * radius;
          const y = CENTER + Math.sin(angle) * radius * 0.62;
          el.style.opacity = String(env);
          el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${0.5 + 0.5 * env})`;
        });

        if (glowRef.current) {
          glowRef.current.style.opacity = String(0.15 + 0.15 * Math.sin(idlePhase));
        }
      }

      // Pause the loop while the section is off-screen — pure efficiency,
      // not scroll control: the animation still runs at its own constant
      // pace whenever it's visible, regardless of how far you've scrolled.
      const trigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        onEnter: () => gsap.ticker.add(render),
        onEnterBack: () => gsap.ticker.add(render),
        onLeave: () => gsap.ticker.remove(render),
        onLeaveBack: () => gsap.ticker.remove(render),
      });

      return () => {
        gsap.ticker.remove(render);
        trigger.kill();
      };
    },
    { scope: sectionRef, dependencies: [prefersReducedMotion] }
  );

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background px-6"
    >
      <p className="absolute top-16 font-mono text-sm text-accent-light tracking-widest uppercase">
        The Aletheia Network
      </p>

      <div
        ref={glowRef}
        aria-hidden="true"
        className="absolute w-[420px] h-[420px] rounded-full bg-accent blur-[100px]"
        style={{ opacity: 0.15 }}
      />

      <div className="relative" style={{ width: STAGE_SIZE, height: STAGE_SIZE }}>
        <svg
          viewBox={`0 0 ${STAGE_SIZE} ${STAGE_SIZE}`}
          width={STAGE_SIZE}
          height={STAGE_SIZE}
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="sphereGradient" cx="35%" cy="30%" r="75%">
              <stop offset="0%" stopColor="var(--color-accent-light)" stopOpacity="0.35" />
              <stop offset="60%" stopColor="var(--color-accent)" stopOpacity="0.18" />
              <stop offset="100%" stopColor="var(--color-background)" stopOpacity="0.05" />
            </radialGradient>
          </defs>

          <circle
            cx={CENTER}
            cy={CENTER}
            r={SPHERE_R}
            fill="url(#sphereGradient)"
            stroke="var(--color-border)"
            strokeWidth="1"
          />

          {LATITUDES.map((lat, i) => (
            <ellipse
              key={i}
              cx={CENTER}
              cy={lat.cy}
              rx={lat.rx}
              ry={lat.ry}
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="1"
              opacity="0.25"
            />
          ))}

          {Array.from({ length: N_MERIDIANS }).map((_, i) => (
            <ellipse
              key={i}
              ref={(el) => {
                meridianRefs.current[i] = el;
              }}
              cx={CENTER}
              cy={CENTER}
              rx="0"
              ry={SPHERE_R}
              fill="none"
              stroke="var(--color-accent-light)"
              strokeWidth="1"
              opacity="0.4"
            />
          ))}

          {NODES.map(([x, y], i) => (
            <circle
              key={i}
              ref={(el) => {
                nodeRefs.current[i] = el;
              }}
              cx={x}
              cy={y}
              r="3"
              fill="var(--color-accent-light)"
              opacity="0.5"
            />
          ))}
        </svg>

        {MESSAGES.map((message, i) => (
          <div
            key={message}
            ref={(el) => {
              bubbleRefs.current[i] = el;
            }}
            className="absolute top-0 left-0 opacity-0 pointer-events-none whitespace-nowrap"
          >
            <p className="font-body text-sm md:text-base bg-surface/80 backdrop-blur-md border border-border rounded-2xl px-4 py-2 text-foreground shadow-lg">
              {message}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}