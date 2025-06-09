import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const ScrollToTopButton = () => {
  const buttonRef = useRef(null);
  const arrowsRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const lastScrollTop = useRef(0);
  const animationRef = useRef(null);
  const arrowIdleAnim = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      if (scrollTop > lastScrollTop.current) {
        setIsVisible(false); // scrolling down
      } else {
        setIsVisible(scrollTop > 100); // scrolling up and passed threshold
      }

      lastScrollTop.current = Math.max(scrollTop, 0);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    if (animationRef.current) animationRef.current.kill();

    animationRef.current = gsap.to(button, {
      autoAlpha: isVisible ? 1 : 0,
      y: isVisible ? 0 : 40,
      duration: 0.7,
      ease: 'power3.out',
      overwrite: 'auto',
    });

    // Start idle arrow bounce when visible
    if (isVisible && arrowsRef.current) {
      if (arrowIdleAnim.current) arrowIdleAnim.current.kill();

      arrowIdleAnim.current = gsap.fromTo(
        arrowsRef.current.children,
        { y: 0 },
        {
          y: -4,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          duration: 0.6,
          stagger: 0.1,
        }
      );
    } else {
      // Kill idle animation when hidden
      if (arrowIdleAnim.current) {
        arrowIdleAnim.current.kill();
        arrowIdleAnim.current = null;
        gsap.set(arrowsRef.current.children, { y: 0 });
      }
    }
  }, [isVisible]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Click animation: subtle bounce
    gsap.timeline()
      .to(arrowsRef.current.children, {
        y: -14,
        opacity: 0,
        stagger: 0.05,
        duration: 0.2,
        ease: 'power1.in',
      })
      .to(arrowsRef.current.children, {
        y: 0,
        opacity: 1,
        stagger: 0.05,
        duration: 0.6,
        ease: 'elastic.out(1, 0.5)',
      }, '-=0.1');
  };

  return (
   <div className='hidden lg:block'>
     <button
      ref={buttonRef}
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className="fixed bottom-3 right-2 lg:bottom-5 md:right-4 md:bottom-4 lg:right-5 mix-blend-difference z-50   lg:p-6 w-12 h-12 flex flex-col items-center justify-center rounded-full backdrop-blur-3xl border border-[#D9D9D9]/30 bg-black/5 hover:bg-black focus:outline-none focus:ring-2 focus:white"
      style={{ opacity: 0, visibility: 'hidden', transform: 'translateY(40px)' }}
    >
      <div ref={arrowsRef} className="flex flex-col items-center justify-center">
        <span className="text-white text-md lg:text-xl font-normal leading-none transform scale-x-200">^</span>
        <span className="text-white text-md lg:text-xl font-normal leading-none transform scale-x-200 -mt-3" style={{marginTop:'-10.5px'}}>^</span>
        <span className="text-white text-md lg:text-xl font-normal leading-none transform scale-x-200 -mt-3" style={{marginTop:'-10.5px'}}>^</span>
      </div>
    </button>
   </div>
  );
};

export default ScrollToTopButton;
