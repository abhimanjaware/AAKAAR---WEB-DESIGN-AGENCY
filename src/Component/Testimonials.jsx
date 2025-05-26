import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const testimonials = [
  {
    quote: '',
    name: 'Firefist Solution',
    role: 'Lead : Shan Shimpi ',
    image: 'https://plus.unsplash.com/premium_photo-1661877737564-3dfd7282efcb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y29kaW5nfGVufDB8fDB8fHww',
  },
  {
    quote: 'It’s rare to find people who are this passionate about both design and code.',
    name: 'Web Designer',
    role: 'Varun Bhabra',
    image: 'https://images.unsplash.com/photo-1512295767273-ac109ac3acfa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDB8fHdlYiUyMGRlc2lnbmVyfGVufDB8fDB8fHww',
  },
  {
    quote: 'A beautiful blend of aesthetics and performance.',
    name: 'SparrowTeck Performance',
    role: 'Founder : Abhishek Pardesi',
    image: 'https://media.istockphoto.com/id/937855500/photo/gears-detail.jpg?s=2048x2048&w=is&k=20&c=1uHHoFcCHrAWhnULaI_dkK9_P-VFEZGuJAqLXnYd398=',
  },
  {
    quote: 'Nothing was discussed except initial onboarding. He Understood what i wanted. only first review of the website made it to the final deployment',
    name: 'Radian Media',
    role: 'Brand Architect : Hrushikesh Bhujbal ',
    image: 'https://media.licdn.com/dms/image/v2/D5616AQEllz0rJOWPMg/profile-displaybackgroundimage-shrink_350_1400/profile-displaybackgroundimage-shrink_350_1400/0/1709229858896?e=1750291200&v=beta&t=KMaUxG1tNRn6W4U4ReIV2QZD66i36igZHs4mfn4grcU',
  },
  {
    quote: 'Every element was handcrafted — and the result? A site that truly represents us.',
    name: 'Digital Supermacy',
    role: 'CEO : Gaurav Kor',
    image: 'https://images.unsplash.com/photo-1705615791240-c35f4799863b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGRpZ2l0YWwlMjBtYXJrdGluZ3xlbnwwfHwwfHx8MA%3D%3D',
  },
];

const TestimonialsGSAP = () => {
  const trackRef = useRef(null);
  const loopRef = useRef(null);

  useEffect(() => {
    const container = trackRef.current;
    if (!container) return;

    const isMobile = window.innerWidth <= 768;

    const originalCards = gsap.utils.toArray('.testimonial-card');
    const cloneCount = 2;
    for (let i = 0; i < cloneCount; i++) {
      originalCards.forEach((card) => {
        const clone = card.cloneNode(true);
        container.appendChild(clone);
      });
    }

    const allCards = gsap.utils.toArray('.testimonial-card');
    const cardWidth = allCards[0]?.offsetWidth || (isMobile ? 200 : 260);
    const gap = parseFloat(getComputedStyle(container).gap) || (isMobile ? 2 : 4);
    const totalWidth = allCards.length * (cardWidth + gap);

    loopRef.current = gsap.to(container, {
      x: `-=${totalWidth / (cloneCount + 1)}`,
      duration: 100,
      ease: 'none',
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x) => parseFloat(x) % totalWidth),
      },
      onUpdate: () => {
        const center = window.innerWidth / 2;
        allCards.forEach((card) => {
          const bounds = card.getBoundingClientRect();
          const cardCenter = bounds.left + bounds.width / 2;
          const distance = Math.abs(center - cardCenter);

          const scale = gsap.utils.clamp(
            isMobile ? 0.95 : 0.8,
            1.09,
            1 - distance / (isMobile ? 1350 : 1250)
          );

          const opacity = gsap.utils.clamp(
            0.1,
            1,
            1 - distance / (isMobile ? 1800 : 950)
          );

          gsap.set(card, { scale, opacity });
        });
      },
    });

    return () => {
      loopRef.current?.kill();
    };
  }, []);

  return (
    <div className="relative h-fit w-full bg-[#D9D9D9] py-20 overflow-hidden">
      <div className='testimonials-head w-full py-16 text-center leading-normal  px-8'>
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[3rem] font-[Familjen_Grotesk] uppercase font-black text-center tracking-tight text-[#27270e]">
          Testimonial
        </h2>
        <span className='text-zinc-900/90 font-[Dancing_Script] font-extralight text-[1.4rem] leading-none overflow-hidden text-center'>
          Trusted by visionaries, entrepreneurs, and brands <span className='text-black font-medium'>worldwide.</span>
        </span>
      </div>

      {/* Gradient masks */}
      <div className="absolute top-0 bottom-0 left-0 w-20 sm:w-32 z-20 bg-gradient-to-r from-[#D9D9D9] to-transparent pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-20 sm:w-32 z-20 bg-gradient-to-l from-[#D9D9D9] to-transparent pointer-events-none" />

      <div className="overflow-hidden w-full px-4 relative z-10 flex justify-center">
        <div
          ref={trackRef}
          className="flex gap-1 sm:gap-2 md:gap-1 w-max items-center pointer-events-none"
          style={{ willChange: 'transform' }}
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="testimonial-card relative bg-[#27170e] text-white border-[2px] border-[#27170e]/10 rounded-3xl p-4 sm:p-6 shadow-md w-[200px] sm:w-[260px] md:w-[280px] lg:w-[400px] lg:h-[580px] h-[320px] sm:h-[370px] flex flex-col items-center justify-between flex-shrink-0 transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] hover:scale-[1.015] hover:shadow-lg"
            >
              {/* Soft image backdrop */}
              <div className="absolute inset-0">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-full h-full object-cover rounded-3xl opacity-10"
                />
              </div>

              <div className="relative z-10 flex flex-col h-full justify-between items-center text-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="rounded-full w-14 h-14 sm:w-20 sm:h-20 object-cover border-[2px] border-white shadow mb-3"
                />
                <p className="text-xs sm:text-sm md:text-base lg:text-[20px] font-light text-white leading-none font-[Familjen_Grotesk] italic px-2">“{testimonial.quote}”</p>
                <div className="mt-4">
                  <p className="font-semibold uppercase text-gray-100/80 text-sm sm:text-base">{testimonial.name}</p>
                  <p className="text-gray-200 text-xs sm:text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsGSAP;
