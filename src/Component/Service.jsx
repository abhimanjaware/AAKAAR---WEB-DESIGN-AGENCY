import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

function Service() {
  const cardsContainerRef = useRef(null);
  const cardRefs = useRef([]);
  const headingRef = useRef(null);
  const subheadingRef = useRef(null);
  const cardsWrapperRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Service cards data with unique images
  const services = [
    {
      id: "web-dev",
      title: <><span className='text-white'>WEBSITE</span> <br /> DESIGNING</>,
      description: <>Website : Brand's powerful voice. <span className='font-normal'>Our Expertise Shines.</span>"</>,
      hoverContent: <>Our web development services ensure your site doesn't just look great but performs seamlessly. With a <span className='text-white font-medium'>focus on speed, reliability, and user-friendly interfaces</span>, we create high-performance websites using the latest technologies.</>,
      image: "https://i.pinimg.com/736x/de/c3/ca/dec3ca638bdde241f60535f1f5f6fb60.jpg" // Web design image
    },
    {
      id: "uiux",
      title: <><span className='text-white'>UI/UX</span> <br /> DESIGNING</>,
      description: <>"Great design doesn't just look beautiful—it feels <span className='font-normal'>effortless</span>."</>,
      hoverContent: <>It's simple: Happy users are loyal users. A <span className='font-medium'>well-designed UX/UI</span> not only makes your site more enjoyable to use but directly impacts your conversion rates.</>,
      image: "https://i.pinimg.com/736x/86/fa/8f/86fa8f4c4d3095b3a6285c5ba19a63f0.jpg" // UI/UX image
    },
    {
      id: "ecom",
      title: <><span className='text-white'>E-COMMERCE</span> <br />SOLUTIONS</>,
      description: <>"Maximize your online store: <span className='font-normal'>More sales, more revenue.</span>"</>,
      hoverContent: <>More Sales = More Revenue. A seamless e-commerce experience can make or break a sale. We ensure that your store is optimized for conversions, with fast load times, <span className='font-medium'>easy navigation, and secure transactions.</span></>,
      image: "https://i.pinimg.com/236x/f6/07/74/f607746a5c42427d706d890bf610b514.jpg" // E-commerce image
    },
    {
      id: "seo",
      title: <> SEO & <span className='text-white text-[] '>PERFORMANCE OPTIMISATION</span></>,
      description: <>"Your website might be beautiful, but <span className='font-normal'>if it's not seen, it can't succeed</span>."</>,
      hoverContent: <>We don't just build pretty websites—we make sure they <span className='font-medium'>reach your audience</span>. Our SEO and performance optimization services ensure that your site ranks higher in search results and loads instantly.</>,
      image: "https://i.pinimg.com/736x/37/31/8f/37318f0ba9e315873af521edb2cb40ee.jpg" // SEO image
    },
    {
      id: "content",
      title: <> CONTENT <span className='whitespace-nowrap'>STRATEGY &</span> <br /><span className='text-white text-[] '>COPYWRITING.</span></>,
      description: <>"Words that sell. <span className='font-normal'>Content that connects</span>."</>,
      hoverContent: <>Great design needs great content. Our content strategy and copywriting services help tell your story in a way that <span className='font-medium'>engages, educates, and inspires action.</span></>,
      image: "https://i.pinimg.com/236x/87/dd/33/87dd33c929b6ee141fb3bd43d5ec0eb3.jpg" // Content image
    },
    {
      id: "brand",
      title: <>BRAND IDENTITY  <br /> <span className='text-white'>LOGO</span> DESIGN</>,
      description: <>Brand identity : <span className='font-normal'>Your business story at every touchpoint</span>.</>,
      hoverContent: <>It's simple: Happy users are loyal users. A <span className='font-medium'>well-designed UX/UI</span> not only makes your site more enjoyable to use but directly impacts your conversion rates.</>,
      image: "https://i.pinimg.com/736x/bd/f0/3e/bdf03ef4b82f104508b12a59945ae445.jpg"      // Brand image
    }
  ];

  // Initialize cardRefs
  useEffect(() => {
    // Pre-populate the refs array with the correct length
    cardRefs.current = Array(services.length).fill(null);
  }, []);

  // Setup animations after all components are mounted and images are loaded
  useEffect(() => {
    // Pre-load images to prevent layout shifts
    const imagePromises = services.map(service => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = service.image;
        img.onload = () => resolve();
        img.onerror = () => resolve(); // Handle errors gracefully
      });
    });

    // Wait for all images to load
    Promise.all(imagePromises).then(() => {
      setIsLoaded(true);
    });
  }, []);

  // Set up animations after everything is loaded
  useEffect(() => {
    if (!isLoaded) return;

    // Store animation timelines for cleanup
    let floatingTimeline;
    let scrollTriggerInstances = [];
    let masterTimeline;

    // Hide all elements initially
    gsap.set([headingRef.current, subheadingRef.current], {
      opacity: 0,
      y: 50
    });

    // Make sure cards are completely hidden initially
    gsap.set(cardRefs.current, {
      opacity: 0,
      y: 100
    });

    // Create master timeline for sequencing animations
    masterTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: cardsContainerRef.current,
        start: "top 70%",
        toggleActions: "play none none none",
      }
    });
    
    scrollTriggerInstances.push(masterTimeline.scrollTrigger);

    // 1. First add heading animations
    masterTimeline.to(headingRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out"
    });

    // 2. Add subheading animation with a slight delay
    masterTimeline.to(subheadingRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out"
    }, "-=0.3");

    // 3. Add cards animation after headings are done
    if (cardRefs.current.every(ref => ref)) {
      masterTimeline.to(cardRefs.current, {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power2.out",
        onComplete: startFloatingAnimation
      }, "-=0.2"); // Start slightly before the subheading animation fully completes
    }

    // Set up floating animation
    function startFloatingAnimation() {
      // Cancel any existing animations
      if (floatingTimeline) {
        floatingTimeline.kill();
      }

      // Create new timeline for wave animation
      floatingTimeline = gsap.timeline({
        repeat: -1,
        yoyo: true,
        defaults: {
          ease: "sine.inOut"
        }
      });

      // Add cards to timeline with progressive delays for wave effect
      cardRefs.current.forEach((card, index) => {
        const delay = index * 0.15;
        
        floatingTimeline.to(card, {
          y: "+=15",
          duration: 2,
          ease: "sine.inOut"
        }, delay);
      });

      // Make animation smoother
      floatingTimeline.timeScale(0.6);
    }

    // Add hover effects to cards
    cardRefs.current.forEach((card) => {
      // Store original positions
      const originalPosition = { y: 0, z: 1 };
      
      card.addEventListener('mouseenter', () => {
        // Only pause if animation exists
        if (floatingTimeline) {
          floatingTimeline.pause();
        }
        
        // Elevate current card and push down others
        gsap.to(cardRefs.current.filter(ref => ref !== card), {
          filter: 'blur(5px)',
          scale: 0.95,
          opacity: 0.7,
          duration: 0.4,
          ease: "power2.out",
          zIndex: 1
        });
        
        gsap.to(card, {
          scale: 1.05,
          filter: 'blur(0px)',
          opacity: 1,
          duration: 0.4,
          ease: "power2.out",
          zIndex: 10
        });
      });

      card.addEventListener('mouseleave', () => {
        // Reset position
        gsap.to(cardRefs.current, {
          filter: 'blur(0px)',
          scale: 1,
          opacity: 1,
          duration: 0.4,
          ease: "power2.out",
          zIndex: 1,
          onComplete: () => {
            // Resume animation after reset
            if (floatingTimeline) {
              floatingTimeline.play();
            }
          }
        });
      });
    });

    // Clean up all animations and event listeners
    return () => {
      if (floatingTimeline) {
        floatingTimeline.kill();
      }
      
      scrollTriggerInstances.forEach(st => {
        if (st) st.kill();
      });
      
      if (masterTimeline) {
        masterTimeline.kill();
      }

      ScrollTrigger.getAll().forEach(st => st.kill());
      gsap.killTweensOf(cardRefs.current);
      gsap.killTweensOf([headingRef.current, subheadingRef.current]);
      
      cardRefs.current.forEach((card) => {
        if (card) {
          card.removeEventListener('mouseenter', () => {});
          card.removeEventListener('mouseleave', () => {});
        }
      });
    };
  }, [isLoaded]);

  return (
    <>
    <div 
    id='services'
      className='bg-[#D9D9D9] flex flex-col flex-wrap min-h-screen  my-20 items-center justify-center p-4 md:p-8'
      ref={cardsContainerRef}
    >
      <div className="h-fit w-full text-center pb-2  pt-8 overflow-hidden">
        <h3 
          className='service-head text-[2rem] md:text-[3rem] text-[#27170e] pb-2 font-[Roboto_Flex] font-black tracking-wide leading-none overflow-hidden'
          ref={headingRef}
        >
          HERE'S WHAT <br /> WE ARE KNOW FOR
        </h3>
        <span 
          className='service-subhead text-zinc-900/90 font-[Dancing_Script] font-extralight text-[1.4rem] leading-none  md:text-[1.8rem] overflow-hidden'
          ref={subheadingRef}
        >
          Converting your brand into flawless aesthetics.
        </span>
      </div>

      <div 
        className="w-full max-w-[104rem] md:py-24 pb-12 flex  flex-wrap justify-center gap-6"
        ref={cardsWrapperRef}
      >
        {services.map((service, index) => (
          <div 
            key={service.id}
            className={`${service.id}-service h-96 w-full sm:w-[calc(100%-2rem)] md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1rem)]  rounded-xl justify-center flex flex-wrap group border-[.001px] border-zinc-800/30 overflow-hidden`}
            ref={el => cardRefs.current[index] = el}
            style={{ 
              zIndex: 1, 
              position: 'relative', 
              transform: 'translate3d(0, 0, 0)', // Force GPU acceleration
              opacity: 0 // Initially hidden
            }}
          >
            <div className="relative h-full w-full rounded-xl overflow-hidden">
              {/* Background image that gets 
              
              red on hover */}
              <div className="absolute inset-0 bg-gray-300 transition-all duration-700 opacity-100 group-hover:scale-[1.2] blur-[1.3px] ease-in-out group-hover:blur-[3.5px] ">
                <div className="h-full w-full bg-stone-700">
                  {/* Custom image for each card */}
                  <img 
                    src={service.image} 
                    alt={`${service.id} Service`} 
                    className="h-full w-full object-cover object-center" 
                    loading="eager" // Force immediate loading
                  />
                </div>
              </div>
             
              {/* Main content that moves up on hover */}
              <div className="absolute inset-0 transition-all duration-500 px-8 ease-in-out transform group-hover:-translate-y-full">
                <div className="h-full w-full flex items-center justify-center flex-col p-6">
                  <p className="font-black text-[2.7rem] leading-none text-center text-zinc-100/90">
                    {service.title}
                  </p>
                  <span className="font-light text-[18px] font-[Roboto_Flex] pt-5 pb-6 leading-none text-zinc-200 text-center">
                    {service.description}
                  </span>
                  <div className="service-btn block lg:hidden">
                    <div className="service-Button bg-[#D9D9D9] w-fit leading-none border-[1px] border-[#D9D9D9]/30 hover:scale-[0.9] active:bg-[#D9D9D9] active:scale-[1] px-4 py-0 relative rounded-full flex items-center justify-center gap-0 overflow-hidden font-[Quicksand] transition-all ease-in duration-300 group hover:bg-[#27170e] focus-within:scale-95">
                      <a href="https://sales.radianmedia.org" target="_blank" className="relative h-[.5rem] flex items-center justify-center">
                        <div className="flex flex-col justify-center items-center relative">
                          {/* First Text: Initially visible, moves up and becomes hidden on hover or focus */}
                          <span className="block font-bold leading-none font-[Familjen_Grotesk] transition-all ease-in duration-300 text-[#27170e] text-center tracking-tighter group-hover:translate-y-[-100%] group-focus:translate-y-[-100%] group-hover:opacity-0 group-focus:opacity-0 whitespace-nowrap text-[18px]">
                            Book Now
                          </span>
                          
                          {/* Second Text: Initially hidden, appears on hover or focus */}
                          <span className="absolute font-bold leading-none font-[Familjen_Grotesk] text-[18px] transition-all ease-in duration-300 group-active:text-[#27170e] text-[#D9D9D9] text-center tracking-tighter opacity-0 group-hover:opacity-100 group-focus:opacity-100 translate-y-[100%] group-hover:translate-y-0 group-focus:translate-y-0 whitespace-nowrap">
                            Book Now
                          </span>
                        </div>
                      </a>
                      
                      {/* Arrow Icon */}
                      <div className='p-3 rounded-full group-hover:-rotate-45 leading-none scale-[0.3] transition-all ease-in group-hover:duration-300 group-hover:scale-100 text-[#27170e] group-active:bg-[#27170e] group-active:text-[#D9D9D9] bg-[#27170e] group-hover:text-[#27170e] group-hover:bg-[#D9D9D9]'>
                        <ion-icon name="arrow-forward-outline" size="small"></ion-icon>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Secondary content that moves in from bottom on hover */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black rounded-xl transition-all duration-500 ease-in-out transform translate-y-full group-hover:translate-y-0 z-0">
                <div className="h-full w-full flex flex-col items-center justify-center p-8 text-white">
                  <span className="text-xl text-center font-[Roboto_Flex] py-7 leading-none font-light">
                    {service.hoverContent}
                  </span>

                  <div className="cta-btn relative z-10">
                    <div className="nav-Button group bg-[#D9D9D9] text-[#27170e] w-fit leading-none border-[1px] border-[#D9D9D9]/30 hover:scale-[0.9] active:bg-[#D9D9D9] active:scale-[1] px-4 py-0 relative rounded-full flex items-center justify-center gap-3 overflow-hidden font-[Quicksand] transition-all ease-in duration-300 group focus-within:scale-95">
                      <a href="https://sales.radianmedia.org" target="_blank" className="relative h-[3rem] flex items-center justify-center">
                        <div className="flex flex-col justify-center items-center relative">
                          {/* First Text */}
                          <span className="block font-bold leading-none font-[Familjen_Grotesk] text-[3vw] transition-all ease-in duration-300 text-center tracking-tighter opacity-100 group-focus:opacity-0 whitespace-nowrap md:text-[2.5vw] lg:text-[1vw]">
                            Let's Connect
                          </span>
                        </div>
                      </a>

                      {/* Arrow Icon */}
                      <div className="p-1 rounded-full group-hover:-rotate-45 scale-[0] transition-all ease-in group-hover:duration-500 group-hover:scale-100 text-[#27170e] group-active:bg-[#27170e] group-active:text-[#D9D9D9] bg-[#27170e] group-hover:text-[#D9D9D9] group-hover:bg-[#27170e]">
                        <ion-icon name="arrow-forward-outline" size="small"></ion-icon>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

     <div className="flex  items-center justify-start  gap-2 md:gap-6">
     <div className="cta-btn mt-4">
              <div className="nav-Button  bg-[#fff] w-fit leading-none  hover:scale-[0.9] active:bg-[#D9D9D9] active:scale-[1] px-3 py-1 md:px-4  lg:py-1 relative rounded-full flex items-center justify-center gap-4 overflow-hidden font-[Quicksand] transition-all ease-in duration-300 group hover:bg-[#27170e] focus-within:scale-95">
          <a href="https://sales.radianmedia.org" target="_blank" className="relative h-[3.5rem] flex items-center justify-center">
            <div className="flex flex-col justify-center items-center relative">
              {/* First Text: Initially visible, moves up and becomes hidden on hover or focus */}
              <span className="block font-bold leading-none font-[Familjen_Grotesk] text-[3.5vw]   transition-all ease-in duration-300  text-[#27170e] text-center tracking-normal group-hover:translate-y-[-100%] group-focus:translate-y-[-100%] group-hover:opacity-0 group-focus:opacity-0 whitespace-nowrap md:text-[2.5vw] lg:text-[1vw]">
                 GET QUOTE
              </span>
              
              {/* Second Text: Initially hidden, appears on hover or focus */}
              <span className="absolute font-bold leading-none font-[Familjen_Grotesk] text-[3.5vw] transition-all ease-in duration-300 group-active:text-[#27170e]  text-[#D9D9D9]  text-center tracking-normal opacity-0 group-hover:opacity-100 group-focus:opacity-100 translate-y-[100%] group-hover:translate-y-0 group-focus:translate-y-0 whitespace-nowrap md:text-[2.5vw] lg:text-[1vw]">
              GET QUOTE
              </span>
            </div>
          </a>
          
          {/* Arrow Icon */}
          <div className='p-3 rounded-full group-hover:-rotate-45   scale-[0.4] transition-all ease-in group-hover:duration-300 group-hover:scale-100 text-[#27170e] group-active:bg-[#27170e] group-active:text-[#D9D9D9] bg-[#27170e] group-hover:text-[#27170e]  group-hover:bg-[#D9D9D9]'>
          <ion-icon name="arrow-forward-outline" size="small"></ion-icon>
                    
</div>
        </div>
              </div>  
              
      <div className="cta-btn mt-4">
              <div className="nav-Button  bg-[#fff] w-fit leading-none  hover:scale-[0.9] active:bg-[#D9D9D9] active:scale-[1] px-3 py-1 md:px-4 relative rounded-full flex items-center justify-center gap-4 overflow-hidden font-[Quicksand] transition-all ease-in duration-300 group hover:bg-[#27170e] focus-within:scale-95">
          <a href="https://sales.radianmedia.org" target="_blank" className="relative h-[3.5rem] flex items-center justify-center">
            <div className="flex flex-col justify-center items-center relative">
              {/* First Text: Initially visible, moves up and becomes hidden on hover or focus */}
              <span className="block font-bold leading-none font-[Familjen_Grotesk] text-[3.5vw]  transition-all ease-in duration-300  text-[#27170e] text-center tracking-normal group-hover:translate-y-[-100%] group-focus:translate-y-[-100%] group-hover:opacity-0 group-focus:opacity-0 whitespace-nowrap md:text-[2.5vw] lg:text-[1vw]">
                 BOOK A CALL
              </span>
              
              {/* Second Text: Initially hidden, appears on hover or focus */}
              <span className="absolute font-bold leading-none font-[Familjen_Grotesk] text-[3.5vw] transition-all ease-in duration-300 group-active:text-[#27170e]  text-[#D9D9D9]  text-center tracking-normal opacity-0 group-hover:opacity-100 group-focus:opacity-100 translate-y-[100%] group-hover:translate-y-0 group-focus:translate-y-0 whitespace-nowrap md:text-[2.5vw] lg:text-[1vw]">
              BOOK A CALL
              </span>
            </div>
          </a>
          
          {/* Arrow Icon */}
          <div className='p-3 rounded-full group-hover:-rotate-45   scale-[0.4] transition-all ease-in group-hover:duration-300 group-hover:scale-100 text-[#27170e] group-active:bg-[#27170e] group-active:text-[#D9D9D9] bg-[#27170e] group-hover:text-[#27170e]  group-hover:bg-[#D9D9D9]'>
          <ion-icon name="arrow-forward-outline" size="small"></ion-icon>
                    
</div>
        </div>
              </div>  
     </div>
   </div>
    </>
  );
}

export default Service;