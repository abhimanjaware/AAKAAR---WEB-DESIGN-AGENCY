import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

function Process() {
  const scrollRef = useRef(null);
  const headerRef = useRef(null);
  const headerTitleRef = useRef(null);
  const headerSubtitleRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.config({ force3D: true, nullTargetWarn: false });

    if (headerTitleRef.current && headerSubtitleRef.current) {
      gsap.set(headerTitleRef.current, { y: 50, opacity: 0 });
      gsap.set(headerSubtitleRef.current, { y: 30, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: headerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });

      tl.to(headerTitleRef.current, {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'power3.out',
      }).to(
        headerSubtitleRef.current,
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
        },
        '-=0.8'
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  // Center first card on tablets
  useEffect(() => {
    const centerCardsOnTablet = () => {
      const container = scrollRef.current;
      if (!container) return;

      const screenWidth = window.innerWidth;

      if (screenWidth >= 768 && screenWidth < 1024) {
        requestAnimationFrame(() => {
          const cards = container.querySelectorAll('.process-card');
          if (!cards.length) return;

          cards.forEach((card) => {
            card.style.minWidth = `${screenWidth}px`;
            card.style.maxWidth = `${screenWidth}px`;
            card.style.flexShrink = '0';
          });

          container.scrollLeft = 0;
        });
      } else {
        // Reset style if not on tablet
        const cards = container.querySelectorAll('.process-card');
        cards.forEach((card) => {
          card.style.minWidth = '';
          card.style.maxWidth = '';
          card.style.flexShrink = '';
        });
      }
    };

    const timeout = setTimeout(centerCardsOnTablet, 100);
    window.addEventListener('resize', centerCardsOnTablet);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', centerCardsOnTablet);
    };
  }, []);

  const processSteps = [
    {
      id: 1,
      title: `Consult /  Discovery Call`,
      number: "01",
      description: "We begin with a structured discussion to understand your business model, goals, audience, and challenges. This lays the strategic foundation for everything that follows.",
      imgUrl: "https://www.studio-krista.com/wp-content/uploads/2024/12/The-Decoroom-Minimalist-Luxury-Interior-Design-Studio-in-Texas-branding-and-website-by-studio-krista-who-are-a-boutique-branding-and-web-design-agency-mockup-scaled.jpg"
    },
    {
      id: 2,
      title: "Client Questionnaire & Checklist",
      number: "02",
      description: "You'll receive a tailored questionnaire that helps us gather clarity on your vision, tone, target market, competitors, and design preferences. We also share a simple checklist to collect your brand assets and content.",
      imgUrl: "https://www.studio-krista.com/wp-content/uploads/2024/12/De-Hasse-Architectural-and-Interior-Design-firm-full-re-brand-and-website-by-studio-krista-mockup-scaled.jpg"
    },
    {
      id: 3,
      title: "Research & Strategy",
      number: "03",
      description: "We analyze your market, study audience behavior, and define a content and design direction. This includes identifying key opportunities and establishing a strong creative strategy aligned with your business goals.",
      imgUrl: "https://www.studio-krista.com/wp-content/uploads/2024/11/Daft-Buro-Architecture-firm-in-Miami-Florida-full-rebrand-and-new-wordpress-website-by-boutique-web-and-branding-agency-studio-krista.-homepage-mockup-scaled.jpg"
    },
    {
      id: 4,
      title: "Homepage Design",
      number: "04",
      description: "We design the homepage first—covering layout structure, UI flow, typography, color, spacing, and visual tone. It acts as the blueprint for the rest of the site.",
      imgUrl: "https://www.studio-krista.com/wp-content/uploads/2024/11/Fullhouse-Group-UK-real-estate-and-design-studio-full-rebrand-and-wordpress-website-by-studio-krista-boutique-branding-and-web-design-agency-scaled.jpg"
    },
    {
      id: 5,
      title: "Feedback & Refinement",
      number: "05",
      description: "We present the initial homepage design and revise based on clear feedback. Every detail—spacing, font choice, alignment—is refined with precision to ensure clarity and consistency.",
      imgUrl: "https://www.studio-krista.com/wp-content/uploads/2024/12/Instagram-Post-%E2%80%93-644-1-scaled.jpg"
    },
    {
      id: 6,
      title: "Full Website Design",
      number: "06",
      description: "With the homepage approved, we extend the visual language to all other pages, including mobile responsiveness and design consistency throughout.",
      imgUrl: "https://www.studio-krista.com/wp-content/uploads/2024/12/Mod-Co-Developers-Texas-branding-websute-for-this-luxury-custom-home-builder-full-rebrand-and-website-by-studio-krista-website-mockup-scaled.jpg"
    },
    {
      id: 7,
      title: "Development Phase",
      number: "07",
      description: "We develop a clean, fast, and SEO-optimized website from scratch using modern technologies—ensuring responsiveness, animation (if included), and accessibility.",
      imgUrl: "https://www.studio-krista.com/wp-content/uploads/2024/12/Andrew-Chary-Architect-Heirloom-Architecture-full-rebrand-and-wordpress-website-by-studio-krista-website-scaled.jpg"
    },
    {
      id: 8,
      title: "Testing & Quality Check",
      number: "08",
      description: "We conduct performance testing across browsers and devices, checking for speed, layout issues, responsiveness, broken links, and bugs.",
      imgUrl: "https://www.studio-krista.com/wp-content/uploads/2024/11/Amy-Stoddart-Studio-interior-designer-london-full-rebrand-and-website-by-studio-krista-mockup-scaled.jpg"
    },
    {
      id: 9,
      title: "Launch",
      number: "09",
      description: "Once approved, we deploy the site live. You receive post-launch guidance and ownership access. The site is now live and ready to perform.",
      imgUrl: "https://www.studio-krista.com/wp-content/uploads/2024/12/Instagram-Post-%E2%80%93-397-1-scaled.jpg"
    },
  ];

  const scrollCard = (direction) => {
    if (!scrollRef.current || isScrolling) return;
    setIsScrolling(true);
    const container = scrollRef.current;
    const card = container.querySelector('.process-card');
    if (!card) return;

    const cardWidth = card.offsetWidth;
    gsap.to(container, {
      scrollLeft: direction === 'right' ? container.scrollLeft + cardWidth : container.scrollLeft - cardWidth,
      duration: 1.2,
      ease: 'power2.out',
      onComplete: () => setIsScrolling(false),
    });
  };

  return (
    <div className='bg-[#D9D9D9] w-full pt-36'>
      <div className="min-h-screen w-full">
        <div className="w-full pt-8 text-center px-4 md:px-0" ref={headerRef}>
          <h3 ref={headerTitleRef} className='text-[2rem] md:text-[3rem] leading-tight text-[#27170e] font-black'>
            WANNA KNOW HOW IT'S DONE?
          </h3>
          <span ref={headerSubtitleRef} className='text-zinc-900/90 font-[Dancing_Script]  text-[1.2rem] md:text-[1.5rem]'>
            "A <span className='text-black font-medium'>Process</span> Designed to Deliver. Refined to Impress."
          </span>
        </div>

        <div className="pt-16 md:pt-24">
          <div className="w-full flex flex-col md:flex-row items-center justify-between pb-16 px-6 md:px-28 gap-6">
            <div className="text-center md:text-left">
              <span className='font-[Familjen_Grotesk] text-[1.2rem] md:text-[1.5rem]'>PROCESS :</span>
            </div>
            <div className='flex items-center gap-3 text-3xl md:text-4xl text-[#27170e]'>
              <div onClick={() => scrollCard('left')} className="bg-[#d1cbcb] p-2 rounded-full cursor-pointer hover:bg-[#27170e] hover:text-[#fff]">
                <ion-icon name="chevron-back-outline"></ion-icon>
              </div>
              <div onClick={() => scrollCard('right')} className="bg-[#d1cbcb] p-2 rounded-full cursor-pointer hover:bg-[#27170e] hover:text-[#fff]">
                <ion-icon name="chevron-forward-outline"></ion-icon>
              </div>
            </div>
          </div>

          <div className="px-4 md:px-28 overflow-x-auto scroll-smooth snap-x snap-mandatory" ref={scrollRef} style={{ scrollbarWidth: 'none' }}>
            <div className="flex flex-row  gap-12 md:gap-28">
              {processSteps.map((step) => (
                <div key={step.id} className="process-card  snap-center w-full md:w-[1100px] flex-shrink-0 flex flex-col items-center md:items-start md:pl-[6rem] lg:items-center lg:pl-0 lg:flex-row lg:gap-16">
                  <div className="w-full md:w-[60%] h-[200px] md:h-[40vh] lg:h-[60vh] rounded-xl overflow-hidden">
                    <img src={step.imgUrl} className='w-full h-full object-cover object-center' alt={step.title} />
                  </div>
                  <div className="text-[#27170e] w-full md:w-[40%] flex flex-col items-start gap-4 mt-4">
                    <h5 className='font-[Tangerine] text-[5rem]'>{step.number}</h5>
                    <div>
                      <h5 className='text-[1.5rem] md:text-[2rem] font-[Dancing_Script] py-2'>{step.title}</h5>
                      <p className='font-[Familjen_Grotesk] text-[1rem] md:text-[1.2rem]'>{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Process;
