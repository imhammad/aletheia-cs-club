"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

const NUM_PARTICLES = 140;

function generateDataPoints(): [number, number][] {
  const points: [number, number][] = [];
  const cols = 14;
  const rows = 10;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      points.push([20 + c * 28, 15 + r * 26]);
    }
  }
  return points;
}

const CIRCUIT_SEGMENTS: [[number, number], [number, number]][] = [
  [[40, 40], [180, 40]],
  [[180, 40], [180, 100]],
  [[180, 100], [340, 100]],
  [[40, 140], [120, 140]],
  [[120, 140], [120, 220]],
  [[120, 220], [260, 220]],
  [[260, 220], [260, 140]],
  [[260, 140], [380, 140]],
  [[100, 40], [100, 220]],
  [[300, 40], [300, 180]],
];

const LAYER_DEFS = [
  { x: 60, ys: [70, 140, 210] },
  { x: 210, ys: [40, 100, 160, 220] },
  { x: 360, ys: [100, 180] },
];

function buildNetworkSegments(): [[number, number], [number, number]][] {
  const segments: [[number, number], [number, number]][] = [];
  for (let l = 0; l < LAYER_DEFS.length - 1; l++) {
    const a = LAYER_DEFS[l];
    const b = LAYER_DEFS[l + 1];
    a.ys.forEach((y1) => {
      b.ys.forEach((y2) => {
        segments.push([[a.x, y1], [b.x, y2]]);
      });
    });
  }
  return segments;
}

const NETWORK_SEGMENTS = buildNetworkSegments();

function distributeAlongSegments(
  segments: [[number, number], [number, number]][],
  count: number
): [number, number][] {
  const lengths = segments.map(([[x1, y1], [x2, y2]]) =>
    Math.hypot(x2 - x1, y2 - y1)
  );
  const total = lengths.reduce((a, b) => a + b, 0);
  const points: [number, number][] = [];

  for (let i = 0; i < count; i++) {
    const target = (i / (count - 1)) * total;
    let covered = 0;
    for (let s = 0; s < segments.length; s++) {
      const withinThisSegment = target <= covered + lengths[s];
      if (withinThisSegment || s === segments.length - 1) {
        const [[x1, y1], [x2, y2]] = segments[s];
        const localT =
          lengths[s] === 0
            ? 0
            : Math.min(Math.max((target - covered) / lengths[s], 0), 1);
        points.push([x1 + (x2 - x1) * localT, y1 + (y2 - y1) * localT]);
        break;
      }
      covered += lengths[s];
    }
  }
  return points;
}

function generateEyePoints(): [number, number][] {
  const points: [number, number][] = [];
  const outlineCount = 90;
  const irisCount = NUM_PARTICLES - outlineCount;

  for (let i = 0; i < outlineCount; i++) {
    const t = (i / outlineCount) * Math.PI * 2;
    points.push([210 + Math.cos(t) * 150, 140 + Math.sin(t) * 70]);
  }

  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < irisCount; i++) {
    const r = 42 * Math.sqrt(i / irisCount);
    const theta = i * goldenAngle;
    points.push([210 + Math.cos(theta) * r, 140 + Math.sin(theta) * r]);
  }

  return points;
}

const STAGE_POINTS: [number, number][][] = [
  generateDataPoints(),
  distributeAlongSegments(CIRCUIT_SEGMENTS, NUM_PARTICLES),
  distributeAlongSegments(NETWORK_SEGMENTS, NUM_PARTICLES),
  generateEyePoints(),
];

const STAGE_LABELS = [
  "Raw Data",
  "Engineered Systems",
  "Learning Intelligence",
  "Truth, Engineered.",
];

const PARTICLE_SEEDS = Array.from({ length: NUM_PARTICLES }, (_, i) => ({
  angle: (i * 2.399963) % (Math.PI * 2),
  radius: 50 + ((i * 37) % 90),
  spin: i % 2 === 0 ? 1 : -1,
}));

