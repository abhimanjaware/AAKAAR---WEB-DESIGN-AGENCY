import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import c1 from "../assets/images/ChatGPT Image Apr 27, 2025, 01_36_57 PM.png";
import mainImage from "../assets/images/abhimanmain.jpg";

gsap.registerPlugin(ScrollTrigger);

function About() {
  const componentRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // Mobile detection with throttling
  useEffect(() => {
    let timeoutId;
    const checkMobile = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsMobile(window.innerWidth < 768);
      }, 100);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Setup animations
  useEffect(() => {
    if (!componentRef.current) return;

    if (isMobile) {
      // MOBILE: Faster, smoother fade-in animations
      gsap.utils.toArray(".mobile-animate").forEach(el => {
        gsap.from(el, {
          opacity: 0,
          y: 20,
          duration: 0.4,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el.closest('section') || componentRef.current,
            start: "top 75%",
            once: true
          }
        });
      });

      // Special animation for floating text
      const floatingText = [
        "#craft p", "#out p", "#webs p", "#leave p", "#impression p"
      ].map(sel => document.querySelector(sel)).filter(Boolean);
      
      if (floatingText.length > 0) {
        gsap.fromTo(floatingText, {
          opacity: 0,
          y: 30
        }, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#about-anime",
            start: "top 80%",
            once: true
          }
        });
      }

      // Force hardware acceleration
      gsap.set(".mobile-animate", { willChange: "opacity, transform" });
    } else {
      // DESKTOP: Original animations (completely unchanged)
      // Initial text animations
      gsap.fromTo(["#craft p", "#out p", "#webs p", "#leave p", "#impression p"], {
        opacity: 0,
        y: 40
      }, {
        opacity: 1,
        y: 0,
        stagger: 0.2,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "#about-anime",
          start: "top 85%",
          end: "bottom top",
          toggleActions: "play none none none"
        }
      });

      // Zoom animation
      const centerBox = document.querySelector(".center-box");
      if (centerBox) {
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
          },
        });

        tl.to(centerBox, {
          scale: finalScale,
          filter: "blur(12px)",
          ease: "linear",
          transformOrigin: "center center",
          zIndex: 50,
        }, 0)
        .to(".leftup-img:not(.center-box)", {
          opacity: 0,
          scale: 0.85,
          ease: "linear",
        }, 0)
        .to(".zoom-text", {
          opacity: 1,
          y: 0,
          ease: "power2.out",
          stagger: 3,
          zIndex: 100,
        }, 0.2)
        .to("#tagline", {
          opacity: 1,
          y: 0,
          ease: "power2.out",
          zIndex: 100,
        }, 0.35);
      }

      // Founder animation
      const elements = {
        meetTheLetters: document.querySelectorAll(".meet-the-letter"),
        founderLetters: document.querySelectorAll(".founder-letter"),
        abhimanImg: document.querySelector(".abhiman-image img"),
        paragraphs: document.querySelectorAll(".about-paragraph"),
        mail: document.querySelector(".abhiman-mail"),
        connect: document.querySelector(".abhiman-connect")
      };

      if (elements.meetTheLetters.length > 0) {
        gsap.set([elements.meetTheLetters, elements.founderLetters], {
          opacity: 0,
          y: 50,
          rotationY: 90
        });
        gsap.set([elements.abhimanImg, elements.paragraphs, elements.mail, elements.connect], {
          opacity: 0,
          y: 20
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ".founder-section",
            start: "top 60%",
            toggleActions: "play none none none"
          }
        });

        tl.to(elements.meetTheLetters, {
          opacity: 1,
          rotationY: 0,
          y: 0,
          duration: 0.6,
          stagger: 0.05,
          ease: "back.out(1.2)"
        })
        .to(elements.founderLetters, {
          opacity: 1,
          rotationY: 0,
          y: 0,
          duration: 0.6,
          stagger: 0.05,
          ease: "back.out(1.2)"
        }, "-=0.3")
        .to(elements.abhimanImg, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out"
        }, "-=0.4")
        .to(elements.paragraphs, {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.4,
          ease: "power2.out"
        }, "-=0.3")
        .to([elements.mail, elements.connect], {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out"
        }, "-=0.2");
      }
    }

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
      gsap.killTweensOf("*");
    };
  }, [isMobile]);

  return (
    <div ref={componentRef} className="about bg-[#1e110a] overflow-x-hidden">
      {/* Entry Screen */}
      <div className="about-moving bg-[#1e110a] h-fit md:h-[100vh] text-center">
        <div className='aakar-head w-full h-fit pt-16 flex flex-col items-center justify-center text-center leading-normal' />
        
        <div className="bg-[#1e110a] h-fit md:h-screen w-full flex flex-col justify-center py-[4rem] leading-tight text-[#D9D9D9] lg:px-[15rem] md:pb-[7rem]" id="about-anime">
          <div className="w-full flex justify-start" id="craft">
            <p className={`whitespace-nowrap text-[13vw] pl-2 lg:text-[7vw] tracking-tight font-black font-[Familjen_Grotesk] leading-none ${isMobile ? 'mobile-animate' : ''}`}>CRAFTING</p>
          </div>
          <div className="w-full" id="out">
            <p className={`whitespace-nowrap text-[21vw] lg:text-[11.5vw] tracking-normal font-[Tangerine] leading-none text-start pl-[3rem] lg:pl-[17rem] mt-[-50px] ${isMobile ? 'mobile-animate' : ''}`}>Outstanding</p>
          </div>
          <div id="webs">
            <p className={`whitespace-nowrap text-[12.5vw] lg:text-[6vw] tracking-tight font-black font-[Familjen_Grotesk] leading-none text-end pr-[18rem] ${isMobile ? 'mobile-animate' : ''}`}>WEBSITES</p>
          </div>
          <div id="leave">
            <p className={`whitespace-nowrap text-[12vw] lg:text-[7vw] tracking-tight font-black font-[Familjen_Grotesk] leading-none text-center ${isMobile ? 'mobile-animate' : ''}`}>THAT LEAVES A</p>
          </div>
          <div id="impression">
            <p className={`whitespace-nowrap text-[17vw] pl-16 lg:text-[10.5vw] tracking-normal font-[Tangerine] leading-none text-center lg:text-end lg:pr-[-5rem] ${isMobile ? 'mobile-animate' : ''}`}>Lasting Impression.</p>
          </div>
        </div>
      </div>

      {/* Scroll Section - Hidden on mobile */}
      {!isMobile && (
        <div className="about-wrapper overflow-hidden min-h-[400vh] relative hidden lg:block">
          <div className="about-content h-screen w-full relative z-10">
            {[
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
              }
            ].map((box, index) => (
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
      )}

      {/* About founder section */}
      <div id="about" className="abhiman min-h-screen w-full bg-[#100905] flex justify-center items-center overflow-hidden mt-0 md:mt-[-10rem]">
        <div className="founder-section w-full h-auto min-h-screen flex justify-center items-center pt-12 md:pt-18 lg:pt-42 relative">
          
          {/* Mobile layout */}
          {isMobile && (
            <div className="block md:hidden min-h-screen w-full">
              <div className="mobile-founder-container w-full flex flex-col items-start px-5 justify-start relative pt-12">
                <div className="mobile-title text-[#D9D9D9] text-start pb-2 w-full z-10 mobile-animate">
                  <h2 className="text-[14vw] leading-none font-[Roboto_flex] font-extrabold">
                    MEET THE
                    <h2 className="text-[15vw] leading-none pl-10">FOUNDER</h2>
                  </h2>
                </div>

                <div className="mobile-image w-[85%] h-[50vh] overflow-hidden relative mt-4 mobile-animate">
                  <img
                    className="w-full h-full object-cover object-center saturate-60"
                    src={mainImage}
                    alt="Abhiman image"
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                <div className="mobile-text-content w-[95%] pt-4 text-white/90 text-[19px] font-normal leading-relaxed capitalize font-[Familjen_Grotesk] text-left">
                  {[
                    <span key="p1" className="font-black text-start text-white mobile-animate">
                      I'm Abhiman Jaware, The founder of <span className="capitalize"><a href="">aakaar.digital.</a></span>
                    </span>,
                    <p key="p2" className="mobile-animate">a premium web design studio based in Nashik. With a refined eye for aesthetics and a passion for handcrafted code.</p>,
                    <p key="p3" className="mobile-animate">We create websites that do more than look good — they perform. We design digital experiences that boost your online presence.</p>,
                    <p key="p4" className="mobile-animate">Every brand has a story, and we bring it to life through clean code, timeless visuals, and thoughtful interaction. We specialize in web design and development for clients who care about details. Our goal is to create high-end web experiences that make your brand go from a 'ordinary' to a 'premium'.</p>
                  ]}
                </div>

                <div className="mobile-contact py-2">
                  <div className="abhiman-mail-mobile flex items-center gap-2 justify-start mb-4 mobile-animate">
                    <ion-icon name="mail-outline" />
                    <div className="mail py-2 text-base leading-none text-white font-normal text-left">
                      <a
                        href="mailto:abhimanjaware@gmail.com"
                        className="hover:text-[16.2px] py-1 transition-all ease-in duration-400 lowercase"
                      >
                        abhimanjaware@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="abhiman-connect-mobile cta-btn py-2 flex justify-start mobile-animate">
                   <div className="nav-Button bg-[#D9D9D9] w-fit leading-none border-[1px] border-[#D9D9D9]/30 hover:scale-[0.9] active:bg-[#D9D9D9] active:scale-[1] px-4 py-[2px] relative rounded-full flex items-center justify-center gap-4 overflow-hidden font-[Quicksand] transition-all ease-in duration-300 group hover:bg-[#27170e] focus-within:scale-95">
                          <a
                            href="https://wa.me/919689762896?text=Hi%20there%2C%20I%20visited%20your%20website%20and%20wanted%20to%20connect!"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative h-[3.2rem] flex items-center justify-center"
                          >
                            <div className="flex flex-col justify-center items-center relative">
                              <span className="block font-bold leading-none font-[Familjen_Grotesk] text-[4vw] transition-all ease-in duration-300 text-[#27170e] text-center tracking-tighter group-hover:translate-y-[-100%] group-focus:translate-y-[-100%] group-hover:opacity-0 group-focus:opacity-0 whitespace-nowrap">
                                Let's Connect
                              </span>
                              <span className="absolute font-bold leading-none font-[Familjen_Grotesk] text-[4vw] transition-all ease-in duration-300 group-active:text-[#27170e] text-[#D9D9D9] text-center tracking-tighter opacity-0 group-hover:opacity-100 group-focus:opacity-100 translate-y-[100%] group-hover:translate-y-0 group-focus:translate-y-0 whitespace-nowrap">
                                Let's Connect
                              </span>
                            </div>
                          </a>
                          <div className="px-4 py-4 rounded-full group-hover:-rotate-45 scale-[0.2] transition-all ease-in group-hover:duration-300 group-hover:scale-90 text-[#27170e] group-active:bg-[#27170e] group-active:text-[#D9D9D9] bg-[#27170e] group-hover:text-[#27170e] group-hover:bg-[#D9D9D9]">
                            <ion-icon name="arrow-forward-outline" size="small" />
                          </div>
                        </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Desktop layout */}
          {!isMobile && (
            <>
              {/* Tablet Layout */}
              <div className="hidden md:flex md:items-start lg:hidden min-h-screen w-full">
                <div className="tablet-founder-container w-full flex flex-col items-start px-8 justify-start relative">
                  <div className="tablet-title text-[#D9D9D9] text-start pb-1 w-full">
                    <h2 className="text-[11vw] leading-none font-[Roboto_flex] font-extrabold">
                      MEET THE
                      <h2 className="text-[11.5vw] leading-none pl-12">FOUNDER</h2>
                    </h2>
                  </div>

                  <div className="tablet-image w-[60%] h-[58vh] overflow-hidden my-6 mt-[28vw] relative">
                    <img
                      className="w-full h-full object-cover object-center saturate-70"
                      src={mainImage}
                      alt="Abhiman image"
                      loading="lazy"
                    />
                  </div>

                  <div className="tablet-text-content w-[77%] text-white/90 text-[24px] py-4 font-normal leading-relaxed capitalize font-[Familjen_Grotesk] text-left">
                    {[
                      <span key="p1" className="font-black text-start text-white">
                        I'm Abhiman Jaware, The founder of <span className="capitalize"><a href="">aakaar.digital.</a></span>
                      </span>,
                      "a premium web design studio based in Nashik. With a refined eye for aesthetics and a passion for handcrafted code.",
                      "We create websites that do more than look good — they perform. We design digital experiences that boost your online presence.",
                      "Every brand has a story, and we bring it to life through clean code, timeless visuals, and thoughtful interaction. We specialize in web design and development for clients who care about details. Our goal is to create high-end web experiences that make your brand go from a 'ordinary' to a 'premium'."
                    ].map((paragraph, index) => (
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
                            href="https://wa.me/919689762896?text=Hi%20there%2C%20I%20visited%20your%20website%20and%20wanted%20to%20connect!"
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

              {/* Desktop Layout */}
              <div className="hidden lg:flex lg:pb-[10rem] justify-center items-center">
                <div className="w-[85%] lg:w-[85%] lg:items-end hidden lg:flex flex-col lg:flex-row justify-center gap-32 items-center relative">
                  <div className="founder-container w-[25%] flex flex-col justify-start items-center lg:mr-12 mb-6 md:mb-0">
                    <div className="center-title text-[10vh] leading-none text-[#D9D9D9] text-center flex flex-col gap-0">
                      <div className="meet-the-part text-start leading-none w-[125%] pr-6 font-[Roboto_flex] font-extrabold whitespace-nowrap">
                        <span className="meet-the-letter">M</span>
                        <span className="meet-the-letter">E</span>
                        <span className="meet-the-letter">E</span>
                        <span className="meet-the-letter">T</span>
                        <span className="meet-the-letter">&nbsp;</span>
                        <span className="meet-the-letter">T</span>
                        <span className="meet-the-letter">H</span>
                        <span className="meet-the-letter">E</span>
                      </div>
                      <div className="founder-part leading-none pl-12 font-[Roboto_flex] font-extrabold whitespace-nowrap">
                        <span className="founder-letter">F</span>
                        <span className="founder-letter">O</span>
                        <span className="founder-letter">U</span>
                        <span className="founder-letter">N</span>
                        <span className="founder-letter">D</span>
                        <span className="founder-letter">E</span>
                        <span className="founder-letter">R</span>
                      </div>
                    </div>
                    <div className="abhiman-image center-image w-[25vw] h-[50vh] overflow-hidden mt-4 lg:mt-0 relative">
                      <img
                        className="w-full saturate-70 h-full"
                        style={{ objectFit: "cover", objectPosition: "bottom" }}
                        src={mainImage}
                        alt="Abhiman image"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  <div className="abhiman-dets lg:pb-[3rem] text-white/90 w-[45%] text-[1.3vw] font-normal leading-relaxed capitalize font-[Familjen_Grotesk] lg:ml-20 text-left overflow-hidden flex flex-col justify-center lg:justify-end lg:items-start">
                    <div className="flex flex-col items-start overflow-hidden">
                      {[
                        <span key="p1" className="font-black text-start text-white">
                          I'm Abhiman Jaware, The founder of <span className="capitalize"><a href="">aakaar.digital.</a></span>
                        </span>,
                        "a premium web design studio based in Nashik. With a refined eye for aesthetics and a passion for handcrafted code.",
                        "We create websites that do more than look good — they perform. We design digital experiences that boost your online presence.",
                        "Every brand has a story, and we bring it to life through clean code, timeless visuals, and thoughtful interaction. We specialize in web design and development for clients who care about details. Our goal is to create high-end web experiences that make your brand go from a 'ordinary' to a 'premium'."
                      ].map((paragraph, index) => (
                        <p key={index} className="about-paragraph leading-tight overflow-hidden mb-4">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                    <div className="abhiman-join relative mt-6">
                      <div className="abhiman-mail overflow-hidden flex items-center gap-3 justify-start">
                        <ion-icon name="mail-outline" />
                        <div className="mail py-6 text-xl leading-none text-white font-normal text-left">
                          <a 
                            href="mailto:abhimanjaware@gmail.com" 
                            className="hover:text-[20.2px] transition-all ease-in duration-400 lowercase"
                          >
                            abhimanjaware@gmail.com
                          </a>
                        </div>
                      </div>

                      <div className="abhiman-connect cta-btn flex justify-start">
                        <div className="nav-Button bg-[#D9D9D9] w-fit leading-none border-[1px] border-[#D9D9D9]/30 hover:scale-[0.9] active:bg-[#D9D9D9] active:scale-[1] px-4 py-[2px] relative rounded-full flex items-center justify-center gap-4 overflow-hidden font-[Quicksand] transition-all ease-in duration-300 group hover:bg-[#27170e] focus-within:scale-95">
                          <a 
                            href="https://wa.me/919689762896?text=Hi%20there%2C%20I%20visited%20your%20website%20and%20wanted%20to%20connect!" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="relative h-[3.5rem] flex items-center justify-center"
                          >
                            <div className="flex flex-col justify-center items-center relative">
                              <span className="block font-bold leading-none font-[Familjen_Grotesk] text-[1.1vw] transition-all ease-in duration-300 text-[#27170e] text-center tracking-tighter group-hover:translate-y-[-100%] group-focus:translate-y-[-100%] group-hover:opacity-0 group-focus:opacity-0 whitespace-nowrap">
                                Let's Connect
                              </span>
                              <span className="absolute font-bold leading-none font-[Familjen_Grotesk] text-[1.1vw] transition-all ease-in duration-300 group-active:text-[#27170e] text-[#D9D9D9] text-center tracking-tighter opacity-0 group-hover:opacity-100 group-focus:opacity-100 translate-y-[100%] group-hover:translate-y-0 group-focus:translate-y-0 whitespace-nowrap">
                                Let's Connect
                              </span>
                            </div>
                          </a>
                          <div className="px-4 py-[14px] rounded-full group-hover:-rotate-45 scale-[0.2] transition-all ease-in group-hover:duration-300 group-hover:scale-90 text-[#27170e] group-active:bg-[#27170e] group-active:text-[#D9D9D9] bg-[#27170e] group-hover:text-[#27170e] group-hover:bg-[#D9D9D9]">
                            <ion-icon name="arrow-forward-outline" size="small" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default About;