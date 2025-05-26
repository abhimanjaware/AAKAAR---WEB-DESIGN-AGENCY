import React, { useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Showcase from './Showcase';

gsap.registerPlugin(ScrollTrigger);

function Projects() {
  const pinWrapperRef = useRef(null);
  const projectsContainerRef = useRef(null);
  const timelineRef = useRef(null);

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

    // Enhanced ScrollTrigger configuration for better performance
    ScrollTrigger.config({ 
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load,resize",
      syncInterval: 30,
    });

    // Check if required elements exist
    const topElement = document.getElementById('opening-top');
    const bottomElement = document.getElementById('opening-bottom');
    const topHeadElement = document.getElementById('opening-top-head');
    const bottomHeadElement = document.getElementById('opening-bottom-head');
    const centerTextElement = document.getElementById('opening-center-text');

    if (!topElement || !bottomElement || !pinWrapperRef.current) {
      console.warn('Required elements not found for Projects animation');
      return;
    }

    // Set initial states for better performance
    gsap.set([topElement, bottomElement], { 
      willChange: "transform",
      force3D: true 
    });
    gsap.set([topHeadElement, bottomHeadElement], { 
      willChange: "transform",
      force3D: true 
    });
    gsap.set(centerTextElement, { 
      opacity: 0,
      willChange: "transform, opacity",
      force3D: true
    });

    const projectsTl = gsap.timeline({
      scrollTrigger: {
        trigger: pinWrapperRef.current,
        start: 'top top',
        end: '+=150%',
        scrub: {
          smoothing: 0.4,
        },
        pin: true,
        pinSpacing: true,
        id: "projects-pin-animation",
        fastScrollEnd: true,
        preventOverlaps: true,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onComplete: () => {
          // Clean up will-change for better performance after animation
          gsap.set([topElement, bottomElement, topHeadElement, bottomHeadElement, centerTextElement], {
            willChange: "auto"
          });
        }
      },
    });

    // Store timeline reference for cleanup
    timelineRef.current = projectsTl;

    // Your original animation sequence - optimized but unchanged in logic
    projectsTl.to('#opening-top', {
      y: "-100%",
      duration: 1,
      ease: "power2.inOut",
    }, 'open');

    projectsTl.to('#opening-bottom', {
      y: "100%",
      duration: 1,
      ease: "power2.inOut",
    }, 'open');

    projectsTl.to('#opening-top-head', {
      bottom: "-13%",
      ease: "power1.inOut",
      duration: 1,
    }, 'open');

    projectsTl.to('#opening-bottom-head', {
      top: "-18%",
      ease: "power1.inOut",
      duration: 1,
    }, 'open');

    // Make center text visible with animation
    projectsTl.to('#opening-center-text', {
      opacity: 1,
      top: "15rem", // Your original position
      duration: 2,
      ease: "power2.out",
    }, 'open+=0.2');

    projectsTl.to('#opening-bottom', {
      display: "none",
      duration: 0.1,
    }, 'open+=1.5');

    // Optimized refresh handling
    let refreshTimeout;
    const debouncedRefresh = () => {
      clearTimeout(refreshTimeout);
      refreshTimeout = setTimeout(() => {
        ScrollTrigger.refresh(true);
      }, 100);
    };

    // Use ResizeObserver for better performance than scroll listener
    const resizeObserver = new ResizeObserver(debouncedRefresh);
    if (pinWrapperRef.current) {
      resizeObserver.observe(pinWrapperRef.current);
    }

    // Also listen to window resize
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
    <div id='work' className='bg-[#1e110a]' ref={projectsContainerRef}>
      <div className="project-content w-full">
        <div className="project-info bg-[#27170e] min-h-fit "></div>

        <div ref={pinWrapperRef} className="pin-wrapper relative">
          <div className="project-opening relative h-screen w-full bg-[#1e110a]">
            
            {/* Top Opening - Your exact original design */}
            <div id="opening-top" className='h-1/2 absolute z-20 top-0 w-full bg-[#D9D9D9] overflow-hidden'>
              <h2 className='absolute left-1/2 bottom-[10%] md:bottom-[13%] lg:bottom-[24%] -translate-x-1/2 leading-0 text-[5vw] sm:text-[6vw] md:text-[3vw] text-[#27170e]/90 font-[Familjen_Grotesk] font-black'>FEW OF OUR PROJECT</h2>
              <h5 id='opening-top-head' className='absolute bottom-0 left-1/2 -translate-x-1/2 leading-0 text-[13vw] text-[#27170e] font-[Familjen_Grotesk] font-black'>HIGHLIGHTS</h5>
            </div>

            {/* Center Showcase + Text - Your exact original design */}
            <div id='opening-center' className="relative w-[100%] min-h-screen bg-[#e27738] ">
              
              {/* Center Text - Your exact original positioning */}
              <div id="opening-center-text" className="absolute left-1/2 -translate-x-1/2 text-center text-[#D9D9D9] font-[Familjen_Grotesk] text-[4vw] sm:text-[4vw] md:text-[3vw] lg:text-[2vw] opacity-0 whitespace-nowrap z-30">
                <p>A Curated showcase of digital experiences</p>
                <p className="font-[Tangerine] text-[6vw] sm:text-[6vw] md:text-[4.5vw] lg:text-[3vw] leading-none text-[#f4f0f0]">We've crafted.</p>
              </div>

              {/* Showcase - Your exact original positioning */}
              <div className="relative z-[-10] mt-[20rem]">
                <Showcase />
              </div>
            </div>

            {/* Bottom Opening - Your exact original design */}
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