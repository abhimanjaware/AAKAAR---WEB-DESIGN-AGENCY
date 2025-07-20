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
  const [isTablet, setIsTablet] = useState(false);
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

  // Device detection with resize listener
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => window.removeEventListener('resize', checkDevice);
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
    if (isMobile || isTablet) return; // Skip grid alignment on mobile and tablet
    
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
  }, [gridSettings, isMobile, isTablet]);

  const createMobileAnimations = useCallback(() => {
    if (animationContextRef.current) {
      animationContextRef.current.revert();
    }

    const ctx = gsap.context(() => {
      projects.forEach((project) => {
        const showcaseEl = `.${project.id}-Showcase`;
        const videoEl = `.${project.id}-Video`;
        const titleEl = `.${project.id}-Title`;
        const descEl = `.${project.id}-Description`;
        const hashtagsEl = `.${project.id}-Hashtags`;

        // Set initial state
        gsap.set([videoEl, titleEl, descEl, hashtagsEl], { 
          y: 30, 
          opacity: 0,
        });

        // Create scroll trigger for mobile
        ScrollTrigger.create({
          trigger: showcaseEl,
          start: "top 85%",
          end: "bottom 20%",
          onEnter: () => {
            gsap.to(videoEl, {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power2.out"
            });
            
            gsap.to(titleEl, {
              y: 0,
              opacity: 1,
              duration: 0.8,
              delay: 0.1,
              ease: "power2.out"
            });

            gsap.to(descEl, {
              y: 0,
              opacity: 1,
              duration: 0.8,
              delay: 0.2,
              ease: "power2.out"
            });

            gsap.to(hashtagsEl, {
              y: 0,
              opacity: 1,
              duration: 0.8,
              delay: 0.3,
              ease: "power2.out"
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
    if (isMobile || isTablet) {
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
  }, [isMobile, isTablet, alignProjectsToGrid, createMobileAnimations, createDesktopAnimations]);

  // Debounced resize handler
  useEffect(() => {
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const newSettings = calculateGridSettings();
        setGridSettings(newSettings);
        if (!isMobile && !isTablet) {
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
  }, [calculateGridSettings, alignProjectsToGrid, isMobile, isTablet]);

  // Desktop scroll animation setup
  useGSAP(() => {
    if (isMobile || isTablet) return;

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
    dependencies: [triggerShowcaseAnimations, isMobile, isTablet],
  });

  const VisitButton = ({ url }) => (
    <div className="font-sans w-fit leading-none border hover:scale-95 active:scale-100 px-4 py-1 rounded-full flex items-center justify-center gap-4 transition-all ease-in duration-300 group" style={{ backgroundColor: '#D9D9D9', borderColor: '#D9D9D9' }}>
      <a href={url} target="_blank" rel="noopener noreferrer" className="relative h-14 flex items-center justify-center">
        <div className="flex flex-col items-center relative">
          <span className="font-bold text-lg group-hover:translate-y-[-100%] group-hover:opacity-0 transition-all text-zinc-900/90">
            Visit Website
          </span>
          <span className="absolute font-bold text-lg opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-[100%] transition-all text-white">
            Visit Website
          </span>
        </div>
      </a>
      <div className="p-3 rounded-full scale-50 group-hover:scale-100 transition-all group-hover:-rotate-45 text-white" style={{ backgroundColor: '#27170e' }}>
        →
      </div>
    </div>
  );

  // Mobile/Tablet Layout
  if (isMobile || isTablet) {
    return (
      <div id='work' className='w-full overflow-hidden' style={{ backgroundColor: '#27170e' }} ref={projectsContainerRef}>
        <div className="px-4 sm:px-6 md:px-8 py-12 sm:py-16">
          {/* Mobile Header */}
          <div className="text-left mb-12 sm:mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white font-sans mb-4">
              OUR PROJECTS
            </h2>
            <p className="text-lg sm:text-xl text-white font-sans">
              A curated showcase of our finest work
            </p>
          </div>

          {/* Mobile Projects Grid */}
          <div ref={showcaseRef} className="space-y-12 sm:space-y-16 md:space-y-20">
            {projects.map((project, index) => (
              <div
                key={project.id}
                ref={(el) => (projectRefs.current[index] = el)}
                className={`${project.id}-Showcase rounded-2xl p-4 sm:p-6 md:p-8 border`}
                style={{ backgroundColor: '#D9D9D9', borderColor: '#27170e' }}
              >
                {/* Video */}
                <div className={`${project.id}-Video mb-6 rounded-xl overflow-hidden`}>
                  <video
                    className="w-full aspect-video object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                  >
                    <source src={project.video} type="video/mp4" />
                  </video>
                </div>

                {/* Content */}
                <div className="space-y-4 sm:space-y-5 text-left">
                  <h3 className={`${project.id}-Title text-xl sm:text-2xl md:text-3xl font-black font-sans tracking-wide text-zinc-900/90`}>
                    {project.title}
                  </h3>
                  
                  <p className={`${project.id}-Description text-sm sm:text-base md:text-lg leading-relaxed font-sans text-zinc-900/90`}>
                    {project.description}
                  </p>
                  
                  <p className={`${project.id}-Hashtags text-xs sm:text-sm font-mono leading-relaxed text-zinc-900/90 ${project.hashtagsClass || ""}`}>
                    {project.hashtags}
                  </p>

                  {/* Visit Button - Mobile Optimized */}
                  <div className="pt-2 flex justify-start">
                    <div className="w-fit leading-none border px-3 py-2 sm:px-4 sm:py-3 rounded-full transition-all duration-300" style={{ backgroundColor: '#27170e', borderColor: '#27170e' }}>
                      <a 
                        href={project.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="font-bold text-white text-sm sm:text-base font-sans"
                      >
                        Visit Website →
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Desktop Layout (Original with new color theme)
  return (
    <div id='work' className='w-full overflow-hidden' style={{ backgroundColor: '#27170e' }} ref={projectsContainerRef}>
      <div className="project-content w-full">
        <div className="project-info min-h-fit w-full" style={{ backgroundColor: '#27170e' }} />
        <div ref={pinWrapperRef} className="pin-wrapper relative w-full">
          <div className="project-opening relative h-screen w-full" style={{ backgroundColor: '#27170e' }}>
            {/* Top */}
            <div id="opening-top" className='h-1/2 absolute z-20 top-0 left-0 w-full overflow-hidden' style={{ backgroundColor: '#D9D9D9' }}>
              <h2 className='absolute left-1/2 bottom-[10%] md:bottom-[13%] lg:bottom-[24%] -translate-x-1/2 leading-none text-[5vw] sm:text-[6vw] md:text-[3vw] font-sans font-black text-zinc-900/90'>
                FEW OF OUR PROJECT
              </h2>
              <h5
                id='opening-top-head'
                className='absolute left-[50%] -translate-x-1/2 translate-y-1/2 bottom-0 leading-none text-[13vw] text-center font-sans font-black text-zinc-900/90'
              >
                HIGHLIGHTS
              </h5>
            </div>

            {/* Center */}
            <div id='opening-center' className="relative w-full min-h-screen overflow-visible" style={{ backgroundColor: '#27170e' }}>
              <div id="opening-center-text" className="absolute left-1/2 -translate-x-1/2 text-center text-white font-sans text-[4vw] sm:text-[4vw] md:text-[3vw] lg:text-[2vw] opacity-0 whitespace-nowrap z-30">
                <p>A Curated showcase of digital experiences</p>
                <p className="font-serif text-[6vw] sm:text-[6vw] md:text-[4.5vw] lg:text-[3vw] leading-none text-white">
                  We've crafted.
                </p>
              </div>

              <div className="showcase-container relative z-10 w-full min-h-[600vh] overflow-visible pt-[60rem]">
                <div ref={showcaseRef} className="showcase-wrapper relative h-full w-full">
                  {/* Showcase Content */}
                  <div className="overflow-hidden py-32 w-full relative" id="showcase-section" style={{ backgroundColor: '#27170e' }}>
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
                              <div className="h-full w-full rounded-full opacity-80" style={{ backgroundColor: '#D9D9D9' }}></div>
                            </div>
                            <div className={`pl-0 sm:pl-4 md:pl-8 ${project.reverse ? "lg:pr-16 lg:pl-0" : "lg:pl-16"} text-white`}>
                              <h3 
                                className={`${project.id}-Title font-black text-white font-sans capitalize whitespace-nowrap tracking-wide text-left text-xl md:text-2xl lg:text-3xl`}
                              >
                                {project.title}
                              </h3>
                              <p 
                                className={`${project.id}-About pt-4 md:pt-6 text-white font-sans leading-tight text-left text-base md:text-lg lg:text-xl`}
                              >
                                {project.description}
                              </p>
                              <p 
                                className={`${project.id}-Hashtags py-6 text-white md:py-10 font-mono leading-tight text-left text-sm md:text-base ${project.hashtagsClass || ""}`}
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
            <div id="opening-bottom" className='h-1/2 absolute bottom-0 left-0 w-full z-20 overflow-hidden' style={{ backgroundColor: '#D9D9D9' }}>
              <h5
                id='opening-bottom-head'
                className='absolute left-[50%] -translate-x-1/2 -translate-y-1/2 leading-none text-[13vw] font-sans font-black text-zinc-900/90'
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