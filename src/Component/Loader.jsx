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

  // Refs
  const mainLoaderRef = useRef(null);
  const timelineRef = useRef(null);
  const animationFrameRef = useRef(null);
  const resizeTimeoutRef = useRef(null);
  const counterStartTime = useRef(null);

  // Performance optimizations
  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= 768;
  }, []);

  // Session storage check with fallback
  useEffect(() => {
    try {
      if (typeof sessionStorage !== 'undefined' && !sessionStorage.getItem('loaderShown')) {
        setShouldShowLoader(true);
        sessionStorage.setItem('loaderShown', 'true');
      }
    } catch {
      setShouldShowLoader(true);
    }
  }, []);

  // Debounced resize handler
  const handleResize = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }
    
    resizeTimeoutRef.current = setTimeout(() => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
      
      if (typeof window.requestAnimationFrame === 'function') {
        animationFrameRef.current = window.requestAnimationFrame(() => {
          const vh = window.innerHeight * 0.01;
          document.documentElement.style.setProperty('--vh', `${vh}px`);
        });
      }
    }, 100);
  }, []);

  // Resize effect with passive listeners
  useEffect(() => {
    if (!shouldShowLoader || typeof window === 'undefined') return;

    window.addEventListener('resize', handleResize, { passive: true });
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [shouldShowLoader, handleResize]);

  // Scroll lock with memory optimization
  useEffect(() => {
    if (!shouldShowLoader || typeof document === 'undefined') return;

    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Notable&display=swap';
    fontLink.rel = 'stylesheet';
    fontLink.crossOrigin = 'anonymous';
    document.head.appendChild(fontLink);

    const scrollY = window.scrollY;
    document.body.style.cssText = `overflow: hidden; position: fixed; top: -${scrollY}px;`;
    
    return () => {
      document.head.removeChild(fontLink);
      document.body.style.cssText = '';
      window.scrollTo(0, scrollY);
    };
  }, [shouldShowLoader]);

  // Fixed percentage counter
  useEffect(() => {
    if (!shouldShowLoader) return;

    counterStartTime.current = Date.now();
    const totalDuration = isMobile ? 2500 : 3500;
    
    const updateCounter = () => {
      const elapsed = Date.now() - counterStartTime.current;
      const progress = Math.min(elapsed / totalDuration, 1);
      const currentValue = Math.floor(progress * 100);
      
      setPercentage(currentValue);
      
      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(updateCounter);
      } else {
        setPercentage(100);
        setBeamColor("white");
        setTimeout(() => setStartOutAnimation(true), 300);
      }
    };
    
    animationFrameRef.current = requestAnimationFrame(updateCounter);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [shouldShowLoader, isMobile]);

  // Original strip positions
  const stripPositions = useMemo(() => [
    "top-1/2", "bottom-1/3", "top-1/3", "bottom-1/6", "top-1/6", 
    "top-full", "", "-bottom-1/6", "-top-1/6", "-bottom-1/3", 
    "-top-1/3", "-bottom-1/2", "-top-1/2", "-bottom-2/3", "-top-2/3", 
    "-bottom-5/6", "-top-5/6", "-bottom-full", "-top-full"
  ], []);

  // Memoized LoadingTextDisplay
  const LoadingTextDisplay = useMemo(() => 
    React.memo(({ isInverted = false }) => {
      const repeatCount = 15;
      
      return (
        <div className={isInverted ? "loader-movingtext-invert" : "loader-movingtext"}>
          {Array.from({ length: repeatCount }, (_, i) => (
            <span 
              key={i} 
              className="text-black/85 text-[12px] font-black px-2 tracking-wide"
            >
              LOADING
            </span>
          ))}
        </div>
      );
    })
  , []);

  // GSAP animations
  useGSAP(() => {
    if (!shouldShowLoader) return;

    gsap.config({
      force3D: false,
      autoSleep: 60,
      nullTargetWarn: false
    });

    const elements = {
      strips: [".strip1", ".strip2"],
      webElements: [".web-horizontal", ".web-vertical", ".web-slantright", ".web-slantleft"],
      beamCircle: ".beam-circle",
      textElements: [".loader-movingtext", ".loader-movingtext-invert"]
    };

    gsap.set([...elements.strips, ...elements.webElements], {
      willChange: 'transform'
    });

    const tl = gsap.timeline({
      defaults: { 
        ease: "power1.out"
      }
    });
    
    timelineRef.current = tl;

    tl.fromTo(elements.strips, {
      width: 0,
    }, {
      width: "2900px",
      duration: 0.8,
    });

    tl.fromTo(".web-horizontal", { width: 0 }, { 
      width: "2900px",
      duration: 0.8,
    }, 'z');

    tl.fromTo(".web-vertical", { width: 0 }, { 
      width: "100vh",
      duration: 0.8,
    }, 'z');

    tl.fromTo([".web-slantright", ".web-slantleft"], { width: 0 }, { 
      width: "2500px",
      duration: 0.8,
    }, 'z');

    tl.fromTo(".web-horizontal-1", { x: "-100%" }, { x: "0%" }, "x");
    tl.fromTo(".web-horizontal-2", { x: "100%" }, { x: "0%" }, "x");
    tl.fromTo(".web-vertical-1", { x: "-100%" }, { x: "0%" }, "x");
    tl.fromTo(".web-vertical-2", { x: "100%" }, { x: "0%" }, "x");
    tl.fromTo([".web-slantright-1", ".web-slantleft-1"], { x: "-100%" }, { x: "0%" }, "x");
    tl.fromTo([".web-slantright-2", ".web-slantleft-2"], { x: "100%" }, { x: "0%" }, "x");

    tl.fromTo(elements.beamCircle, {
      scale: 0,
      opacity: 0
    }, {
      scale: 1,
      opacity: 1,
      duration: 0.6,
      ease: "back.out(1.7)"
    }, "-=0.5");

    gsap.to(".loader-movingtext", {
      x: "-100%",
      duration: 90,
      repeat: -1,
      ease: "none"
    });

    gsap.to(".loader-movingtext-invert", {
      x: "100%",
      duration: 90,
      repeat: -1,
      ease: "none"
    });

    return () => {
      if (timelineRef.current) timelineRef.current.kill();
    };
  }, [shouldShowLoader]);

  // Beam color change
  useGSAP(() => {
    if (beamColor === "white" && shouldShowLoader) {
      gsap.to(".beam-circle", {
        backgroundColor: "#ffffff",
        boxShadow: "0 0 20px rgba(255, 255, 255, 0.8)",
        duration: 0.8,
      });
      
      gsap.to(".counter-number", {
        opacity: 0,
        duration: 0.5,
      });
    }
  }, [beamColor, shouldShowLoader]);

  // Exit animation
  useGSAP(() => {
    if (startOutAnimation && shouldShowLoader) {
      const outTl = gsap.timeline({
        onComplete: () => setShouldShowLoader(false)
      });
      
      outTl.to([".web-horizontal", ".web-vertical", ".web-slantright", ".web-slantleft", ".strip1", ".strip2"], {
        width: 0,
        opacity: 0,
        duration: 1,
        ease: "power3.in"
      }, 0);
      
      outTl.to(".beam-circle", {
        scale: 1.2,
        duration: 0.2
      })
      .to(".beam-circle", {
        scale: 50,
        duration: 0.5
      })
      .to(".loader-content", {
        backgroundColor: "#ffffff",
        duration: 0.4
      }, "-=0.4")
      .to(".main-loader", {
        opacity: 0,
        duration: 0.5
      });
    }
  }, [startOutAnimation, shouldShowLoader]);

  // Responsive sizes
  const beamSize = useMemo(() => {
    const baseSize = Math.min(windowSize.width, windowSize.height) * 0.3;
    return {
      width: Math.min(baseSize, 200),
      height: Math.min(baseSize, 200)
    };
  }, [windowSize]);

  const fontSize = useMemo(() => {
    const baseSize = Math.min(windowSize.width, windowSize.height) * 0.07;
    return Math.min(baseSize, 32);
  }, [windowSize]);

  if (!shouldShowLoader) {
    return null;
  }

  return (
    <div 
      ref={mainLoaderRef}
      className="main-loader fixed inset-0 z-[9999] w-screen overflow-hidden" 
      style={{
        height: 'calc(var(--vh, 1vh) * 100)',
        touchAction: 'none'
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
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div 
              className="counter-number text-zinc-500 font-bold"
              style={{
                fontFamily: "'Notable', sans-serif",
                letterSpacing: '1px',
                fontSize: `${fontSize}px`,
                lineHeight: 1
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
                    width: '2900px'
                  }}
                >
                  <div className="strip-text-animation whitespace-nowrap absolute w-[200%] left-0">
                    {Array.from({ length: 20 }, (_, i) => (
                      <span 
                        key={i} 
                        className="text-black/85 text-[12px] font-black px-2 tracking-wide inline-block"
                      >
                        LOADING
                      </span>
                    ))}
                  </div>
                </div>
                
                <div 
                  className={`strip2 h-4 bg-[#070304] absolute ${position} -rotate-45 overflow-hidden`}
                  style={{ 
                    width: '2900px'
                  }}
                >
                  <div className="strip-text-animation-reverse whitespace-nowrap absolute w-[200%] left-0">
                    {Array.from({ length: 20 }, (_, i) => (
                      <span 
                        key={i} 
                        className="text-black/85 text-[12px] font-black px-2 tracking-wide inline-block"
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
                width: '2900px'
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
                  width: '2500px'
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