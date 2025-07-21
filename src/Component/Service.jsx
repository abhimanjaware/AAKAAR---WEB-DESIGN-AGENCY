import React, { useEffect, useRef, useState } from 'react';

// Mock GSAP and ScrollTrigger for compatibility
const gsap = {
  registerPlugin: () => {},
  set: (elements, props) => {
    if (!elements) return;
    const els = Array.isArray(elements) ? elements : [elements];
    els.forEach(el => {
      if (el) {
        Object.assign(el.style, {
          opacity: props.opacity !== undefined ? props.opacity : el.style.opacity,
          transform: `translateY(${props.y || 0}px)`
        });
      }
    });
  },
  to: (elements, props) => {
    if (!elements) return { scrollTrigger: null };
    const els = Array.isArray(elements) ? elements : [elements];
    
    setTimeout(() => {
      els.forEach((el, index) => {
        if (el) {
          const delay = props.stagger ? index * (props.stagger * 1000) : 0;
          setTimeout(() => {
            el.style.transition = `all ${(props.duration || 0.5) * 1000}ms ${props.ease || 'ease'}`;
            el.style.opacity = props.opacity !== undefined ? props.opacity : el.style.opacity;
            el.style.transform = `translateY(${props.y || 0}px)`;
          }, delay);
        }
      });
    }, 100);
    
    return { scrollTrigger: null };
  },
  timeline: (config) => {
    const tl = {
      to: (elements, props) => {
        gsap.to(elements, props);
        return tl;
      },
      kill: () => {},
      scrollTrigger: null
    };
    
    // Simulate scroll trigger
    if (config?.scrollTrigger) {
      setTimeout(() => {
        const trigger = document.querySelector('#services');
        if (trigger) {
          const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                // Trigger animations
                setTimeout(() => tl.to(), 100);
              }
            });
          }, { threshold: 0.3 });
          observer.observe(trigger);
        }
      }, 100);
    }
    
    return tl;
  },
  killTweensOf: () => {}
};

