import { useEffect, useRef } from 'react';
import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './Component/About';

function App() {
  const scrollRef = useRef(null);

  useEffect(() => {
    const scroll = new LocomotiveScroll({
      el: scrollRef.current,
      smooth: true,
      lerp: 0.08,
      multiplier: 1,
      class: 'is-reveal',
    });

    return () => {
      if (scroll) scroll.destroy();
    };
  }, []);

  return (
    <div ref={scrollRef} data-scroll-container className="bg-[#D9D9D9]">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* You can add more routes here */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
