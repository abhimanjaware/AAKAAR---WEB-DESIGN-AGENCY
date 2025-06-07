import React, { useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ShowcaseWrapper from './ShowcaseWrapper';

gsap.registerPlugin(ScrollTrigger);

function Projects() {
  const pinWrapperRef = useRef(null);
  const projectsContainerRef = useRef(null);
  const timelineRef = useRef(null);
  const showcaseRef = useRef(null);

  const killScrollTriggers = useCallback(() => {
    ScrollTrigger.getAll().forEach(st => {
      if (st.vars?.id?.includes("projects-") || st.vars?.id?.includes("showcase-")) {
        st.kill();
      }
    });
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {}, projectsContainerRef);

    return () => {
      ctx.revert();
      killScrollTriggers();
    };
  }, [killScrollTriggers]);

  useGSAP(() => {
    killScrollTriggers();

    ScrollTrigger.config({ 
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load,resize",
      syncInterval: 30,
    });

    const topElement = document.getElementById('opening-top');
    const bottomElement = document.getElementById('opening-bottom');
    const topHeadElement = document.getElementById('opening-top-head');
    const bottomHeadElement = document.getElementById('opening-bottom-head');
    const centerTextElement = document.getElementById('opening-center-text');

    if (!topElement || !bottomElement || !pinWrapperRef.current) {
      console.warn('Required elements not found for Projects animation');
      return;
    }

    gsap.set([topElement, bottomElement, topHeadElement, bottomHeadElement, centerTextElement], {
      willChange: 'transform, opacity',
      force3D: true
    });

    const projectsTl = gsap.timeline({
      scrollTrigger: {
        trigger: pinWrapperRef.current,
        start: 'top top',
        end: '+=500%', // Increased to provide more scroll space for showcase
        scrub: {
          smoothing: 0.5,
        },
        pin: true,
        pinSpacing: true,
        id: "projects-pin-animation",
        fastScrollEnd: true,
        preventOverlaps: true,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          // Trigger showcase animations based on scroll progress
          if (self.progress > 0.15 && showcaseRef.current) {
            triggerShowcaseAnimations();
          }
        },
        onComplete: () => {
          gsap.set([topElement, bottomElement, topHeadElement, bottomHeadElement, centerTextElement], {
            willChange: "auto"
          });
        }
      }
    });

    timelineRef.current = projectsTl;

    // Opening animation (first 20% of scroll)
    projectsTl.to('#opening-top', {
      y: "-100%",
      duration: 0.2,
      ease: "power2.inOut",
    }, 0);

    projectsTl.to('#opening-bottom', {
      y: "100%",
      duration: 0.2,
      ease: "power2.inOut",
    }, 0);

    projectsTl.to('#opening-top-head', {
      y: "-100%",
      ease: "power2.inOut",
      duration: 0.2,
    }, 0);

    projectsTl.to('#opening-bottom-head', {
      y: "100%",
      ease: "power2.inOut",
      duration: 0.2,
    }, 0);

    projectsTl.to('#opening-center-text', {
      opacity: 1,
      top: "10rem",
      duration: 0.25,
      ease: "power2.out",
    }, 0.05);

    // Fade out center text after it appears
    projectsTl.to('#opening-center-text', {
      opacity: 0,
      duration: 0.1,
      ease: "power2.in",
    }, 0.25);

    projectsTl.to('#opening-bottom', {
      display: "none",
      duration: 0.01,
    }, 0.3);

    // Showcase scroll animation (remaining 80% of scroll)
    projectsTl.to('.showcase-container', {
      y: '-85%', // Smooth scroll through showcase content
      duration: 0.8,
      ease: "power1.inOut",
    }, 0.2);

    // Function to trigger showcase animations based on scroll position
    const triggerShowcaseAnimations = () => {
      const showcaseItems = showcaseRef.current?.querySelectorAll('[class*="-Showcase"]');
      if (!showcaseItems) return;

      showcaseItems.forEach((item, index) => {
        const faceEl = item.querySelector('[class*="-Face"]');
        const infoEl = item.querySelector('[class*="-Info"]');
        
        if (faceEl && infoEl) {
          // Enhanced stagger animations with better easing
          gsap.to([faceEl, infoEl], {
            y: 0,
            opacity: 1,
            duration: 1.2,
            delay: index * 0.15,
            ease: "power3.out",
            force3D: true,
          });
        }
      });
    };

    let refreshTimeout;
    const debouncedRefresh = () => {
      clearTimeout(refreshTimeout);
      refreshTimeout = setTimeout(() => {
        ScrollTrigger.refresh(true);
      }, 100);
    };

    const resizeObserver = new ResizeObserver(debouncedRefresh);
    if (pinWrapperRef.current) {
      resizeObserver.observe(pinWrapperRef.current);
    }

    window.addEventListener('resize', debouncedRefresh, { passive: true });

    return () => {
      clearTimeout(refreshTimeout);
      resizeObserver.disconnect();
      window.removeEventListener('resize', debouncedRefresh);
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
      killScrollTriggers();
    };
  }, { scope: projectsContainerRef, dependencies: [killScrollTriggers] });

  return (
    <div id='work' className='bg-[#1e110a] w-full overflow-x-hidden' ref={projectsContainerRef}>
      <div className="project-content w-full block">
        <div className="project-info bg-[#27170e] min-h-fit w-full block" />

        <div ref={pinWrapperRef} className="pin-wrapper relative w-full block">
          <div className="project-opening relative h-screen w-full bg-[#1e110a] block">

            {/* Top Opening */}
            <div id="opening-top" className='h-1/2 absolute z-20 top-0 w-full bg-[#D9D9D9] overflow-hidden'>
              <h2 className='absolute left-1/2 bottom-[10%] md:bottom-[13%] lg:bottom-[24%] -translate-x-1/2 leading-0 text-[5vw] sm:text-[6vw] md:text-[3vw] text-[#27170e]/90 font-[Familjen_Grotesk] font-black'>FEW OF OUR PROJECT</h2>
              <h5 id='opening-top-head' className='absolute bottom-0 left-1/2 -translate-x-1/2 leading-0 text-[13vw] text-[#27170e] font-[Familjen_Grotesk] font-black'>HIGHLIGHTS</h5>
            </div>

            {/* Center Content */}
            <div id='opening-center' className="relative  w-full min-h-screen bg-[#27170e] block overflow-hidden">

              {/* Center Text */}
              <div id="opening-center-text" className="absolute left-1/2 -translate-x-1/2 text-center text-[#D9D9D9] font-[Familjen_Grotesk] text-[4vw] sm:text-[4vw] md:text-[3vw] lg:text-[2vw] opacity-0 whitespace-nowrap z-30">
                <p>A Curated showcase of digital experiences</p>
                <p className="font-[Tangerine] text-[6vw] sm:text-[6vw] md:text-[4.5vw] lg:text-[3vw] leading-none text-[#f4f0f0]">We've crafted.</p>
              </div>

              {/* Showcase Container */}
              <div className="showcase-container relative z-10 pt-[60rem] w-full min-h-[600vh] overflow-visible">
                <div ref={showcaseRef} className="showcase-wrapper relative h-full">
                  <ShowcaseWrapper disableScrollTriggers={true} />
                </div>
              </div>
            </div>

            {/* Bottom Opening */}
            <div id="opening-bottom" className='h-1/2 absolute bottom-0 w-full z-20 bg-[#D9D9D9] overflow-hidden'>
              <h5 id='opening-bottom-head' className='absolute top-0 left-1/2 -translate-x-1/2 leading-0 text-[13vw] text-[#27170e] font-[Familjen_Grotesk] font-black'>HIGHLIGHTS</h5>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Projects;