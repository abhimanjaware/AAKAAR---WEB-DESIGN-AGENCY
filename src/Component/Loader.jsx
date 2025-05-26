import React, { useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP); // register the hook to avoid React version discrepancies

function Loader() {
  // State to control when to trigger the out-animation
  const [startOutAnimation, setStartOutAnimation] = useState(false);
  // State for the counter percentage
  const [percentage, setPercentage] = useState(0);
  // State for beam color
  const [beamColor, setBeamColor] = useState("black");
  
  // Array of positions for strip placement
  // These values represent relative positions for strips in the animation
  const stripPositions = [
    "top-1/2", "bottom-1/3", "top-1/3", "bottom-1/6", "top-1/6", 
    "top-12/12", "", "-bottom-2/12", "-top-1/6", "-bottom-1/3", 
    "-top-1/3", "-bottom-1/2", "-top-1/2", "-bottom-8/12", "-top-8/12", 
    "-bottom-10/12", "-top-10/12", "-bottom-12/12", "-top-12/12"
  ];
  
  // Create reusable LoadingTextDisplay component
  const LoadingTextDisplay = ({ isInverted = false }) => {
    // Create array of 30 LOADING text elements
    const loadingTexts = Array(30).fill(null).map((_, index) => (
      <span key={index} className="text-black/85 text-[15px] font-black px-2 tracking-wide">
        LOADING
      </span>
    ));
    
    // Apply the appropriate class for regular or inverted movement
    const containerClass = isInverted ? "loader-movingtext-invert" : "loader-movingtext";
    
    return <div className={containerClass}>{loadingTexts}</div>;
  };
  
  // Enhanced scroll locking that doesn't interfere with Navbar
  useEffect(() => {
    // Import Notable font from Google Fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Notable&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    // Save the original values for restoration
    const originalValues = {
      htmlOverflow: document.documentElement.style.overflow,
      htmlHeight: document.documentElement.style.height,
      bodyOverflow: document.body.style.overflow,
      bodyHeight: document.body.style.height,
      bodyPosition: document.body.style.position,
      bodyTop: document.body.style.top,
      bodyWidth: document.body.style.width,
      bodyPaddingRight: document.body.style.paddingRight
    };
    
    // Calculate scrollbar width
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    
    // Get the current scroll position before locking
    const scrollY = window.scrollY;
    
    // Create and insert a style element to completely hide scrollbars
    const scrollbarStyle = document.createElement('style');
    scrollbarStyle.setAttribute('data-loader-scrollbar', 'true');
    scrollbarStyle.textContent = `
      html, body {
        overflow: hidden !important;
        height: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      
      body::-webkit-scrollbar {
        display: none !important;
        width: 0 !important;
      }
      
      html {
        scrollbar-width: none !important;
        -ms-overflow-style: none !important;
      }
    `;
    document.head.appendChild(scrollbarStyle);
    
    // Fix body in place at current scroll position to prevent jump when adding padding
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    
    // Cleanup function to restore original styles
    return () => {
      // Remove the custom scrollbar style
      if (scrollbarStyle.parentNode) {
        document.head.removeChild(scrollbarStyle);
      }
      
      // Remove the font link
      if (link.parentNode) {
        document.head.removeChild(link);
      }
      
      // Restore original values
      document.documentElement.style.overflow = originalValues.htmlOverflow;
      document.documentElement.style.height = originalValues.htmlHeight;
      document.body.style.overflow = originalValues.bodyOverflow;
      document.body.style.height = originalValues.bodyHeight;
      document.body.style.position = originalValues.bodyPosition;
      document.body.style.top = originalValues.bodyTop;
      document.body.style.width = originalValues.bodyWidth;
      document.body.style.paddingRight = originalValues.bodyPaddingRight;
      
      // Restore scroll position
      if (document.body.style.position === 'fixed') {
        const scrollY = parseInt(document.body.style.top || '0', 10) * -1;
        window.scrollTo(0, scrollY);
      }
    };
  }, []);
  
  // Update the counter and trigger the out-animation after completion
  // Modified to make counter reach 100% more slowly
  useEffect(() => {
    // Create a smaller random step increment for slower counting
    // Reduced from 1-3 to 0.5-1.5 for slower progression
    const getRandomIncrement = () => (Math.random() * 1) + 1;
    
    // Set an interval to increment the counter
    const intervalId = setInterval(() => {
      setPercentage(prev => {
        const nextValue = prev + getRandomIncrement();
        // If we've reached 100%, clear the interval and trigger out-animation
        if (nextValue >= 100) {
          clearInterval(intervalId);
          // Change beam color to white
          setBeamColor("white");
          // Start the out animation after a short delay
          setTimeout(() => {
            setStartOutAnimation(true);
          }, 500);
          return 100;
        }
        return nextValue;
      });
    }, 50); // Interval time remains the same, but increment is smaller
    
    return () => clearInterval(intervalId);
  }, []);
  
  useGSAP(() => {
    // Initialize GSAP timeline for sequential animations
    const tl = gsap.timeline();
    
    // Animation for the initial strips expanding
    tl.fromTo(
      ".strip1, .strip2",
      {
        width: 0,
      },
      {
        width: "2900px",
        duration: 1,
        ease: "expo.in",
      },
      "a"
    );

    // Horizontal strips animation
    tl.fromTo('.web-horizontal', {
      width: 0,
    }, {
      width: "2900px",
      ease: 'circ.in',
      stagger: 0.05,
    }, 'z');
  
    // Animate horizontal strips from left
    tl.fromTo(".web-horizontal-1", {
      x: "-100%",
    }, {
      x: "0%", 
      duration: 1,
      ease: "power2.out"
    }, "x");
  
    // Animate horizontal strips from right
    tl.fromTo(".web-horizontal-2", {
      x: "100%",
    }, { 
      x: "0%", 
      duration: 1,
      ease: "power2.out",
    }, "x");
 
    // Vertical strips animation
    tl.fromTo(".web-vertical", {
      width: "0",
    }, {
      width: "100vh",
      stagger: 0.05,
    }, 'z');
  
    // Animate vertical strips from left
    tl.fromTo(".web-vertical-1", {
      x: "-100%" 
    }, {
      x: "0%", 
      ease: "power2.out",
      duration: 1,
    }, "x");

    // Animate vertical strips from right
    tl.fromTo(".web-vertical-2", {
      x: "100%" 
    }, {
      x: "0%", 
      ease: "power2.out",
      duration: 1,
    }, "x");
  
    // Slant-right strips animation
    tl.fromTo(".web-slantright", {
      width: 0,
    }, {
      width: "2500px",
      duration: 1,
    }, 'z');
  
    // Animate slant-right strips from left
    tl.fromTo(".web-slantright-1", {
      x: "-100%",
      opacity: 0
    }, {
      x: "0%", 
      ease: "power2.out",
      duration: 1,
      opacity: 1
    }, "x");

    // Animate slant-right strips from right
    tl.fromTo(".web-slantright-2", {
      x: "100%", 
      opacity: 0
    }, {
      x: "0%", 
      ease: "power2.out",
      duration: 1,
      opacity: 1
    }, "x");
 
    // Slant-left strips animation
    tl.fromTo(".web-slantleft", {
      width: 0,
    }, {
      width: "2500px",
    }, 'z');
  
    // Animate slant-left strips from left
    tl.fromTo(".web-slantleft-1", {
      x: "-100%",
      opacity: 0
    }, {
      x: "0%", 
      ease: "power2.out",
      duration: 1,
      opacity: 1
    }, "x");

    // Animate slant-left strips from right
    tl.fromTo(".web-slantleft-2", {
      x: "100%",
      opacity: 0
    }, {
      x: "0%", 
      ease: "power2.out",
      duration: 1,
      opacity: 1
    }, "x");
 
    // Beam animation (reveal the black beam)
    tl.fromTo(".beam-circle", {
      scale: 0,
      opacity: 0
    }, {
      scale: 1,
      opacity: 1,
      duration: 0.5,
      ease: "power2.out"
    }, "-=0.5");

    // Continuous horizontal text animation (left to right)
    // These animations continue to run throughout the entire loading process
    gsap.to(".loader-movingtext", {
      x: "-100%", // Moves text out of view
      duration: 90, // Adjust speed of animation
      repeat: -1,
      ease: "linear",
      delay: 1
    });

    // Continuous horizontal text animation (right to left)
    gsap.to(".loader-movingtext-invert", {
      x: "100%", // Moves text out of view
      duration: 90, // Adjust speed of animation
      repeat: -1,
      ease: "linear",
      delay: 1
    });

    // Continuous loading text animation for strips with text moving left to right
    gsap.to(".strip-text-animation", {
      x: "-100%", 
      duration: 40, // Faster animation for background strips
      repeat: -1,
      ease: "linear",
      immediateRender: true // Forces immediate rendering for smoother start
    });
    
    // Continuous loading text animation for strips with text moving right to left
    gsap.to(".strip-text-animation-reverse", {
      x: "100%", 
      duration: 40, // Faster animation for background strips
      repeat: -1,
      ease: "linear",
      immediateRender: true // Forces immediate rendering for smoother start
    });

  }, []);

  // Watch for beam color change and animate it
  useGSAP(() => {
    if (beamColor === "white") {
      gsap.to(".beam-circle", {
        backgroundColor: "#ffffff",
        boxShadow: "0 0 20px rgba(255, 255, 255, 0.8)", // Add blurriness effect
        duration: 0.8,
        ease: "power2.inOut"
      });
      
      gsap.to(".counter-number", {
        opacity: 0,
        duration: 0.5,
        delay: 0.3,
        ease: "power2.out"
      });
    }
  }, [beamColor]);

  // Out-animation sequence triggered by state change
  // Modified to make white circle expand faster and ensure loader is fully hidden at the end
  useGSAP(() => {
    if (startOutAnimation) {
      // Create a new timeline for the out-animation
      const outTl = gsap.timeline({
        onComplete: () => {
          // When animation completes, completely remove the loader from DOM flow
          const loader = document.querySelector('.main-loader');
          if (loader) {
            // Fully remove the loader from the document flow
            loader.style.display = 'none';
            loader.style.visibility = 'hidden';
            loader.style.pointerEvents = 'none';
            
            // Re-enable scrolling by removing our custom styles
            const scrollbarStyles = document.querySelectorAll('style[data-loader-scrollbar]');
            scrollbarStyles.forEach(style => style.remove());
            
            // Restore body scroll - retrieve position from fixed state if needed
            if (document.body.style.position === 'fixed') {
              const scrollY = parseInt(document.body.style.top || '0', 10) * -1;
              
              // Reset body styles
              document.body.style.overflow = '';
              document.body.style.position = '';
              document.body.style.top = '';
              document.body.style.width = '';
              document.body.style.paddingRight = '';
              
              // Restore scroll position
              window.scrollTo(0, scrollY);
            }
            
            console.log("Animation complete, loader removed from DOM");
          }
        }
      });
      
      // ======= OUT-ANIMATION SEQUENCE =======
      
      // Animate horizontal strips toward the center (maintain horizontal direction)
      outTl.to(".web-horizontal", {
        width: 0,
        x: 0,
        opacity: 0,
        duration: 1.2,
        ease: "power3.in",
        stagger: 0.05
      }, 0);
      
      // Animate vertical strips toward the center (maintain vertical direction)
      outTl.to(".web-vertical", {
        height: 0,
        y: 0,
        opacity: 0,
        duration: 1.2,
        ease: "power3.in",
        stagger: 0.05
      }, 0);
      
      // Animate slant strips toward the center (maintain their angle)
      outTl.to(".web-slantright, .web-slantleft", {
        width: 0,
        opacity: 0,
        duration: 1.2,
        ease: "power3.in",
        stagger: 0.05
      }, 0);
      
      // Animate black strips toward center
      outTl.to(".strip1, .strip2", {
        width: 0,
        opacity: 0,
        duration: 1.2,
        ease: "power3.in",
        stagger: 0.02
      }, 0);
      
      // Expand the white beam to cover the screen - MODIFIED TO BE FASTER
      // First a slight pause and initial slow expansion 
      outTl.to(".beam-circle", {
        scale: 1.5,
        duration: 0.4, // Further reduced for faster expansion
        ease: "power1.in",
        delay: 0.2  // Further reduced delay
      });
      
      // Then rapid acceleration to cover the screen
      outTl.to(".beam-circle", {
        scale: 50, // Increased scale for better coverage
        duration: 0.6, // Faster expansion
        ease: "power4.in" // Start slow, then accelerate rapidly
      });
      
      // Fade out everything
      outTl.to(".loader-content", {
        backgroundColor: "#ffffff",
        duration: 0.3,
        ease: "power4.in"
      }, "-=0.3");
      
      // Final fade out of the entire loader
      outTl.to(".main-loader", {
        opacity: 0,
        duration: 0.4,
        ease: "power2.inOut"
      });
    }
  }, [startOutAnimation]); // Dependency array - this runs when startOutAnimation changes

  return (
    // Full screen overlay with highest z-index to ensure it covers everything including Navbar
    <div 
      className="main-loader fixed inset-0 z-[9999] w-screen h-screen overflow-hidden" 
      style={{
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0,
        margin: 0,
        padding: 0,
        touchAction: 'none' // Prevent touch scrolling
      }}
    >
      {/* Content container with full viewport dimensions */}
      <div 
        className="loader-content h-full w-full bg-black overflow-hidden" 
        style={{
          maxHeight: '100vh', 
          maxWidth: '100vw',
          margin: 0,
          padding: 0,
          touchAction: 'none' // Prevent touch scrolling
        }}
      >
        <div className="loader-allStrips relative h-full flex justify-center">
          {/* Beam circle with counter */}
          <div className="beam-circle absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-44 h-44 bg-black rounded-full z-50 flex items-center justify-center">
            {/* Counter number with Notable font */}
            <div 
              className="counter-number text-zinc-700 font-bold text-5xl"
              style={{
                fontFamily: "'Notable', sans-serif",
                letterSpacing: '1px'
              }}
            >
              {Math.floor(percentage)}%
            </div>
          </div>

          <div className="bg-strip flex justify-center">
            {/* Using map to create rotated strips (45 degrees) with moving text */}
            {stripPositions.map((position, index) => (
              <div 
                key={`strip1-${index}`} 
                className={`strip1 h-4 w-[2900px] bg-[#070304] absolute ${position} rotate-45 overflow-hidden`}
              >
                <div className="strip-text-animation whitespace-nowrap relative" style={{width: "200%", position: "absolute", left: 0}}>
                  {Array(50).fill(null).map((_, i) => (
                    <span key={i} className="text-black/85 text-[12px] font-black px-2 tracking-wide inline-block">
                      LOADING
                    </span>
                  ))}
                </div>
              </div>
            ))}
            
            {/* Using map to create rotated strips (-45 degrees) with moving text */}
            {stripPositions.map((position, index) => (
              <div 
                key={`strip2-${index}`} 
                className={`strip2 h-4 w-[2900px] bg-[#070304] absolute ${position} -rotate-45 overflow-hidden`}
              >
                <div className="strip-text-animation-reverse whitespace-nowrap relative" style={{width: "200%", position: "absolute", left: 0}}>
                  {Array(50).fill(null).map((_, i) => (
                    <span key={i} className="text-black/85 text-[12px] font-black px-2 tracking-wide inline-block">
                      LOADING
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div> 
          
          {/* main-strips */}
          <div className="webstrips flex justify-center">
            {/* Vertical Loading Bar (Rotated 90 degrees) */}
            <div className="web-vertical h-5 w-[100vh] bg-red-900/0 flex absolute rotate-90 overflow-hidden top-1/2 left-1/2 -translate-x-1/2">
              {/* First vertical gradient section - left to right */}
              <div className="web-vertical-1 h-full w-[100%] bg-gradient-to-r from-yellow-400/40 to-black/50 lg:to-black/90 flex items-center justify-center overflow-hidden">
                <LoadingTextDisplay />
              </div>
              
              {/* Second vertical gradient section - right to left */}
              <div className="web-vertical-2 h-full w-[100%] bg-gradient-to-l from-yellow-400/40 to-black/50 lg:to-black/90 flex items-center justify-center overflow-hidden">
                <LoadingTextDisplay isInverted={true} />
              </div>
            </div>

            {/* Horizontal Loading Bar */}
            <div className="web-horizontal h-5 w-[2000px] bg-red-500/0 flex absolute top-1/2 overflow-hidden">
              {/* First horizontal gradient section - left to right */}
              <div className="web-horizontal-1 h-full w-full bg-gradient-to-r from-yellow-400 via-yellow-400/40 to-black/50 lg:to-black/90 flex items-center justify-start overflow-hidden">
                <LoadingTextDisplay />
              </div>
              
              {/* Second horizontal gradient section - right to left */}
              <div className="web-horizontal-2 h-full w-full bg-gradient-to-l from-yellow-400 via-yellow-400/40 to-black/50 lg:to-black/90 flex items-center justify-end overflow-hidden">
                <LoadingTextDisplay isInverted={true} />
              </div>
            </div>

            {/* Right slanted line */}
            <div className="web-slantright h-5 w-[100vw] flex absolute bg-red-600/0 top-1/2 -rotate-[55deg]">
              {/* First half with gradient from right */}
              <div className="web-slantright-1 h-full w-[50%] bg-gradient-to-r from-yellow-400 via-yellow-400/40 to-black/50 lg:to-black/90 flex items-center justify-center overflow-hidden">
                <LoadingTextDisplay />
              </div>
              
              {/* Second half with gradient from left */}
              <div className="web-slantright-2 h-full w-[50%] bg-gradient-to-l from-yellow-400 via-yellow-400/40 to-black/50 lg:to-black/90 flex items-center justify-center overflow-hidden">
                <LoadingTextDisplay isInverted={true} />
              </div>
            </div>
            
            {/* Left slanted line */}
            <div className="web-slantleft h-5 w-[100vw] flex absolute bg-yellow-600/0 top-1/2 rotate-[55deg]">
              {/* First half with gradient from right */}
              <div className="web-slantleft-1 h-full w-[50%] bg-gradient-to-r from-yellow-400 via-yellow-400/40 to-black/50 lg:to-black/90 flex items-center justify-center overflow-hidden">
                <LoadingTextDisplay />
              </div>
              
              {/* Second half with gradient from left */}
              <div className="web-slantleft-2 h-full w-[50%] bg-gradient-to-l from-yellow-400 via-yellow-400/40 to-black/50 lg:to-black/90 flex items-center justify-center overflow-hidden">
                <LoadingTextDisplay isInverted={true} />
              </div>
            </div>

            {/* Additional slanted band (negative rotation) */}
            <div className="web-slantright h-5 w-[100vw] flex absolute bg-red-600/0 top-1/2 -rotate-[26deg]">
              <div className="web-slantright-1 h-full w-[100%] bg-gradient-to-r from-yellow-400 via-yellow-400/40 to-black/50 lg:to-black/90 flex items-center justify-center overflow-hidden">
                <LoadingTextDisplay />
              </div>
              <div className="web-slantright-2 h-full w-[100%] bg-gradient-to-l from-yellow-400 via-yellow-400/40 to-black/50 lg:to-black/90 flex items-center justify-center overflow-hidden">
                <LoadingTextDisplay isInverted={true} />
              </div>
            </div>

            {/* Additional slanted band (positive rotation) */}
            <div className="web-slantright h-5 w-[100vw] flex absolute bg-red-600/0 top-1/2 rotate-[26deg]">
              <div className="web-slantright-1 h-full w-[100%] bg-gradient-to-r from-yellow-400 via-yellow-400/40 to-black/50 lg:to-black/90 flex items-center justify-center overflow-hidden">
                <LoadingTextDisplay />
              </div>
              <div className="web-slantright-2 h-full w-[100%] bg-gradient-to-l from-yellow-400 via-yellow-400/40 to-black/50 lg:to-black/90 flex items-center justify-center overflow-hidden">
                <LoadingTextDisplay isInverted={true} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Loader;