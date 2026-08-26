import FadeUp from "./animations/FadeUp";
import ScaleOnScroll from "./animations/ScaleOnScroll";
import SharpenIn from "./animations/SharpenIn";

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

export default function WhatWeDo() {
  return (
    <section id="about" className="relative py-32 px-6 max-w-5xl mx-auto">
      <FadeUp>
        <p className="font-mono text-sm text-accent-light tracking-widest uppercase mb-6">
          What We Do
        </p>
      </FadeUp>

      <SharpenIn className="mb-8">
        <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground leading-snug max-w-3xl">
          Most clubs host talks. We run workshops. There&apos;s a difference.
        </h2>
      </SharpenIn>

      <FadeUp delay={0.1}>
        <p className="font-body text-muted max-w-2xl mb-20 leading-relaxed">
          We&apos;re a community of CS students who think the most
          interesting questions in tech aren&apos;t purely technical —
          they&apos;re ethical, societal, uncomfortable. We think the people
          who sit with those questions while still building things are the
          ones who actually change something. Our sessions are hands-on and
          deliberately ahead of the curve.
        </p>
      </FadeUp>

      <div className="grid sm:grid-cols-2 gap-6">
        {FOCUS_ITEMS.map((item) => (
          <ScaleOnScroll key={item.label}>
            <div className="border border-border bg-surface/50 rounded-2xl p-6 backdrop-blur-sm hover:border-accent/50 transition-colors h-full">
              <span className="inline-block w-2 h-2 bg-accent rounded-full mb-4" />
              <h3 className="font-display text-xl font-bold text-foreground mb-2">
                {item.label}
              </h3>
              <p className="font-body text-sm text-muted leading-relaxed">
                {item.description}
              </p>
            </div>
          </ScaleOnScroll>
        ))}
      </div>
    </section>
  );
}