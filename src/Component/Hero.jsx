import { useRef, useState, useCallback, useEffect } from 'react';
import { useGSAP } from "@gsap/react";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import deskWebp from "../assets/images/hero-desk.webp";
import mobWebp from "../assets/images/hero-mob.webp";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const heroRef = useRef(null);
  const frameRef = useRef(null);
  const imageRef = useRef(null);
  const ctaRef = useRef(null);
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  const checkMobile = useCallback(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [checkMobile]);

  // Aggressive preload of WebP
  useEffect(() => {
    const preload = document.createElement('link');
    preload.rel = 'preload';
    preload.as = 'image';
    preload.href = isMobile ? mobWebp : deskWebp;
    preload.type = 'image/webp';
    document.head.appendChild(preload);
  }, [isMobile]);

  useGSAP(() => {
    if (isMobile) return;

    gsap.set([imageRef.current, ctaRef.current], {
      opacity: 0,
      clearProps: "transform"
    });

    gsap.set(imageRef.current, {
      scale: 1.08,
      y: 15
    });

    gsap.set(ctaRef.current, {
      y: 50
    });

    const tl = gsap.timeline();
    tl.to(imageRef.current, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 1.6,
      ease: "power2.out"
    }).to(ctaRef.current, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "back.out(1.7)"
    }, "-=0.8");

    gsap.fromTo(frameRef.current, {
      scale: 0.4,
      y: -600
    }, {
      scale: 1,
      y: 100,
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "50% top",
        scrub: 1,
        invalidateOnRefresh: true
      }
    });
  }, [isMobile]);

  return (
    <div ref={heroRef} className="relative w-full">
      <div ref={containerRef} className="hero bg-[#100905] h-screen w-full overflow-hidden">
        <div className="relative h-screen w-full">
          {/* Optimized Hero Image */}
          <div
            ref={imageRef}
            className="absolute inset-0 h-[110%] w-[110%] -left-[5%] -top-[5%] z-0"
          >
            <picture>
              <source srcSet={deskWebp} type="image/webp" media="(min-width: 768px)" />
              <source srcSet={mobWebp} type="image/webp" media="(max-width: 767px)" />
              <img
                src={isMobile ? mobWebp : deskWebp}
                alt="Hero background"
                className="h-full w-full object-cover object-center"
                loading="eager"
                fetchpriority="high"
                decoding="async"
                style={{
                  willChange: isMobile ? 'auto' : 'transform',
                  transform: isMobile ? 'none' : 'translateZ(0)',
                  filter: isMobile ? 'none' : 'drop-shadow(10px 10px #555)',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden'
                }}
              />
            </picture>
          </div>

          {/* CTA Button */}
          <div className="absolute inset-x-0 bottom-10 md:bottom-16 lg:bottom-27 flex justify-center">
            <div
              ref={ctaRef}
              className="nav-Button bg-gradient-to-r from-[#161D27] to-[#243040] border border-[#161D27]/30 hover:scale-[0.99] px-3 sm:px-4 md:px-5 py-1 rounded-full flex items-center justify-center gap-2 sm:gap-3 md:gap-4 font-[Quicksand] transition-all ease-cubic-bezier duration-500 group hover:bg-gradient-to-r hover:from-[#D9D9D9] hover:to-[#D9D9D9] focus-within:scale-[0.99] shadow-md hover:shadow-lg"
            >
              <a
                href="https://wa.me/919689762896?text=Hi%20there%2C%20I%20visited%20your%20website%20and%20wanted%20to%20connect!"
                target="_blank"
                rel="noopener noreferrer"
                className="relative h-10 sm:h-12 md:h-14 flex items-center justify-center"
              >
                <div className="flex flex-col items-center relative">
                  <span className="block font-bold font-[Familjen_Grotesk] text-base sm:text-lg md:text-xl lg:text-2xl transition-transform duration-400 text-[#D9D9D9] tracking-tighter group-hover:-translate-y-full opacity-100 group-hover:opacity-0 whitespace-nowrap">
                    Let's Connect
                  </span>
                  <span className="absolute font-bold font-[Familjen_Grotesk] text-base sm:text-lg md:text-xl lg:text-2xl transition-transform duration-400 text-[#161D27] tracking-tighter opacity-0 group-hover:opacity-100 translate-y-full group-hover:translate-y-0 whitespace-nowrap">
                    Let's Connect
                  </span>
                </div>
              </a>
              <div className="p-2 sm:p-2.5 md:p-3 rounded-full group-hover:-rotate-45 scale-[0.4] transition-all duration-400 text-[#D9D9D9] group-active:text-[#161D27] bg-[#D9D9D9] group-hover:text-[#D9D9D9] group-hover:bg-gradient-to-r group-hover:from-[#161D27] group-hover:to-[#243040] shadow-sm group-hover:shadow">
                <ion-icon name="arrow-forward-outline" size="small"></ion-icon>
              </div>
            </div>
          </div>

          <div ref={frameRef}></div>
        </div>
      </div>
    </div>
  );
}
