import FadeUp from "./animations/FadeUp";
import MagneticWrapper from "./MagneticWrapper";

export default function JoinSection() {
  return (
    <section
      id="join"
      className="relative py-40 px-6 max-w-3xl mx-auto text-center"
    >
      <FadeUp>
        <p className="font-mono text-sm text-accent-light tracking-widest uppercase mb-6">
          Join Us
        </p>
      </FadeUp>
      <FadeUp delay={0.05}>
        <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground leading-tight mb-6">
          Come see what we&apos;re working on.
        </h2>
      </FadeUp>
      <FadeUp delay={0.1}>
        <p className="font-body text-muted leading-relaxed mb-10">
          If you&apos;re a student, Aletheia is the place to experiment
          without the pressure of a grade attached. Ship projects. Break
          things. Find collaborators who match your curiosity.
        </p>
      </FadeUp>
      <FadeUp delay={0.15}>
        <MagneticWrapper strength={0.2}>
          <a
            href="mailto:hammadhassan319@gmail.com"
            className="inline-block font-mono text-sm uppercase tracking-widest bg-accent text-background px-8 py-4 rounded-full hover:bg-accent-light transition-colors"
          >
            Get In Touch
          </a>
        </MagneticWrapper>
      </FadeUp>
    </section>
  );
}