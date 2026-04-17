import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import testimonialsData from "../../data/testimonials.json";

interface Testimonial {
  name: string;
  location: string;
  text: string;
  stars: number;
}

const testimonials: Testimonial[] = testimonialsData;

export function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-[#f7f7f7] py-20 sm:py-24 overflow-hidden">
      <div className="mx-auto w-full max-w-[1180px] px-6 md:px-8 lg:px-10">
        <p className="text-center text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-black/44 mb-4">
          Depoimentos
        </p>
        <h2 className="mx-auto max-w-[48rem] text-center font-display text-[clamp(2.2rem,5vw,4.5rem)] leading-[0.9] text-black mb-12">
          Histórias reais de quem transformou seu perfil
        </h2>

        <div className="relative min-h-[350px] sm:min-h-[280px] w-full flex items-center justify-center pt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute inset-0 flex flex-col items-center text-center"
            >

              <div className="flex gap-1 mb-6">
                {[...Array(testimonials[currentIndex].stars)].map((_, i) => (
                  <Star key={i} className="size-5 fill-[#FFC107] text-[#FFC107]" />
                ))}
              </div>
              
              <blockquote className="text-[1.2rem] sm:text-[1.5rem] leading-[1.4] text-black font-medium italic mb-8 px-4">
                "{testimonials[currentIndex].text}"
              </blockquote>
              
              <div className="flex flex-col items-center">
                <span className="text-[1rem] font-bold text-black capitalize">
                  {testimonials[currentIndex].name}
                </span>
                <span className="text-[0.85rem] text-black/48 mt-1">
                  {testimonials[currentIndex].location}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-12 flex justify-center gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex ? "w-8 bg-black" : "w-1.5 bg-black/10"
              }`}
              aria-label={`Ir para depoimento ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
