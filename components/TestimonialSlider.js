// components/TestimonialSlider.js

import { useState, useEffect } from 'react';

export default function TestimonialSlider({ testimonials = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Default testimonials if none provided
  const defaultTestimonials = [
    {
      id: 1,
      name: 'John Doe',
      role: 'CEO, Tech Company',
      content: 'HenryMo Technologies transformed our digital presence. Their expertise and attention to detail is unmatched.',
      avatar: '/images/testimonial-1.jpg',
    },
    {
      id: 2,
      name: 'Jane Smith',
      role: 'Founder, Startup Inc',
      content: 'Working with HenryMo was a game-changer. They delivered exactly what we needed, on time and within budget.',
      avatar: '/images/testimonial-2.jpg',
    },
    {
      id: 3,
      name: 'Mike Johnson',
      role: 'CTO, Enterprise Corp',
      content: 'Professional, reliable, and innovative. HenryMo Technologies is our go-to partner for all digital solutions.',
      avatar: '/images/testimonial-3.jpg',
    },
  ];

  const items = testimonials.length > 0 ? testimonials : defaultTestimonials;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [items.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {items.map((testimonial) => (
            <div key={testimonial.id} className="min-w-full px-4">
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-2xl font-bold text-indigo-600">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                </div>
                <p className="text-gray-700 text-lg mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={goToPrevious}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
        aria-label="Previous testimonial"
      >
        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={goToNext}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
        aria-label="Next testimonial"
      >
        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-6 space-x-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-indigo-600' : 'bg-gray-300'
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

