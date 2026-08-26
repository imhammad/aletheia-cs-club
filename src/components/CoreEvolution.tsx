"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DataStage from "./core-evolution/DataStage";
import CircuitStage from "./core-evolution/CircuitStage";
import NetworkStage from "./core-evolution/NetworkStage";
import EyeStage from "./core-evolution/EyeStage";

gsap.registerPlugin(ScrollTrigger);

const STAGES = [
  { key: "data", label: "Raw Data", component: DataStage },
  { key: "circuit", label: "Engineered Systems", component: CircuitStage },
  { key: "network", label: "Learning Intelligence", component: NetworkStage },
  { key: "eye", label: "Truth, Engineered.", component: EyeStage },
];

export default function CoreEvolution() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const captionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      const stages = stageRefs.current;
      const captions = captionRefs.current;
      if (stages.some((s) => !s) || captions.some((c) => !c)) return;

      gsap.set(stages[0], { opacity: 1, scale: 1, filter: "blur(0px)" });
      gsap.set(stages.slice(1), { opacity: 0, scale: 1.08, filter: "blur(16px)" });

      gsap.set(captions[0], { opacity: 1, y: 0 });
      gsap.set(captions.slice(1), { opacity: 0, y: 16 });

      const transitions = stages.length - 1;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${window.innerHeight * transitions * 1.3}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        },
      });

      for (let i = 0; i < transitions; i++) {
        tl.to(stages[i], { opacity: 0, scale: 0.92, filter: "blur(16px)", duration: 1 }, i)
          .to(stages[i + 1], { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1 }, i)
          .to(captions[i], { opacity: 0, y: -16, duration: 0.6 }, i)
          .to(captions[i + 1], { opacity: 1, y: 0, duration: 0.6 }, i + 0.4);
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 bg-background"
    >
      <p className="absolute top-16 font-mono text-sm text-accent-light tracking-widest uppercase">
        The Aletheia Core
      </p>

      <div className="relative w-full max-w-xl aspect-[3/2]">
        {STAGES.map((stage, i) => {
          const StageComponent = stage.component;
          return (
            <div
              key={stage.key}
              ref={(el) => {
                stageRefs.current[i] = el;
              }}
              className="absolute inset-0"
            >
              <StageComponent />
            </div>
          );
        })}
      </div>

      <div className="relative h-8 mt-8">
        {STAGES.map((stage, i) => (
          <div
            key={stage.key}
            ref={(el) => {
              captionRefs.current[i] = el;
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <p className="font-display text-xl md:text-2xl font-bold text-foreground text-center whitespace-nowrap">
              {stage.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}