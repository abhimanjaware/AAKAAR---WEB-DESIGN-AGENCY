import { useEffect, useRef, useState } from 'react';
import { useGSAP } from "@gsap/react";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const heroRef = useRef(null);
  const frameRef = useRef(null);
  const imageRef = useRef(null);
  const ctaRef = useRef(null);
  const containerRef = useRef(null);
  // Add state to track device size
  const [isMobile, setIsMobile] = useState(false);
  
  useGSAP(() => {
    // Check if we're on mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Run once on mount
    checkMobile();
    
    // Create a timeline for the reveal animation
    const tl = gsap.timeline();
    
    // First, ensure everything starts hidden
    gsap.set(imageRef.current, { 
      opacity: 0,
      scale: 1.08, // Slightly larger scale for more dramatic reveal
      y: 15 // Slight initial offset for more dynamic movement
    });
    
    gsap.set(ctaRef.current, { 
      opacity: 0,
      y: 50 // Increased Y offset for more dramatic animation 
    });
    
    // Enhanced reveal animation sequence - optimized for smoothness
    tl.to(imageRef.current, { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      duration: 1.6, // Longer duration for smoother animation
      ease: "power2.out", // More natural easing
      force3D: true
      // Removed clearProps to maintain transform consistency
    })
    .to(ctaRef.current, { 
      opacity: 1, 
      y: 0, 
      duration: 1.2, // Longer duration for smoother animation
      ease: "back.out(1.7)", // More pronounced bounce for visual interest
      force3D: true
    }, "-=0.8"); // Start earlier for better flow
    
    // Define wave animation variables once
    const waveAnimConfig = {
      transformOrigin: "center center",
      ease: "sine.inOut",
      force3D: true,
      overwrite: 'auto'
    };
    
    // Create a base scale tween that can be overridden during hover
    const baseScaleTween =  gsap.to(imageRef.current, {
      scale: 1.02, // Subtle scale change for breathing effect
      duration: 8, // Slower for more natural feel
      ...waveAnimConfig,
      repeat: -1,
      yoyo: true,
      paused: true // Start paused to manage manually
    });
    
    // Start the breathing animation
    baseScaleTween.play();
    
    // Scroll animation - adjust based on device size
    gsap.fromTo(frameRef.current, {
      scale: isMobile ? 0.6 : 0.4, // Less extreme scaling for mobile
      y: isMobile ? -300 : -600 // Less extreme position shift for mobile
    }, {
      scale: 1,
      y: isMobile ? 50 : 100, // Less extreme final position for mobile
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "50% top",
        scrub: 1,
        invalidateOnRefresh: true
      }
    });
    
    // Only enable parallax effects on non-touch devices
    if (!('ontouchstart' in window)) {
      // Improved mouse interaction with stronger parallax effect
      let mouseX = 0;
      let mouseY = 0;
      let lastX = 0;
      let lastY = 0;
      let animationId;
      let rect; // Store the container dimensions to avoid recalculating
      let isHovering = false; // Track hover state
      
      // Update the cached rect dimensions on resize
      const updateRect = () => {
        if (containerRef.current) {
          rect = containerRef.current.getBoundingClientRect();
        }
      };
      
      // Initial call to set rect
      updateRect();
      
      // Improved mouse move handler
      const handleMouseMove = (e) => {
        if (!containerRef.current) return;
        
        // Update rect on first move to ensure accuracy
        if (!rect) {
          updateRect();
        }
        
        const { clientX, clientY } = e;
        
        // Calculate mouse position relative to the container - with adjusted intensity based on screen size
        const intensityFactor = window.innerWidth < 768 ? 5 : 15; // Less movement on smaller screens
        mouseX = (((clientX - rect.left) / rect.width) - 0.5) * intensityFactor;
        mouseY = (((clientY - rect.top) / rect.height) - 0.5) * intensityFactor;
        
        // Always update elements on mouse move
        if (!animationId) {
          animationId = requestAnimationFrame(updateElements);
        }
      };
      
      // Update elements based on mouse position at a controlled rate
      const updateElements = () => {
        // Smoother movement with optimized acceleration factor
        lastX += (mouseX - lastX) * 0.06; // Faster response
        lastY += (mouseY - lastY) * 0.06; // Faster response
        
        // Apply parallax effect with stronger movement
        if (imageRef.current) {
          gsap.to(imageRef.current, {
            x: lastX * 1.2, // Increased movement for better visibility
            y: lastY * 1.2, // Increased movement for better visibility
            rotationY: lastX * 0.03, // Subtle 3D effect
            rotationX: -lastY * 0.03, // Subtle 3D effect
            duration: 0.2, // Short duration for responsive feel
            ease: "power1.out",
            force3D: true,
            overwrite: "auto" // Prevent animation conflicts
          });
        }
        
        // Animate the CTA button with increased movement
        if (ctaRef.current) {
          gsap.to(ctaRef.current, {
            x: lastX * 0.4, // Increased movement
            y: lastY * 0.4, // Increased movement
            duration: 0.2,
            ease: "power1.out",
            force3D: true,
            overwrite: "auto" // Prevent animation conflicts
          });
        }
        
        // Continue animation loop with improved logic
        animationId = null;
        if (Math.abs(mouseX - lastX) > 0.01 || Math.abs(mouseY - lastY) > 0.01) {
          animationId = requestAnimationFrame(updateElements);
        } else {
          // Schedule one final update to ensure animations complete
          animationId = requestAnimationFrame(updateElements);
        }
      };
      
      // Enhanced mouse enter/leave handlers for smooth scale transition
      const handleMouseEnter = () => {
        isHovering = true;
        
        // Pause the breathing animation
        baseScaleTween.pause();
        
        if (imageRef.current) {
          gsap.to(imageRef.current, {
            scale: 1.09, // More noticeable scale up on hover
            duration: 0.8, // Longer duration for smoother transition
            // ease: "power2.out",
            overwrite: "auto" // Prevent animation conflicts
          });
        }
      };
      
      const handleMouseLeave = () => {
        isHovering = false;
        
        if (imageRef.current) {
          // Return to base scale with a longer, smoother transition
          gsap.to(imageRef.current, {
            scale: 1.09, // Return to breathing animation base scale
            duration: 5, // Much longer duration for very smooth exit
            // ease: "power3.inOut", // More sophisticated easing for smoother transition
            onComplete: () => {
              // Resume the breathing animation after scaling back
              baseScaleTween.play();
            }
          });
          
          // Reset position with a smooth, gradual transition
          gsap.to(imageRef.current, {
            x: 0,
            y: 0,
            rotationX: 0,
            rotationY: 0,
            duration: 5, // Extended duration for smoother exit
            ease: "power2.inOut" // Changed to inOut for smoother transition
          });
        }
        
        // Reset button position with matching smoothness
        if (ctaRef.current) {
          gsap.to(ctaRef.current, {
            x: 0,
            y: 0,
            duration: 1.4, // Extended duration to match image transition
            ease: "power2.inOut" // Changed to inOut for smoother transition
          });
        }
      };
      
      // Event listeners with proper cleanup
      if (containerRef.current) {
        containerRef.current.addEventListener('mousemove', handleMouseMove);
        containerRef.current.addEventListener('mouseenter', handleMouseEnter);
        containerRef.current.addEventListener('mouseleave', handleMouseLeave);
      }
      
      // Set up resize handler for responsiveness
      const handleResize = () => {
        if (containerRef.current) {
          checkMobile(); // Update mobile state
          
          // Update cached dimensions when available
          if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
          }
        }
        
        ScrollTrigger.refresh();
      };
      
      window.addEventListener('resize', handleResize);
      
      // Store the event handlers and functions to allow proper cleanup
      const cleanupFunctions = {
        handleMouseMove,
        handleMouseEnter,
        handleMouseLeave,
        handleResize
      };
      
      // Return cleanup function
      return () => {
        window.removeEventListener('resize', cleanupFunctions.handleResize);
        
        // Only remove mouse event listeners if they were added (non-touch devices)
        if (!('ontouchstart' in window) && containerRef.current) {
          containerRef.current.removeEventListener('mousemove', cleanupFunctions.handleMouseMove);
          containerRef.current.removeEventListener('mouseenter', cleanupFunctions.handleMouseEnter);
          containerRef.current.removeEventListener('mouseleave', cleanupFunctions.handleMouseLeave);
        }
        
        if (typeof animationId !== 'undefined' && animationId) {
          cancelAnimationFrame(animationId);
        }
        
        // Make sure to kill all GSAP animations on cleanup to prevent memory leaks
        gsap.killTweensOf(imageRef.current);
        gsap.killTweensOf(ctaRef.current);
        baseScaleTween.kill();
      };
    }
  }, [isMobile]); // Added isMobile as dependency

  return (
    <div ref={heroRef} className="relative w-full">
      {/* Hero section with background */}
      <div className="hero bg-[#100905] h-screen w-full overflow-hidden" ref={containerRef}>
        
        <div className="relative h-screen w-full">
          {/* Enlarged image wrapper to prevent gaps during animation */}
          <div 
            ref={imageRef} 
            className="absolute inset-0 h-[110%] w-[110%] -left-[5%] -top-[5%] z-0"
            style={{ perspective: '1000px' }}
          >
            <img 
              className="h-full w-full object-cover hidden lg:block object-center" 
              src="src\assets\images\hero-desk.png" 
              alt="Hero background" 
              style={{filter: 'drop-shadow(10px 10px #555)'}}
            />

             <img 
              className="h-full w-full object-cover  lg:hidden object-center" 
              src="src\assets\images\hero-mob.png" 
              alt="Hero background" 
              style={{filter: 'drop-shadow(10px 10px #555)'}}
            />
          </div>
          
          {/* CTA button with responsive positioning and sizing */}
          <div className='h-fit overflow-hidden'>
            <div 
              ref={ctaRef} 
              className="max-w-4xl absolute bottom-10 md:bottom-16 lg:bottom-27 py-3 left-1/2 transform -translate-x-1/2 text-center"
            >
              <div className="nav-Button bg-gradient-to-r from-[#161D27] to-[#243040] w-fit leading-none border-[1px] border-[#161D27]/30 transform hover:scale-[0.99] px-3 sm:px-4 md:px-5 py-1 relative rounded-full flex items-center justify-center gap-2 sm:gap-3 md:gap-4 overflow-hidden font-[Quicksand] transition-all ease-cubic-bezier duration-500 will-change-transform group hover:bg-gradient-to-r hover:from-[#D9D9D9] hover:to-[#D9D9D9] focus-within:scale-[0.99] shadow-md hover:shadow-lg">
                <a href="https://sales.radianmedia.org" target="_blank" className="relative h-10 sm:h-12 md:h-14 flex items-center justify-center">
                  <div className="flex flex-col justify-center items-center relative">
                    <span className="block font-bold leading-none font-[Familjen_Grotesk] text-base sm:text-lg md:text-xl lg:text-2xl transition-transform ease-out duration-400 text-[#D9D9D9] text-center tracking-tighter group-hover:translate-y-[-100%] group-focus:translate-y-[-100%] group-hover:opacity-0 group-focus:opacity-0 whitespace-nowrap">
                      Let's Connect
                    </span>
                    <span className="absolute font-bold leading-none font-[Familjen_Grotesk] text-base sm:text-lg md:text-xl lg:text-2xl transition-transform ease-out duration-400 group-active:text-[#D9D9D9] text-[#161D27] text-center tracking-tighter opacity-0 group-hover:opacity-100 group-focus:opacity-100 translate-y-[100%] group-hover:translate-y-0 group-focus:translate-y-0 whitespace-nowrap">
                      Let's Connect
                    </span>
                  </div>
                </a>
                <div className='p-2 sm:p-2.5 md:p-3 rounded-full group-hover:-rotate-45 scale-[0.4] transform transition-all ease-out duration-400 will-change-transform group-hover:scale-100 text-[#D9D9D9] group-active:text-[#161D27] bg-[#D9D9D9] group-hover:text-[#D9D9D9] group-hover:bg-gradient-to-r group-hover:from-[#161D27] group-hover:to-[#243040] shadow-sm group-hover:shadow'>
                  <ion-icon name="arrow-forward-outline" size="small"></ion-icon>
                </div>
              </div>
            </div>
          </div>
          
          {/* Frame reference */}
          <div ref={frameRef}></div>
        </div>
      </div>
    </div>
  );
}