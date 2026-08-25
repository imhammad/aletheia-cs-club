import Navbar from "@/components/Navbar";
import FadeUp from "@/components/animations/FadeUp";

export default function Home() {
  return (
    <>
      <Navbar />
      <main
        id="top"
        className="min-h-[250vh] flex flex-col items-center justify-center gap-4 pt-40"
      >
        <p className="font-mono text-sm text-accent-light tracking-widest uppercase">
          Aletheia CS Club
        </p>
        <h1 className="font-display text-6xl font-bold text-foreground">
          Truth, <span className="text-accent">Engineered.</span>
        </h1>
        <FadeUp>
          <p className="font-body text-muted max-w-md text-center">
            A CS club community of builders, thinkers, and AI explorers.
          </p>
        </FadeUp>
      </main>
    </>
  );
}