const ScrollTrigger = {
  getAll: () => [],
  kill: () => {}
};

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
      image: "https://i.pinimg.com/736x/de/c3/ca/dec3ca638bdde241f60535f1f5f6fb60.jpg"
    },
    {
      id: "uiux",
      title: <><span className='text-white'>UI/UX</span> <br /> DESIGNING</>,
      description: <>"Great design doesn't just look beautiful—it feels <span className='font-normal'>effortless</span>."</>,
      hoverContent: <>It's simple: Happy users are loyal users. A <span className='font-medium'>well-designed UX/UI</span> not only makes your site more enjoyable to use but directly impacts your conversion rates.</>,
      image: "https://i.pinimg.com/736x/86/fa/8f/86fa8f4c4d3095b3a6285c5ba19a63f0.jpg"
    },
    {
      id: "ecom",
      title: <><span className='text-white'>E-COMMERCE</span> <br />SOLUTIONS</>,
      description: <>"Maximize your online store: <span className='font-normal'>More sales, more revenue.</span>"</>,
      hoverContent: <>More Sales = More Revenue. A seamless e-commerce experience can make or break a sale. We ensure that your store is optimized for conversions, with fast load times, <span className='font-medium'>easy navigation, and secure transactions.</span></>,
      image: "https://i.pinimg.com/236x/f6/07/74/f607746a5c42427d706d890bf610b514.jpg"
    },
    {
      id: "seo",
      title: <> SEO & <span className='text-white text-[] '>PERFORMANCE OPTIMISATION</span></>,
      description: <>"Your website might be beautiful, but <span className='font-normal'>if it's not seen, it can't succeed</span>."</>,
      hoverContent: <>We don't just build pretty websites—we make sure they <span className='font-medium'>reach your audience</span>. Our SEO and performance optimization services ensure that your site ranks higher in search results and loads instantly.</>,
      image: "https://i.pinimg.com/736x/37/31/8f/37318f0ba9e315873af521edb2cb40ee.jpg"
    },
    {
      id: "content",
      title: <> CONTENT <span className='whitespace-nowrap'>STRATEGY &</span> <br /><span className='text-white text-[] '>COPYWRITING.</span></>,
      description: <>"Words that sell. <span className='font-normal'>Content that connects</span>."</>,
      hoverContent: <>Great design needs great content. Our content strategy and copywriting services help tell your story in a way that <span className='font-medium'>engages, educates, and inspires action.</span></>,
      image: "https://i.pinimg.com/236x/87/dd/33/87dd33c929b6ee141fb3bd43d5ec0eb3.jpg"
    },
    {
      id: "brand",
      title: <>BRAND IDENTITY  <br /> <span className='text-white'>LOGO</span> DESIGN</>,
      description: <>Brand identity : <span className='font-normal'>Your business story at every touchpoint</span>.</>,
      hoverContent: <>It's simple: Happy users are loyal users. A <span className='font-medium'>well-designed UX/UI</span> not only makes your site more enjoyable to use but directly impacts your conversion rates.</>,
      image: "https://i.pinimg.com/736x/bd/f0/3e/bdf03ef4b82f104508b12a59945ae445.jpg"
    }
  ];

  // Initialize cardRefs
  useEffect(() => {
    cardRefs.current = Array(services.length).fill(null);
    setIsLoaded(true);
  }, [services.length]);

  // Faster fade-in and stagger animation
  useEffect(() => {
    if (!isLoaded) return;

    let masterTimeline;
    let scrollTriggerInstances = [];
    
    // Store current ref values to avoid stale references in cleanup
    const currentHeadingRef = headingRef.current;
    const currentSubheadingRef = subheadingRef.current;
    const currentCardRefs = [...cardRefs.current];
    const currentCardsContainerRef = cardsContainerRef.current;

    // Ensure refs are available
    if (!currentCardsContainerRef) return;

    // Hide all elements initially
    gsap.set([currentHeadingRef, currentSubheadingRef].filter(Boolean), {
      opacity: 0,
      y: 20
    });

    gsap.set(currentCardRefs.filter(Boolean), {
      opacity: 0,
      y: 20
    });

    // Create master timeline for reveal animations
    masterTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: currentCardsContainerRef,
        start: "top 75%",
        toggleActions: "play none none none",
      }
    });
    
    scrollTriggerInstances.push(masterTimeline.scrollTrigger);

    // Faster heading animations
    if (currentHeadingRef) {
      masterTimeline.to(currentHeadingRef, {
        opacity: 1,
        y: 0,
        duration: 0.25,
        ease: "power2.out"
      });
    }

    if (currentSubheadingRef) {
      masterTimeline.to(currentSubheadingRef, {
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease: "power2.out"
      }, "-=0.15");
    }

    // Faster cards reveal animation with reduced stagger
    const validCardRefs = currentCardRefs.filter(ref => ref);
    if (validCardRefs.length > 0) {
      masterTimeline.to(validCardRefs, {
        opacity: 1,
        y: 0,
        stagger: 0.08,
        duration: 0.4,
        ease: "power2.out"
      }, "-=0.1");
    }

    // Cleanup function
    return () => {
      scrollTriggerInstances.forEach(st => {
        if (st && st.kill) st.kill();
      });
      
      if (masterTimeline && masterTimeline.kill) {
        masterTimeline.kill();
      }

      ScrollTrigger.getAll().forEach(st => st.kill && st.kill());
      gsap.killTweensOf(currentCardRefs);
      gsap.killTweensOf([currentHeadingRef, currentSubheadingRef]);
    };
  }, [isLoaded]);

  return (
    <>
      <div 
        id='services'
        className='bg-[#D9D9D9] flex flex-col flex-wrap min-h-screen my-20 items-center justify-center p-4 md:p-8'
        ref={cardsContainerRef}
        style={{ display: 'flex', minHeight: '100vh' }}
      >
        <div className="h-fit w-full text-center pb-8 pt-8 overflow-hidden">
          <h3 
            className='service-head text-[2rem] md:text-[3rem] text-[#27170e] pb-2 font-black tracking-wide leading-none overflow-hidden'
            ref={headingRef}
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            HERE'S WHAT <br /> WE ARE KNOW FOR
          </h3>
          <span 
            className='service-subhead font-[Dancing_Script] text-zinc-900/90 font-extralight text-[1.4rem] leading-none md:text-[2rem] overflow-hidden'
            ref={subheadingRef}
            // style={{ fontFamily: 'Dancing_Script' }}
          >
            Converting your brand into flawless aesthetics.
          </span>
        </div>

        <div 
          className="w-full max-w-[104rem] md:py-24 pb-12 flex flex-wrap justify-center gap-6"
          ref={cardsWrapperRef}
        >
          {services.map((service, index) => (
            <div 
              key={service.id}
              className={`${service.id}-service h-96 w-full sm:w-[calc(100%-2rem)] md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1rem)] rounded-xl justify-center flex flex-wrap group border-[.001px] border-zinc-800/30 overflow-hidden`}
              ref={el => cardRefs.current[index] = el}
              style={{ display: 'flex', minHeight: '384px' }}
            >
              <div className="relative h-full w-full rounded-xl overflow-hidden">
                {/* Background image */}
                <div className="absolute inset-0 bg-gray-300 transition-all duration-500 opacity-100 group-hover:scale-[1.1] blur-[1.3px] ease-in-out group-hover:blur-[2px]">
                  <div className="h-full w-full bg-stone-700">
                    <img 
                      src={service.image} 
                      alt={`${service.id} Service`} 
                      className="h-full w-full object-cover object-center" 
                      loading="lazy"
                      decoding="async"
                      style={{ display: 'block', width: '100%', height: '100%' }}
                    />
                  </div>
                </div>
               
                {/* Main content */}
                <div className="absolute inset-0 transition-all px-8 ease-in-out duration-500 transform group-hover:-translate-y-full">
                  <div className="h-full w-full flex items-center justify-center flex-col p-6">
                    <p className="font-black text-[2.7rem] leading-none text-center text-zinc-100/90">
                      {service.title}
                    </p>
                    <span className="font-light text-[18px] pt-5 pb-6 leading-none text-zinc-200 text-center" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      {service.description}
                    </span>
                    <div className="service-btn block lg:hidden">
                      <div className="service-Button bg-[#D9D9D9] w-fit leading-none border-[1px] border-[#D9D9D9]/30 hover:scale-[0.9] active:bg-[#D9D9D9] active:scale-[1] px-4 py-0 relative rounded-full flex items-center justify-center gap-0 overflow-hidden transition-all ease-in duration-300 group hover:bg-[#27170e] focus-within:scale-95" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                        <a href="https://wa.me/919689762896?text=Hi%20there%2C%20I%20visited%20your%20website%20and%20wanted%20to%20connect!" target="_blank" rel="noopener noreferrer" className="relative h-[.5rem] flex items-center justify-center">
                          <div className="flex flex-col justify-center items-center relative">
                            <span className="block font-bold leading-none text-[18px] transition-all ease-in duration-300 text-[#27170e] text-center tracking-tighter group-hover:translate-y-[-100%] group-focus:translate-y-[-100%] group-hover:opacity-0 group-focus:opacity-0 whitespace-nowrap" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                              Book Now
                            </span>
                            
                            <span className="absolute font-bold leading-none text-[18px] transition-all ease-in duration-300 group-active:text-[#27170e] text-[#D9D9D9] text-center tracking-tighter opacity-0 group-hover:opacity-100 group-focus:opacity-100 translate-y-[100%] group-hover:translate-y-0 group-focus:translate-y-0 whitespace-nowrap" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                              Book Now
                            </span>
                          </div>
                        </a>
                        
                        <div className='p-3 rounded-full group-hover:-rotate-45 leading-none scale-[0.3] transition-all ease-in group-hover:duration-300 group-hover:scale-100 text-[#27170e] group-active:bg-[#27170e] group-active:text-[#D9D9D9] bg-[#27170e] group-hover:text-[#27170e] group-hover:bg-[#D9D9D9]'>
                          <span style={{ display: 'inline-block', transform: 'rotate(0deg)' }}>→</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Secondary content */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black rounded-xl transition-all ease-in-out duration-500 transform translate-y-full group-hover:translate-y-0 z-0">
                  <div className="h-full w-full flex flex-col items-center justify-center p-8 text-white">
                    <span className="text-xl text-center py-7 leading-none font-light" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      {service.hoverContent}
                    </span>

                    <div className="cta-btn relative z-10">
                      <div className="nav-Button group bg-[#D9D9D9] text-[#27170e] w-fit leading-none border-[1px] border-[#D9D9D9]/30 hover:scale-[0.9] active:bg-[#D9D9D9] active:scale-[1] px-4 py-0 relative rounded-full flex items-center justify-center gap-3 overflow-hidden transition-all ease-in duration-300 focus-within:scale-95" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                        <a href="https://wa.me/919689762896?text=Hi%20there%2C%20I%20visited%20your%20website%20and%20wanted%20to%20connect!" target="_blank" rel="noopener noreferrer" className="relative h-[3rem] flex items-center justify-center">
                          <div className="flex flex-col justify-center items-center relative">
                            <span className="block font-bold leading-none text-[3vw] transition-all ease-in duration-300 text-center tracking-tighter opacity-100 group-focus:opacity-0 whitespace-nowrap md:text-[2.5vw] lg:text-[1vw]" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                              Let's Connect
                            </span>
                          </div>
                        </a>

                        <div className="p-1 rounded-full group-hover:-rotate-45 scale-[0] transition-all ease-in group-hover:duration-500 group-hover:scale-100 text-[#27170e] group-active:bg-[#27170e] group-active:text-[#D9D9D9] bg-[#27170e] group-hover:text-[#D9D9D9] group-hover:bg-[#27170e]">
                          <span style={{ display: 'inline-block', transform: 'rotate(0deg)' }}>→</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-start gap-2 md:gap-6">
          <div className="cta-btn mt-4">
            <div className="nav-Button bg-[#fff] w-fit leading-none hover:scale-[0.9] active:bg-[#D9D9D9] active:scale-[1] px-3 py-1 md:px-4 lg:py-1 relative rounded-full flex items-center justify-center gap-4 overflow-hidden transition-all ease-in duration-300 group hover:bg-[#27170e] focus-within:scale-95" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  const newWindow = window.open('AAKAAR - QUOTATION (2).pdf', '_blank');
                  if (newWindow) {
                    newWindow.document.title = 'Aakaar Quote Request';
                  }
                }}
                className="relative h-[3.5rem] flex items-center justify-center group"
              >
                <div className="flex flex-col justify-center items-center relative">
                  <span className="block font-bold leading-none text-[3.5vw] transition-all ease-in duration-300 text-[#27170e] text-center tracking-normal group-hover:translate-y-[-100%] group-focus:translate-y-[-100%] group-hover:opacity-0 group-focus:opacity-0 whitespace-nowrap md:text-[2.5vw] lg:text-[1vw]" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    GET QUOTE
                  </span>

                  <span className="absolute font-bold leading-none text-[3.5vw] transition-all ease-in duration-300 group-active:text-[#27170e] text-[#D9D9D9] text-center tracking-normal opacity-0 group-hover:opacity-100 group-focus:opacity-100 translate-y-[100%] group-hover:translate-y-0 group-focus:translate-y-0 whitespace-nowrap md:text-[2.5vw] lg:text-[1vw]" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    GET QUOTE
                  </span>
                </div>
              </a>
              <div className='p-3 rounded-full group-hover:-rotate-45 scale-[0.4] transition-all ease-in group-hover:duration-300 group-hover:scale-100 text-[#27170e] group-active:bg-[#27170e] group-active:text-[#D9D9D9] bg-[#27170e] group-hover:text-[#27170e] group-hover:bg-[#D9D9D9]'>
                <span style={{ display: 'inline-block', transform: 'rotate(0deg)' }}>→</span>
              </div>
            </div>
          </div>  
              
          <div className="cta-btn mt-4">
            <div className="nav-Button bg-[#fff] w-fit leading-none hover:scale-[0.9] active:bg-[#D9D9D9] active:scale-[1] px-3 py-1 md:px-4 relative rounded-full flex items-center justify-center gap-4 overflow-hidden transition-all ease-in duration-300 group hover:bg-[#27170e] focus-within:scale-95" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              <a href="tel:+911234567890" target="_blank" rel="noopener noreferrer" className="relative h-[3.5rem] flex items-center justify-center">
                <div className="flex flex-col justify-center items-center relative">
                  <span className="block font-bold leading-none text-[3.5vw] transition-all ease-in duration-300 text-[#27170e] text-center tracking-normal group-hover:translate-y-[-100%] group-focus:translate-y-[-100%] group-hover:opacity-0 group-focus:opacity-0 whitespace-nowrap md:text-[2.5vw] lg:text-[1vw]" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    BOOK A CALL
                  </span>
                  
                  <span className="absolute font-bold leading-none text-[3.5vw] transition-all ease-in duration-300 group-active:text-[#27170e] text-[#D9D9D9] text-center tracking-normal opacity-0 group-hover:opacity-100 group-focus:opacity-100 translate-y-[100%] group-hover:translate-y-0 group-focus:translate-y-0 whitespace-nowrap md:text-[2.5vw] lg:text-[1vw]" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    BOOK A CALL
                  </span>
                </div>
              </a>
              
              <div className='p-3 rounded-full group-hover:-rotate-45 scale-[0.4] transition-all ease-in group-hover:duration-300 group-hover:scale-100 text-[#27170e] group-active:bg-[#27170e] group-active:text-[#D9D9D9] bg-[#27170e] group-hover:text-[#27170e] group-hover:bg-[#D9D9D9]'>
                <span style={{ display: 'inline-block', transform: 'rotate(0deg)' }}>→</span>
              </div>
            </div>
          </div>  
        </div>
      </div>
    </>
  );
}

export default Service;