import React, { useState, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import logo from "../assets/images/logogogogogo.png";

gsap.registerPlugin(ScrollTrigger);

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollDirection, setScrollDirection] = useState("up");
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const menuItems = [
    { name: "HOME", href: "/", cursive: "Home" },
    { name: "ABOUT", href: "#about", cursive: "About" },
    { name: "WORK", href: "#work", cursive: "Work" },
    { name: "SERVICES", href: "#services", cursive: "Services" },
    { name: "CONTACT", href: "#contact", cursive: "Contact" },
  ];

  const socialLinks = [
    { name: "logo-instagram", href: "https://www.instagram.com/aakaar.29/" },
    { name: "logo-linkedin", href: "https://www.linkedin.com/in/aakaar-web-design-agency-7405b0324/" },
    { name: "logo-whatsapp", href: "https://wa.me/919689762896" },
    { name: "mail-outline", href: "mailto:hey@aakaar.digital" },
  ];

  useEffect(() => {
    gsap.set([".page-transition", ".page-transition-1", ".page-transition-2"], {
      y: "100%",
      opacity: 1,
      transformOrigin: "bottom center",
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
      if (currentScroll > lastScrollTop && currentScroll > 50) {
        setScrollDirection("down");
      } else {
        setScrollDirection("up");
      }
      setLastScrollTop(currentScroll <= 0 ? 0 : currentScroll);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollTop]);

  const handleNavigation = useCallback((e, href) => {
    e.preventDefault();
    if (isTransitioning) return;

    setIsTransitioning(true);

    const tl = gsap.timeline({
      onComplete: () => setIsTransitioning(false),
    });

    tl.fromTo(
      [".page-transition", ".page-transition-1", ".page-transition-2"],
      { y: "100%", opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", stagger: 0.1 }
    );

    setTimeout(() => {
      if (href === "/") {
        window.scrollTo({ top: 0, behavior: "instant" });
      } else if (href.startsWith("#")) {
        const el = document.querySelector(href);
        if (el) {
          el.scrollIntoView({
            behavior: "instant",
            block: "start",
            inline: "nearest",
          });
        }
      } else {
        window.open(href, "_blank");
      }
    }, 300);

    tl.to(
      [".page-transition-2", ".page-transition-1", ".page-transition"],
      {
        y: "-100%",
        opacity: 0,
        duration: 0.6,
        ease: "power2.in",
        stagger: 0.1,
      },
      "+=0.5"
    );

    if (menuOpen) {
      setMenuOpen(false);
    }
  }, [isTransitioning, menuOpen]);

  const NavLink = ({ item, textSize = "" }) => (
    <div className="menu-list relative overflow-hidden cursor-pointer flex justify-end">
      <a
        href={item.href}
        onClick={(e) => handleNavigation(e, item.href)}
        className="button relative flex flex-row-reverse overflow-hidden transition-all ease-out duration-300 group"
      >
        <div className="flex flex-col justify-center items-center relative w-full overflow-hidden">
          <span className={`block font-bold font-[Familjen_Grotesk] transition-all ease-out duration-300 text-white text-center group-hover:translate-y-[-80%] group-hover:opacity-0 whitespace-nowrap ${textSize}`}>
            {item.name}
          </span>
          <span className={`absolute font-[Tangerine] font-bold transition-all ease-out duration-300 text-white text-center opacity-0 group-hover:opacity-100 translate-y-[100%] group-hover:translate-y-0 whitespace-nowrap ${textSize.replace("text-5xl", "text-6xl")}`}>
            {item.cursive}
          </span>
        </div>
      </a>
    </div>
  );

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full py-3 px-3 flex justify-between items-center z-50 transition-all duration-500 ease-out ${
        scrollDirection === "down" ? "transform -translate-y-2 opacity-90" : "transform translate-y-0 opacity-100"
      }`}>
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm z-[-1] mix-blend-difference pointer-events-none"></div>

        <a href="/" onClick={(e) => handleNavigation(e, "/")}>
          <img
            src={logo}
            alt="logo"
            className="w-[16vw] md:w-[9vw] lg:w-[4.5vw] brightness-200 saturate-200 contrast-0 transition-transform duration-300 hover:scale-105"
          />
        </a>

        <div className={`hidden lg:block transition-all duration-500 ease-out ${
          scrollDirection === "down" ? "opacity-0 -translate-y-5 pointer-events-none" : "opacity-100 translate-y-0"
        }`}>
          <ul className="flex gap-8 text-white text-[.9vw]">
            {menuItems.map((item, index) => (
              <li key={index} className="transform transition-all duration-300 hover:scale-105">
                <NavLink item={item} textSize="text-[1vw]" />
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden text-white text-3xl z-50 transition-transform duration-300 hover:scale-110 active:scale-95"
        >
          <ion-icon name={menuOpen ? "close-outline" : "menu-outline"}></ion-icon>
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed top-0 left-0 w-full h-full bg-[#27170e] z-40 flex flex-col items-end px-4 justify-center transition-all duration-500 ease-out ${
        menuOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
      }`}>
        <ul className="flex flex-col gap-6 text-white text-3xl font-extrabold text-center">
          {menuItems.map((item, index) => (
            <li
              key={index}
              className={`transform transition-all duration-500 ease-out ${
                menuOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}
              style={{ transitionDelay: menuOpen ? `${index * 0.1}s` : "0s" }}
            >
              <NavLink item={item} textSize="text-5xl" />
            </li>
          ))}
        </ul>

        <div className={`flex gap-4 pt-10 transform transition-all duration-500 ease-out ${
          menuOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`} style={{ transitionDelay: menuOpen ? "0.5s" : "0s" }}>
          {socialLinks.map((social, index) => (
            <a
              key={index}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-[#27170e] p-3 rounded-full hover:scale-110 active:scale-95 transition-transform duration-300"
            >
              <ion-icon name={social.name} size="small"></ion-icon>
            </a>
          ))}
        </div>

        <div className={`pt-8 transform transition-all duration-500 ease-out ${
          menuOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`} style={{ transitionDelay: menuOpen ? "0.6s" : "0s" }}>
          <a
            href="https://wa.me/919689762896"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#d9d9d9] text-[#27170e] px-6 py-3 rounded-full font-semibold text-base shadow-md hover:scale-105 active:scale-95 transition-all duration-300"
          >
            Let's Connect
          </a>
        </div>
      </div>

      {/* Page Transitions */}
      <div className="page-transition fixed top-0 left-0 w-screen h-screen bg-black z-40 transform translate-y-full"></div>
      <div className="page-transition-1 fixed top-0 left-0 w-screen h-screen bg-[#d9d9d9a2] z-50 transform translate-y-full"></div>
      <div className="page-transition-2 fixed top-0 left-0 w-screen h-screen bg-[#27170e] z-60 transform translate-y-full"></div>
    </>
  );
};

export default Navbar;
