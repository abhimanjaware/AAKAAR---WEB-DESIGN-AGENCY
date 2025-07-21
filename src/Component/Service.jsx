import React, { useEffect, useRef, useState } from 'react';

function Service() {
  const cardsContainerRef = useRef(null);
  const cardRefs = useRef([]);
  const headingRef = useRef(null);
  const subheadingRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Service cards data
  const services = [
    {
      id: "web-dev",
      title: "WEBSITE DESIGNING",
      description: "Website: Brand's powerful voice. Our Expertise Shines.",
      hoverContent: "Our web development services ensure your site doesn't just look great but performs seamlessly. With a focus on speed, reliability, and user-friendly interfaces, we create high-performance websites using the latest technologies.",
      image: "https://i.pinimg.com/736x/de/c3/ca/dec3ca638bdde241f60535f1f5f6fb60.jpg"
    },
    {
      id: "uiux",
      title: "UI/UX DESIGNING",
      description: "Great design doesn't just look beautiful—it feels effortless.",
      hoverContent: "It's simple: Happy users are loyal users. A well-designed UX/UI not only makes your site more enjoyable to use but directly impacts your conversion rates.",
      image: "https://i.pinimg.com/736x/86/fa/8f/86fa8f4c4d3095b3a6285c5ba19a63f0.jpg"
    },
    {
      id: "ecom",
      title: "E-COMMERCE SOLUTIONS",
      description: "Maximize your online store: More sales, more revenue.",
      hoverContent: "More Sales = More Revenue. A seamless e-commerce experience can make or break a sale. We ensure that your store is optimized for conversions, with fast load times, easy navigation, and secure transactions.",
      image: "https://i.pinimg.com/236x/f6/07/74/f607746a5c42427d706d890bf610b514.jpg"
    },
    {
      id: "seo",
      title: "SEO & PERFORMANCE OPTIMISATION",
      description: "Your website might be beautiful, but if it's not seen, it can't succeed.",
      hoverContent: "We don't just build pretty websites—we make sure they reach your audience. Our SEO and performance optimization services ensure that your site ranks higher in search results and loads instantly.",
      image: "https://i.pinimg.com/736x/37/31/8f/37318f0ba9e315873af521edb2cb40ee.jpg"
    },
    {
      id: "content",
      title: "CONTENT STRATEGY & COPYWRITING",
      description: "Words that sell. Content that connects.",
      hoverContent: "Great design needs great content. Our content strategy and copywriting services help tell your story in a way that engages, educates, and inspires action.",
      image: "https://i.pinimg.com/236x/87/dd/33/87dd33c929b6ee141fb3bd43d5ec0eb3.jpg"
    },
    {
      id: "brand",
      title: "BRAND IDENTITY LOGO DESIGN",
      description: "Brand identity: Your business story at every touchpoint.",
      hoverContent: "It's simple: Happy users are loyal users. A well-designed UX/UI not only makes your site more enjoyable to use but directly impacts your conversion rates.",
      image: "https://i.pinimg.com/736x/bd/f0/3e/bdf03ef4b82f104508b12a59945ae445.jpg"
    }
  ];

  // Initialize component
  useEffect(() => {
    cardRefs.current = Array(services.length).fill(null);
    setIsLoaded(true);
  }, [services.length]);

  // Simple intersection observer for visibility
  useEffect(() => {
    if (!isLoaded || !cardsContainerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(cardsContainerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [isLoaded]);

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/919689762896?text=Hi%20there%2C%20I%20visited%20your%20website%20and%20wanted%20to%20connect!', '_blank');
  };

  const handleCallClick = () => {
    window.open('tel:+911234567890', '_blank');
  };

  const handleQuoteClick = (e) => {
    e.preventDefault();
    const newWindow = window.open('AAKAAR - QUOTATION (2).pdf', '_blank');
    if (newWindow) {
      newWindow.document.title = 'Aakaar Quote Request';
    }
  };

  return (
    <div 
      id='services'
      className='bg-gray-200 min-h-screen py-10 px-4 sm:px-6 lg:px-8'
      ref={cardsContainerRef}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h3 
            className={`text-3xl sm:text-4xl lg:text-5xl font-black text-gray-800 mb-4 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            ref={headingRef}
          >
            HERE'S WHAT<br />WE ARE KNOWN FOR
          </h3>
          <p 
            className={`text-lg sm:text-xl text-gray-700 font-light transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            ref={subheadingRef}
          >
            Converting your brand into flawless aesthetics.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {services.map((service, index) => (
            <div 
              key={service.id}
              className={`group relative h-80 sm:h-96 rounded-xl overflow-hidden border border-gray-300 transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${300 + index * 100}ms` }}
              ref={el => cardRefs.current[index] = el}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img 
                  src={service.image} 
                  alt={`${service.title} Service`} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              </div>
              
              {/* Default Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center transition-transform duration-500 group-hover:-translate-y-full">
                <h4 className="text-white text-2xl sm:text-3xl font-black mb-4 leading-tight">
                  {service.title}
                </h4>
                <p className="text-gray-200 text-sm sm:text-base font-light mb-6">
                  {service.description}
                </p>
                
                {/* Mobile Book Now Button */}
                <button 
                  onClick={handleWhatsAppClick}
                  className="bg-gray-200 text-gray-800 px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 hover:bg-gray-800 hover:text-gray-200 active:scale-95 sm:hidden"
                >
                  Book Now →
                </button>
              </div>
              
              {/* Hover Content */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col items-center justify-center p-6 text-center transition-transform duration-500 translate-y-full group-hover:translate-y-0">
                <p className="text-white text-base sm:text-lg font-light mb-8 leading-relaxed">
                  {service.hoverContent}
                </p>
                
                <button 
                  onClick={handleWhatsAppClick}
                  className="bg-gray-200 text-gray-800 px-8 py-3 rounded-full font-bold transition-all duration-300 hover:bg-gray-800 hover:text-gray-200 active:scale-95 flex items-center gap-2"
                >
                  Let's Connect
                  <span className="transform transition-transform duration-300 group-hover:rotate-45">→</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <button 
            onClick={handleQuoteClick}
            className="w-full sm:w-auto bg-white text-gray-800 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:bg-gray-800 hover:text-white active:scale-95 flex items-center justify-center gap-3"
          >
            GET QUOTE
            <span className="transform transition-transform duration-300 hover:rotate-45">→</span>
          </button>
          
          <button 
            onClick={handleCallClick}
            className="w-full sm:w-auto bg-white text-gray-800 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:bg-gray-800 hover:text-white active:scale-95 flex items-center justify-center gap-3"
          >
            BOOK A CALL
            <span className="transform transition-transform duration-300 hover:rotate-45">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Service;