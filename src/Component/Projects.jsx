import React, { useRef, useCallback, useEffect, useState, useMemo } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Sample video URLs - replace with your actual video URLs
const sampleVideos = {
  sparrow: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  rad: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  oochi: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  rejouice: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  works: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  twogood: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
};

function Projects() {
  const pinWrapperRef = useRef(null);
  const projectsContainerRef = useRef(null);
  const showcaseRef = useRef(null);
  const projectRefs = useRef([]);
  const animationContextRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [gridSettings, setGridSettings] = useState({ gap: 170, count: 28, cellSize: 170 });

  const projects = useMemo(() => [
    {
      id: "SparrowTeck",
      video: sampleVideos.sparrow,
      title: "SPARROWTECK PERFORMANCE",
      description: "Sparrowteck Performance is a high-performance eCommerce brand for custom bike sprockets. We built a seamless shopping experience with smooth animations and an engineering-first aesthetic—capturing the speed, strength, and spirit of the ride.",
      hashtags: "#ecommerce #content curation #art direction #copywriting #web design",
      reverse: false,
      url: "https://sparrow-teck-perfromance.vercel.app/",
    },
    {
      id: "Radian",
      video: sampleVideos.rad,
      title: "RADIAN MEDIA",
      description: "Radian Media helps agencies book high-quality appointments, charge more, and build a business that serves them. We created a high-converting site with smooth interactions and a bold, confident brand language.",
      hashtags: "#modern webdesign #ui/ux design #art direction #responsive design #web design",
      reverse: true,
      url: "https://radianmedia.org/",
    },
    {
      id: "Ochi",
      video: sampleVideos.oochi,
      title: "OCHI PRESENTATION",
      description: "Ochi is a strategic presentation agency for bold, future-focused companies. We crafted a sharp, minimal website with impactful typography, confident colors, and fluid GSAP animations to guide focus and elevate storytelling.",
      hashtags: "#DigitalExperienceDesign #ModernUIUX #StrategicBranding",
      reverse: false,
      hashtagsClass: "lowercase",
      url: "https://ochidesign-alpha.vercel.app/",
    },
    {
      id: "Rejouice",
      video: sampleVideos.rejouice,
      title: "REJOUICE AGENCY",
      description: "A thoughtfully designed and animated website that reflects our passion for clean visuals, smooth interactions, and intuitive experiences. From layout to motion, every element is carefully crafted to feel effortless yet engaging.",
      hashtags: "#copywriting #Inclusive Design #StrategicBranding",
      reverse: true,
      hashtagsClass: "lowercase",
      url: "https://rejouice-tawny.vercel.app/",
    },
    {
      id: "Works",
      video: sampleVideos.works,
      title: "WORKS STUDIO",
      description: "Works.Studio is a creative studio advancing culture through strategy and design. We built a high-impact, visually bold website with striking typography, fluid animations, and seamless UX—capturing the agency's artistic and strategic essence.",
      hashtags: "#Creative Studio #Minimal Design #BoldTypography #WebExperience Design",
      reverse: false,
      hashtagsClass: "lowercase",
      url: "https://works-studio-beta.vercel.app/",
    },
    {
      id: "Twogood",
      video: sampleVideos.twogood,
      title: "TWO GOOD CO",
      description: "Two Good Co is a purpose-driven eCommerce brand supporting women impacted by trauma. We designed a meaningful, high-performing website that showcases their products while telling a powerful story of social impact.",
      hashtags: "#Purpose Driven Design #eCommerce Development #Social Impact Brand #Inclusive Design",
      reverse: true,
      hashtagsClass: "lowercase",
      url: "https://twoo-good-co.vercel.app/",
    },
  ], []);

  // Mobile detection with resize listener
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const calculateGridSettings = useCallback(() => {
    const width = window.innerWidth;
    if (width < 640) return { gap: 80, count: 20, cellSize: 80 };
    if (width < 1024) return { gap: 120, count: 24, cellSize: 120 };
    return { gap: 170, count: 28, cellSize: 170 };
  }, []);

  const triggerShowcaseAnimations = useCallback(() => {
    const showcaseItems = showcaseRef.current?.querySelectorAll('[class*="-Showcase"]');
    if (!showcaseItems) return;

    showcaseItems.forEach((item, index) => {
      const faceEl = item.querySelector('[class*="-Face"]');
      const infoEl = item.querySelector('[class*="-Info"]');

      if (faceEl && infoEl) {
        gsap.to([faceEl, infoEl], {
          y: 0,
          opacity: 1,
          duration: 1.2,
          delay: index * 0.15,
          ease: 'power3.out',
        });
      }
    });
  }, []);

  const alignProjectsToGrid = useCallback((settings = gridSettings) => {
    if (isMobile) return; // Skip grid alignment on mobile
    
    requestAnimationFrame(() => {
      const pad = Math.round(settings.cellSize / 2);
      
      projectRefs.current.forEach((el) => {
        if (!el) return;
        
        Object.assign(el.style, {
          paddingLeft: `${pad}px`,
          paddingRight: `${pad}px`,
        });
      });

      requestAnimationFrame(() => {
        projectRefs.current.forEach((el) => {
          if (!el) return;
          const rect = el.getBoundingClientRect();
          el.style.minHeight = `${Math.max(4, Math.round(rect.height / settings.cellSize)) * settings.cellSize}px`;
        });
      });
    });
  }, [gridSettings, isMobile]);

  const createMobileAnimations = useCallback(() => {
    if (animationContextRef.current) {
      animationContextRef.current.revert();
    }

    const ctx = gsap.context(() => {
      projects.forEach((project) => {
        const faceEl = `.${project.id}-Face`;
        const infoEl = `.${project.id}-Info`;

        // Set initial state
        gsap.set([faceEl, infoEl], { 
          y: 50, 
          opacity: 0,
          transformOrigin: "center center"
        });

        // Create scroll trigger for mobile
        ScrollTrigger.create({
          trigger: `.${project.id}-Showcase`,
          start: "top 80%",
          end: "bottom 20%",
          onEnter: () => {
            gsap.to(faceEl, {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power2.out"
            });
            
            gsap.to(infoEl, {
              y: 0,
              opacity: 1,
              duration: 1,
              delay: 0.1,
              ease: "power2.out"
            });
          },
          onLeave: () => {
            gsap.to([faceEl, infoEl], {
              y: 50,
              opacity: 0,
              duration: 0.6,
              ease: "power2.in"
            });
          },
          onEnterBack: () => {
            gsap.to(faceEl, {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power2.out"
            });
            
            gsap.to(infoEl, {
              y: 0,
              opacity: 1,
              duration: 1,
              delay: 0.1,
              ease: "power2.out"
            });
          },
          onLeaveBack: () => {
            gsap.to([faceEl, infoEl], {
              y: 50,
              opacity: 0,
              duration: 0.6,
              ease: "power2.in"
            });
          }
        });
      });
    }, showcaseRef);

    animationContextRef.current = ctx;
  }, [projects]);

  const createDesktopAnimations = useCallback(() => {
    if (animationContextRef.current) {
      animationContextRef.current.revert();
    }

    const ctx = gsap.context(() => {
      projects.forEach((project) => {
        const triggerEl = `.${project.id}-Showcase`;
        const faceEl = `.${project.id}-Face`;
        const infoEl = `.${project.id}-Info`;

        gsap.set([faceEl, infoEl], { 
          y: 100, 
          opacity: 0,
          transformOrigin: "center center"
        });

        const animateIn = () => {
          gsap.to(faceEl, {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power2.out"
          });
          
          gsap.to(infoEl, {
            y: 0,
            opacity: 1,
            duration: 1.2,
            delay: 0.15,
            ease: "power2.out"
          });
        };

        const animateOut = () => {
          gsap.to([faceEl, infoEl], {
            y: 100,
            opacity: 0,
            duration: 0.8,
            ease: "power2.in"
          });
        };

        ScrollTrigger.create({
          trigger: triggerEl,
          start: "top 85%",
          end: "bottom 15%",
          onEnter: animateIn,
          onEnterBack: animateIn,
          onLeave: animateOut,
          onLeaveBack: animateOut
        });
      });
    }, showcaseRef);

    animationContextRef.current = ctx;
  }, [projects]);

  // Initialize animations based on device type
  useEffect(() => {
    if (isMobile) {
      createMobileAnimations();
    } else {
      alignProjectsToGrid();
      createDesktopAnimations();
    }

    return () => {
      if (animationContextRef.current) {
        animationContextRef.current.revert();
      }
    };
  }, [isMobile, alignProjectsToGrid, createMobileAnimations, createDesktopAnimations]);

  // Debounced resize handler
  useEffect(() => {
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const newSettings = calculateGridSettings();
        setGridSettings(newSettings);
        if (!isMobile) {
          alignProjectsToGrid(newSettings);
        }
        ScrollTrigger.refresh();
      }, 150);
    };

    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
    };
  }, [calculateGridSettings, alignProjectsToGrid, isMobile]);

  // Desktop scroll animation setup
  useGSAP(() => {
    if (isMobile) return;

    ScrollTrigger.getAll().forEach((st) => {
      if (st.vars?.id?.includes('projects-') || st.vars?.id?.includes('showcase-')) {
        st.kill();
      }
    });

    const elements = {
      top: document.getElementById('opening-top'),
      bottom: document.getElementById('opening-bottom'),
      topHead: document.getElementById('opening-top-head'),
      bottomHead: document.getElementById('opening-bottom-head'),
      centerText: document.getElementById('opening-center-text'),
    };

    if (!elements.top || !elements.bottom || !pinWrapperRef.current) return;

    gsap.set(Object.values(elements), {
      willChange: 'transform, opacity',
    });

    const projectsTl = gsap.timeline({
      scrollTrigger: {
        trigger: pinWrapperRef.current,
        start: 'top top',
        end: '+=500%',
        scrub: 0.6,
        pin: true,
        pinSpacing: true,
        id: 'projects-pin-animation',
        fastScrollEnd: true,
        preventOverlaps: true,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          if (self.progress > 0.15) {
            triggerShowcaseAnimations();
          }
        },
        onComplete: () => {
          gsap.set(Object.values(elements), {
            willChange: 'auto',
          });
        },
      },
    });

    projectsTl
      .to([elements.top, elements.topHead], {
        y: '-100%',
        duration: 0.2,
        ease: 'power2.inOut',
      }, 0)
      .to([elements.bottom, elements.bottomHead], {
        y: '100%',
        duration: 0.2,
        ease: 'power2.inOut',
      }, 0)
      .to(elements.centerText, {
        opacity: 1,
        top: '10rem',
        duration: 0.25,
        ease: 'power2.out',
      }, 0.05)
      .to(elements.centerText, {
        opacity: 0,
        duration: 0.1,
        ease: 'power2.in',
      }, 0.25)
      .set(elements.bottom, { display: 'none' }, 0.3)
      .to('.showcase-container', {
        y: '-85%',
        duration: 0.8,
        ease: 'power1.inOut',
      }, 0.2);

    let refreshTimeout;
    const debouncedRefresh = () => {
      clearTimeout(refreshTimeout);
      refreshTimeout = setTimeout(() => {
        ScrollTrigger.refresh(true);
      }, 100);
    };

    const resizeObserver = new ResizeObserver(debouncedRefresh);
    resizeObserver.observe(pinWrapperRef.current);
    window.addEventListener('resize', debouncedRefresh, { passive: true });

    return () => {
      clearTimeout(refreshTimeout);
      resizeObserver.disconnect();
      window.removeEventListener('resize', debouncedRefresh);
      projectsTl.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars?.id?.includes('projects-') || st.vars?.id?.includes('showcase-')) {
          st.kill();
        }
      });
    };
  }, {
    scope: projectsContainerRef,
    dependencies: [triggerShowcaseAnimations, isMobile],
  });

  const VisitButton = ({ url }) => (
    <div className="font-sans bg-gray-200 w-fit leading-none border border-gray-300 hover:scale-95 active:scale-100 px-4 py-1 rounded-full flex items-center justify-center gap-4 transition-all ease-in duration-300 group hover:bg-gray-800">
      <a href={url} target="_blank" rel="noopener noreferrer" className="relative h-14 flex items-center justify-center">
        <div className="flex flex-col items-center relative">
          <span className="font-bold text-gray-800 text-lg group-hover:translate-y-[-100%] group-hover:opacity-0 transition-all">
            Visit Website
          </span>
          <span className="absolute font-bold text-gray-200 text-lg opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-[100%] transition-all">
            Visit Website
          </span>
        </div>
      </a>
      <div className="p-3 rounded-full scale-50 group-hover:scale-100 transition-all group-hover:-rotate-45 bg-gray-800 text-gray-200 group-hover:bg-gray-200 group-hover:text-gray-800">
        →
      </div>
    </div>
  );

  return (
    <div id='work' className='bg-amber-950 w-full overflow-hidden' ref={projectsContainerRef}>
      <div className="project-content w-full">
        <div className="project-info bg-amber-900 min-h-fit w-full" />
        <div ref={pinWrapperRef} className="pin-wrapper relative w-full">
          <div className="project-opening relative h-screen w-full bg-amber-950">
            {/* Top */}
            <div id="opening-top" className='h-1/2 absolute z-20 top-0 left-0 w-full bg-gray-200 overflow-hidden'>
              <h2 className='absolute left-1/2 bottom-[10%] md:bottom-[13%] lg:bottom-[24%] -translate-x-1/2 leading-none text-[5vw] sm:text-[6vw] md:text-[3vw] text-amber-900/90 font-sans font-black'>
                FEW OF OUR PROJECT
              </h2>
              <h5
                id='opening-top-head'
                className='absolute left-[50%] -translate-x-1/2 translate-y-1/2 bottom-0 leading-none text-[13vw] text-center text-amber-900 font-sans font-black'
              >
                HIGHLIGHTS
              </h5>
            </div>

            {/* Center */}
            <div id='opening-center' className="relative w-full min-h-screen bg-amber-950 overflow-visible">
              <div id="opening-center-text" className="absolute left-1/2 -translate-x-1/2 text-center text-gray-200 font-sans text-[4vw] sm:text-[4vw] md:text-[3vw] lg:text-[2vw] opacity-0 whitespace-nowrap z-30">
                <p>A Curated showcase of digital experiences</p>
                <p className="font-serif text-[6vw] sm:text-[6vw] md:text-[4.5vw] lg:text-[3vw] leading-none text-gray-100">
                  We've crafted.
                </p>
              </div>

              <div className={`showcase-container relative z-10 w-full min-h-[600vh] overflow-visible ${isMobile ? 'pt-20' : 'pt-[60rem]'}`}>
                <div ref={showcaseRef} className="showcase-wrapper relative h-full w-full">
                  {/* Showcase Content */}
                  <div className="bg-amber-950 overflow-hidden py-32 w-full relative" id="showcase-section">
                    <div className="px-1 sm:px-6 md:px-16 lg:px-24 flex flex-col gap-24 md:gap-32 lg:gap-36 pt-32 justify-start items-start lg:justify-center lg:items-center w-full relative z-10">
                      {projects.map((project, index) => (
                        <div
                          key={project.id}
                          ref={(el) => (projectRefs.current[index] = el)}
                          className={`${project.id}-Showcase ${project.reverse ? "lg:flex-row-reverse" : "lg:flex-row"} flex flex-col items-start lg:items-center gap-6 md:gap-10 lg:gap-24 xl:gap-36 w-full max-w-[110%] ${project.reverse ? "lg:ml-auto" : "mx-auto"} mb-12 lg:mb-0`}
                        >
                          <div className={`${project.id}-Face w-full lg:w-1/2 rounded-2xl overflow-hidden relative`}>
                            <video
                              className="w-full h-auto lg:h-[90vh] object-cover object-center rounded-2xl transition-transform duration-500 hover:scale-105"
                              autoPlay
                              loop
                              muted
                              playsInline
                              preload="metadata"
                            >
                              <source src={project.video} type="video/mp4" />
                            </video>
                          </div>
                          <div className={`${project.id}-Info w-full lg:w-1/2 relative flex items-start lg:items-center`}>
                            <div className={`stick absolute h-[25vw] ${project.reverse ? "right-[-12px] lg:right-[-24px]" : "left-[-12px]"} hidden lg:block`}>
                              <div className="h-full w-full bg-white rounded-full opacity-80"></div>
                            </div>
                            <div className={`pl-0 sm:pl-4 md:pl-8 ${project.reverse ? "lg:pr-16 lg:pl-0" : "lg:pl-16"} text-gray-200`}>
                              <h3 
                                className={`${project.id}-Title font-black text-white font-sans capitalize whitespace-nowrap tracking-wide text-left text-xl md:text-2xl lg:text-3xl`}
                              >
                                {project.title}
                              </h3>
                              <p 
                                className={`${project.id}-About pt-4 md:pt-6 text-white/80 font-sans leading-tight text-left text-base md:text-lg lg:text-xl`}
                              >
                                {project.description}
                              </p>
                              <p 
                                className={`${project.id}-Hashtags py-6 text-zinc-300 md:py-10 font-mono leading-tight text-left text-sm md:text-base ${project.hashtagsClass || ""}`}
                              >
                                {project.hashtags}
                              </p>
                              <div className="flex justify-start">
                                <VisitButton url={project.url} />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom */}
            <div id="opening-bottom" className='h-1/2 absolute bottom-0 left-0 w-full z-20 bg-gray-200 overflow-hidden'>
              <h5
                id='opening-bottom-head'
                className='absolute left-[50%] -translate-x-1/2 -translate-y-1/2 leading-none text-[13vw] text-amber-900 font-sans font-black'
              >
                HIGHLIGHTS
              </h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Projects;