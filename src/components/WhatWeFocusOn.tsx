import FadeUp from "./animations/FadeUp";
import ScaleOnScroll from "./animations/ScaleOnScroll";
import MagneticWrapper from "./MagneticWrapper";

const FOCUS_ITEMS = [
  {
    label: "AI, from scratch",
    description:
      "Not just prompting — building the models yourself, from the ground up.",
  },
  {
    label: "Robotics",
    description:
      "Systems that operate in the physical world, not just on a screen.",
  },
  {
    label: "Emerging trends",
    description: "Dissecting what's next in CS before it goes mainstream.",
  },
  {
    label: "Engineering fundamentals",
    description:
      "The unglamorous basics that quietly make you exceptional.",
  },
];

export default function WhatWeFocusOn() {
  return (
    <section id="focus" className="relative py-32 px-6 max-w-5xl mx-auto">
      <FadeUp>
        <p className="font-mono text-sm text-accent-light tracking-widest uppercase mb-6">
          What We Focus On
        </p>
      </FadeUp>
      <FadeUp delay={0.05}>
        <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground leading-snug max-w-2xl mb-16">
          Four areas. One north star.
        </h2>
      </FadeUp>

      <div className="grid sm:grid-cols-2 gap-6">
        {FOCUS_ITEMS.map((item) => (
          <ScaleOnScroll key={item.label}>
            <MagneticWrapper strength={0.25}>
              <div className="border border-border bg-surface/50 rounded-2xl p-8 backdrop-blur-sm hover:border-accent/50 transition-colors h-full cursor-default">
                <span className="inline-block w-2 h-2 bg-accent rounded-full mb-4" />
                <h3 className="font-display text-xl font-bold text-foreground mb-2">
                  {item.label}
                </h3>
                <p className="font-body text-sm text-muted leading-relaxed">
                  {item.description}
                </p>
              </div>
            </MagneticWrapper>
          </ScaleOnScroll>
        ))}
      </div>
    </section>
  );
}