import { useEffect, useRef } from "react";
import { CatalogSection } from "../components/sections/catalog-section";
import { HeroSection } from "../components/sections/hero-section";
import { TestimonialCarousel } from "../components/sections/testimonial-carousel";
import { Footer } from "../components/layout/footer";


export function HomePage() {
  const snapTimerRef = useRef<number | null>(null);
  const snapLockedRef = useRef(false);

  useEffect(() => {
    const clearSnapTimer = () => {
      if (snapTimerRef.current !== null) {
        window.clearTimeout(snapTimerRef.current);
        snapTimerRef.current = null;
      }
    };

    const unlockSnapWhenBackAtTop = () => {
      const hero = document.querySelector<HTMLElement>("[data-hero-shell]");

      if (!hero) {
        return;
      }

      if (window.scrollY < hero.offsetHeight * 0.2) {
        snapLockedRef.current = false;
      }
    };

    const maybeSnapToPacks = () => {
      const hero = document.querySelector<HTMLElement>("[data-hero-shell]");
      const packs = document.getElementById("packs");

      if (!hero || !packs || snapLockedRef.current) {
        return;
      }

      if (window.scrollY <= hero.offsetHeight * 0.3) {
        return;
      }

      snapLockedRef.current = true;
      packs.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const onScroll = () => {
      unlockSnapWhenBackAtTop();
      clearSnapTimer();
      snapTimerRef.current = window.setTimeout(maybeSnapToPacks, 120);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      clearSnapTimer();
    };
  }, []);

  return (
    <main className="relative bg-white text-[#080808]">
      <HeroSection />
      <CatalogSection />
      <TestimonialCarousel />
      <Footer />
    </main>
  );
}
