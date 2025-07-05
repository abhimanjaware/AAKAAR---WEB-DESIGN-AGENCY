import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import sparrow from "../assets/video/sparrowteck_showcase.mp4";
import rad from "../assets/video/radian_ahowcase.MOV";
import oochi from "../assets/video/oochi_shaowcase.mp4";
import rejouice from "../assets/video/rejouice_showcase.mov";
import works from "../assets/video/works_showcase.mp4";
import twogood from "../assets/video/twogood_showcase.mp4";
import stick from "../assets/images/white_sticker.png";

gsap.registerPlugin(ScrollTrigger);

function Showcase() {
  const showcaseRef = useRef(null);
  const projectRefs = useRef([]);
  const animationContextRef = useRef(null);
  const [gridSettings, setGridSettings] = useState({ gap: 170, count: 28, cellSize: 170 });
  const [isMobile, setIsMobile] = useState(false);

  const projects = useMemo(() => [
    {
      id: "SparrowTeck",
      video: sparrow,
      title: "SPARROWTECK PERFROMANCE",
      description: "Sparrowteck Performance is a high-performance eCommerce brand for custom bike sprockets. We built a seamless shopping experience with smooth animations and an engineering-first aesthetic—capturing the speed, strength, and spirit of the ride.",
      hashtags: "#ecommerce  #content curation #art direction #copywriting #web design ",
      reverse: false,
      url: "https://sparrow-teck-perfromance.vercel.app/",
    },
    {
      id: "Radian",
      video: rad,
      title: "RADIAN MEDIA",
      description: "Radian Media helps agencies book high-quality appointments, charge more, and build a business that serves them. We created a high-converting site with smooth interactions and a bold, confident brand language.",
      hashtags: "#modern webdesign  #ui/ux design  #art direction #responsive design #web design ",
      reverse: true,
      url: "https://radianmedia.org/",
    },
    {
      id: "Ochi",
      video: oochi,
      title: "OCHI PRESENTATION",
      description: "Ochi is a strategic presentation agency for bold, future-focused companies. We crafted a sharp, minimal website with impactful typography, confident colors, and fluid GSAP animations to guide focus and elevate storytelling.",
      hashtags: "#DigitalExperienceDesign #ModernUIUX #StrategicBranding",
      reverse: false,
      hashtagsClass: "lowercase",
      url: "https://ochidesign-alpha.vercel.app/",
    },
    {
      id: "Rejouice",
      video: rejouice,
      title: "REJOUICE AGENCY ",
      description: "A thoughtfully designed and animated website that reflects our passion for clean visuals, smooth interactions, and intuitive experiences.From layout to motion, every element is carefully crafted to feel effortless yet engaging. Built with React and GSAP.",
      hashtags: "#copywriting #Inclusive Design #StrategicBranding",
      reverse: true,
      hashtagsClass: "lowercase",
      url: "https://rejouice-tawny.vercel.app/",
    },
    {
      id: "Works",
      video: works,
      title: "WORKS STUDIO",
      description: "Works.Studio is a creative studio advancing culture through strategy and design. We built a high-impact, visually bold website with striking typography, fluid animations, and seamless UX—capturing the agency's artistic and strategic essence.",
      hashtags: "Creative Studio  #Minimal Design #BoldTypography #WebExperience Design",
      reverse: false,
      hashtagsClass: "lowercase",
      url: "https://works-studio-beta.vercel.app/",
    },
    {
      id: "Twogood",
      video: twogood,
      title: "TWO GOOD CO",
      description: "Two Good Co is a purpose-driven eCommerce brand supporting women impacted by trauma. We designed a meaningful, high-performing website that showcases their products while telling a powerful story of social impact and inspiring support.",
      hashtags: "#Purpose Driven Design #eCommerce Development #Social Impact Brand #Inclusive Design",
      reverse: true,
      hashtagsClass: "lowercase",
      url: "https://twoo-good-co.vercel.app/",
    },
  ], []);

  // Mobile detection with useEffect
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth <= 768 || 
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(isMobileDevice);
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

  const alignProjectsToGrid = useCallback((settings = gridSettings) => {
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
  }, [gridSettings]);

  const createScrollAnimations = useCallback(() => {
    if (animationContextRef.current) {
      animationContextRef.current.revert();
    }

    // Skip complex animations on mobile
    if (isMobile) {
      // Just set elements to visible state
      gsap.set([...document.querySelectorAll('[class*="-Face"], [class*="-Info"]')], {
        y: 0,
        opacity: 1
      });
      return;
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
          onLeaveBack: animateOut,
          markers: false
        });
      });
    }, showcaseRef);

    animationContextRef.current = ctx;
  }, [projects, isMobile]);

  // Debounced resize handler
  useEffect(() => {
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const newSettings = calculateGridSettings();
        setGridSettings(newSettings);
        alignProjectsToGrid(newSettings);
        if (!isMobile) {
          ScrollTrigger.refresh();
        }
      }, 150);
    };

    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
    };
  }, [calculateGridSettings, alignProjectsToGrid, isMobile]);

  // Initialize grid and animations
  useEffect(() => {
    alignProjectsToGrid();
    createScrollAnimations();

    return () => {
      if (animationContextRef.current) {
        animationContextRef.current.revert();
      }
    };
  }, [alignProjectsToGrid, createScrollAnimations]);

  const VisitButton = ({ url }) => (
    <div className="font-[Familjen_Grotesk] bg-[#D9D9D9] w-fit leading-none border border-[#D9D9D9]/30 hover:scale-95 active:scale-100 px-4 py-1 rounded-full flex items-center justify-center gap-4 transition-all ease-in duration-300 group hover:bg-[#27170e]">
      <a href={url} target="_blank" rel="noopener noreferrer" className="relative h-[3.5rem] flex items-center justify-center">
        <div className="flex flex-col items-center relative">
          <span className="font-bold text-[#27170e] text-[clamp(1rem,2.5vw,1.1rem)] group-hover:translate-y-[-100%] group-hover:opacity-0 transition-all">
            Visit Website
          </span>
          <span className="absolute font-bold text-[#D9D9D9] text-[clamp(1rem,2.5vw,1.1rem)] opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-[100%] transition-all">
            Visit Website
          </span>
        </div>
      </a>
      <div className="p-3 rounded-full scale-50 group-hover:scale-100 transition-all group-hover:-rotate-45 bg-[#27170e] text-[#D9D9D9] group-hover:bg-[#D9D9D9] group-hover:text-[#27170e]">
        <ion-icon name="arrow-forward-outline" size="small"></ion-icon>
      </div>
    </div>
  );

  return (
    <div 
      ref={showcaseRef} 
      className="bg-[#1e110a] overflow-hidden py-32 w-full relative" 
      id="showcase-section"
      style={{
        // Force hardware acceleration
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        perspective: '1000px'
      }}
    >
      <div className="px-1 sm:px-6 md:px-16 lg:px-24 flex flex-col gap-24 md:gap-32 lg:gap-36 pt-32 justify-start items-start lg:justify-center lg:items-center w-full relative z-10">
        {projects.map((project, index) => (
          <div
            key={project.id}
            ref={(el) => (projectRefs.current[index] = el)}
            className={`${project.id}-Showcase ${project.reverse ? "lg:flex-row-reverse" : "lg:flex-row"} flex flex-col items-start lg:items-center gap-6 md:gap-10 lg:gap-24 xl:gap-36 w-full max-w-[110%] ${project.reverse ? "lg:ml-auto" : "mx-auto"} mb-12 lg:mb-0`}
            style={{
              willChange: 'transform, opacity',
              transform: 'translateZ(0)'
            }}
          >
            <div 
              className={`${project.id}-Face w-full lg:w-1/2 rounded-2xl overflow-hidden relative`}
              style={{
                willChange: 'transform',
                transform: 'translateZ(0)'
              }}
            >
              <video
                className="w-full h-auto lg:h-[90vh] object-cover object-center rounded-2xl transition-transform duration-500 hover:scale-105"
                autoPlay
                loop
                muted
                playsInline
                preload={isMobile ? "none" : "metadata"}
                loading="lazy"
                disablePictureInPicture
              >
                <source src={project.video} type="video/mp4" />
              </video>
            </div>
            <div 
              className={`${project.id}-Info w-full lg:w-1/2 relative flex items-start lg:items-center`}
              style={{
                willChange: 'transform, opacity',
                transform: 'translateZ(0)'
              }}
            >
              {!isMobile && (
                <div className={`stick absolute h-[25vw] ${project.reverse ? "right-[-12px] lg:right-[-24px]" : "left-[-12px]"} hidden lg:block`}>
                  <img src={stick} alt="Sticker" className="h-full w-full" loading="lazy" />
                </div>
              )}
              <div className={`pl-0 sm:pl-4 md:pl-8 ${project.reverse ? "lg:pr-16 lg:pl-0" : "lg:pl-16"} text-[#D9D9D9]`}>
                <h3 
                  className={`${project.id}-Title font-black text-white font-[Familjen_Grotesk] capitalize whitespace-nowrap tracking-wide text-left`} 
                  style={{ fontSize: "clamp(1.2rem, 2vw, 1.7vw)" }}
                >
                  {project.title}
                </h3>
                <p 
                  className={`${project.id}-About pt-4 md:pt-6 text-white/80 font-[Familjen_Grotesk] leading-tight text-left`} 
                  style={{ fontSize: "clamp(1.2rem, 1.5vw, 1.2vw)" }}
                >
                  {project.description}
                </p>
                <p 
                  className={`${project.id}-Hashtags py-6 text-zinc-300 md:py-10 font-[Roboto_flex] leading-tight text-left ${project.hashtagsClass || ""}`} 
                  style={{ fontSize: "clamp(1.1rem, 1vw, 1.1vw)" }}
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
  );
}

export default Showcase;