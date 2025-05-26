import React from 'react'

function Button() {
  return (
    <div className='h-screen w-full flex items-center bg-yellow-200 justify-center'>
      <div className="">
        <div className="button bg-[#D9D9D9] leading-none border-[1px] border-black px-4 py-2 relative rounded-full flex items-center justify-center gap-4 overflow-hidden font-[Quicksand] transition-all ease-in duration-300 group hover:bg-[#27170e] focus-within:scale-95">
          <a href="https://sales.radianmedia.org" target="_blank" className="relative h-[3.5rem] flex items-center justify-center">
            <div className="flex flex-col justify-center items-center relative">
              {/* First Text: Initially visible, moves up and becomes hidden on hover or focus */}
              <span className="block font-bold leading-none font-[Familjen_Grotesk] text-[3.3vw] transition-all ease-in duration-300 text-[#27170e] text-center tracking-tighter group-hover:translate-y-[-100%] group-focus:translate-y-[-100%] group-hover:opacity-0 group-focus:opacity-0 whitespace-nowrap md:text-[2.5vw] lg:text-[1.3vw]">
                START A CONVERSATION
              </span>
              
              {/* Second Text: Initially hidden, appears on hover or focus */}
              <span className="absolute font-bold leading-none font-[Familjen_Grotesk] text-[3.3vw] transition-all ease-in duration-300 text-[#D9D9D9] text-center tracking-tighter opacity-0 group-hover:opacity-100 group-focus:opacity-100 translate-y-[100%] group-hover:translate-y-0 group-focus:translate-y-0 whitespace-nowrap md:text-[2.5vw] lg:text-[1.3vw]">
                START A CONVERSATION
              </span>
            </div>
          </a>
          
          {/* Arrow Icon */}
          <div className='p-3 rounded-full group-hover:-rotate-45   scale-[0.4] transition-all ease-in group-hover:duration-300 group-hover:scale-100 bg-[#27170e]  group-hover:bg-[#D9D9D9]'>
          <ion-icon name="arrow-forward-outline" size="small"></ion-icon>
                    
</div>
        </div>
      </div>
    </div>
  )
}

export default Button
