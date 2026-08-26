import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-[250vh]">
        <Hero />
      </main>
    </>
  );
}