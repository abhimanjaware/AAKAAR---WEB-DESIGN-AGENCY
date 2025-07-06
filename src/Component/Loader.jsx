import React, { useState, useEffect, useMemo, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(useGSAP);

function Loader() {
  const [shouldShowLoader, setShouldShowLoader] = useState(false);
  const [startOutAnimation, setStartOutAnimation] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const [beamColor, setBeamColor] = useState("black");
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  // Device detection with performance optimization
  // eslint-disable-next-line no-unused-vars
  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= 768 || 
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }, []);

  // Check if loader should show (only once per session)
  useEffect(() => {
    if (typeof sessionStorage === 'undefined') return;
    const hasShownLoader = sessionStorage.getItem('loaderShown');
    if (!hasShownLoader) {
      setShouldShowLoader(true);
      sessionStorage.setItem('loaderShown', 'true');
    }
  }, []);

  // Throttled resize handler
  const handleResize = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    const updateSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
      
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    if (typeof window.requestAnimationFrame === 'function') {
      window.requestAnimationFrame(updateSize);
    } else {
      updateSize();
    }
  }, []);

  useEffect(() => {
    if (!shouldShowLoader || typeof window === 'undefined') return;

    window.addEventListener('resize', handleResize, { passive: true });
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [shouldShowLoader, handleResize]);

  // Body scroll lock with memory optimization
  useEffect(() => {
    if (!shouldShowLoader || typeof document === 'undefined') return;

    // Load font without blocking
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Notable&display=swap';
    link.rel = 'stylesheet';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);

    const scrollY = window.scrollY;
    const body = document.body;
    const html = document.documentElement;
    
    // Store original styles for restoration
    const originalBodyOverflow = body.style.overflow;
    const originalBodyPosition = body.style.position;
    const originalBodyTop = body.style.top;
    const originalHtmlOverflow = html.style.overflow;

    // Apply scroll lock
    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    html.style.overflow = 'hidden';
    
    return () => {
      // Cleanup
      if (link.parentNode === document.head) {
        document.head.removeChild(link);
      }
      
      // Restore styles
      body.style.overflow = originalBodyOverflow;
      body.style.position = originalBodyPosition;
      body.style.top = originalBodyTop;
      html.style.overflow = originalHtmlOverflow;
      window.scrollTo(0, scrollY);
    };
  }, [shouldShowLoader]);
  
  // Percentage counter with optimized timing
  useEffect(() => {
    if (!shouldShowLoader) return;

    let animationId;
    let startTime = null;
    const totalDuration = 3500; // Same duration for both mobile and desktop
    
    const updateCounter = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / totalDuration, 1);
      const currentValue = Math.floor(progress * 100);
      
      setPercentage(currentValue);
      
      if (progress >= 1) {
        setPercentage(100);
        setBeamColor("white");
        setTimeout(() => setStartOutAnimation(true), 500);
        return;
      }
      
      animationId = requestAnimationFrame(updateCounter);
    };
    
    animationId = requestAnimationFrame(updateCounter);
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [shouldShowLoader]);

  // Original strip positions
  const stripPositions = useMemo(() => [
    "top-1/2", "bottom-1/3", "top-1/3", "bottom-1/6", "top-1/6", 
    "top-full", "", "-bottom-1/6", "-top-1/6", "-bottom-1/3", 
    "-top-1/3", "-bottom-1/2", "-top-1/2", "-bottom-2/3", "-top-2/3", 
    "-bottom-5/6", "-top-5/6", "-bottom-full", "-top-full"
  ], []);

  // Original loading text component
  const LoadingTextDisplay = useMemo(() => React.memo(({ isInverted = false }) => {
    const containerClass = isInverted ? "loader-movingtext-invert" : "loader-movingtext";
    
    return (
      <div className={containerClass}>
        {Array.from({ length: 15 }, (_, i) => (
          <span 
            key={i} 
            className="text-black/85 text-[12px] font-black px-2 tracking-wide"
            style={{ willChange: 'transform' }}
          >
            LOADING
          </span>
        ))}
      </div>
    );
  }), []);

  // Main GSAP animations with mobile performance optimizations
  useGSAP(() => {
    if (!shouldShowLoader) return;

    // Performance optimizations that don't affect visuals
    gsap.config({
      force3D: true,
      autoSleep: 60,
      nullTargetWarn: false,
      autoKill: true
    });

    // Use will-change for critical elements
    gsap.set([".strip1", ".strip2", ".web-horizontal", ".web-vertical", ".web-slantright", ".web-slantleft"], {
      willChange: 'transform, opacity'
    });

    const tl = gsap.timeline({
      defaults: { ease: "power2.out" }
    });
    
    // Initial strip animations
    tl.fromTo([".strip1", ".strip2"], {
      width: 0,
    }, {
      width: "2900px",
      duration: 0.8,
      ease: "power2.inOut",
    });

    // Main strip animations
    const stripAnimations = [
      { selector: '.web-horizontal', width: "2900px" },
      { selector: '.web-vertical', width: "100vh" },
      { selector: '.web-slantright', width: "2500px" },
      { selector: '.web-slantleft', width: "2500px" }
    ];
    
    stripAnimations.forEach(({ selector, width }) => {
      tl.fromTo(selector, { width: 0 }, { 
        width, 
        duration: 0.8,
        ease: 'power2.inOut', 
        stagger: 0.03 
      }, 'z');
    });
    
    // Movement animations
    const movementAnimations = [
      { selector: ".web-horizontal-1", from: { x: "-100%" }, to: { x: "0%" } },
      { selector: ".web-horizontal-2", from: { x: "100%" }, to: { x: "0%" } },
      { selector: ".web-vertical-1", from: { x: "-100%" }, to: { x: "0%" } },
      { selector: ".web-vertical-2", from: { x: "100%" }, to: { x: "0%" } },
      { selector: ".web-slantright-1", from: { x: "-100%", opacity: 0 }, to: { x: "0%", opacity: 1 } },
      { selector: ".web-slantright-2", from: { x: "100%", opacity: 0 }, to: { x: "0%", opacity: 1 } },
      { selector: ".web-slantleft-1", from: { x: "-100%", opacity: 0 }, to: { x: "0%", opacity: 1 } },
      { selector: ".web-slantleft-2", from: { x: "100%", opacity: 0 }, to: { x: "0%", opacity: 1 } }
    ];
    
    movementAnimations.forEach(({ selector, from, to }) => {
      tl.fromTo(selector, from, { 
        ...to, 
        duration: 0.8, 
        ease: "power2.out" 
      }, "x");
    });
 
    // Beam circle animation
    tl.fromTo(".beam-circle", {
      scale: 0,
      opacity: 0
    }, {
      scale: 1,
      opacity: 1,
      duration: 0.6,
      ease: "back.out(1.7)"
    }, "-=0.5");

    // Text animations
    const textAnimations = [
      { selector: ".loader-movingtext", x: "-100%", duration: 90 },
      { selector: ".loader-movingtext-invert", x: "100%", duration: 90 },
      { selector: ".strip-text-animation", x: "-100%", duration: 40 },
      { selector: ".strip-text-animation-reverse", x: "100%", duration: 40 }
    ];
    
    textAnimations.forEach(({ selector, x, duration }) => {
      gsap.to(selector, {
        x,
        duration,
        repeat: -1,
        ease: "none",
        delay: selector.includes('strip') ? 0 : 1
      });
    });
  }, [shouldShowLoader]);

  // Beam color change animation
  useGSAP(() => {
    if (beamColor === "white" && shouldShowLoader) {
      gsap.to(".beam-circle", {
        backgroundColor: "#ffffff",
        boxShadow: "0 0 20px rgba(255, 255, 255, 0.8)",
        duration: 0.8,
        ease: "power2.inOut"
      });
      
      gsap.to(".counter-number", {
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
        delay: 0.3
      });
    }
  }, [beamColor, shouldShowLoader]);

  // Exit animation
  useGSAP(() => {
    if (startOutAnimation && shouldShowLoader) {
      const outTl = gsap.timeline({
        onComplete: () => {
          setShouldShowLoader(false);
        }
      });
      
      const outAnimations = [
        { selector: ".web-horizontal", props: { width: 0, opacity: 0 } },
        { selector: ".web-vertical", props: { height: 0, opacity: 0 } },
        { selector: ".web-slantright, .web-slantleft", props: { width: 0, opacity: 0 } },
        { selector: ".strip1, .strip2", props: { width: 0, opacity: 0 } }
      ];
      
      outAnimations.forEach(({ selector, props }) => {
        outTl.to(selector, {
          ...props,
          duration: 1,
          ease: "power3.in",
          stagger: 0.03
        }, 0);
      });
      
      outTl.to(".beam-circle", {
        scale: 1.2,
        duration: 0.2,
        ease: "power1.in"
      })
      .to(".beam-circle", {
        scale: 50,
        duration: 0.5,
        ease: "power2.in"
      })
      .to(".loader-content", {
        backgroundColor: "#ffffff",
        duration: 0.4,
        ease: "power2.in"
      }, "-=0.4")
      .to(".main-loader", {
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut"
      });
    }
  }, [startOutAnimation, shouldShowLoader]);

  // Responsive sizes
  const beamSize = useMemo(() => {
    const baseSize = Math.min(windowSize.width, windowSize.height) * 0.3;
    return {
      width: Math.max(80, Math.min(baseSize, 200)),
      height: Math.max(80, Math.min(baseSize, 200))
    };
  }, [windowSize]);

  const fontSize = useMemo(() => {
    const baseSize = Math.min(windowSize.width, windowSize.height) * 0.07;
    return Math.max(18, Math.min(baseSize, 32));
  }, [windowSize]);

  if (!shouldShowLoader) {
    return null;
  }

  return (
    <div 
      className="main-loader fixed inset-0 z-[9999] w-screen overflow-hidden" 
      style={{
        height: 'calc(var(--vh, 1vh) * 100)',
        touchAction: 'none',
        overscrollBehavior: 'none',
        willChange: 'opacity',
        backfaceVisibility: 'hidden'
      }}
    >
      <div className="loader-content h-full w-full bg-black overflow-hidden relative">
        <div className="loader-allStrips h-full w-full">
          {/* Centered Beam Circle */}
          <div 
            className="beam-circle absolute bg-black rounded-full z-50 flex items-center justify-center"
            style={{
              width: beamSize.width,
              height: beamSize.height,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              willChange: 'transform, background-color',
              transformStyle: 'preserve-3d'
            }}
          >
            <div 
              className="counter-number text-zinc-500 font-bold"
              style={{
                fontFamily: "'Notable', sans-serif",
                letterSpacing: '1px',
                willChange: 'opacity',
                fontSize: `${fontSize}px`,
                lineHeight: 1,
                transform: 'translateZ(0)'
              }}
            >
              {percentage}%
            </div>
          </div>

          <div className="bg-strip flex justify-center">
            {stripPositions.map((position, index) => (
              <React.Fragment key={index}>
                <div 
                  className={`strip1 h-4 w-[2900px] bg-[#070304] absolute ${position} rotate-45 overflow-hidden`}
                  style={{ 
                    willChange: 'width, opacity',
                    transform: 'translateZ(0)'
                  }}
                >
                  <div className="strip-text-animation whitespace-nowrap absolute w-[200%] left-0">
                    {Array.from({ length: 20 }, (_, i) => (
                      <span 
                        key={i} 
                        className="text-black/85 text-[12px] font-black px-2 tracking-wide inline-block"
                        style={{ willChange: 'transform' }}
                      >
                        LOADING
                      </span>
                    ))}
                  </div>
                </div>
                
                <div 
                  className={`strip2 h-4 w-[2900px] bg-[#070304] absolute ${position} -rotate-45 overflow-hidden`}
                  style={{ 
                    willChange: 'width, opacity',
                    transform: 'translateZ(0)'
                  }}
                >
                  <div className="strip-text-animation-reverse whitespace-nowrap absolute w-[200%] left-0">
                    {Array.from({ length: 20 }, (_, i) => (
                      <span 
                        key={i} 
                        className="text-black/85 text-[12px] font-black px-2 tracking-wide inline-block"
                        style={{ willChange: 'transform' }}
                      >
                        LOADING
                      </span>
                    ))}
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div> 
          
          <div className="webstrips flex justify-center">
            <div 
              className="web-vertical h-5 w-[100vh] flex absolute rotate-90 overflow-hidden top-1/2 left-1/2 -translate-x-1/2"
              style={{ 
                willChange: 'width, height, opacity',
                transform: 'translateZ(0)'
              }}
            >
              <div className="web-vertical-1 h-full w-full bg-gradient-to-r from-yellow-400/40 to-black/50 lg:to-black/90 flex items-center justify-center overflow-hidden">
                <LoadingTextDisplay />
              </div>
              <div className="web-vertical-2 h-full w-full bg-gradient-to-l from-yellow-400/40 to-black/50 lg:to-black/90 flex items-center justify-center overflow-hidden">
                <LoadingTextDisplay isInverted={true} />
              </div>
            </div>

            <div 
              className="web-horizontal h-5 flex absolute top-1/2 overflow-hidden"
              style={{ 
                width: '2900px',
                willChange: 'width, opacity',
                transform: 'translateZ(0)'
              }}
            >
              <div className="web-horizontal-1 h-full w-full bg-gradient-to-r from-yellow-400 via-yellow-400/40 to-black/50 lg:to-black/90 flex items-center justify-start overflow-hidden">
                <LoadingTextDisplay />
              </div>
              <div className="web-horizontal-2 h-full w-full bg-gradient-to-l from-yellow-400 via-yellow-400/40 to-black/50 lg:to-black/90 flex items-center justify-end overflow-hidden">
                <LoadingTextDisplay isInverted={true} />
              </div>
            </div>

            {[
              { rotation: '-rotate-[55deg]', class: 'web-slantright' },
              { rotation: 'rotate-[55deg]', class: 'web-slantleft' },
              { rotation: '-rotate-[26deg]', class: 'web-slantright' },
              { rotation: 'rotate-[26deg]', class: 'web-slantright' }
            ].map(({ rotation, class: className }, index) => (
              <div 
                key={index} 
                className={`${className} h-5 flex absolute top-1/2 ${rotation}`}
                style={{ 
                  width: '2500px',
                  willChange: 'width, opacity',
                  transform: 'translateZ(0)'
                }}
              >
                <div className={`${className}-1 h-full w-full bg-gradient-to-r from-yellow-400 via-yellow-400/40 to-black/50 lg:to-black/90 flex items-center justify-center overflow-hidden`}>
                  <LoadingTextDisplay />
                </div>
                <div className={`${className}-2 h-full w-full bg-gradient-to-l from-yellow-400 via-yellow-400/40 to-black/50 lg:to-black/90 flex items-center justify-center overflow-hidden`}>
                  <LoadingTextDisplay isInverted={true} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Loader;