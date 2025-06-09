import React, { useEffect, useRef, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import c1 from "../assets/images/ChatGPT Image Apr 27, 2025, 01_36_57 PM.png";
import main from "../assets/images/abhimanmain.jpg";
import "../assets/images/abhimanalternate.jpg";

gsap.registerPlugin(ScrollTrigger);

function About() {
  // Refs for better performance
  const componentRef = useRef(null);
  const contextRefs = useRef([]);

  // Memoized box data to prevent recreation on every render
  const boxesData = useMemo(() => [
    {
      position: "w-[30%] h-[90vh] absolute top-[50%] translate-y-[-50%] left-0 sm:w-[40%] md:w-[35%] lg:w-[30%]",
      imgSrc: "https://i.pinimg.com/736x/32/04/a0/3204a0923c23d27a651420c8407e585d.jpg",
      isCenter: false,
    },
    {
      position: "w-[30%] h-[90vh] absolute top-[50%] left-[50%] -translate-y-[50%] -translate-x-[50%] z-50 sm:w-[50%] md:w-[45%] lg:w-[35%]",
      imgSrc: c1,
      isCenter: true,
    },
    {
      position: "w-[30%] h-[90vh] absolute top-[50%] translate-y-[-50%] right-0 sm:w-[40%] md:w-[35%] lg:w-[30%]",
      imgSrc: "https://i.pinimg.com/736x/6e/74/34/6e74348f55ed5379f8df0e2e37a4f0d7.jpg",
      isCenter: false,
    },
  ], [c1]);

  // Memoized content variations
  const contentVariations = useMemo(() => [
    {
      mainTitle: "THE FOUNDER",
      image: "https://i.pinimg.com/474x/42/43/36/42433638987f37168eb71dac6f9a998c.jpg",
      paragraphs: [
        "I'm Abhiman    Jaware, The founder of aakaar.digital.",
        "a premium web design studio based in Nashik. With a refined eye for aesthetics and a passion for handcrafted code.We create websites that do more than look good — they perform. We design digital experiences that boost your online presence. Every brand has a story, and we bring it to life through clean code, timeless visuals, and thoughtful interaction.Aakaar.digital represents the fusion of art and technology.",
        "Our studio specializes in crafting digital experiences that elevate brands to their highest potential.",
        "We focus on clean aesthetics, intuitive interfaces, and optimized performance.",
      ]
    },
  ], []);

  const aboutParagraphs = useMemo(() => [
    <span key="p1" className="font-black text-start bg-green-900  text-white">
      I'm Abhiman Jaware, The founder of <span className="capitalize"><a href="">aakaar.digital.</a></span>
    </span>,
    "a premium web design studio based in Nashik. With a refined eye for aesthetics and a passion for handcrafted code.",
    "We create websites that do more than look good — they perform. We design digital experiences that boost your online presence.",
    "Every brand has a story, and we bring it to life through clean code, timeless visuals, and thoughtful interaction."
  ], []);

  // Optimized touch handler
  const setupTouchInteractions = () => {
    const containers = ['.mobile-image', '.tablet-image', '.center-image'];
    
    containers.forEach(selector => {
      const container = document.querySelector(selector);
      if (!container) return;
      
      const images = container.querySelectorAll('img');
      if (images.length < 2) return;
      
      const handleTouch = (e) => {
        e.preventDefault();
        images[0].classList.toggle('opacity-0');
        images[1].classList.toggle('opacity-0');
      };
      
      container.addEventListener('touchstart', handleTouch, { passive: false });
    });
  };

  // Optimized text animation with will-change and transform3d
  const setupTextAnimation = () => {
    const selectors = ['#craft p', '#out p', '#webs p', '#leave p', '#impression p'];
    const elements = selectors.map(sel => document.querySelector(sel)).filter(Boolean);
    
    if (elements.length === 0) return;

    // Force hardware acceleration and optimize for transforms
    elements.forEach(el => {
      gsap.set(el, { 
        force3D: true,
        willChange: "transform",
        backfaceVisibility: "hidden",
        perspective: 1000
      });
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#about-anime",
        start: "top bottom",
        end: "bottom top",
        scrub: true, // Use boolean for smoother performance
        refreshPriority: -1,
        invalidateOnRefresh: true,
      }
    });

    // Optimized animations with transform3d
    const animations = [
      { element: elements[0], from: { x: -30, z: 0 }, to: { x: 50, z: 0 } },
      { element: elements[1], from: { x: 80, y: -10, z: 0 }, to: { x: 20, y: -10, z: 0 } },
      { element: elements[2], from: { x: 0, y: -25, z: 0 }, to: { x: 100, y: -25, z: 0 } },
      { element: elements[3], from: { x: 30, y: -25, z: 0 }, to: { x: -20, y: -25, z: 0 } },
      { element: elements[4], from: { x: 100, y: -25, z: 0 }, to: { x: -100, y: -25, z: 0 } },
    ];

    animations.forEach(({ element, from, to }) => {
      if (element) {
        tl.fromTo(element, from, { 
          ...to, 
          ease: "none", // Use 'none' for smoother scrub animations
          force3D: true
        }, 0);
      }
    });

    return tl;
  };

  // Optimized zoom animation
  const setupZoomAnimation = () => {
    const centerBox = document.querySelector(".center-box");
    const others = document.querySelectorAll(".leftup-img:not(.center-box)");
    const textElements = document.querySelectorAll(".zoom-text");
    const tagline = document.querySelectorAll("#tagline");
    const agencySection = document.querySelector(".agency-section");

    if (!centerBox) return;

    gsap.set(centerBox, { brightness: "100%" });

    const { width: boxWidth, height: boxHeight } = centerBox.getBoundingClientRect();
    const scaleX = window.innerWidth / boxWidth;
    const scaleY = window.innerHeight / boxHeight;
    const finalScale = Math.max(scaleX, scaleY);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".about-wrapper",
        start: "top top",
        end: "+=300%",
        scrub: 2.3,
        pin: ".about-content",
        anticipatePin: 1,
        refreshPriority: 1,
      },
    });

    tl.to(centerBox, {
      scale: finalScale,
      filter: "blur(12px)",
      ease: "linear",
      transformOrigin: "center center",
      zIndex: 50,
    }, 0)
    .to(others, {
      opacity: 0,
      scale: 0.85,
      ease: "linear",
    }, 0)
    .to(textElements, {
      opacity: 1,
      y: 0,
      ease: "power2.out",
      stagger: 3,
      zIndex: 100,
    }, 0.2)
    .to(tagline, {
      opacity: 1,
      y: 0,
      ease: "power2.out",
      zIndex: 100,
    }, 0.35);

    if (agencySection) {
      tl.to(agencySection, {
        opacity: 1,
        y: 0,
        ease: "power2.out",
        duration: 1,
      }, 0.8);
    }

    return tl;
  };

  // Optimized founder animation with mobile improvements
  const setupFounderAnimation = () => {
    const selectors = {
      centerContainer: ".center-animation-container",
      meetThePart: ".meet-the-part",
      meetTheLetters: ".meet-the-letter",
      founderLetters: ".founder-letter",
      detailsContainer: ".abhiman-dets",
      paragraphs: ".about-paragraph",
      finalContainer: ".founder-container",
      mobileContainer: ".mobile-founder-container",
      mobileParagraphs: ".mobile-paragraph",
      mobileTitle: ".mobile-title",
      mobileImage: ".mobile-image",
      mobileTextContent: ".mobile-text-content",
      abhimanImg: ".abhiman-image",
      abhimanMail: ".abhiman-mail",
      abhimanConnect: ".abhiman-connect",
      abhimanJoin: ".abhiman-join",
      mobileMail: ".abhiman-mail-mobile",
      mobileConnect: ".abhiman-connect-mobile"
    };

    const elements = {};
    Object.entries(selectors).forEach(([key, selector]) => {
      elements[key] = key.includes('Letters') || key.includes('Paragraphs') 
        ? document.querySelectorAll(selector)
        : document.querySelector(selector);
    });

    const isMobile = window.innerWidth < 768;

    // Set initial states with batch operations
    const initialStates = [
      [elements.abhimanJoin, { position: "relative", zIndex: 10 }],
      [elements.finalContainer, { opacity: 0 }],
      [elements.detailsContainer, { opacity: 0, y: 30 }],
      [elements.paragraphs, { opacity: 0, y: 20 }],
      [elements.meetThePart, { y: -10 }],
      [elements.meetTheLetters, { rotationY: 95, opacity: 0, y: 100 }],
      [elements.founderLetters, { rotationY: 95, opacity: 0, y: 150 }],
      [elements.abhimanImg, { opacity: 0 }],
      [elements.abhimanMail, { opacity: 0, y: 20 }],
      [elements.abhimanConnect, { opacity: 0, y: 20 }],
    ];

    if (elements.mobileContainer) {
      initialStates.push(
        [elements.mobileContainer, { opacity: 0 }],
        [elements.mobileTitle, { opacity: 0, y: -20 }],
        [elements.mobileImage, { opacity: 0, y: 30 }],
        [elements.mobileTextContent, { opacity: 0, y: 30 }],
        [elements.mobileParagraphs, { opacity: 0, y: 20 }],
        [elements.mobileMail, { opacity: 0, y: 20 }],
        [elements.mobileConnect, { opacity: 0, y: 20 }]
      );
    }

    initialStates.forEach(([element, props]) => {
      if (element) gsap.set(element, props);
    });

    // Calculate move position for desktop
    let moveX = 0;
    if (!isMobile && elements.finalContainer) {
      const finalRect = elements.finalContainer.getBoundingClientRect();
      const windowCenter = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      moveX = finalRect.left - windowCenter.x;
    }

    // Create optimized timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".founder-section",
        start: "top 60%",
        end: "bottom bottom",
        toggleActions: "play none none reverse",
        refreshPriority: 0,
      }
    });

    // Common animations
    tl.to(elements.meetTheLetters, {
      opacity: 1,
      rotationY: 0,
      x: isMobile ? 0 : -40,
      duration: 0.4,
      stagger: 0.04,
      ease: "power1.out",
      y: 15,
    })
    .to(elements.founderLetters, {
      opacity: 1,
      rotationY: 0,
      x: isMobile ? 0 : 26,
      duration: 0.5,
      stagger: 0.07,
      ease: "back.out(1.2)",
      y: -15,
      delay: -0.40
    }, "-=0.1")
    .to(elements.abhimanImg, {
      opacity: 1,
      duration: 0.4,
      y: -12,
      x: isMobile ? 0 : -10,
      ease: "power2.inOut",
      delay: -0.45
    }, "-=0.3");

    // Branch animations based on device
    if (isMobile) {
      // Mobile-optimized timeline with reduced delays for smoother performance
      const mobileAnimations = [
        [elements.centerContainer, { opacity: 0, duration: 0.3 }],
        [elements.mobileContainer, { opacity: 1, duration: 0.3 }],
        [elements.mobileTitle, { opacity: 1, y: 0, duration: 0.3 }],
        [elements.mobileImage, { opacity: 1, y: 0, duration: 0.3 }],
        [elements.mobileTextContent, { opacity: 1, y: 0, duration: 0.3 }],
        [elements.mobileParagraphs, { opacity: 1, y: 0, stagger: 0.08, duration: 0.25 }],
        [elements.mobileMail, { opacity: 1, y: 0, duration: 0.25 }],
        [elements.mobileConnect, { opacity: 1, y: 0, duration: 0.25 }]
      ];

      mobileAnimations.forEach(([element, props], index) => {
        if (element) {
          const offset = index < 2 ? "-=0.15" : "-=0.1";
          tl.to(element, { ...props, ease: "power2.out" }, offset);
        }
      });
    } else {
      // Desktop animations
      tl.to(elements.centerContainer, {
        x: moveX,
        duration: 1,
        ease: "power3.inOut",
      })
      .to(elements.finalContainer, { opacity: 1, duration: 0.4 }, "-=0.6")
      .to(elements.detailsContainer, { opacity: 1, y: 0, duration: 0.8 }, "-=0.4")
      .to(elements.paragraphs, {
        opacity: 1,
        y: 0,
        x: 10,
        stagger: 0.15,
        duration: 0.5,
        ease: "power2.out"
      }, "-=0.6")
      .to(elements.abhimanMail, { opacity: 1, x: 10, y: 0, duration: 0.3 }, "-=0.4")
      .to(elements.abhimanConnect, { opacity: 1, y: 0, x: 5, duration: 0.3 }, "-=0.3");
    }

    return tl;
  };

  // Optimized content switching
  const setupContentSwitching = () => {
    if (contentVariations.length <= 1) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".abhiman",
        start: "top top",
        endTrigger: ".emptyscreen:last-child",
        end: "top 50%",
        pin: true,
        pinSpacing: true,
        scrub: 1,
        refreshPriority: -1,
      }
    });

    contentVariations.forEach((content, index) => {
      if (index === 0) return;

      const sectionDuration = 1 / (contentVariations.length - 1);
      const startPoint = index - 1;

      // Batch DOM queries
      const elements = {
        title: document.querySelector(".abhiman-title h2 span:last-child"),
        image: document.querySelector(".founder-image img"),
        paragraphs: document.querySelectorAll(".about-paragraph")
      };

      tl.to(elements.title, { opacity: 0, y: -30, duration: 0.15 }, startPoint * sectionDuration)
        .to(elements.image, { opacity: 0, scale: 0.9, y: 500, duration: 0.15 }, startPoint * sectionDuration)
        .to(elements.paragraphs, { opacity: 0.5, y: -10, stagger: 0.03, duration: 0.15 }, startPoint * sectionDuration)
        .call(() => {
          // Batch DOM updates
          if (elements.title) elements.title.textContent = content.mainTitle;
          if (elements.image) {
            elements.image.src = content.image;
            elements.image.style.objectFit = "cover";
            elements.image.style.objectPosition = "center";
          }
          
          content.paragraphs.forEach((text, i) => {
            if (elements.paragraphs[i]) {
              if (i === 0) {
                elements.paragraphs[i].innerHTML = `<span class="font-black text-white">${text}</span>`;
              } else {
                elements.paragraphs[i].textContent = text;
              }
            }
          });
        }, null, startPoint * sectionDuration + 0.15)
        .to(elements.title, { opacity: 1, y: 0, duration: 0.15 }, startPoint * sectionDuration + 0.2)
        .to(elements.image, { opacity: 1, scale: 1, duration: 0.15 }, startPoint * sectionDuration + 0.2)
        .to(elements.paragraphs, { opacity: 1, y: 0, stagger: 0.05, duration: 0.15 }, startPoint * sectionDuration + 0.25);
    });

    return tl;
  };

  // Optimized resize handler with debouncing
  const setupResizeHandler = () => {
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
        
        // Only reload if switching between mobile/desktop
        if ((window.innerWidth < 768) !== (window.innerHeight > window.innerWidth)) {
          window.location.reload();
        }
      }, 100);
    };

    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
    };
  };

  // Main useEffect with optimized cleanup
  useEffect(() => {
    // Clear previous contexts
    contextRefs.current.forEach(context => context?.revert?.());
    contextRefs.current = [];

    const context = gsap.context(() => {
      // Setup all animations
      setupTouchInteractions();
      const textTl = setupTextAnimation();
      const zoomTl = setupZoomAnimation();
      const founderTl = setupFounderAnimation();
      const contentTl = setupContentSwitching();
      
      // Store timelines for cleanup
      contextRefs.current.push(textTl, zoomTl, founderTl, contentTl);
      
      // Batch ScrollTrigger refresh
      ScrollTrigger.batch(".about *", {
        onEnter: () => ScrollTrigger.refresh(),
        once: true
      });
      
    }, componentRef.current);

    const cleanupResize = setupResizeHandler();

    

    return () => {
      context.revert();
      cleanupResize();
      contextRefs.current.forEach(tl => tl?.kill?.());
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, [contentVariations]);

  return (
    <div ref={componentRef} className="about bg-[#1e110a] overflow-x-hidden">
      {/* Entry Screen */}
      <div className="about-moving bg-[#1e110a] h-fit md:h-[100vh] text-center">
        <div className='aakar-head w-full h-fit pt-16 flex flex-col items-center justify-center text-center leading-normal' />
        
        <div className="bg-[#1e110a] h-fit md:h-screen w-full flex flex-col justify-center py-[4rem] leading-tight text-[#D9D9D9] lg:px-[15rem] md:pb-[7rem]" id="about-anime">
          <div className="w-full flex justify-start" id="craft">
            <p className="whitespace-nowrap text-[13vw] pl-2 lg:text-[7vw] tracking-tight font-black font-[Familjen_Grotesk] leading-none transform-gpu will-change-transform">CRAFTING</p>
          </div>
          <div className="w-full" id="out">
            <p className="whitespace-nowrap text-[21vw] lg:text-[11.5vw] tracking-normal font-[Tangerine] leading-none text-start pl-[3rem] lg:pl-[17rem] mt-[-50px] transform-gpu will-change-transform">Outstanding</p>
          </div>
          <div id="webs">
            <p className="whitespace-nowrap text-[12.5vw] lg:text-[6vw] tracking-tight font-black font-[Familjen_Grotesk] leading-none text-end pr-[18rem] transform-gpu will-change-transform">WEBSITES</p>
          </div>
          <div id="leave">
            <p className="whitespace-nowrap text-[12vw] lg:text-[7vw] tracking-tight font-black font-[Familjen_Grotesk] leading-none text-center transform-gpu will-change-transform">THAT LEAVES A</p>
          </div>
          <div id="impression">
            <p className="whitespace-nowrap text-[17vw] pl-16 lg:text-[10.5vw] tracking-normal font-[Tangerine] leading-none text-center lg:text-end lg:pr-[-5rem] transform-gpu will-change-transform">Lasting Impression.</p>
          </div>
        </div>
      </div>

      {/* Scroll Section */}
      <div className="about-wrapper overflow-hidden min-h-[400vh] relative hidden lg:block">
        <div className="about-content h-screen w-full relative z-10">
          {boxesData.map((box, index) => (
            <div
              key={index}
              className={`leftup-img ${box.position} ${box.isCenter ? 'center-box' : ''} overflow-hidden flex items-center justify-center`}
            >
              <img
                className="w-full h-full object-cover"
                src={box.imgSrc}
                alt={`Box image ${index}`}
                loading={index === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}

          {/* Animated Text */}
          <div className="zoom-text absolute h-full w-full flex items-center justify-center flex-col text-center leading-none opacity-0 z-100">
            <a href="">
              <h2 id="about-head" className="text-white text-[5vw] leading-none font-black font-[Familjen_Grotesk]">
                AAKAAR
              </h2>
            </a>
            <p id="tagline" className="text-white leading-none tracking-widest font-bold text-[1.4vw] pt-3 pl-2 font-[Dancing_script]">
              Timeless Design. Rooted in Aesthetic Intelligence.
            </p>
          </div>
        </div>
      </div>

           {/* About founder section with center animation - improved spacing and separate animations */}
<div id="about" className="abhiman min-h-screen w-full bg-[#100905] flex justify-center items-center overflow-hidden mt-0 md:mt-[-10rem]">
  <div className="founder-section  w-full h-auto min-h-screen flex justify-center items-center pt-12 md:pt-18 lg:pt-42 relative">
  
  {/* Mobile layout - for screens below md breakpoint */}
  <div className="md:hidden min-h-screen w-full">
    <div className="mobile-founder-container w-full flex flex-col items-start px-5 justify-start relative">
      {/* Title at top */}
      <div className="mobile-title text-[#D9D9D9] text-start pb-2 w-full z-10">
        <h2 className="text-[14vw] leading-none font-[Roboto_flex] font-extrabold">
          MEET THE
          <h2 className="text-[15vw] leading-none pl-10">FOUNDER</h2>
        </h2>
      </div>

      {/* Image placed below heading */}
      <div className="mobile-image w-[85%] sm:w-[60%] h-[50vh] sm:h-[50vh] overflow-hidden relative mt-4">
        <img
          className="w-full h-full object-cover object-center saturate-60 absolute top-0 left-0 transition-opacity duration-300 ease-in"
          src={main}
          alt="Abhiman image"
        />
        <img
          className="w-full h-full object-cover object-center  absolute top-0 left-0 opacity-0 active:opacity-100  focus:opacity-100 transition-opacity duration-300 ease-in"
          src={main}
          // style={{saturate:"50"}}
          // alt={main}
          tabIndex="0"
        />
        <div
          className="absolute top-0 left-0 w-full h-full z-10 cursor-pointer"
          onClick={(e) => {
            const container = e.currentTarget.parentElement;
            const images = container.querySelectorAll("img");
            images[0].classList.toggle("opacity-0");
            images[1].classList.toggle("opacity-0");
          }}
        />
      </div>

      {/* Text paragraphs below */}
      <div className="mobile-text-content w-[95%] pt-4 text-white/90 text-[19px] sm:text-lg font-normal leading-relaxed capitalize font-[Familjen_Grotesk] text-left">
        {aboutParagraphs.map((paragraph, index) => (
          <p key={index} className="mobile-paragraph leading-tight mb-3 sm:mb-4">
            {paragraph}
          </p>
        ))}

        <div className="mobile-contact py-2">
          <div className="abhiman-mail-mobile flex items-center gap-2 sm:gap-3 justify-start mb-4">
            <ion-icon name="mail-outline" />
            <div className="mail py-2 sm:py-3 text-base sm:text-lg leading-none text-white font-normal text-left">
              <a
                href="mailto:abhimanjaware@gmail.com"
                className="hover:text-[16.2px] py-1 transition-all ease-in duration-400 lowercase"
              >
                abhimanjaware@gmail.com
              </a>
            </div>
          </div>

          <div className="abhiman-connect-mobile cta-btn py-2 flex justify-start">
            <div className="nav-Button bg-[#D9D9D9] w-fit leading-none border-[1px] border-[#D9D9D9]/30 hover:scale-[0.9] active:bg-[#D9D9D9] active:scale-[1] px-3 sm:px-4 py-[2px] relative rounded-full flex items-center justify-center gap-3 sm:gap-4 overflow-hidden font-[Quicksand] transition-all ease-in duration-300 group hover:bg-[#27170e] focus-within:scale-95">
              <a
                href="https://sales.radianmedia.org"
                target="_blank"
                rel="noopener noreferrer"
                className="relative h-[2.5rem] sm:h-[3rem] flex items-center justify-center"
              >
                <div className="flex flex-col justify-center items-center relative">
                  <span className="block font-bold leading-none font-[Familjen_Grotesk] text-[4vw] sm:text-[3vw] text-[#27170e] text-center tracking-tighter group-hover:translate-y-[-100%] group-focus:translate-y-[-100%] group-hover:opacity-0 group-focus:opacity-0 whitespace-nowrap">
                    Let's Connect
                  </span>
                  <span className="absolute font-bold leading-none font-[Familjen_Grotesk] text-[4vw] sm:text-[3vw] transition-all ease-in duration-300 group-active:text-[#27170e] text-[#D9D9D9] text-center tracking-tighter opacity-0 group-hover:opacity-100 group-focus:opacity-100 translate-y-[100%] group-hover:translate-y-0 group-focus:translate-y-0 whitespace-nowrap">
                    Let's Connect
                  </span>
                </div>
              </a>
              <div className="px-3 sm:px-4 py-[10px] sm:py-[14px] rounded-full group-hover:-rotate-45 scale-[0.2] transition-all ease-in group-hover:duration-300 group-hover:scale-90 text-[#27170e] group-active:bg-[#27170e] group-active:text-[#D9D9D9] bg-[#27170e] group-hover:text-[#27170e] group-hover:bg-[#D9D9D9]">
                <ion-icon name="arrow-forward-outline" size="small" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Tablet Layout */}
  <div className="hidden md:flex md:items-start lg:hidden min-h-screen w-full">
    <div className="tablet-founder-container w-full flex flex-col items-start px-8 justify-start relative">
      {/* Title */}
      <div className="tablet-title text-[#D9D9D9] text-start pb-1 w-full">
        <h2 className="text-[11vw] leading-none font-[Roboto_flex] font-extrabold">
          MEET THE
          <h2 className="text-[11.5vw] leading-none pl-12">FOUNDER</h2>
        </h2>
      </div>

      {/* Image (with margin instead of padding) */}
      <div className="tablet-image w-[60%] h-[58vh] overflow-hidden my-6 mt-[28vw] relative">
        <img
          className="w-full h-full object-cover object-center saturate-70 hover:saturate-70 hover:scale-[1.01] transition-all ease-in duration-300 absolute top-0 left-0"
          src={main}

          alt="Abhiman image"
        />
        <img
          className="w-full h-full object-cover object-center absolute top-0 left-0 opacity-0 hover:opacity-100 active:opacity-100 focus:opacity-100 transition-opacity duration-300 ease-in"
          src={main}

          alt="Abhiman main image"
          tabIndex="0"
        />
        <div
          className="absolute top-0 left-0 w-full h-full z-10 cursor-pointer"
          onClick={(e) => {
            const container = e.currentTarget.parentElement;
            const images = container.querySelectorAll("img");
            images[0].classList.toggle("opacity-0");
            images[1].classList.toggle("opacity-0");
          }}
        />
      </div>

      {/* Text */}
      <div className="tablet-text-content w-[77%] text-white/90 text-[24px] py-4 font-normal leading-relaxed capitalize font-[Familjen_Grotesk] text-left">
        {aboutParagraphs.map((paragraph, index) => (
          <p key={index} className="tablet-paragraph leading-tight mb-4">
            {paragraph}
          </p>
        ))}

        <div className="tablet-contact py-1">
          <div className="abhiman-mail-tablet flex items-center gap-3 justify-start mb-4">
            <ion-icon name="mail-outline" />
            <div className="mail py-4 text-lg leading-none text-white font-normal">
              <a
                href="mailto:abhimanjaware@gmail.com"
                className="hover:text-[18px] py-1 transition-all ease-in duration-400 lowercase"
              >
                abhimanjaware@gmail.com
              </a>
            </div>
          </div>

          <div className="abhiman-connect-tablet cta-btn py-2 flex justify-start">
            <div className="nav-Button bg-[#D9D9D9] w-fit leading-none border-[1px] border-[#D9D9D9]/30 hover:scale-[0.9] active:bg-[#D9D9D9] active:scale-[1] px-4 py-[2px] relative rounded-full flex items-center justify-center gap-4 overflow-hidden font-[Quicksand] transition-all ease-in duration-300 group hover:bg-[#27170e] focus-within:scale-95">
              <a
                href="https://sales.radianmedia.org"
                target="_blank"
                rel="noopener noreferrer"
                className="relative h-[3.2rem] flex items-center justify-center"
              >
                <div className="flex flex-col justify-center items-center relative">
                  <span className="block font-bold leading-none font-[Familjen_Grotesk] text-[2.5vw] transition-all ease-in duration-300 text-[#27170e] text-center tracking-tighter group-hover:translate-y-[-100%] group-focus:translate-y-[-100%] group-hover:opacity-0 group-focus:opacity-0 whitespace-nowrap">
                    Let's Connect
                  </span>
                  <span className="absolute font-bold leading-none font-[Familjen_Grotesk] text-[2.5vw] transition-all ease-in duration-300 group-active:text-[#27170e] text-[#D9D9D9] text-center tracking-tighter opacity-0 group-hover:opacity-100 group-focus:opacity-100 translate-y-[100%] group-hover:translate-y-0 group-focus:translate-y-0 whitespace-nowrap">
                    Let's Connect
                  </span>
                </div>
              </a>
              <div className="px-4 py-[12px] rounded-full group-hover:-rotate-45 scale-[0.2] transition-all ease-in group-hover:duration-300 group-hover:scale-90 text-[#27170e] group-active:bg-[#27170e] group-active:text-[#D9D9D9] bg-[#27170e] group-hover:text-[#27170e] group-hover:bg-[#D9D9D9]">
                <ion-icon name="arrow-forward-outline" size="small" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Desktop layout - only visible on lg screens and above */}

  {/* Center animation container - only visible during initial animation on large desktop screens */}
 <div className="flex justify-end  items-center ">
   <div className="center-animation-container  absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center z-50 lg:-translate-x-1/2 hidden lg:flex">
    <div className="center-title leading-none  text-[#D9D9D9] text-center flex flex-col gap-0">
      {/* Responsive text sizes for different screens */}
      <div className="meet-the-part  leading-none w-[125%] pr-6 font-[Roboto_flex] font-extrabold whitespace-nowrap">
        {["M", "E", "E", "T", "\u00A0", "T", "H", "E"].map((letter, index) => (
          <span key={index} className="meet-the-letter overflow-hidden leading-none text-[3rem] sm:text-[4rem] md:text-[5rem] lg:text-[5.22rem] inline-block">
            {letter}
          </span>
        ))}
      </div>
      <div className="founder-part leading-none pl-12 font-[Roboto_flex] font-extrabold whitespace-nowrap z-40">
        {["F", "O", "U", "N", "D", "E", "R"].map((letter, index) => (
          <span key={index} className="founder-letter overflow-hidden leading-none text-[3.5rem] sm:text-[4.5rem] md:text-[6rem] lg:text-[5.5rem] inline-block">
            {letter}
          </span>
        ))}
      </div>
    </div>
    <div className="abhiman-image center-image w-[50vw] sm:w-[40vw] lg:w-[25vw] h-auto lg:h-[50vh] overflow-hidden mt-4 lg:mt-0 relative">
      {/* First image (original) */}
      <img
        className="w-full saturate-70 hover:saturate-70 hover:scale-[1.01] transition-all ease-in duration-300 -z-10 h-full absolute top-0 left-0"
        style={{ objectFit: "cover", objectPosition: "bottom" }}
        src={main}

        alt="Abhiman image"
      />
      {/* Second image (replacement) - initially invisible */}
      <img
        className="w-full h-full opacity-0 hover:opacity-100 focus:opacity-100 active:opacity-100 transition-opacity ease-in duration-300 absolute top-0 left-0"
        style={{ objectFit: "cover", objectPosition: "bottom" }}
        src={main}
        alt="Abhiman main image"
        tabIndex="0"
      />
      {/* Empty div for maintaining aspect ratio and dimensions */}
      <div className="w-full h-0 pb-[100%] lg:pb-0 lg:h-full" />
    </div>
  </div>

  <div className="  w-[90%] sm:w-[85%] md:w-[90%] lg:w-[85%] hidden lg:flex flex-col lg:flex-row justify-center gap-8 sm:gap-16 md:gap-12 lg:gap-32 items-center lg:items-center lg:pt-8 relative">
    {/* Left side with founder title and image */}
    <div className="founder-container  w-full sm:w-[70%] md:w-[35%] lg:w-[25%] flex flex-col justify-start items-center md:mr-6 lg:mr-12 mb-6 md:mb-0" />

    {/* Right side with text */}
    <div className="abhiman-dets text-white/90 w-full sm:w-[80%] md:w-[55%] lg:w-[45%] text-base sm:text-lg md:text-lg lg:text-xl xl:text-[1.2vw] font-normal leading-relaxed capitalize font-[Familjen_Grotesk] md:ml-4 lg:ml-20 text-left overflow-hidden flex flex-col justify-center lg:justify-start lg:items-start lg:pb-8">
      {/* Desktop paragraphs */}
      <div className="flex flex-col items-start overflow-hidden">
        {aboutParagraphs.map((paragraph, index) => (
          <p key={index} className="about-paragraph leading-tight overflow-hidden mb-3 sm:mb-4">
            {paragraph}
          </p>
        ))}
      </div>
      <div className="abhiman-join relative mt-4 sm:mt-6">
        <div className="abhiman-mail overflow-hidden flex items-center gap-2 sm:gap-3 justify-start">
          <ion-icon name="mail-outline" />
          <div className="mail py-4 sm:py-6 text-base sm:text-lg md:text-lg lg:text-xl leading-none text-white font-normal text-left">
            <a 
              href="mailto:abhimanjaware@gmail.com" 
              className="hover:text-[20.2px] transition-all ease-in duration-400 lowercase"
            >
              abhimanjaware@gmail.com
            </a>
          </div>
        </div>

        <div className="abhiman-connect cta-btn flex justify-start">
          <div className="nav-Button bg-[#D9D9D9] w-fit leading-none border-[1px] border-[#D9D9D9]/30 hover:scale-[0.9] active:bg-[#D9D9D9] active:scale-[1] px-3 sm:px-4 py-[2px] relative rounded-full flex items-center justify-center gap-3 sm:gap-4 overflow-hidden font-[Quicksand] transition-all ease-in duration-300 group hover:bg-[#27170e] focus-within:scale-95">
            <a 
              href="https://sales.radianmedia.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="relative h-[2.5rem] sm:h-[3rem] md:h-[3.2rem] lg:h-[3.5rem] flex items-center justify-center"
            >
              <div className="flex flex-col justify-center items-center relative">
                <span className="block font-bold leading-none font-[Familjen_Grotesk] text-[4vw] sm:text-[3vw] md:text-[1.8vw] lg:text-[1.1vw] transition-all ease-in duration-300 text-[#27170e] text-center tracking-tighter group-hover:translate-y-[-100%] group-focus:translate-y-[-100%] group-hover:opacity-0 group-focus:opacity-0 whitespace-nowrap">
                  Let's Connect
                </span>
                <span className="absolute font-bold leading-none font-[Familjen_Grotesk] text-[4vw] sm:text-[3vw] md:text-[1.8vw] lg:text-[1.1vw] transition-all ease-in duration-300 group-active:text-[#27170e] text-[#D9D9D9] text-center tracking-tighter opacity-0 group-hover:opacity-100 group-focus:opacity-100 translate-y-[100%] group-hover:translate-y-0 group-focus:translate-y-0 whitespace-nowrap">
                  Let's Connect
                </span>
              </div>
            </a>
            <div className="px-3 sm:px-4 py-[10px] sm:py-[14px] rounded-full group-hover:-rotate-45 scale-[0.2] transition-all ease-in group-hover:duration-300 group-hover:scale-90 text-[#27170e] group-active:bg-[#27170e] group-active:text-[#D9D9D9] bg-[#27170e] group-hover:text-[#27170e] group-hover:bg-[#D9D9D9]">
              <ion-icon name="arrow-forward-outline" size="small" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
 </div>

</div>
</div>

    </div>
  );
}

export default About;