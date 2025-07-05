import React from 'react';

function Footer() {
  return (
    <div 
      id="contact" 
      className="overflow-hidden px-3 bg-[#1e110a]"
    >
      <div
        className="footer-content min-h-screen w-full relative bg-[#1e110a]"
      >
        <div
          className="footer-head leading-none w-fit h-[70vh] flex flex-col px-[8rem] md:px-[5rem] sm:px-[2rem] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <div className="letstext overflow-hidden">
            <p
              className="whitespace-nowrap text-[11vw] lg:text-[6vw] md:text-[11vw] pl-5 md:pl-3 lg:pl-0 text-[#D9D9D9] tracking-tight font-black font-[Familjen_Grotesk] leading-none text-start uppercase"
            >
              Let's Start
            </p>
          </div>

          <div className="extratext overflow-hidden pt-3 px-4 md:px-2">
            <p
              className="whitespace-nowrap text-[#D9D9D9] text-[14vw] md:text-[15vw] lg:text-[12vw] tracking-tight font-black font-[Tangerine] leading-none text-center"
            >
              Something Extraordinary
            </p>
          </div>

          <div className="togethertext overflow-hidden">
            <p
              className="whitespace-nowrap text-[10vw] md:text-[11vw] lg:text-[6vw] text-[#D9D9D9] tracking-tight font-black font-[Familjen_Grotesk] pr-5 md:pr-3 lg:pr-0 leading-none text-end uppercase"
            >
              Together
            </p>
          </div>

          <div className="btn absolute top-[40%] md:top-[50%] lg:left-[5%] lg:top-[63%] md:left-[26%] right-40 sm:left-[23%]">
            <div className="relative flex items-center justify-center">
              <span
                className="absolute w-[5vw] h-[5vw] md:w-[40vw] md:h-[40vw] lg:w-[17vw] lg:h-[17vw] rounded-full border border-[#D9D9D9]/30 opacity-10 group-hover:opacity-50 transition-opacity duration-300"
              ></span>

              <a
                href="https://wa.me/919689762896?text=Hi%20there%2C%20I%20visited%20your%20website%20and%20wanted%20to%20connect!"
                target='_blank'
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
          className="footer-last w-full absolute bottom-0 flex pb-4 flex-col-reverse lg:flex-row lg:justify-between text-center justify-end lg:text-start lg:flex"
        >
          <div className="copyright px-4">
            <p className="text-zinc-700 font-[Familjen_Grotesk] whitespace-nowrap text-sm sm:text-xs md:text-sm">
              © 2025 Aakaar Digital. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;