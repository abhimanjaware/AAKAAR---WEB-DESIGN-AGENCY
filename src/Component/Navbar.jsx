import React, { useState, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import logo from "../assets/images/logogogogogo.png";

gsap.registerPlugin(ScrollTrigger);

const Navbar = () => {
  const [isActive, setIsActive] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [scrollDirection, setScrollDirection] = useState(null);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [scrollbarWidth, setScrollbarWidth] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Unified menu data for both sticky and overlay nav
  const menuItems = {
    sticky: [
      { name: "HOME", href: "/", cursive: "Home" },
      { name: "ABOUT", href: "#about", cursive: "About" },
      { name: "WORK", href: "#work", cursive: "Work" },
      { name: "SERVICES", href: "#services", cursive: "Services" },
      { name: "CONTACT", href: "#contact", cursive: "Contact" }
    ],
    overlay: [
      { name: "HOME", href: "/", cursive: "Home" },
      { name: "ABOUT", href: "#about", cursive: "About" },
      { name: "WORK", href: "#work", cursive: "Work" },
      { name: "SERVICES", href: "#services", cursive: "Services" },
      { name: "CONTACT", href: "#contact", cursive: "Contact" }
    ]
  };

const socialLinks = [
  {
    name: "logo-instagram",
    href: "https://www.instagram.com/aakaar.29/?utm_source=ig_web_button_share_sheet", // replace with your actual Instagram username
    hoverColor: "pink-500",
    fromColor: "pink-400",
    viaColor: "pink-300",
    toColor: "violet-400"
  },
  {
    name: "logo-linkedin",
    href: "https://www.linkedin.com/in/aakaar-web-design-agency-7405b0324/", // replace with your actual LinkedIn page
    hoverColor: "blue-600",
    fromColor: "blue-300",
    viaColor: "blue-700",
    toColor: "blue-600"
  },
  {
    name: "logo-whatsapp",
    href: "https://wa.me/919689762896?text=Hi%20there%2C%20I%20visited%20your%20website%20and%20wanted%20to%20connect!", // replace with your WhatsApp number in international format
    hoverColor: "green-600",
    fromColor: "green-300",
    viaColor: "green-700",
    toColor: "green-800"
  },
  {
    name: "mail-outline",
    href: "mailto:hey@aakaar.digital",
    hoverColor: "yellow-500",
    fromColor: "yellow-300",
    viaColor: "yellow-700",
    toColor: "yellow-800"
  }
];


  

  // Calculate scrollbar width and initialize GSAP
  useEffect(() => {
    const calculateScrollbarWidth = () => {
      const outer = document.createElement('div');
      outer.style.cssText = 'visibility:hidden;overflow:scroll';
      document.body.appendChild(outer);
      
      const inner = document.createElement('div');
      outer.appendChild(inner);
      
      const width = outer.offsetWidth - inner.offsetWidth;
      document.body.removeChild(outer);
      return width;
    };
    
    setScrollbarWidth(calculateScrollbarWidth());

    // Initialize GSAP positions
    gsap.set([".overlay", ".overlay-1", ".overlay-2"], { y: "-100%" });
    gsap.set(".main-menu-lists .menu-list a", { opacity: 0, y: 50 });
    gsap.set(".nav-socials", { opacity: 0 });
    gsap.set([".page-transition", ".page-transition-1", ".page-transition-2"], { y: "100%" });
    
    setTimeout(() => {
      setScrollDirection("up");
      setIsInitialized(true);
    }, 100);
  }, []);

  // Scroll direction handler
  useEffect(() => {
    if (!isInitialized) return;
    
    const handleScroll = () => {
      const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (Math.abs(currentScrollTop - lastScrollTop) > 5) {
        setScrollDirection(currentScrollTop > lastScrollTop ? "down" : "up");
        setLastScrollTop(Math.max(currentScrollTop, 0));
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollTop, isInitialized]);

  // Body scroll lock management
  useEffect(() => {
    const body = document.body;
    
    if (isActive) {
      const scrollY = window.scrollY;
      Object.assign(body.style, {
        paddingRight: `${scrollbarWidth}px`,
        overflow: 'hidden',
        position: 'fixed',
        top: `-${scrollY}px`,
        width: '100%'
      });
      
    } else {
      const scrollY = body.style.position === 'fixed' 
        ? parseInt(body.style.top || '0', 10) * -1 
        : 0;
      
      Object.assign(body.style, {
        overflow: '',
        position: '',
        top: '',
        paddingRight: '',
        width: ''
      });
      
      if (scrollY) window.scrollTo(0, scrollY);
    }

    return () => {
      Object.assign(body.style, {
        overflow: '',
        position: '',
        top: '',
        paddingRight:'',
        width: ''
      });
    };
  }, [isActive, scrollbarWidth]);

  const toggleMenu = useCallback(() => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setIsActive(prev => {
      const next = !prev;
      const tl = gsap.timeline({ onComplete: () => setIsTransitioning(false) });

      if (next) {
        // Opening animation
        gsap.set(".main-menu-lists .menu-list a", { opacity: 0, y: 50 });
        gsap.set(".nav-socials", { opacity: 0, y: 20 });

        tl.fromTo([".overlay", ".overlay-1", ".overlay-2"], 
          { y: "-100%" }, 
          { y: 0, duration: 0.6, ease: "power3.inOut", stagger: 0.1 })
          .fromTo(".main-menu-lists", { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "power3.out" }, "-=0.1")
          .fromTo(".main-menu-lists .menu-list a", 
            { opacity: 0, y: 150 }, 
            { opacity: 1, y: 0, duration: 1.1, stagger: 0.06, ease: "power3.out" }, "-=1.2")
          .fromTo(".nav-socials", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, "-=0.3")
          .fromTo(".nav-socials-links a", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.04, ease: "power3.out" }, "-=0.3")
          .fromTo(".mail", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, "-=0.4");
      } else {
        // Closing animation
        tl.to(".main-menu-lists .menu-list a", { opacity: 0, y: 50, duration: 0.4, stagger: 0.01, ease: "power2.in" })
          .to(".nav-socials", { opacity: 0, y: 20, duration: 0.4, ease: "power2.in" }, "-=0.2")
          .to([".overlay-2", ".overlay-1", ".overlay"], 
            { y: "-100%", duration: 0.5, ease: "power3.inOut", stagger: 0.2 }, "-=0.1");
      }

      return next;
    });
  }, [isTransitioning]);

  const handleNavigation = useCallback((e, targetPath, isOverlayLink = false) => {
    e.preventDefault();
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(() => {
          setIsTransitioning(false);
          if (isOverlayLink) {
            setIsActive(false);
          }
          gsap.set([".page-transition", ".page-transition-1", ".page-transition-2"], { y: "100%" });
          gsap.set([".overlay", ".overlay-1", ".overlay-2"], { y: "-100%" });
        }, 100);
      }
    });

    // Close menu if active with smooth animation (only for overlay links)
    if (isActive && isOverlayLink) {
      tl.to(".main-menu-lists .menu-list a", { 
        opacity: 0, 
        y: 50, 
        duration: 0.4, 
        stagger: 0.02, 
        ease: "power2.in" 
      })
      .to(".nav-socials", { 
        opacity: 0, 
        y: 20, 
        duration: 0.4, 
        ease: "power2.in" 
      }, "-=0.2");
    }

    // Page transition animation for all navigation
    tl.fromTo([".page-transition", ".page-transition-1", ".page-transition-2"], 
      { y: "100%" }, 
      { 
        y: 0, 
        duration: 0.8, 
        ease: "power3.inOut", 
        stagger: 0.15
      }, isActive && isOverlayLink ? "-=0.2" : "0")
    .call(() => {
      if (targetPath === "/") {
        window.location.href = targetPath;
      } else if (targetPath.startsWith("#")) {
        const targetElement = document.querySelector(targetPath);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else if (targetPath.startsWith("http")) {
        window.open(targetPath, '_blank');
      }
    })
    .to([".page-transition-2", ".page-transition-1", ".page-transition"], 
      { 
        y: "-100%", 
        duration: 0.8, 
        ease: "power3.inOut", 
        stagger: 0.15 
      }, "+=0.2");

    // Close overlay menu animation (only for overlay links)
    if (isActive && isOverlayLink) {
      tl.to([".overlay-2", ".overlay-1", ".overlay"], 
        { 
          y: "-100%", 
          duration: 0.6, 
          ease: "power3.inOut", 
          stagger: 0.1 
        }, "-=1.2");
    }
  }, [isActive, isTransitioning]);

  const NavLink = ({ item, className = "", textSize = "", isOverlay = false }) => (
    <div className="menu-list relative overflow-hidden cursor-pointer">
      <a 
        href={item.href} 
        className={`button leading-none relative flex flex-row-reverse items-end justify-start overflow-hidden transition-all ease-in duration-300 group ${className}`}
        onClick={(e) => handleNavigation(e, item.href, isOverlay)}
      >
        <div className="flex flex-col justify-center items-center relative w-full overflow-hidden">
          <span className={`block font-bold leading-none font-[Familjen_Grotesk] transition-all ease-in duration-300 text-white text-center group-hover:translate-y-[-80%] group-focus:translate-y-[-100%] capitalize tracking-tight group-hover:opacity-0 group-focus:opacity-0 whitespace-nowrap ${textSize}`}>
            {item.name}
          </span>
          <span className={`absolute leading-none font-[Tangerine] tracking-tight font-bold flex justify-center items-start transition-all ease-in duration-300 text-white text-center opacity-0 group-hover:opacity-100 group-focus:opacity-100 translate-y-[100%] group-hover:translate-y-0 group-focus:translate-y-0 whitespace-nowrap ${textSize.includes('text-[6') ? 'text-[7.5vw]' : textSize.replace('text-5xl', 'text-6xl').replace('text-8xl', 'text-9xl')}`}>
            {item.cursive}
          </span>
        </div>
        {isOverlay && (
          <div className="rounded-full group-hover:-rotate-45 opacity-0 group-hover:opacity-100 absolute left-0 transition-all ease-in group-hover:duration-300 text-zinc-200 font-light">
            <ion-icon name="arrow-forward-outline" size="large"></ion-icon>
          </div>
        )}
      </a>
    </div>
  );

  return (
    <>
      {/* Fixed Navigation Bar */}
      <nav className="fixed top-0 w-full py-2 px-3 flex justify-between items-center z-30">
        <div className="absolute inset-0 bg-yellow-500/0 z-[-1] mix-blend-difference pointer-events-none"></div>

        <div className="logo text-white text-xl leading-none font-medium">
          <a href="/" onClick={(e) => handleNavigation(e, "/")}>
            <img
              className="w-[16vw] md:w-[9vw] lg:w-[4.5vw] brightness-200 saturate-200 contrast-0 inline-block"
              src={logo}
              alt="Logo"
            />
          </a>
        </div>

        <div className="nav-right flex items-center justify-center gap-8 text-[.9vw]">
          <div className={`sticky-navlinks text-white px-6 border-r-[1px] border-white hidden lg:block transition-all duration-300 ${
            !isInitialized || scrollDirection === 'down' ? 'opacity-0 translate-y-[-20px]' : 'opacity-100 translate-y-0'
          }`}>
            <ul className="flex gap-7">
              {menuItems.sticky.map((item, index) => (
                <li key={index}>
                  <NavLink item={item} />
                </li>
              ))}
            </ul>
          </div>

          <button
            className="relative w-12 h-[8px] md:w-16 lg:w-18 lg:h-[8px] group flex flex-col justify-between items-center z-50 cursor-pointer"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            disabled={isTransitioning}
          >
            <span className={`block h-[1px] bg-white transform transition-all duration-500 ease-in-out ${
              isActive ? 'rotate-45 translate-y-[4px] w-[50%]' : 'w-full group-hover:translate-x-1.5'
            }`}></span>
            <span className={`block h-[1px] bg-white transform transition-all duration-500 ease-in-out ${
              isActive ? '-rotate-45 -translate-y-[4px] w-[50%]' : 'w-full group-hover:-translate-x-1.5'
            }`}></span>
          </button>
        </div>
      </nav>

      {/* Page Transition Overlays */}
      <div className="page-transition fixed top-0 left-0 w-screen h-screen bg-black z-40 transform translate-y-full"></div>
      <div className="page-transition-1 fixed top-0 left-0 w-screen h-screen bg-[#d9d9d9a2] z-50 transform translate-y-full"></div>
      <div className="page-transition-2 fixed top-0 left-0 w-screen h-screen bg-[#27170e] z-60 transform translate-y-full"></div>

      {/* Fixed Menu Overlay */}
      <div className={`overlay fixed top-0 left-0 w-screen h-screen bg-black z-20 overflow-hidden ${isActive ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <div className="overlay-1 absolute top-0 left-0 w-full h-full bg-[#d9d9d9a2] z-10" />
        <div className="overlay-2 absolute top-0 left-0 w-full h-full bg-[#27170e] z-20" />
        
        <div className="content-wrapper px-0 pt-4 leading-none fixed top-0 left-0 z-30 w-full h-full">
          <div className="relative w-full flex top-0 flex-col md:flex-row items-end justify-around md:items-center md:gap-10 lg:gap-20 xl:gap-96 p-8 md:p-16 lg:p-32 h-full overflow-hidden">
            <div className="md:flex-row md:gap-2.5 flex flex-col justify-end">
              <div className="main-menu-lists w-full flex flex-col items-end md:w-[70%] lg:w-[90%] md:pr-10 lg:pr-40 md:border-r-[1px] border-zinc-500">
                {menuItems.overlay.map((item, index) => (
                  <NavLink 
                    key={index}
                    item={item} 
                    className="m-2 pt-2 mt-0 pr-0 lg:pr-8 gap-5" 
                    textSize="text-5xl md:text-8xl lg:text-[6vw] text-[#D9D9D9]" 
                    isOverlay={true}
                  />
                ))}
              </div>

              <div className="nav-right w-full pt-8 lg:pl-24 md:w-[40%] lg:w-[50%] lg:items-center mt-10 md:mt-0 h-auto md:justify-end md:items-end flex flex-col items-center justify-center">
                <div className="nav-socials flex flex-col justify-center items-center overflow-hidden w-full">
                  <div className="overflow-hidden w-full text-end lg:text-center hidden md:block">
                    <div className="mail py-3 pt-9 w-full text-lg md:text-xl lg:text-xl leading-none text-white font-normal md:text-center">
                      <a href="mailto:hey@aakaar.digital" className="hover:text-[18.3px] cursor-pointer transition-all ease-in duration-400">hey@aakaar.digital</a>
                    </div>
                  </div>
                  
                  <div className="nav-socials-links overflow-hidden w-full flex pb-2 gap-4 justify-end lg:justify-center">
                    {socialLinks.map((social, index) => (
                      <a 
                        key={index}
                        href={social.href} 
                        className={`text-2xl bg-white text-[#27170e] hover:text-${social.hoverColor} hover:font-black hover:scale-95 rounded-full p-3 flex justify-center items-center duration-300 focus:bg-gradient-to-b from-${social.fromColor} via-${social.viaColor} to-${social.toColor} focus:text-white`}
                        target={social.href.startsWith('http') ? '_blank' : '_self'}
                        rel={social.href.startsWith('http') ? 'noopener noreferrer' : ''}
                      >
                        <ion-icon name={social.name}></ion-icon>
                      </a>
                    ))}
                  </div>
                  
                  <div className="cta-btn w-full pt-2 flex justify-end lg:justify-center">
                    <div className="nav-Button bg-[#D9D9D9] w-fit leading-none border-[1px] border-[#D9D9D9]/30 hover:scale-[0.9] active:bg-[#D9D9D9] active:scale-[1] px-5 py-1 relative rounded-full flex items-center justify-center gap-4 overflow-hidden font-[Quicksand] transition-all ease-in duration-300 group hover:bg-[#27170e] focus-within:scale-95">
                      <a href="https://wa.me/919689762896?text=Hi%20there%2C%20I%20visited%20your%20website%20and%20wanted%20to%20connect!" target="_blank" rel="noopener noreferrer" className="relative h-[3.5rem] flex items-center justify-center">
                        <div className="flex flex-col justify-center items-center relative">
                          <span className="block font-bold leading-none font-[Familjen_Grotesk] text-[4vw] transition-all ease-in duration-300 text-[#27170e] text-center tracking-tighter group-hover:translate-y-[-100%] group-focus:translate-y-[-100%] group-hover:opacity-0 group-focus:opacity-0 whitespace-nowrap md:text-[2.5vw] lg:text-[1vw]">
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