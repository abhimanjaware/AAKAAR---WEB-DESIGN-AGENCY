import LocomotiveScroll from 'locomotive-scroll';
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './pages/Home';
import About from './Component/About';
function App() {
  // const locomotiveScroll = new LocomotiveScroll();


  return (
    <div className='bg-[#D9D9D9]'>
      
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />       
      </Routes>
    </BrowserRouter>
    
   

    </div>
  )
}

export default App
