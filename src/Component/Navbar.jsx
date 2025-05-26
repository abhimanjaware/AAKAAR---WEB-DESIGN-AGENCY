import { useState, useEffect } from "react";
import { gsap } from "gsap";

const Navbar = () => {
  const [isActive, setIsActive] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [scrollDirection, setScrollDirection] = useState("up");
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [scrollbarWidth, setScrollbarWidth] = useState(0);

  // Menu data for mapping
  const menuItems = 
  [
    { id: 1, name: "HOME", href: "/", cursive: "Home" },
    { id: 2, name: "ABOUT", href: "#about", cursive: "About" },
    { id: 3, name: "WORK", href: "#work", cursive: "Work" },
    { id: 4, name: "SERVICES", href: "#services", cursive: "Services" },
    { id: 5, name: "CONTACT", href: "#contact", cursive: "Contact" }
  ];

  // Sticky nav links
  const navLinks = ["HOME", "ABOUT", "WORK", "SERVICES","CONTACT"];
  
  // Link paths for sticky nav (matching with menu items)
  const navLinkPaths = {
    "HOME": "/",
    "ABOUT": "#about",
    "WORK": "#work",
    "SERVICES": "#services",
    "CONTACT": "#contact"
  };

  // Social links for mapping
  const socialLinks = [
    { id: 1, name: "logo-instagram", href: "#", hoverColor: "pink-500", fromColor: "pink-400", viaColor: "pink-300", toColor: "violet-400" },
    { id: 2, name: "logo-linkedin", href: "#", hoverColor: "blue-600", fromColor: "blue-300", viaColor: "blue-700", toColor: "blue-600" },
    { id: 3, name: "logo-whatsapp", href: "#", hoverColor: "green-600", fromColor: "green-300", viaColor: "green-700", toColor: "green-800" },
    { id: 4, name: "mail-outline", href: "mailto:hey@aakaar.digital", hoverColor: "yellow-500", fromColor: "yellow-300", viaColor: "yellow-700", toColor: "yellow-800" }
  ];

  // Calculate scrollbar width on initial load
  useEffect(() => {
    // Calculate scrollbar width
    const calculateScrollbarWidth = () => {
      const outer = document.createElement('div');
      outer.style.visibility = 'hidden';
      outer.style.overflow = 'scroll';
      document.body.appendChild(outer);
      
      const inner = document.createElement('div');
      outer.appendChild(inner);
      
      const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
      outer.parentNode.removeChild(outer);
      
      return scrollbarWidth;
    };
    
    setScrollbarWidth(calculateScrollbarWidth());
  }, []);

  useEffect(() => {
    // Initialize overlay positions
    gsap.set(".overlay", { y: "-100%" });
    gsap.set(".overlay-1", { y: "-100%" });
    gsap.set(".overlay-2", { y: "-100%" });
    gsap.set(".main-menu-lists .menu-list a", { opacity: 0, y: 50 });
    gsap.set(".nav-socials", { opacity: 0 });
    gsap.set(".page-transition", { y: "100%" });
    gsap.set(".page-transition-1", { y: "100%" });
    gsap.set(".page-transition-2", { y: "100%" });
    
    // Add scroll event listener for sticky nav
    const handleScroll = () => {
      const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (currentScrollTop > lastScrollTop) {
        // Scrolling down
        setScrollDirection("down");
      } else {
        // Scrolling up
        setScrollDirection("up");
      }
      
      setLastScrollTop(currentScrollTop <= 0 ? 0 : currentScrollTop);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      // Ensure scroll is re-enabled when component unmounts
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [lastScrollTop]);

  // Effect to handle body scroll lock when menu is active
  useEffect(() => {
    if (isActive) {
      // Save current scroll position
      const scrollY = window.scrollY;
      
      // Add padding to the body to compensate for scrollbar disappearance
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      
      // Disable scrolling when menu is open
      document.body.style.overflow = 'hidden';
      
      // Fix position but maintain scroll position
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      // Re-enable scrolling when menu is closed
      if (document.body.style.position === 'fixed') {
        // Get the scroll position from the body top property
        const scrollY = document.body.style.top ? parseInt(document.body.style.top || '0', 10) * -1 : 0;
        
        // Reset body styles
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.paddingRight = '';
        document.body.style.width = '';
        
        // Restore scroll position
        window.scrollTo(0, scrollY);
      }
    }
    
    return () => {
      // Cleanup - ensure scroll is enabled when component unmounts
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.paddingRight = '';
      document.body.style.width = '';
    };
  }, [isActive, scrollbarWidth]);

  const toggleMenu = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    setIsActive((prev) => {
      const next = !prev;

      if (next) {
        // Opening animation sequence
        const tl = gsap.timeline({
          onComplete: () => {
            setIsTransitioning(false);
          }
        });

        // Reset positions before animating to prevent stacking issues
        gsap.set(".main-menu-lists .menu-list a", { opacity: 0, y: 50 });
        gsap.set(".nav-socials", { opacity: 0, y: 20 });

        // Animate overlay backgrounds
        tl.fromTo(".overlay", { y: "-100%" }, { y: 0, duration: 0.6, ease: "power3.inOut" })
          .fromTo(".overlay-1", { y: "-100%" }, { y: 0, duration: 0.5, ease: "power3.inOut" }, "-=0.4")
          .fromTo(".overlay-2", { y: "-100%" }, { y: 0, duration: 0.5, ease: "power3.inOut" }, "-=0.3");

        // Animate menu items
        tl.fromTo(".main-menu-lists", { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "power3.out" }, "-=0.1")
          .fromTo(".main-menu-lists .menu-list a", { opacity: 0, y: 150 }, {
            opacity: 1, y: 0, duration: 1.1, stagger: 0.06, ease: "power3.out", delay:-.9,
          }, "-=0.3");

        // Animate social elements
        tl.fromTo(".nav-socials", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, "-=0.3")
          .fromTo(".nav-socials-links a", { opacity: 0, y: 20 }, { 
            opacity: 1, y: 0, duration: 0.8, stagger: 0.04, ease: "power3.out"
          }, "-=0.3")
          .fromTo(".mail", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, "-=0.4");

      } else {
        // Closing animation sequence
        const tl = gsap.timeline({
          onComplete: () => {
            setIsTransitioning(false);
          }
        });

        // Animate menu content out first
        tl.to(".main-menu-lists .menu-list a", {
          opacity: 0, y: 50, duration: 0.4, stagger: 0.01, ease: "power2.in"
        });

        tl.to(".nav-socials", { opacity: 0, y: 20, duration: 0.4, ease: "power2.in" }, "-=0.2");

        // Animate overlay backgrounds with delays
        tl.to(".overlay-2", { y: "-100%", duration: 0.5, ease: "power3.inOut" }, "-=0.1")
          .to(".overlay-1", { y: "-100%", duration: 0.5, ease: "power3.inOut" }, "-=0.3")
          .to(".overlay", { y: "-100%", duration: 0.6, ease: "power3.inOut" }, "-=0.3");
      }

      return next;
    });
  };

  // Page transition animation
  const handleNavLinkClick = (e, targetPath) => {
    e.preventDefault();
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    // Run page transition animation
    const tl = gsap.timeline({
      onComplete: () => {
        // Reset transitions after completion
        resetTransition();
        // Navigate using window.location after animation completes
        window.location.href = targetPath;
      }
    });
    
    // If menu is active, close menu content first
    if (isActive) {
      tl.to(".main-menu-lists .menu-list a", {
        opacity: 0, y: 50, duration: 0.4, stagger: 0.05, ease: "power2.in"
      });

      tl.to(".nav-socials", { opacity: 0, y: 20, duration: 0.4, ease: "power2.in" }, "-=0.2");
    }

    // Page transition with overlays
    tl.fromTo(".page-transition", { y: "100%" }, { y: 0, duration: 0.6, ease: "power3.inOut" })
      .fromTo(".page-transition-1", { y: "100%" }, { y: 0, duration: 0.5, ease: "power3.inOut" }, "-=0.4")
      .fromTo(".page-transition-2", { y: "100%" }, { y: 0, duration: 0.5, ease: "power3.inOut" }, "-=0.3");
  };

  // Reset page transition animation
  const resetTransition = () => {
    const tl = gsap.timeline({
      onComplete: () => {
        setIsTransitioning(false);
        setIsActive(false);
        // Ensure scroll is re-enabled after transition
        if (document.body.style.position === 'fixed') {
          // Get the scroll position from the body top property
          const scrollY = document.body.style.top ? parseInt(document.body.style.top || '0', 10) * -1 : 0;
          
          // Reset body styles
          document.body.style.overflow = '';
          document.body.style.position = '';
          document.body.style.top = '';
          document.body.style.paddingRight = '';
          document.body.style.width = '';
          
          // Restore scroll position
          window.scrollTo(0, scrollY);
        }
      }
    });
    
    tl.to(".page-transition-2", { y: "100%", duration: 0.5, ease: "power3.inOut" })
      .to(".page-transition-1", { y: "100%", duration: 0.5, ease: "power3.inOut" }, "-=0.3")
      .to(".page-transition", { y: "100%", duration: 0.6, ease: "power3.inOut" }, "-=0.3");
      
    // Reset menu overlays
    tl.to(".overlay-2", { y: "-100%", duration: 0.5, ease: "power3.inOut" }, "-=0.1")
      .to(".overlay-1", { y: "-100%", duration: 0.5, ease: "power3.inOut" }, "-=0.3")
      .to(".overlay", { y: "-100%", duration: 0.6, ease: "power3.inOut" }, "-=0.3");
  };
  
  // Helper function for handling logo click
  const handleLogoClick = (e) => {
    e.preventDefault();
    handleNavLinkClick(e, "/");
  };

  return (
    <>
      {/* Fixed Navigation Bar - Always visible */}
      <nav className="fixed top-0 w-full py-2 px-2 flex justify-between items-center z-30">
  {/* This background layer makes blend mode work as expected */}
  <div className="absolute inset-0 bg-yellow-500/0 z-[-1] mix-blend-difference pointer-events-none"></div>

  <div className="logo text-white text-xl leading-none font-medium">
    <a href="#" onClick={handleLogoClick}>
      <img
        className="w-[13vw] md:w-[9vw] lg:w-[4.5vw] brightness-200 saturate-200 contrast-0 inline-block"
        src="src/assets/images/logogogogogo.png"
        alt="Logo"
      />
    </a>
  </div>

  <div className="nav-right flex items-center justify-center gap-8 text-[.9vw]">
    <div
      className={`sticky-navlinks text-white px-6 border-r-[1px] border-white hidden lg:block transition-all duration-300 ${
        scrollDirection === 'down'
          ? 'opacity-0 translate-y-[-20px]'
          : 'opacity-100 translate-y-0'
      }`}
    >
      <ul className="flex gap-7">
        {navLinks.map((link, index) => (
          <li key={index}>
            <div className="navl1 relative overflow-hidden cursor-pointer">
              <a
                href="#"
                className="button leading-none relative flex flex-row-reverse items-end justify-start overflow-hidden transition-all ease-in duration-300 group"
                onClick={(e) => handleNavLinkClick(e, navLinkPaths[link])}
              >
                <div className="flex flex-col justify-center items-center relative w-full">
                  <span className="block font-normal leading-none font-[Familjen_Grotesk] transition-all ease-in duration-300 text-white text-center group-hover:translate-y-[-80%] group-focus:translate-y-[-100%] capitalize tracking-tight group-hover:opacity-0 group-focus:opacity-0 whitespace-nowrap">
                    {link}
                  </span>
                  <span className="absolute leading-none font-[Familjen_Grotesk] tracking-tight font-bold flex justify-center items-start transition-all ease-in duration-300 text-white text-center opacity-0 group-hover:opacity-100 group-focus:opacity-100 translate-y-[100%] group-hover:translate-y-0 group-focus:translate-y-0 whitespace-nowrap">
                    {link}
                  </span>
                </div>
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>

    <button
      className="relative w-10 h-[8px] md:w-16 lg:w-18 lg:h-[8px] group flex flex-col justify-between items-center z-50 cursor-pointer"
      onClick={toggleMenu}
      aria-label="Toggle menu"
      disabled={isTransitioning}
    >
      <span
        className={`block h-[1px] bg-white transform transition-all duration-500 ease-in-out ${
          isActive
            ? 'rotate-45 translate-y-[4px] w-[40%]'
            : 'w-full group-hover:translate-x-1.5'
        }`}
      ></span>
      <span
        className={`block h-[1px] bg-white transform transition-all duration-500 ease-in-out ${
          isActive
            ? '-rotate-45 -translate-y-[4px] w-[40%]'
            : 'w-full group-hover:-translate-x-1.5'
        }`}
      ></span>
    </button>
  </div>
</nav>


      {/* Page Transition Overlays */}
      <div className="page-transition fixed top-0 left-0 w-screen h-screen bg-black z-40 transform translate-y-full"></div>
      <div className="page-transition-1 fixed top-0 left-0 w-screen h-screen bg-[#d9d9d9a2] z-50 transform translate-y-full"></div>
      <div className="page-transition-2 fixed top-0 left-0 w-screen h-screen bg-[#27170e] z-60 transform translate-y-full"></div>

      {/* Fixed Menu Overlay - Independent of scroll */}
      <div className={`overlay fixed top-0 left-0 w-screen h-screen bg-black z-20 overflow-hidden ${isActive ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <div className="overlay-1 absolute top-0 left-0 w-full h-full bg-[#d9d9d9a2] z-10" />
        <div className="overlay-2 absolute top-0 left-0 w-full h-full bg-[#27170e] z-20" />
        
        <div className="content-wrapper  px-0 pt-8 leading-none fixed top-0 left-0 z-30 w-full h-full">
          <div className="relative w-full flex top-0  flex-col md:flex-row items-end justify-around md:items-center  md:gap-10 lg:gap-20 xl:gap-96 p-8 md:p-16 lg:p-32 h-full overflow-hidden">
          <div className="md:flex-row md:gap-2.5 flex flex-col justify-end">
              <div className="main-menu-lists w-full   md:w-[70%] lg:w-[90%] md:pr-10 lg:pr-40 md:border-r-[1px] border-zinc-500">
              {menuItems.map((item) => (
                <div key={item.id} className="menu-list relative overflow-hidden cursor-pointer">
                  <a 
                    href="#" 
                    className="button m-2 leading-none pt-4 pr-0 lg:pr-8 relative flex flex-row-reverse items-end justify-start gap-4 overflow-hidden transition-all ease-in duration-300 group" 
                    onClick={(e) => handleNavLinkClick(e, item.href)}
                  >
                    <div className="flex flex-col justify-end items-end relative w-full">
                      <span className="block font-bold leading-none font-[Familjen_Grotesk] text-6xl md:text-8xl lg:text-[7vw] transition-all ease-in duration-300 text-[#D9D9D9] text-center group-hover:translate-y-[-80%] group-focus:translate-y-[-100%] capitalize tracking-tight group-hover:opacity-0 group-focus:opacity-0 whitespace-nowrap">
                        {item.name}
                      </span>
                      <span className="absolute leading-none font-[Tangerine] tracking-tight font-bold flex justify-center items-start text-6xl md:text-8xl lg:text-[7.5vw] transition-all ease-in duration-300 text-[#D9D9D9] text-center opacity-0 group-hover:opacity-100 group-focus:opacity-100 translate-y-[100%] group-hover:translate-y-0 group-focus:translate-y-0 whitespace-nowrap">
                        {item.cursive}
                      </span>
                    </div>
                    <div className="rounded-full group-hover:-rotate-45 opacity-0 group-hover:opacity-100 absolute left-0 transition-all ease-in group-hover:duration-300 text-zinc-200 font-light">
                      <ion-icon name="arrow-forward-outline" size="large"></ion-icon>
                    </div>
                  </a>
                </div>
              ))}
            </div>

            <div className="nav-right w-full pt-8  lg:pl-24  md:w-[40%] lg:w-[50%] lg:items-center mt-10 md:mt-0 h-auto md:justify-end md:items-end flex flex-col items-center justify-center ">
              <div className="nav-socials flex flex-col justify-center items-center overflow-hidden w-full">
                <div className="overflow-hidden  w-full text-end lg:text-center hidden  md:block">
                  <div className="mail py-3 pt-9 w-full  text-lg md:text-xl lg:text-xl leading-none text-white font-normal  md:text-center ">
                    <a href="mailto:hey@aakaar.digital" className="hover:text-[18.3px] cursor-pointer transition-all ease-in duration-400">hey@aakaar.digital</a>
                  </div>
                </div>
                
                <div className="nav-socials-links overflow-hidden  w-full flex py-3 gap-4 justify-end lg:justify-center">
                  {socialLinks.map((social) => (
                    <a 
                      key={social.id} 
                      href={social.href} 
                      className={`text-2xl bg-white text-[#27170e] hover:text-${social.hoverColor} hover:font-black hover:scale-95 rounded-full p-3 flex justify-center items-center duration-300 focus:bg-gradient-to-b from-${social.fromColor} via-${social.viaColor} to-${social.toColor} focus:text-white`}
                    >
                      <ion-icon name={social.name}></ion-icon>
                    </a>
                  ))}
                </div>
                
                <div className="cta-btn   w-full pt-2 flex justify-end lg:justify-center">
                  <div className="nav-Button bg-[#D9D9D9] w-fit leading-none border-[1px] border-[#D9D9D9]/30 hover:scale-[0.9] active:bg-[#D9D9D9] active:scale-[1] px-5 py-1 relative rounded-full flex items-center justify-center gap-4 overflow-hidden font-[Quicksand] transition-all ease-in duration-300 group hover:bg-[#27170e] focus-within:scale-95">
                    <a href="https://sales.radianmedia.org" target="_blank" className="relative h-[3.5rem] flex items-center justify-center">
                      <div className="flex flex-col justify-center items-center relative">
                        <span className="block font-bold leading-none font-[Familjen_Grotesk] text-[4vw] transition-all ease-in duration-300 text-[#27170e] text-center tracking-tighter group-hover:translate-y-[-100%] group-focus:translate-y-[-100%] group-hover:opacity-0 group-focus:opacity-0 whitespace-nowrap  md:text-[2.5vw] lg:text-[1vw]">
                          Let's Connect
                        </span>
                        <span className="absolute font-bold leading-none font-[Familjen_Grotesk] text-[4vw] transition-all ease-in duration-300 group-active:text-[#27170e] text-[#D9D9D9] text-center tracking-tighter opacity-0 group-hover:opacity-100 group-focus:opacity-100 translate-y-[100%] group-hover:translate-y-0 group-focus:translate-y-0 whitespace-nowrap md:text-[2.5vw] lg:text-[1vw]">
                          Let's Connect
                        </span>
                      </div>
                    </a>
                    <div className='p-3 rounded-full group-hover:-rotate-45 scale-[0.4] transition-all ease-in group-hover:duration-300 group-hover:scale-100 text-[#27170e] group-active:bg-[#27170e] group-active:text-[#D9D9D9] bg-[#27170e] group-hover:text-[#27170e] group-hover:bg-[#D9D9D9]'>
                      <ion-icon name="arrow-forward-outline" size="small"></ion-icon>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;