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

  useEffect(() => {
    if (typeof sessionStorage === 'undefined') return;
    const hasShownLoader = sessionStorage.getItem('loaderShown');
    if (!hasShownLoader) {
      setShouldShowLoader(true);
      sessionStorage.setItem('loaderShown', 'true');
    }
  }, []);

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
    window.requestAnimationFrame(updateSize);
  }, []);

  useEffect(() => {
    if (!shouldShowLoader || typeof window === 'undefined') return;
    window.addEventListener('resize', handleResize, { passive: true });
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [shouldShowLoader, handleResize]);

  useEffect(() => {
    if (!shouldShowLoader || typeof document === 'undefined') return;
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Notable&display=swap';
    link.rel = 'stylesheet';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);

    const scrollY = window.scrollY;
    const body = document.body;
    const html = document.documentElement;
    const originalBodyOverflow = body.style.overflow;
    const originalBodyPosition = body.style.position;
    const originalBodyTop = body.style.top;
    const originalHtmlOverflow = html.style.overflow;

    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    html.style.overflow = 'hidden';

    return () => {
      if (link.parentNode === document.head) {
        document.head.removeChild(link);
      }
      body.style.overflow = originalBodyOverflow;
      body.style.position = originalBodyPosition;
      body.style.top = originalBodyTop;
      html.style.overflow = originalHtmlOverflow;
      window.scrollTo(0, scrollY);
    };
  }, [shouldShowLoader]);

  useEffect(() => {
    if (!shouldShowLoader) return;
    let animationId;
    let startTime = null;
    const totalDuration = 3500;

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
    return () => cancelAnimationFrame(animationId);
  }, [shouldShowLoader]);

  const stripPositions = useMemo(() => [
    "top-1/2", "bottom-1/3", "top-1/3", "bottom-1/6", "top-1/6",
    "top-full", "", "-bottom-1/6", "-top-1/6", "-bottom-1/3",
    "-top-1/3", "-bottom-1/2", "-top-1/2", "-bottom-2/3", "-top-2/3",
    "-bottom-5/6", "-top-5/6", "-bottom-full", "-top-full"
  ], []);

  const LoadingTextDisplay = useMemo(() => React.memo(({ isInverted = false }) => {
    const containerClass = isInverted ? "loader-movingtext-invert" : "loader-movingtext";
    return (
      <div className={containerClass} style={{ contentVisibility: 'auto' }}>
        {Array.from({ length: 15 }, (_, i) => (
          <span
            key={i}
            className="text-black/85 text-[12px] font-black px-2 tracking-wide"
            style={{
              willChange: 'transform',
              transform: 'translate3d(0, 0, 0)',
              backfaceVisibility: 'hidden'
            }}
          >
            LOADING
          </span>
        ))}
      </div>
    );
  }), []);

  useGSAP(() => {
    if (!shouldShowLoader) return;
    gsap.config({ force3D: true, autoSleep: 60, nullTargetWarn: false, autoKill: true });
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

    tl.fromTo([".strip1", ".strip2"], { width: 0 }, { width: "2900px", duration: 0.8, ease: "power2.inOut" });

    const stripAnimations = [
      { selector: '.web-horizontal', width: "2900px" },
      { selector: '.web-vertical', width: "100vh" },
      { selector: '.web-slantright', width: "2500px" },
      { selector: '.web-slantleft', width: "2500px" }
    ];

    stripAnimations.forEach(({ selector, width }) => {
      tl.fromTo(selector, { width: 0 }, { width, duration: 0.8, ease: 'power2.inOut', stagger: 0.03 }, 'z');
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
      tl.fromTo(selector, from, { ...to, duration: 0.8, ease: "power2.out" }, "x");
    });

    tl.fromTo(".beam-circle", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" }, "-=0.5");

    const textAnimations = [
      { selector: ".loader-movingtext", x: "-100%", duration: 90 },
      { selector: ".loader-movingtext-invert", x: "100%", duration: 90 },
      { selector: ".strip-text-animation", x: "-100%", duration: 40 },
      { selector: ".strip-text-animation-reverse", x: "100%", duration: 40 }
    ];

    textAnimations.forEach(({ selector, x, duration }) => {
      gsap.to(selector, { x, duration, repeat: -1, ease: "none", delay: selector.includes('strip') ? 0 : 1 });
    });
  }, [shouldShowLoader]);

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

  useGSAP(() => {
    if (startOutAnimation && shouldShowLoader) {
      const outTl = gsap.timeline({ onComplete: () => setShouldShowLoader(false) });
      const outAnimations = [
        { selector: ".web-horizontal", props: { width: 0, opacity: 0 } },
        { selector: ".web-vertical", props: { height: 0, opacity: 0 } },
        { selector: ".web-slantright, .web-slantleft", props: { width: 0, opacity: 0 } },
        { selector: ".strip1, .strip2", props: { width: 0, opacity: 0 } }
      ];
      outAnimations.forEach(({ selector, props }) => {
        outTl.to(selector, { ...props, duration: 1, ease: "power3.in", stagger: 0.03 }, 0);
      });
      outTl.to(".beam-circle", { scale: 1.2, duration: 0.2, ease: "power1.in" })
        .to(".beam-circle", { scale: 50, duration: 0.5, ease: "power2.in" })
        .to(".loader-content", { backgroundColor: "#ffffff", duration: 0.4, ease: "power2.in" }, "-=0.4")
        .to(".main-loader", { opacity: 0, duration: 0.5, ease: "power2.inOut" });
    }
  }, [startOutAnimation, shouldShowLoader]);

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

  if (!shouldShowLoader) return null;

  return (
    <div
      className="main-loader fixed inset-0 z-[9999] w-screen overflow-hidden"
      style={{
        height: 'calc(var(--vh, 1vh) * 100)',
        touchAction: 'none',
        overscrollBehavior: 'none',
        willChange: 'opacity',
        backfaceVisibility: 'hidden',
        transform: 'translate3d(0, 0, 0)'
      }}
    >
      {/* Add your beam-circle, strips, and JSX here to complete rendering */}
    </div>
  );
}

export default Loader;