function getParticlePosition(
  index: number,
  globalProgress: number,
  idleRotation: number
) {
  const numTransitions = STAGE_POINTS.length - 1;
  const clamped = Math.min(Math.max(globalProgress, 0), numTransitions);
  const stageIndex = Math.min(Math.floor(clamped), numTransitions - 1);
  const localT = clamped - stageIndex;

  const from = STAGE_POINTS[stageIndex][index];
  const to = STAGE_POINTS[stageIndex + 1][index];
  const seed = PARTICLE_SEEDS[index];

  const shatterAmount = Math.sin(localT * Math.PI);
  const angle = seed.angle + localT * Math.PI * seed.spin * 1.5;
  const offsetX = Math.cos(angle) * seed.radius * shatterAmount;
  const offsetY = Math.sin(angle) * seed.radius * shatterAmount;

  const wobbleX = Math.cos(idleRotation * 2 + index) * 2.2;
  const wobbleY = Math.sin(idleRotation * 2 + index * 1.3) * 2.2;

  const baseX = from[0] + (to[0] - from[0]) * localT;
  const baseY = from[1] + (to[1] - from[1]) * localT;

  return {
    x: baseX + offsetX + wobbleX,
    y: baseY + offsetY + wobbleY,
    opacity: 1 - shatterAmount * 0.6,
    r: 2.6 - shatterAmount * 0.8,
  };
}

// How close to a given stage (0-3) the current scroll progress must be
// before that stage's structural detail (glyphs/lines/iris) becomes
// visible. Multiplying distance by 3 means it only shows up in roughly
// the final third of approach/departure — tight enough that it's gone
// well before the particles start noticeably scattering again.
function stageDetailOpacity(stageIndex: number, globalProgress: number) {
  const distance = Math.abs(globalProgress - stageIndex);
  return Math.max(0, 1 - distance * 3);
}

