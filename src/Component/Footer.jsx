import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function Footer() {
  const buttonRef = useRef(null);
  const borderRef = useRef(null);
  const textRefs = useRef([]);
  const mainContainerRef = useRef(null);
  const footerContentRef = useRef(null);
  const footerLastRef = useRef(null);

  const hoverAnimation = useRef(null);

  useEffect(() => {
    textRefs.current = [];

    const ctx = gsap.context(() => {
      gsap.set(textRefs.current, {
        y: 100,
        opacity: 0,
      });

      gsap.set(buttonRef.current, {
        scale: 0.7,
        opacity: 0,
        y: 40,
      });

      gsap.set(borderRef.current, {
        opacity: 0,
        scale: 0.8,
      });

      gsap.set(footerLastRef.current, {
        y: 30,
        opacity: 0,
      });

      // Main entrance timeline
      const mainTl = gsap.timeline({
        scrollTrigger: {
          trigger: footerContentRef.current,
          start: 'top 80%',
          end: 'top 30%',
          scrub: 0.5,
          toggleActions: 'play none none reverse',
        },
        defaults: { ease: 'power2.out' },
      });

      mainTl
        .to(textRefs.current, {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 0.8,
          ease: 'power3.out',
        })
        .to(
          buttonRef.current,
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'back.out(1.7)',
          },
          '-=0.4'
        )
        .to(
          borderRef.current,
          {
            opacity: 0.1,
            scale: 1,
            duration: 0.4,
          },
          '<'
        )
        .to(
          footerLastRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
          },
          '-=0.2'
        );

      // Parallax text float
      gsap.to(textRefs.current, {
        yPercent: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: footerContentRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Background and heading scale-in
      gsap.fromTo(
        mainContainerRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: footerContentRef.current,
            start: 'top 90%',
          },
        }
      );

      gsap.fromTo(
        '.footer-head',
        { scale: 0.97, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: footerContentRef.current,
            start: 'top 90%',
          },
        }
      );

      // Floating text effect
      textRefs.current.forEach((el, index) => {
        gsap.to(el, {
          y: '+=8',
          duration: 2,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: index * 0.2,
        });
      });

      // Footer last section fade up
      gsap.fromTo(
        footerLastRef.current,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: footerContentRef.current,
            start: 'top 70%',
          },
        }
      );

      // Border rotation
      hoverAnimation.current = gsap.to(borderRef.current, {
        rotation: 360,
        duration: 8,
        ease: 'linear',
        repeat: -1,
        paused: true,
      });

      const handleMouseEnter = () => {
        gsap.killTweensOf(borderRef.current, 'opacity,scale');
        gsap.to(borderRef.current, {
          opacity: 0.5,
          scale: 1,
          duration: 0.3,
          ease: 'power2.inOut',
        });
        hoverAnimation.current.play();
      };

      const handleMouseLeave = () => {
        gsap.killTweensOf(borderRef.current, 'opacity,scale');
        gsap.to(borderRef.current, {
          opacity: 1,
          scale: 1.1,
          duration: 0.3,
          ease: 'power2.inOut',
        });
        hoverAnimation.current.pause();
      };

      buttonRef.current.addEventListener('mouseenter', handleMouseEnter);
      buttonRef.current.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        buttonRef.current?.removeEventListener('mouseenter', handleMouseEnter);
        buttonRef.current?.removeEventListener('mouseleave', handleMouseLeave);
      };
    }, mainContainerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  const addToRefs = (el) => {
    if (el && !textRefs.current.includes(el)) {
      textRefs.current.push(el);
    }
  };

  return (
    <div  id="contact" ref={mainContainerRef} className="overflow-hidden px-3 bg-[#1e110a]">
      <div
        ref={footerContentRef}
        className="footer-content min-h-screen w-full relative bg-[#1e110a]"
      >
        <div
          className="footer-head leading-none w-fit h-[70vh]  flex flex-col px-[8rem] md:px-[5rem] sm:px-[2rem] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <div className="letstext overflow-hidden">
            <p
              ref={addToRefs}
              className="whitespace-nowrap text-[11vw] lg:text-[6vw] md:text-[11vw] pl-5 md:pl-3 lg:pl-0 text-[#D9D9D9] tracking-tight font-black font-[Familjen_Grotesk] leading-none text-start uppercase"
            >
              Let's Start
            </p>
          </div>

          <div className="extratext overflow-hidden pt-3 px-4 md:px-2">
            <p
              ref={addToRefs}
              className="whitespace-nowrap text-[#D9D9D9] text-[14vw] md:text-[15vw] lg:text-[12vw] tracking-tight font-black font-[Tangerine] leading-none text-center"
            >
              Something Extraordinary
            </p>
          </div>

          <div className="togethertext overflow-hidden">
            <p
              ref={addToRefs}
              className="whitespace-nowrap text-[10vw] md:text-[11vw] lg:text-[6vw] text-[#D9D9D9] tracking-tight font-black font-[Familjen_Grotesk] pr-5 md:pr-3 lg:pr-0 leading-none text-end uppercase"
            >
              Together
            </p>
          </div>

          <div className="btn absolute top-[40%] md:top-[50%] lg:left-[5%] lg:top-[63%] md:left-[26%] right-40 sm:left-[23%]">
            <div className="relative flex items-center justify-center">
              <span
                ref={borderRef}
                className="absolute w-[5vw] h-[5vw] md:w-[40vw] md:h-[40vw] lg:w-[17vw] lg:h-[17vw] rounded-full border border-[#D9D9D9]/30 opacity-0"
              ></span>

              <a
                href="#"
                ref={buttonRef}
                className="group relative flex items-center justify-center p-32 md:p-24 sm:p-20 w-[5vw] h-[5vw] md:w-[40vw] md:h-[40vw] lg:w-[17vw] lg:h-[17vw] bg-[#D9D9D9] rounded-full text-[#1e110a] font-bold text-xl overflow-hidden transform will-change-transform"
              >
                <span className="absolute inset-0 bg-[#4f2e1d] rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-500 ease-out"></span>
                <span className="relative z-10 font-[Familjen_Grotesk] whitespace-nowrap text-[5vw] sm:text-[1vw] md:text-[3vw] lg:text-[1.5vw] font-medium group-hover:text-[#D9D9D9] transition-colors duration-300">
                  CONNECT NOW!
                </span>
              </a>
            </div>
          </div>
        </div>

        <div
          ref={footerLastRef}
          className="footer-last w-full absolute bottom-0 flex pb-4 flex-col-reverse lg:flex-row lg:justify-between text-center justify-end lg:text-start lg:flex"
        >
          <div className="copyright px-4">
            <p className="text-zinc-700 font-[Familjen_Grotesk] whitespace-nowrap text-sm sm:text-xs md:text-sm">
              © 2025 Aakaar Digital. All rights reserved.
            </p>
          </div>

          <div className="call flex gap-1 items-center justify-center lg:justify-end">
            <div className="text-zinc-700">
              <p>
                <ion-icon name="call-outline"></ion-icon>
              </p>
            </div>
            <div>
              <p className="text-zinc-700 font-[Familjen_Grotesk] text-sm sm:text-xs md:text-sm">
                +91 9689762896
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
