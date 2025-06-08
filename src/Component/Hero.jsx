import { useRef, useState } from 'react';
import { useGSAP } from "@gsap/react";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import deskim from "../assets/images/hero-desk.png";
import mobim from "../assets/images/hero-mob.png";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const heroRef = useRef(null);
  const frameRef = useRef(null);
  const imageRef = useRef(null);
  const ctaRef = useRef(null);
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useGSAP(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();

    const tl = gsap.timeline();

    gsap.set(imageRef.current, {
      opacity: 0,
      scale: 1.08,
      y: 15
    });

    gsap.set(ctaRef.current, {
      opacity: 0,
      y: 50
    });

    tl.to(imageRef.current, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 1.6,
      ease: "power2.out",
      force3D: true
    }).to(ctaRef.current, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "back.out(1.7)",
      force3D: true
    }, "-=0.8");

    const waveAnimConfig = {
      transformOrigin: "center center",
      ease: "sine.inOut",
      force3D: true,
      overwrite: 'auto'
    };

    const baseScaleTween = gsap.to(imageRef.current, {
      scale: 1.02,
      duration: 8,
      ...waveAnimConfig,
      repeat: -1,
      yoyo: true,
      paused: true
    });

    baseScaleTween.play();

    gsap.fromTo(frameRef.current, {
      scale: isMobile ? 0.6 : 0.4,
      y: isMobile ? -300 : -600
    }, {
      scale: 1,
      y: isMobile ? 50 : 100,
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "50% top",
        scrub: 1,
        invalidateOnRefresh: true
      }
    });

    if (!('ontouchstart' in window)) {
      let mouseX = 0, mouseY = 0, lastX = 0, lastY = 0, animationId;
      let rect;

      const updateRect = () => {
        if (containerRef.current) {
          rect = containerRef.current.getBoundingClientRect();
        }
      };

      updateRect();

      const handleMouseMove = (e) => {
        if (!rect) updateRect();

        const { clientX, clientY } = e;
        const intensityFactor = window.innerWidth < 768 ? 5 : 15;
        mouseX = (((clientX - rect.left) / rect.width) - 0.5) * intensityFactor;
        mouseY = (((clientY - rect.top) / rect.height) - 0.5) * intensityFactor;

        if (!animationId) {
          animationId = requestAnimationFrame(updateElements);
        }
      };

      const updateElements = () => {
        lastX += (mouseX - lastX) * 0.06;
        lastY += (mouseY - lastY) * 0.06;

        if (imageRef.current) {
          gsap.to(imageRef.current, {
            x: lastX * 1.2,
            y: lastY * 1.2,
            rotationY: lastX * 0.03,
            rotationX: -lastY * 0.03,
            duration: 0.2,
            ease: "power1.out",
            force3D: true,
            overwrite: "auto"
          });
        }

        if (ctaRef.current) {
          gsap.to(ctaRef.current, {
            x: lastX * 0.4,
            y: lastY * 0.4,
            duration: 0.2,
            ease: "power1.out",
            force3D: true,
            overwrite: "auto"
          });
        }

        animationId = null;
        if (Math.abs(mouseX - lastX) > 0.01 || Math.abs(mouseY - lastY) > 0.01) {
          animationId = requestAnimationFrame(updateElements);
        }
      };

      const handleMouseEnter = () => {
        baseScaleTween.pause();

        if (imageRef.current) {
          gsap.to(imageRef.current, {
            scale: 1.09,
            duration: 0.8,
            overwrite: "auto"
          });
        }
      };

      const handleMouseLeave = () => {
        if (imageRef.current) {
          gsap.to(imageRef.current, {
            scale: 1.09,
            duration: 5,
            onComplete: () => {
              baseScaleTween.play();
            }
          });

          gsap.to(imageRef.current, {
            x: 0,
            y: 0,
            rotationX: 0,
            rotationY: 0,
            duration: 5,
            ease: "power2.inOut"
          });
        }

        if (ctaRef.current) {
          gsap.to(ctaRef.current, {
            x: 0,
            y: 0,
            duration: 1.4,
            ease: "power2.inOut"
          });
        }
      };

      if (containerRef.current) {
        containerRef.current.addEventListener('mousemove', handleMouseMove);
        containerRef.current.addEventListener('mouseenter', handleMouseEnter);
        containerRef.current.addEventListener('mouseleave', handleMouseLeave);
      }

      const handleResize = () => {
        checkMobile();
        updateRect();
        ScrollTrigger.refresh();
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (!('ontouchstart' in window) && containerRef.current) {
          containerRef.current.removeEventListener('mousemove', handleMouseMove);
          containerRef.current.removeEventListener('mouseenter', handleMouseEnter);
          containerRef.current.removeEventListener('mouseleave', handleMouseLeave);
        }
        if (animationId) {
          cancelAnimationFrame(animationId);
        }

        gsap.killTweensOf(imageRef.current);
        gsap.killTweensOf(ctaRef.current);
        baseScaleTween.kill();
      };
    }
  }, [isMobile]);

  return (
    <div ref={heroRef} className="relative w-full">
      <div ref={containerRef} className="hero bg-[#100905] h-screen w-full overflow-hidden">
        <div className="relative h-screen w-full">
          <div
            ref={imageRef}
            className="absolute inset-0 h-[110%] w-[110%] -left-[5%] -top-[5%] z-0"
            style={{ perspective: '1000px' }}
          >
            <img
              className="h-full w-full object-cover hidden lg:block object-center"
              src={deskim}
              alt="Hero background"
              style={{ filter: 'drop-shadow(10px 10px #555)' }}
            />
            <img
              className="h-full w-full object-cover lg:hidden object-center"
              src={mobim}
              alt="Hero background"
              style={{ filter: 'drop-shadow(10px 10px #555)' }}
            />
          </div>

          <div className="h-fit overflow-hidden">
            <div
              ref={ctaRef}
              className="absolute bottom-10 md:bottom-16 lg:bottom-27 left-1/2 transform -translate-x-1/2 text-center w-fit"
            >
              <div className="nav-Button bg-gradient-to-r from-[#161D27] to-[#243040] border-[1px] border-[#161D27]/30 hover:scale-[0.99] px-3 sm:px-4 md:px-5 py-1 rounded-full flex items-center justify-center gap-2 sm:gap-3 md:gap-4 font-[Quicksand] transition-all ease-cubic-bezier duration-500 group hover:bg-gradient-to-r hover:from-[#D9D9D9] hover:to-[#D9D9D9] focus-within:scale-[0.99] shadow-md hover:shadow-lg">
                <a
                  href="https://sales.radianmedia.org"
                  target="_blank"
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
          </div>

          <div ref={frameRef}></div>
        </div>
      </div>
    </div>
  );
}
