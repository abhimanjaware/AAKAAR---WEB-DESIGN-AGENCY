import React, { useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

function Loader() {
  const [shouldShowLoader, setShouldShowLoader] = useState(false);
  const [startOutAnimation, setStartOutAnimation] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const [beamColor, setBeamColor] = useState("black");
  
  // Check if loader should show (only once per session)
  useEffect(() => {
    const hasShownLoader = window.sessionStorage?.getItem('loaderShown');
    if (!hasShownLoader) {
      setShouldShowLoader(true);
      if (window.sessionStorage) {
        window.sessionStorage.setItem('loaderShown', 'true');
      }
    }
  }, []);

  const stripPositions = [
    "top-1/2", "bottom-1/3", "top-1/3", "bottom-1/6", "top-1/6", 
    "top-full", "", "-bottom-1/6", "-top-1/6", "-bottom-1/3", 
    "-top-1/3", "-bottom-1/2", "-top-1/2", "-bottom-2/3", "-top-2/3", 
    "-bottom-5/6", "-top-5/6", "-bottom-full", "-top-full"
  ];
  
  const LoadingTextDisplay = React.memo(({ isInverted = false }) => {
    const containerClass = isInverted ? "loader-movingtext-invert" : "loader-movingtext";
    
    return (
      <div className={containerClass}>
        {Array.from({ length: 30 }, (_, i) => (
          <span key={i} className="text-black/85 text-[15px] font-black px-2 tracking-wide">
            LOADING
          </span>
        ))}
      </div>
    );
  });
  
  useEffect(() => {
    if (!shouldShowLoader) return;

    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Notable&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);
    
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    const originalTop = document.body.style.top;
    const originalWidth = document.body.style.width;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    
    const scrollY = window.scrollY;
    
    Object.assign(document.body.style, {
      overflow: 'hidden',
      position: 'fixed',
      top: `-${scrollY}px`,
      width: '100%',
      height: '100%'
    });
    
    document.documentElement.style.overflow = 'hidden';
    
    return () => {
      link.remove();
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
      
      Object.assign(document.body.style, {
        overflow: originalOverflow,
        position: originalPosition,
        top: originalTop,
        width: originalWidth,
        height: ''
      });
      
      document.documentElement.style.overflow = originalHtmlOverflow;
      window.scrollTo(0, scrollY);
    };
  }, [shouldShowLoader]);
  
  useEffect(() => {
    if (!shouldShowLoader) return;

    let animationId;
    let currentValue = 0;
    const targetValue = 100;
    const increment = 1.4;
    
    const updateCounter = () => {
      currentValue += increment;
      if (currentValue >= targetValue) {
        setPercentage(100);
        setBeamColor("white");
        setTimeout(() => setStartOutAnimation(true), 500);
        return;
      }
      setPercentage(currentValue);
      animationId = requestAnimationFrame(updateCounter);
    };
    
    animationId = requestAnimationFrame(updateCounter);
    return () => cancelAnimationFrame(animationId);
  }, [shouldShowLoader]);
  
  useGSAP(() => {
    if (!shouldShowLoader) return;

    const tl = gsap.timeline();
    
    gsap.set([".strip1", ".strip2", ".web-horizontal", ".web-vertical", 
              ".web-slantright", ".web-slantleft", ".beam-circle"], {
      force3D: true,
      transformOrigin: "center center"
    });
    
    tl.fromTo([".strip1", ".strip2"], {
      width: 0,
    }, {
      width: "2900px",
      duration: 1,
      ease: "expo.in",
    });

    const stripAnimations = [
      { selector: '.web-horizontal', width: "2900px" },
      { selector: '.web-vertical', width: "100vh" },
      { selector: '.web-slantright', width: "2500px" },
      { selector: '.web-slantleft', width: "2500px" }
    ];
    
    stripAnimations.forEach(({ selector, width }) => {
      tl.fromTo(selector, { width: 0 }, { 
        width, 
        ease: 'circ.in', 
        stagger: 0.05 
      }, 'z');
    });
    
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
 
    tl.fromTo(".beam-circle", {
      scale: 0,
      opacity: 0
    }, {
      scale: 1,
      opacity: 1,
      duration: 0.5,
      ease: "power2.out"
    }, "-=0.5");

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
        delay: selector.includes('strip') ? 0 : 1,
        immediateRender: true
      });
    });
  }, [shouldShowLoader]);

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
        scale: 50,
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
  }, [startOutAnimation, shouldShowLoader]);

  // Don't render anything if loader shouldn't show
  if (!shouldShowLoader) {
    return null;
  }

  return (
    <div 
      className="main-loader fixed inset-0 z-[9999] w-screen overflow-hidden" 
      style={{
        height: 'calc(var(--vh, 1vh) * 100)',
        touchAction: 'none',
        overscrollBehavior: 'none'
      }}
    >
      <div className="loader-content h-full w-full bg-black overflow-hidden">
        <div className="loader-allStrips relative h-full flex justify-center">
          <div 
            className="beam-circle absolute w-44 h-44 bg-black rounded-full z-50 flex items-center justify-center"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              position: 'absolute'
            }}
          >
            <div 
              className="counter-number text-zinc-500 font-bold text-4xl md:text-5xl"
              style={{
                fontFamily: "'Notable', sans-serif",
                letterSpacing: '1px'
              }}
            >
              {Math.floor(percentage)}%
            </div>
          </div>

          <div className="bg-strip flex justify-center">
            {stripPositions.map((position, index) => (
              <React.Fragment key={index}>
                <div className={`strip1 h-4 w-[2900px] bg-[#070304] absolute ${position} rotate-45 overflow-hidden`}>
                  <div className="strip-text-animation whitespace-nowrap absolute w-[200%] left-0">
                    {Array.from({ length: 50 }, (_, i) => (
                      <span key={i} className="text-black/85 text-[12px] font-black px-2 tracking-wide inline-block">
                        LOADING
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className={`strip2 h-4 w-[2900px] bg-[#070304] absolute ${position} -rotate-45 overflow-hidden`}>
                  <div className="strip-text-animation-reverse whitespace-nowrap absolute w-[200%] left-0">
                    {Array.from({ length: 50 }, (_, i) => (
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
            <div className="web-vertical h-5 w-[100vh] flex absolute rotate-90 overflow-hidden top-1/2 left-1/2 -translate-x-1/2">
              <div className="web-vertical-1 h-full w-full bg-gradient-to-r from-yellow-400/40 to-black/50 lg:to-black/90 flex items-center justify-center overflow-hidden">
                <LoadingTextDisplay />
              </div>
              <div className="web-vertical-2 h-full w-full bg-gradient-to-l from-yellow-400/40 to-black/50 lg:to-black/90 flex items-center justify-center overflow-hidden">
                <LoadingTextDisplay isInverted={true} />
              </div>
            </div>

            <div className="web-horizontal h-5 w-[2000px] flex absolute top-1/2 overflow-hidden">
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
              <div key={index} className={`${className} h-5 w-[100vw] flex absolute top-1/2 ${rotation}`}>
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