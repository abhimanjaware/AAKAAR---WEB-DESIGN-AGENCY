import React, { useEffect, useRef, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Showcase from './Showcase'; // Your original Showcase component

function ShowcaseWrapper({ disableScrollTriggers = false }) {
  const wrapperRef = useRef(null);
  const [isInPinnedContext, setIsInPinnedContext] = useState(disableScrollTriggers);

  useEffect(() => {
    if (disableScrollTriggers) {
      // Disable all scroll triggers within this wrapper
      const killShowcaseScrollTriggers = () => {
        ScrollTrigger.getAll().forEach(st => {
          if (st.trigger && wrapperRef.current?.contains(st.trigger)) {
            st.kill();
          }
        });
      };

      // Kill existing triggers
      killShowcaseScrollTriggers();

      // Set up a mutation observer to kill any new scroll triggers created by Showcase
      const observer = new MutationObserver(() => {
        setTimeout(killShowcaseScrollTriggers, 100);
      });

      if (wrapperRef.current) {
        observer.observe(wrapperRef.current, {
          childList: true,
          subtree: true
        });
      }

      return () => {
        observer.disconnect();
        killShowcaseScrollTriggers();
      };
    }
  }, [disableScrollTriggers]);

  return (
    <div 
      ref={wrapperRef}
      className={`showcase-wrapper ${disableScrollTriggers ? 'pinned-context' : ''}`}
      style={disableScrollTriggers ? {
        // Styles to make showcase work in pinned context
        position: 'relative',
        height: 'auto',
        minHeight: '100vh',
        overflow: 'visible',
        width: '100%'
      } : {}}
    >
      <Showcase />
      {disableScrollTriggers && (
        <style jsx>{`
          .showcase-wrapper.pinned-context {
            min-height: 500vh !important;
            height: auto !important;
            padding-bottom: 100vh;
          }
          
          .showcase-wrapper.pinned-context [class*="-Face"],
          .showcase-wrapper.pinned-context [class*="-Info"] {
            opacity: 1 !important;
            transform: translateY(0) !important;
            transition: none !important;
          }
          
          .showcase-wrapper.pinned-context [class*="-Showcase"] {
            margin-bottom: 6rem !important;
            position: relative !important;
            opacity: 1 !important;
            transform: none !important;
            visibility: visible !important;
          }
          
          /* Ensure all showcase items are visible and properly spaced */
          .showcase-wrapper.pinned-context > * {
            position: relative !important;
            opacity: 1 !important;
            visibility: visible !important;
            z-index: 1 !important;
          }
          
          /* Remove any hidden overflow that might clip content */
          .showcase-wrapper.pinned-context,
          .showcase-wrapper.pinned-context * {
            overflow: visible !important;
          }
        `}</style>
      )}
    </div>
  );
}

export default ShowcaseWrapper;