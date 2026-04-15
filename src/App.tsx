import { CatalogSection } from "./components/sections/catalog-section";
import { HeroSection } from "./components/sections/hero-section";

export default function App() {
  return (
    <main className="relative bg-white text-[#080808]">
      <HeroSection />
      <CatalogSection />
    </main>
  );
}
