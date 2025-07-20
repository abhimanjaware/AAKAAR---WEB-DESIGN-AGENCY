import { useEffect, useRef, useState } from "react";
import deskim from "../assets/images/hero-desk.png";
import mobim from "../assets/images/hero-mob.webp";

export default function Hero() {
  const heroRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Use matchMedia instead of resize listener
  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const handler = (e) => setIsMobile(e.matches);
    setIsMobile(media.matches);
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  // Lightweight Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px", threshold: 0.1 }
    );
    if (heroRef.current) observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  const imageSrc = isMobile ? mobim : deskim;

  return (
    <section
      ref={heroRef}
      className="relative w-full h-screen bg-[#100905] isolate overflow-hidden"
      style={{ contain: "layout paint" }}
    >
      {/* Optimized Background Image */}
      {isVisible && (
        <img
          src={imageSrc}
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
          loading="lazy"
          decoding="async"
          width={isMobile ? "414" : "1920"}
          height={isMobile ? "896" : "1080"}
          style={{
            transform: "translateZ(0)",
            willChange: "transform",
            backfaceVisibility: "hidden",
          }}
        />
      )}

      {/* CTA Button (Original Design Preserved) */}
      <div className="absolute inset-x-0 bottom-10 md:bottom-16 lg:bottom-24 flex justify-center z-10">
        <div className="nav-Button bg-gradient-to-r from-[#161D27] to-[#243040] border border-[#161D27]/30 hover:scale-[0.99] px-3 sm:px-4 md:px-5 py-1 rounded-full flex items-center justify-center gap-2 sm:gap-3 md:gap-4 font-[Quicksand] transition-all ease-in-out duration-300 group hover:bg-[#D9D9D9] focus-within:scale-[0.99] shadow-md hover:shadow-lg will-change-transform">

          <a
            href="https://wa.me/919689762896?text=Hi%20there%2C%20I%20visited%20your%20website%20and%20wanted%20to%20connect!"
            target="_blank"
            rel="noopener noreferrer"
            className="relative h-10 sm:h-12 md:h-14 flex items-center justify-center"
            aria-label="Connect via WhatsApp"
          >
            <div className="flex flex-col items-center relative">
              <span className="block font-bold font-[Familjen_Grotesk] text-base sm:text-lg md:text-xl lg:text-2xl transition-transform duration-300 text-[#D9D9D9] tracking-tighter group-hover:-translate-y-full opacity-100 group-hover:opacity-0 whitespace-nowrap">
                Let's Connect
              </span>
              <span className="absolute font-bold font-[Familjen_Grotesk] text-base sm:text-lg md:text-xl lg:text-2xl transition-transform duration-300 text-[#161D27] tracking-tighter opacity-0 group-hover:opacity-100 translate-y-full group-hover:translate-y-0 whitespace-nowrap">
                Let's Connect
              </span>
            </div>
          </a>

          <div className="p-2 sm:p-2.5 md:p-3 rounded-full group-hover:-rotate-45 scale-[0.4] transition-all duration-300 text-[#D9D9D9] group-active:text-[#161D27] bg-[#D9D9D9] group-hover:text-[#D9D9D9] group-hover:bg-gradient-to-r group-hover:from-[#161D27] group-hover:to-[#243040] shadow-sm group-hover:shadow">
            <ion-icon name="arrow-forward-outline" size="small"></ion-icon>
          </div>

        </div>
      </div>
    </section>
  );
}
