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

  // Detect mobile device
  const isMobile = useMemo(() => {
    return typeof window !== 'undefined' && (
      window.innerWidth <= 768 || 
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    );
  }, []);

  // Check if loader should show (only once per session)
  useEffect(() => {
    // Use regular storage check without try-catch since we're not in artifact restrictions
    const hasShownLoader = sessionStorage?.getItem('loaderShown');
    if (!hasShownLoader) {
      setShouldShowLoader(true);
      sessionStorage?.setItem('loaderShown', 'true');
    }
  }, []);

  // Optimized resize handler with RAF throttling
  const handleResize = useCallback(() => {
    const newSize = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    setWindowSize(newSize);
    
    // Update vh variable
    const vh = newSize.height * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }, []);

  useEffect(() => {
    if (!shouldShowLoader) return;

    let rafId;
    let isScheduled = false;

    const throttledResize = () => {
      if (!isScheduled) {
        rafId = requestAnimationFrame(() => {
          handleResize();
          isScheduled = false;
        });
        isScheduled = true;
      }
    };

    window.addEventListener('resize', throttledResize, { passive: true });
    handleResize(); // Initial call

    return () => {
      window.removeEventListener('resize', throttledResize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [shouldShowLoader, handleResize]);

  // Optimized body scroll lock
  useEffect(() => {
    if (!shouldShowLoader) return;

    // Load font more efficiently
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Notable&display=swap';
    link.rel = 'stylesheet';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);

    const scrollY = window.scrollY;
    const body = document.body;
    const html = document.documentElement;
    
    // Store original styles
    const originalStyles = {
      bodyOverflow: body.style.overflow,
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyWidth: body.style.width,
      bodyHeight: body.style.height,
      htmlOverflow: html.style.overflow
    };
    
    // More efficient style application
    const bodyStyle = body.style;
    bodyStyle.overflow = 'hidden';
    bodyStyle.position = 'fixed';
    bodyStyle.top = `-${scrollY}px`;
    bodyStyle.width = '100%';
    bodyStyle.height = '100%';
    html.style.overflow = 'hidden';
    
    return () => {
      link.remove();
      // Restore original styles
      bodyStyle.overflow = originalStyles.bodyOverflow;
      bodyStyle.position = originalStyles.bodyPosition;
      bodyStyle.top = originalStyles.bodyTop;
      bodyStyle.width = originalStyles.bodyWidth;
      bodyStyle.height = originalStyles.bodyHeight;
      html.style.overflow = originalStyles.htmlOverflow;
      window.scrollTo(0, scrollY);
    };
  }, [shouldShowLoader]);
  
  // Optimized percentage counter with RAF
  useEffect(() => {
    if (!shouldShowLoader) return;

    let animationId;
    let startTime = null;
    const totalDuration = 4000;
    
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

  // Optimized strip positions - reduced for mobile
  const stripPositions = useMemo(() => {
    const positions = [
      "top-1/2", "bottom-1/3", "top-1/3", "bottom-1/6", "top-1/6", 
      "top-full", "", "-bottom-1/6", "-top-1/6", "-bottom-1/3", 
      "-top-1/3", "-bottom-1/2", "-top-1/2", "-bottom-2/3", "-top-2/3", 
      "-bottom-5/6", "-top-5/6", "-bottom-full", "-top-full"
    ];
    // Reduce strips on mobile for better performance
    return isMobile ? positions.slice(0, 12) : positions;
  }, [isMobile]);

  // Optimized loading text component
  const LoadingTextDisplay = useMemo(() => React.memo(({ isInverted = false }) => {
    const containerClass = isInverted ? "loader-movingtext-invert" : "loader-movingtext";
    const textCount = isMobile ? 8 : 15; // Reduce text elements on mobile
    
    return (
      <div className={containerClass}>
        {Array.from({ length: textCount }, (_, i) => (
          <span key={i} className="text-black/85 text-[15px] font-black px-2 tracking-wide">
            LOADING
          </span>
        ))}
      </div>
    );
  }), [isMobile]);

  // Main GSAP animations with mobile optimizations
  useGSAP(() => {
    if (!shouldShowLoader) return;

    // Optimize GSAP config for mobile
    gsap.config({
      force3D: true, // Enable hardware acceleration
      autoSleep: 60,
      nullTargetWarn: false
    });

    const tl = gsap.timeline();
    
    // Initial strip animations
    tl.fromTo([".strip1", ".strip2"], {
      width: 0,
    }, {
      width: isMobile ? "200vw" : "2900px", // Responsive width
      duration: 1,
      ease: "expo.in",
    });

    // Optimized strip animations with responsive sizes
    const stripAnimations = [
      { selector: '.web-horizontal', width: isMobile ? "200vw" : "2900px" },
      { selector: '.web-vertical', width: "100vh" },
      { selector: '.web-slantright', width: isMobile ? "150vw" : "2500px" },
      { selector: '.web-slantleft', width: isMobile ? "150vw" : "2500px" }
    ];
    
    stripAnimations.forEach(({ selector, width }) => {
      tl.fromTo(selector, { width: 0 }, { 
        width, 
        ease: 'circ.in', 
        stagger: 0.05 
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
        duration: 1, 
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
      duration: 0.5,
      ease: "power2.out"
    }, "-=0.5");

    // Optimized text animations with different speeds for mobile
    const textAnimations = [
      { selector: ".loader-movingtext", x: "-100%", duration: isMobile ? 60 : 90 },
      { selector: ".loader-movingtext-invert", x: "100%", duration: isMobile ? 60 : 90 },
      { selector: ".strip-text-animation", x: "-100%", duration: isMobile ? 30 : 40 },
      { selector: ".strip-text-animation-reverse", x: "100%", duration: isMobile ? 30 : 40 }
    ];
    
    textAnimations.forEach(({ selector, x, duration }) => {
      gsap.to(selector, {
        x,
        duration,
        repeat: -1,
        ease: "none",
        delay: selector.includes('strip') ? 0 : 1,
        immediateRender: true
      });
    });
  }, [shouldShowLoader, isMobile]);

  // Beam color change animation
  useGSAP(() => {
    if (beamColor === "white" && shouldShowLoader) {
      const tl = gsap.timeline();
      
      tl.to(".beam-circle", {
        backgroundColor: "#ffffff",
        boxShadow: "0 0 20px rgba(255, 255, 255, 0.8)",
        duration: 0.8,
        ease: "power2.inOut"
      })
      .to(".counter-number", {
        opacity: 0,
        duration: 0.5,
        ease: "power2.out"
      }, 0.3);
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
          duration: 1.2,
          ease: "power3.in",
          stagger: 0.05
        }, 0);
      });
      
      outTl.to(".beam-circle", {
        scale: 1.5,
        duration: 0.2,
        ease: "power1.in"
      })
      .to(".beam-circle", {
        scale: isMobile ? 30 : 50, // Smaller scale on mobile
        duration: 0.4,
        ease: "power4.in"
      })
      .to(".loader-content", {
        backgroundColor: "#ffffff",
        duration: 0.3,
        ease: "power4.in"
      }, "-=0.3")
      .to(".main-loader", {
        opacity: 0,
        duration: 0.4,
        ease: "power2.inOut"
      });
    }
  }, [startOutAnimation, shouldShowLoader, isMobile]);

  // Calculate responsive sizes
  const beamSize = useMemo(() => {
    const baseSize = Math.min(windowSize.width, windowSize.height) * (isMobile ? 0.25 : 0.3);
    return {
      width: Math.max(80, Math.min(baseSize, isMobile ? 150 : 200)),
      height: Math.max(80, Math.min(baseSize, isMobile ? 150 : 200))
    };
  }, [windowSize, isMobile]);

  const fontSize = useMemo(() => {
    const baseSize = Math.min(windowSize.width, windowSize.height) * (isMobile ? 0.06 : 0.08);
    return Math.max(16, Math.min(baseSize, isMobile ? 24 : 32));
  }, [windowSize, isMobile]);

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
        willChange: 'transform, opacity'
      }}
    >
      <div className="loader-content h-full w-full bg-black overflow-hidden relative">
        <div className="loader-allStrips h-full w-full">
          {/* Enhanced Centered Beam Circle */}
          <div 
            className="beam-circle absolute bg-black rounded-full z-50 flex items-center justify-center"
            style={{
              width: beamSize.width,
              height: beamSize.height,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              willChange: 'transform, background-color'
            }}
          >
            <div 
              className="counter-number text-zinc-500 font-bold"
              style={{
                fontFamily: "'Notable', sans-serif",
                letterSpacing: '1px',
                willChange: 'opacity',
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
                  className={`strip1 h-4 w-[200vw] bg-[#070304] absolute ${position} rotate-45 overflow-hidden`}
                  style={{ willChange: 'width, opacity' }}
                >
                  <div className="strip-text-animation whitespace-nowrap absolute w-[200%] left-0">
                    {Array.from({ length: isMobile ? 15 : 25 }, (_, i) => (
                      <span key={i} className="text-black/85 text-[12px] font-black px-2 tracking-wide inline-block">
                        LOADING
                      </span>
                    ))}
                  </div>
                </div>
                
                <div 
                  className={`strip2 h-4 w-[200vw] bg-[#070304] absolute ${position} -rotate-45 overflow-hidden`}
                  style={{ willChange: 'width, opacity' }}
                >
                  <div className="strip-text-animation-reverse whitespace-nowrap absolute w-[200%] left-0">
                    {Array.from({ length: isMobile ? 15 : 25 }, (_, i) => (
                      <span key={i} className="text-black/85 text-[12px] font-black px-2 tracking-wide inline-block">
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
              style={{ willChange: 'width, height, opacity' }}
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
                width: isMobile ? '200vw' : '2000px',
                willChange: 'width, opacity' 
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
                  width: isMobile ? '150vw' : '100vw',
                  willChange: 'width, opacity' 
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