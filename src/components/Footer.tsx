export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full h-[420px] z-0 bg-surface border-t border-border flex flex-col justify-between overflow-hidden">
      <div className="flex-1 flex items-center overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {Array.from({ length: 2 }).map((_, i) => (
            <span
              key={i}
              className="font-display text-6xl md:text-8xl font-bold text-foreground/10 pr-12"
            >
              ALETHEIA CS CLUB - TRUTH, ENGINEERED -{" "}
            </span>
          ))}
        </div>
      </div>

      <div className="px-6 pb-10 max-w-5xl mx-auto w-full flex flex-col md:flex-row md:items-end md:justify-between gap-8">
        <div>
          <p className="font-display text-2xl font-bold text-foreground mb-2">
            ALETHEIA
          </p>
          <p className="font-body text-sm text-muted max-w-xs">
            Developed by Hammad Hassan
          </p>
          <p className="font-body text-sm text-muted max-w-xs">
            Albukhary International University · <br></br>
            Advisor: Prof. Dr. Zurinahni
            Zainol
          </p>
        </div>

        <div className="flex gap-8 font-mono text-xs uppercase tracking-widest text-muted">
          <a href="https://www.instagram.com/aletheiacs_?igsi=MXdwNDVpYzB0bWdmYg==" className="hover:text-accent-light transition-colors">
            Instagram
          </a>
          <a href="https://www.linkedin.com/company/aletheia-cs/" className="hover:text-accent-light transition-colors">
            LinkedIn
          </a>
          <a 
            href="mailto:hammadhassan319@gmail.com"
            className="hover:text-accent-light transition-colors"
          >
            Email
          </a>
        </div>

        <p className="font-mono text-xs text-muted">© 2026 Aletheia CS Club</p>
      </div>
    </footer>
  );
}