import { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import deskim from "../assets/images/hero-desk.png";
import mobim from "../assets/images/hero-mob.webp";

export default function Hero() {
  const heroRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);

  // Debounced resize handler
  const checkDevice = useCallback(() => {
    const width = window.innerWidth;
    setIsMobile(width < 768);
  }, []);

  // Throttled resize handler
  const throttledResize = useCallback(() => {
    let timeoutId;
    return () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkDevice, 150);
    };
  }, [checkDevice]);

  // Memoized image source
  const imageSrc = useMemo(() => isMobile ? mobim : deskim, [isMobile]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Resize event listener
  useEffect(() => {
    const resizeHandler = throttledResize();
    checkDevice(); // Initial check
    
    window.addEventListener("resize", resizeHandler, { passive: true });
    return () => window.removeEventListener("resize", resizeHandler);
  }, [throttledResize, checkDevice]);

  // Preload image only when needed
  useEffect(() => {
    if (!isIntersecting) return;

    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.src = imageSrc;
    
    // Preload link for browsers that support it
    const preloadLink = document.createElement("link");
    preloadLink.rel = "preload";
    preloadLink.as = "image";
    preloadLink.href = imageSrc;
    preloadLink.type = isMobile ? "image/webp" : "image/png";
    document.head.appendChild(preloadLink);

    return () => {
      if (document.head.contains(preloadLink)) {
        document.head.removeChild(preloadLink);
      }
    };
  }, [imageSrc, isIntersecting, isMobile]);

  // Optimized image styles
  const imageStyles = useMemo(() => ({
    transform: 'translate3d(0, 0, 0)', // Hardware acceleration
    willChange: 'auto', // Remove will-change when not animating
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
    imageRendering: 'auto',
    filter: 'none', // Remove expensive filters
    transition: 'opacity 0.3s ease',
    opacity: imageLoaded ? 1 : 0,
  }), [imageLoaded]);

  return (
    <section 
      ref={heroRef} 
      className="relative w-full isolate" // isolate creates new stacking context
      style={{ contain: 'layout style paint' }} // CSS containment
    >
      <div className="hero bg-[#100905] h-screen w-full overflow-hidden">
        <div className="relative h-screen w-full">
          
          {/* Background Image Container */}
          <div className="absolute inset-0 z-0">
            {isIntersecting && (
              <>
                <img
                  src={imageSrc}
                  alt="Hero background"
                  className="h-full w-full object-cover object-center"
                  loading="eager"
                  decoding="async"
                  style={imageStyles}
                  onLoad={() => setImageLoaded(true)}
                  width={isMobile ? "414" : "1920"}
                  height={isMobile ? "896" : "1080"}
                />
                
                {/* Fallback for no-js */}
                <noscript>
                  <img
                    src={deskim}
                    alt="Static fallback"
                    className="h-full w-full object-cover object-center"
                  />
                </noscript>
              </>
            )}
            
            {/* Loading placeholder */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-[#100905] animate-pulse">
                <div className="h-full w-full bg-gradient-to-b from-[#100905] to-[#1a0f0a]"></div>
              </div>
            )}
          </div>

          {/* CTA Button */}
          <div className="absolute inset-x-0 bottom-10 md:bottom-16 lg:bottom-27 flex justify-center z-10">
            <div className="nav-Button bg-gradient-to-r from-[#161D27] to-[#243040] border border-[#161D27]/30 hover:scale-[0.99] px-3 sm:px-4 md:px-5 py-1 rounded-full flex items-center justify-center gap-2 sm:gap-3 md:gap-4 font-[Quicksand] transition-all ease-in-out duration-300 group hover:bg-gradient-to-r hover:from-[#D9D9D9] hover:to-[#D9D9D9] focus-within:scale-[0.99] shadow-md hover:shadow-lg will-change-transform">
              
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
        </div>
      </div>
    </section>
  );
}