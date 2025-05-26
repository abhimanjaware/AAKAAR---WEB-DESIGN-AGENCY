import React, { useEffect, useState } from "react";
import gsap from "gsap";

const Counter = () => {
  const [count, setCount] = useState(1);   

  useEffect(() => {
    gsap.to({value: 1},
      {
        value: 100,
        duration: 5,
        roundProps: "value",
        ease: "power2.out",
        delay:4,
        onUpdate: function () {
          setCount(Math.round(this.targets()[0].value));
        },
      });

gsap.to('.counter-logo',{
  rotate:"360",
  duration:5.1,
  repeat:-1,
  ease: "linear" // Smooth continuous rotation

})

    }, []);

  
return (
  
  <div className="counter-number absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] flex items-center justify-center">
<img className="counter-logo z-10 h-[150px] w-[150px]" src="src\assets\ChatGPT Image Apr 2, 2025, 04_25_00 PM.png" alt="" />
{/* <span className="  text-[60px] font-[Notable]  font-black text-zinc-800 drop-shadow-lg    rounded-full ">{count}%</span> */}
</div>  
); 
}                  

export default Counter;