export default function CoreEvolution() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const particleRefs = useRef<(SVGCircleElement | null)[]>([]);
  const captionRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const glowRef = useRef<HTMLDivElement>(null);
  const dataTextRef = useRef<SVGGElement>(null);
  const circuitGroupRef = useRef<SVGGElement>(null);
  const networkGroupRef = useRef<SVGGElement>(null);
  const eyeGroupRef = useRef<SVGGElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      const progressState = { value: 0 };

      gsap.to(progressState, {
        value: STAGE_POINTS.length - 1,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () =>
            `+=${window.innerHeight * (STAGE_POINTS.length - 1) * 1.4}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        },
      });

      let idleRotation = 0;

      function render() {
        if (!prefersReducedMotion) {
          idleRotation += 0.0015;
        }

        // How "settled" the current view is — 1 means a shape's structural
        // detail is fully shown, so the raw particles should be invisible.
        const nearestStage = Math.round(progressState.value);
        const detailStrength = stageDetailOpacity(
          nearestStage,
          progressState.value
        );

        particleRefs.current.forEach((el, i) => {
          if (!el) return;
          const { x, y, opacity, r } = getParticlePosition(
            i,
            progressState.value,
            idleRotation
          );
          el.setAttribute("cx", x.toFixed(2));
          el.setAttribute("cy", y.toFixed(2));
          el.setAttribute("opacity", (opacity * (1 - detailStrength)).toFixed(2));
          el.setAttribute("r", r.toFixed(2));
        });

        captionRefs.current.forEach((el, i) => {
          if (!el) return;
          const opacity = stageDetailOpacity(i, progressState.value);
          el.style.opacity = String(opacity);
          el.style.transform = `translateY(${(1 - opacity) * 14}px)`;
        });

        if (dataTextRef.current) {
          dataTextRef.current.style.opacity = String(
            stageDetailOpacity(0, progressState.value)
          );
        }
        if (circuitGroupRef.current) {
          circuitGroupRef.current.style.opacity = String(
            stageDetailOpacity(1, progressState.value)
          );
        }
        if (networkGroupRef.current) {
          networkGroupRef.current.style.opacity = String(
            stageDetailOpacity(2, progressState.value)
          );
        }
        if (eyeGroupRef.current) {
          eyeGroupRef.current.style.opacity = String(
            stageDetailOpacity(3, progressState.value)
          );
        }

        if (glowRef.current) {
          const t = progressState.value / (STAGE_POINTS.length - 1);
          glowRef.current.style.opacity = String(0.12 + t * 0.38);
          glowRef.current.style.transform = `scale(${1 + t * 0.7})`;
        }
      }

      gsap.ticker.add(render);
      return () => {
        gsap.ticker.remove(render);
      };
    },
    { scope: sectionRef, dependencies: [prefersReducedMotion] }
  );

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 bg-background"
    >
      <div
        aria-hidden="true"
        className={`absolute w-[700px] h-[700px] rounded-full border border-accent/10 ${
          prefersReducedMotion ? "" : "animate-[spin_50s_linear_infinite]"
        }`}
      />
      <div
        aria-hidden="true"
        className={`absolute w-[520px] h-[520px] rounded-full border border-accent/10 ${
          prefersReducedMotion
            ? ""
            : "animate-[spin_38s_linear_infinite_reverse]"
        }`}
      />

      <div
        ref={glowRef}
        aria-hidden="true"
        className="absolute w-[400px] h-[400px] rounded-full bg-accent blur-[80px]"
        style={{ opacity: 0.12 }}
      />

      <p className="absolute top-16 font-mono text-sm text-accent-light tracking-widest uppercase">
        The Aletheia Core
      </p>

      <svg
        viewBox="0 0 420 280"
        className="relative w-full max-w-xl aspect-[3/2]"
        aria-hidden="true"
      >
        {/* Structural detail layers — hidden by default, faded in near rest */}
        <g ref={circuitGroupRef} style={{ opacity: 0 }}>
          {CIRCUIT_SEGMENTS.map(([[x1, y1], [x2, y2]], i) => (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="var(--color-accent)"
              strokeWidth="1.5"
              opacity="0.5"
            />
          ))}
        </g>

        <g ref={networkGroupRef} style={{ opacity: 0 }}>
          {NETWORK_SEGMENTS.map(([[x1, y1], [x2, y2]], i) => (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="var(--color-accent)"
              strokeWidth="1"
              opacity="0.3"
            />
          ))}
        </g>

        <g ref={eyeGroupRef} style={{ opacity: 0 }}>
          <ellipse
            cx="210"
            cy="140"
            rx="150"
            ry="70"
            fill="none"
            stroke="var(--color-foreground)"
            strokeWidth="2"
          />
          <circle cx="210" cy="140" r="42" fill="var(--color-accent)" opacity="0.5" />
        </g>

        <g
          ref={dataTextRef}
          style={{ opacity: 0 }}
          fontFamily="var(--font-mono)"
          fontSize="16"
          fill="var(--color-accent-light)"
        >
          {STAGE_POINTS[0].map(([x, y], i) => (
            <text key={i} x={x} y={y + 4} textAnchor="middle">
              {(Math.floor(i / 14) + (i % 14)) % 3 === 0 ? "1" : "0"}
            </text>
          ))}
        </g>

        {/* The particle layer — always visible, drives the shatter/reform */}
        {Array.from({ length: NUM_PARTICLES }).map((_, i) => (
          <circle
            key={i}
            ref={(el) => {
              particleRefs.current[i] = el;
            }}
            r="2.6"
            fill={
              i % 3 === 0 ? "var(--color-accent-light)" : "var(--color-accent)"
            }
          />
        ))}
      </svg>

      <div className="relative h-8 mt-8">
        {STAGE_LABELS.map((label, i) => (
          <p
            key={label}
            ref={(el) => {
              captionRefs.current[i] = el;
            }}
            className="absolute inset-0 flex items-center justify-center font-display text-xl md:text-2xl font-bold text-foreground text-center whitespace-nowrap"
            style={{ opacity: i === 0 ? 1 : 0 }}
          >
            {label}
          </p>
        ))}
      </div>
    </section>
  );
}