import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

function Why() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardRefs = useRef([]);
  const [screenType, setScreenType] = useState('desktop');

  useEffect(() => {
    const checkScreen = () => {
      const width = window.innerWidth;
      if (width < 768) setScreenType('mobile');
      else if (width < 1024) setScreenType('tablet');
      else setScreenType('desktop');
    };

    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      if (!sectionRef.current || !headerRef.current) return;

      const headerTitle = headerRef.current.querySelector('h3');
      const headerSubtitle = headerRef.current.querySelector('span');

      gsap.from(headerTitle, {
        y: 50,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 80%",
          toggleActions: "play none none none"
        }
      });

      gsap.from(headerSubtitle, {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: "power2.out",
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 80%",
          toggleActions: "play none none none"
        }
      });

      cardRefs.current.slice(1).forEach(ref => {
        gsap.set(ref, { y: '100vh', opacity: 0 });
      });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "+=400%",
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=400%",
          scrub: 0.5,
        }
      });

      tl.to(cardRefs.current[1], { y: 0, opacity: 1, duration: 0.15 }, "card2-=0.05");
      tl.to(cardRefs.current[0], { scale: 0.95, filter: "blur(5px)", duration: 0.15 }, "card2");
      tl.to(cardRefs.current[2], { y: 0, opacity: 1, duration: 0.15 }, "card3-=0.05");
      tl.to(cardRefs.current[1], { scale: 0.95, filter: "blur(5px)", duration: 0.15 }, "card3");
      tl.to(cardRefs.current[3], { y: 0, opacity: 1, duration: 0.15 }, "card4-=0.05");
      tl.to(cardRefs.current[2], { scale: 0.95, filter: "blur(5px)", duration: 0.15 }, "card4");
    });

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  const titles = ['Clarity', 'Speed', 'Focus', 'Expertise'];

  const desktopDescriptions = [
    [
      "We guide you through every stage of the journey—from strategy and design to launch and beyond—while giving you complete transparency into our workflow. You’ll always know what we’re working on, why we’re doing it, and how it’s progressing.",
      "We take the time to deeply understand your brand, your goals, and your audience. This ensures that every decision—from creative direction to technical execution"
    ],
    [
      "Our team works with speed and discipline, ensuring consistent progress without ever compromising on quality. Every milestone is met with care, precision, and a clear sense of momentum—so you’re never left waiting or wondering",
      " Our approach is designed to achieve the highest possible results in the shortest timeframe—so you get value quickly and effectively."
    ],
    [
      "We strip away the clutter and distractions to focus purely on what your brand truly needs to grow. Our process is intentional and streamlined—built to highlight what matters most to your business.",
      "Nothing is designed just for show—every element we create is carefully thought out to drive real"
    ],
    [
      "With deep expertise in the latest design tools, technologies, and industry trends, we bring a level of proficiency that ensures your brand stays ahead of the curve—both visually and functionally.",
      "This foundation allows us to craft clean, modern, and highly strategic solutions—tailored to your brand’s goals, optimized for performance, and designed to leave a lasting impression."
    ]
  ];

  const tabletDescriptions = [...desktopDescriptions];

  const mobileDescriptions = [
    [
      "We keep you in the loop at every stage, working with full transparency so you're never left guessing.",
      "Your goals and vision are at the heart of our process, shaping every design decision we make to ensure meaningful results."
    ],
    [
      "We deliver rapid results while maintaining the highest standards of quality, ensuring you get the best without delay.",
      "You’ll see swift and clear outcomes, designed to meet your goals with precision."
    ],
    [
      "We eliminate unnecessary distractions and focus entirely on what matters, ensuring that every decision and action is aligned with your goals and vision for the project.",
      "Everything we build serves a purpose."
    ],
    [
      "From day one, you receive the highest level of expertise and craftsmanship. Our team brings years of experience and knowledge to every project, ensuring that you get exceptional work right from the start.",
      "We know design inside out."
    ]
  ];

  const descriptions =
    screenType === 'mobile' ? mobileDescriptions :
    screenType === 'tablet' ? tabletDescriptions :
    desktopDescriptions;

  return (
    <div className="my-8">
      <div className="why-content min-h-screen w-full overflow-hidden" ref={sectionRef}>
        <div className="why-header w-full px-4 md:px-16 py-12 leading-none md:py-20 text-center" ref={headerRef}>
          <h3 className='text-2xl md:text-5xl pb-4 text-[#D9D9D9] font-[Roboto_Flex] font-black tracking-wide leading-none overflow-hidden'>
            WHY TO CHOOSE AAKAAR?
          </h3>
          <span className='text-zinc-400 font-[Dancing_Script] text-xl leading-none md:text-2xl overflow-hidden block'>
            " Rooted in design. Focused on growth. Driven by impact. "
          </span>
        </div>

        <div className="why-cardsection flex items-center justify-center h-[75vh] px-4 md:px-5 w-full">
          <div className="cards-stack relative h-[70vh] w-full max-w-[900px]">
            {titles.map((title, i) => (
              <div
                key={i}
                ref={el => (cardRefs.current[i] = el)}
                className="card h-[70vh] w-full bg-[#27170e] rounded-lg flex flex-col md:flex-row absolute top-0 left-0 items-center justify-center shadow-xl px-4 md:px-6 lg:px-12 overflow-hidden"
              >
                <img
                  className="h-full w-full object-cover object-center opacity-5 rounded-lg absolute"
                  src="https://i.pinimg.com/236x/9a/98/55/9a985577ce4ee066cdd7071a628b2fa3.jpg"
                  alt="bg"
                  loading="lazy"
                />
                <div className="clarity-dets text-white h-full flex flex-col items-start justify-start z-10 px-4 py-18 md:pt-0 md:py-0 gap-6 md:gap-0">
                  <h5 className='font-[Tangerine] text-[#bababa] text-[5rem] md:text-[12rem] lg:text-[13rem] leading-none'>
                    {`0${i + 1}.`}
                  </h5>
                  <div className="s1-info text-start md:pr-20">
                    <h5 className='text-4xl md:text-6xl lg:text-[3.9rem] font-bold font-[Dancing_Script] py-4'>
                      {title}
                    </h5>
                    <div>
                      {descriptions[i].map((para, idx) => (
                        <p key={idx} className='font-[Familjen_Grotesk] text-zinc-300 text-[19px] md:text-xl lg:text-[1.3rem] pb-4 leading-snug'>
                          {para}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Why;