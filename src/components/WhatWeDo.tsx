import FadeUp from "./animations/FadeUp";
import SharpenIn from "./animations/SharpenIn";

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
        <p className="font-body text-muted max-w-2xl leading-relaxed">
          We&apos;re a community of CS students who think the most
          interesting questions in tech aren&apos;t purely technical,
          they&apos;re ethical, societal, uncomfortable. We think the people
          who sit with those questions while still building things are the
          ones who actually change something. Our sessions are hands-on and
          deliberately ahead of the curve.
        </p>
      </FadeUp>
    </section>
  );
}