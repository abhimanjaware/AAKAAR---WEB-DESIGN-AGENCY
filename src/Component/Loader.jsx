import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
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

  // Refs for performance optimization
  const mainLoaderRef = useRef(null);
  const timelineRef = useRef(null);
  const animationFrameRef = useRef(null);
  const resizeTimeoutRef = useRef(null);

  // Device detection with performance optimization
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

  // Optimized resize handler with debouncing
  const handleResize = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    // Clear existing timeout
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }
    
    // Debounce resize updates
    resizeTimeoutRef.current = setTimeout(() => {
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
    }, 16); // ~60fps throttling
  }, []);

  useEffect(() => {
    if (!shouldShowLoader || typeof window === 'undefined') return;

    window.addEventListener('resize', handleResize, { passive: true });
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [shouldShowLoader, handleResize]);

  // Body scroll lock with memory optimization
  useEffect(() => {
    if (!shouldShowLoader || typeof document === 'undefined') return;

    // Preload font asynchronously
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Notable&display=swap';
    link.rel = 'preload';
    link.as = 'style';
    link.onload = function() { this.rel = 'stylesheet'; };
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
  
  // Optimized percentage counter
  useEffect(() => {
    if (!shouldShowLoader) return;

    let startTime = null;
    const totalDuration = isMobile ? 2500 : 3500; // Faster on mobile
    
    const updateCounter = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / totalDuration, 1);
      const currentValue = Math.floor(progress * 100);
      
      setPercentage(currentValue);
      
      if (progress >= 1) {
        setPercentage(100);
        setBeamColor("white");
        setTimeout(() => setStartOutAnimation(true), 300); // Faster transition on mobile
        return;
      }
      
      animationFrameRef.current = requestAnimationFrame(updateCounter);
    };
    
    animationFrameRef.current = requestAnimationFrame(updateCounter);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [shouldShowLoader, isMobile]);

  // Memoized strip positions with reduced count for mobile
  const stripPositions = useMemo(() => {
    const allPositions = [
      "top-1/2", "bottom-1/3", "top-1/3", "bottom-1/6", "top-1/6", 
      "top-full", "", "-bottom-1/6", "-top-1/6", "-bottom-1/3", 
      "-top-1/3", "-bottom-1/2", "-top-1/2", "-bottom-2/3", "-top-2/3", 
      "-bottom-5/6", "-top-5/6", "-bottom-full", "-top-full"
    ];
    // Reduce strips on mobile for better performance
    return isMobile ? allPositions.slice(0, 12) : allPositions;
  }, [isMobile]);

  // Optimized loading text component with reduced repetitions on mobile
  const LoadingTextDisplay = useMemo(() => React.memo(({ isInverted = false }) => {
    const containerClass = isInverted ? "loader-movingtext-invert" : "loader-movingtext";
    const repeatCount = isMobile ? 8 : 15; // Fewer repetitions on mobile
    
    return (
      <div className={containerClass}>
        {Array.from({ length: repeatCount }, (_, i) => (
          <span 
            key={i} 
            className="text-black/85 text-[12px] font-black px-2 tracking-wide"
            style={{ 
              willChange: 'transform',
              contain: 'layout style paint'
            }}
          >
            LOADING
          </span>
        ))}
      </div>
    );
  }), [isMobile]);

  // Main GSAP animations with enhanced mobile optimizations
  useGSAP(() => {
    if (!shouldShowLoader) return;

    // Enhanced performance optimizations
    gsap.config({
      force3D: true,
      autoSleep: 30, // More aggressive sleeping
      nullTargetWarn: false,
      autoKill: true
    });

    // Batch DOM queries for better performance
    const elements = {
      strips: gsap.utils.toArray([".strip1", ".strip2"]),
      webElements: gsap.utils.toArray([".web-horizontal", ".web-vertical", ".web-slantright", ".web-slantleft"]),
      beamCircle: ".beam-circle",
      textElements: gsap.utils.toArray([".loader-movingtext", ".loader-movingtext-invert"]),
      stripTextElements: gsap.utils.toArray([".strip-text-animation", ".strip-text-animation-reverse"])
    };

    // Set will-change for critical elements in batch
    gsap.set([...elements.strips, ...elements.webElements], {
      willChange: 'transform, opacity',
      force3D: true
    });

    const tl = gsap.timeline({
      defaults: { 
        ease: isMobile ? "power1.out" : "power2.out" // Simpler easing on mobile
      }
    });
    
    timelineRef.current = tl;

    // Optimized initial strip animations
    tl.fromTo(elements.strips, {
      width: 0,
    }, {
      width: isMobile ? "2000px" : "2900px", // Smaller width on mobile
      duration: isMobile ? 0.6 : 0.8,
      ease: "power2.inOut",
    });

    // Optimized main strip animations with reduced complexity on mobile
    const stripAnimations = [
      { selector: '.web-horizontal', width: isMobile ? "2000px" : "2900px" },
      { selector: '.web-vertical', width: "100vh" },
      { selector: '.web-slantright', width: isMobile ? "1800px" : "2500px" },
      { selector: '.web-slantleft', width: isMobile ? "1800px" : "2500px" }
    ];
    
    stripAnimations.forEach(({ selector, width }) => {
      tl.fromTo(selector, { width: 0 }, { 
        width, 
        duration: isMobile ? 0.6 : 0.8,
        ease: 'power2.inOut', 
        stagger: isMobile ? 0.02 : 0.03 // Faster stagger on mobile
      }, 'z');
    });
    
    // Optimized movement animations
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
        duration: isMobile ? 0.6 : 0.8,
        ease: isMobile ? "power1.out" : "power2.out"
      }, "x");
    });
 
    // Optimized beam circle animation
    tl.fromTo(elements.beamCircle, {
      scale: 0,
      opacity: 0
    }, {
      scale: 1,
      opacity: 1,
      duration: isMobile ? 0.4 : 0.6,
      ease: isMobile ? "back.out(1.2)" : "back.out(1.7)" // Less bounce on mobile
    }, "-=0.5");

    // Optimized text animations with reduced duration on mobile
    const textAnimations = [
      { selector: ".loader-movingtext", x: "-100%", duration: isMobile ? 60 : 90 },
      { selector: ".loader-movingtext-invert", x: "100%", duration: isMobile ? 60 : 90 },
      { selector: ".strip-text-animation", x: "-100%", duration: isMobile ? 25 : 40 },
      { selector: ".strip-text-animation-reverse", x: "100%", duration: isMobile ? 25 : 40 }
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

    // Cleanup function
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [shouldShowLoader, isMobile]);

  // Optimized beam color change animation
  useGSAP(() => {
    if (beamColor === "white" && shouldShowLoader) {
      gsap.to(".beam-circle", {
        backgroundColor: "#ffffff",
        boxShadow: isMobile ? "0 0 10px rgba(255, 255, 255, 0.6)" : "0 0 20px rgba(255, 255, 255, 0.8)",
        duration: isMobile ? 0.5 : 0.8,
        ease: "power2.inOut"
      });
      
      gsap.to(".counter-number", {
        opacity: 0,
        duration: isMobile ? 0.3 : 0.5,
        ease: "power2.out",
        delay: isMobile ? 0.2 : 0.3
      });
    }
  }, [beamColor, shouldShowLoader, isMobile]);

  // Optimized exit animation
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
          duration: isMobile ? 0.7 : 1,
          ease: "power3.in",
          stagger: isMobile ? 0.02 : 0.03
        }, 0);
      });
      
      outTl.to(".beam-circle", {
        scale: 1.2,
        duration: isMobile ? 0.15 : 0.2,
        ease: "power1.in"
      })
      .to(".beam-circle", {
        scale: isMobile ? 30 : 50, // Smaller scale on mobile
        duration: isMobile ? 0.4 : 0.5,
        ease: "power2.in"
      })
      .to(".loader-content", {
        backgroundColor: "#ffffff",
        duration: isMobile ? 0.3 : 0.4,
        ease: "power2.in"
      }, "-=0.4")
      .to(".main-loader", {
        opacity: 0,
        duration: isMobile ? 0.3 : 0.5,
        ease: "power2.inOut"
      });
    }
  }, [startOutAnimation, shouldShowLoader, isMobile]);

  // Optimized responsive sizes
  const beamSize = useMemo(() => {
    const baseSize = Math.min(windowSize.width, windowSize.height) * (isMobile ? 0.25 : 0.3);
    return {
      width: Math.max(isMobile ? 60 : 80, Math.min(baseSize, isMobile ? 150 : 200)),
      height: Math.max(isMobile ? 60 : 80, Math.min(baseSize, isMobile ? 150 : 200))
    };
  }, [windowSize, isMobile]);

  const fontSize = useMemo(() => {
    const baseSize = Math.min(windowSize.width, windowSize.height) * (isMobile ? 0.05 : 0.07);
    return Math.max(isMobile ? 14 : 18, Math.min(baseSize, isMobile ? 24 : 32));
  }, [windowSize, isMobile]);

  if (!shouldShowLoader) {
    return null;
  }

  return (
    <div 
      ref={mainLoaderRef}
      className="main-loader fixed inset-0 z-[9999] w-screen overflow-hidden" 
      style={{
        height: 'calc(var(--vh, 1vh) * 100)',
        touchAction: 'none',
        overscrollBehavior: 'none',
        willChange: 'opacity',
        backfaceVisibility: 'hidden',
        contain: 'layout style paint',
        isolation: 'isolate'
      }}
    >
      <div className="loader-content h-full w-full bg-black overflow-hidden relative"
           style={{ contain: 'layout style paint' }}>
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
              transformStyle: 'preserve-3d',
              contain: 'layout style paint'
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
                transform: 'translateZ(0)',
                contain: 'layout style paint'
              }}
            >
              {percentage}%
            </div>
          </div>

          <div className="bg-strip flex justify-center">
            {stripPositions.map((position, index) => (
              <React.Fragment key={index}>
                <div 
                  className={`strip1 h-4 bg-[#070304] absolute ${position} rotate-45 overflow-hidden`}
                  style={{ 
                    width: isMobile ? '2000px' : '2900px',
                    willChange: 'width, opacity',
                    transform: 'translateZ(0)',
                    contain: 'layout style paint'
                  }}
                >
                  <div className="strip-text-animation whitespace-nowrap absolute w-[200%] left-0">
                    {Array.from({ length: isMobile ? 12 : 20 }, (_, i) => (
                      <span 
                        key={i} 
                        className="text-black/85 text-[12px] font-black px-2 tracking-wide inline-block"
                        style={{ 
                          willChange: 'transform',
                          contain: 'layout style paint'
                        }}
                      >
                        LOADING
                      </span>
                    ))}
                  </div>
                </div>
                
                <div 
                  className={`strip2 h-4 bg-[#070304] absolute ${position} -rotate-45 overflow-hidden`}
                  style={{ 
                    width: isMobile ? '2000px' : '2900px',
                    willChange: 'width, opacity',
                    transform: 'translateZ(0)',
                    contain: 'layout style paint'
                  }}
                >
                  <div className="strip-text-animation-reverse whitespace-nowrap absolute w-[200%] left-0">
                    {Array.from({ length: isMobile ? 12 : 20 }, (_, i) => (
                      <span 
                        key={i} 
                        className="text-black/85 text-[12px] font-black px-2 tracking-wide inline-block"
                        style={{ 
                          willChange: 'transform',
                          contain: 'layout style paint'
                        }}
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
                transform: 'translateZ(0)',
                contain: 'layout style paint'
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
                width: isMobile ? '2000px' : '2900px',
                willChange: 'width, opacity',
                transform: 'translateZ(0)',
                contain: 'layout style paint'
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
                  width: isMobile ? '1800px' : '2500px',
                  willChange: 'width, opacity',
                  transform: 'translateZ(0)',
                  contain: 'layout style paint'
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