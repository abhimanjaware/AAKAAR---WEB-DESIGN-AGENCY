import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const testimonials = [
  {
    quote: 'Their team nailed the design aesthetics. The site feels smooth, responsive, and absolutely stunning.',
    name: 'Firefist Solution',
    role: 'Lead : Shan Shimpi ',
    image: 'src/assets/images/shansir.png',
  },
  {
    quote: 'Elegant and modern. Perfectly aligned with our brand.',
    name: 'Web Designer',
    role: 'Varun Bhabra',
    image: 'src/assets/images/varunbhbara.png',
  },
  {
    quote: 'Blending creativity, speed, and elegance into one seamless experience. This is not just a site, it’s a masterpiece.',
    name: 'SparrowTeck Performance',
    role: 'Founder : Abhishek Pardesi',
    image: 'src/assets/images/sparrowteck.png',
  },
  {
    quote: 'Nothing was discussed except initial onboarding. They Understood what i wanted. only first review of the website made it to the final deployment',
    name: 'Radian Media',
    role: 'Brand Architect : Hrushikesh Bhujbal ',
    image: 'src/assets/images/rad.jpg',
  },

   {
    quote: 'Zero revisions needed. Truly premium service!',
    name: 'Digital Supermacy',
    role: 'Sales Lead : Durvesh Patil',
    image: 'https://images.unsplash.com/photo-1705615791240-c35f4799863b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGRpZ2l0YWwlMjBtYXJrdGluZ3xlbnwwfHwwfHx8MA%3D%3D',
  },
  {
    quote: 'From fonts to animations, everything screams luxury. Aakaar took our brand to another level. Every detail was handled with care and perfection.',
    name: 'Digital Supermacy',
    role: 'CEO : Gaurav Kor',
    image: 'src/assets/images/gauravkor.png',
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

    const loopAnim = gsap.to(container, {
      x: `-=${totalWidth / (cloneCount + 1)}`,
      duration: 90,
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

    loopRef.current = loopAnim;

    const pauseAnimation = () => loopAnim.pause();
    const playAnimation = () => loopAnim.play();

    allCards.forEach((card) => {
      card.addEventListener('mouseenter', pauseAnimation);
      card.addEventListener('mouseleave', playAnimation);
      card.addEventListener('touchstart', () => {
        if (isMobile) loopAnim.pause();
      });
    });

    return () => {
      loopAnim.kill();
      allCards.forEach((card) => {
        card.removeEventListener('mouseenter', pauseAnimation);
        card.removeEventListener('mouseleave', playAnimation);
        card.removeEventListener('touchstart', () => {
          if (isMobile) loopAnim.pause();
        });
      });
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
                  className="rounded-full w-14 h-14 sm:w-20 sm:h-20 object-cover object-top border-[2px] border-white shadow mb-3"
                />
                <p className="text-[12px] sm:text-base md:text-lg lg:text-xl font-light text-white leading-snug font-[Familjen_Grotesk] italic px-2">“{testimonial.quote}”</p>
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
