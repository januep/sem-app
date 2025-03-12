'use client'

import { useEffect, useRef, useState } from 'react'

export default function Home() {
  const [scrollY, setScrollY] = useState(0)
  const heroRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const testimonialsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* Hero Section with Parallax */}
      <div 
        ref={heroRef}
        className="relative flex w-full h-screen items-center justify-center bg-gradient-to-b from-indigo-500 to-purple-700 overflow-hidden"
      >
        {/* Background shapes that move with scroll */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: `${Math.random() * 200 + 50}px`,
                height: `${Math.random() * 200 + 50}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.1,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl">
          <h1 
            className="text-5xl md:text-7xl font-bold text-white mb-6"
            style={{ transform: `translateY(${-scrollY * 0.2}px)` }}
          >
            Twórz kursy <span className="text-yellow-300">szybciej</span> niż kiedykolwiek
          </h1>
          <p 
            className="text-xl md:text-2xl text-white/90 mb-10"
            style={{ transform: `translateY(${-scrollY * 0.15}px)` }}
          >
            Automatyzacja tworzenia interaktywnych kursów
          </p>
          <button 
            className="px-8 py-4 bg-white text-purple-700 rounded-full text-lg font-bold shadow-lg hover:shadow-xl transform transition hover:-translate-y-1 hover:bg-yellow-300"
            style={{ transform: `translateY(${-scrollY * 0.1}px)` }}
          >
            Rozpocznij
          </button>
        </div>

        {/* Scroll indicator */}
        <div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce"
          style={{ opacity: Math.max(0, 1 - scrollY / 300) }}
        >
          <svg className="w-6 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      {/* Features section with staggered fade in */}
      <div 
        ref={featuresRef}
        className="w-full py-24 px-6 bg-white"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-20 text-gray-800">
            Our Amazing Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "Feature One",
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum.",
                icon: "💡"
              },
              {
                title: "Feature Two",
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum.",
                icon: "🚀"
              },
              {
                title: "Feature Three",
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum.",
                icon: "⚡"
              }
            ].map((feature, i) => (
              <div 
                key={i}
                className="bg-gray-50 p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                style={{
                  opacity: scrollY > 300 ? 1 : 0,
                  transform: `translateY(${Math.max(0, 50 - (scrollY - 300) / 10)}px)`,
                  transition: `opacity 0.6s ease ${i * 0.2}s, transform 0.6s ease ${i * 0.2}s`
                }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-3 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Horizontal scroll section */}
      <div className="w-full bg-gray-100 py-24 overflow-hidden">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
          Our Solutions
        </h2>
        
        <div 
          className="flex gap-6 py-8 px-12 overflow-x-auto scrollbar-hide"
          style={{
            scrollbarWidth: 'none',
            scrollBehavior: 'smooth',
            transform: `translateX(${-scrollY * 0.2 + 500}px)`,
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div 
              key={i}
              className="flex-shrink-0 w-80 bg-white p-6 rounded-xl shadow-md"
            >
              <div className="h-48 rounded-lg bg-gradient-to-r from-blue-300 to-purple-300 mb-4" />
              <h3 className="text-xl font-bold mb-2 text-gray-800">Solution {i + 1}</h3>
              <p className="text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum.
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials with staggered reveal */}
      <div 
        ref={testimonialsRef}
        className="w-full py-24 px-6 bg-gradient-to-b from-indigo-50 to-indigo-100"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-20 text-gray-800">
            What People Say
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              {
                quote: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero.",
                name: "Jane Doe",
                title: "CEO, Company"
              },
              {
                quote: "Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet.",
                name: "John Smith",
                title: "CTO, Organization"
              },
              {
                quote: "Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta.",
                name: "Emily Johnson",
                title: "Designer, Studio"
              },
              {
                quote: "Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora.",
                name: "Michael Brown",
                title: "Developer, Platform"
              }
            ].map((testimonial, i) => (
              <div 
                key={i}
                className="bg-white p-8 rounded-2xl shadow-md"
                style={{
                  opacity: scrollY > 1000 ? 1 : 0,
                  transform: `translateX(${Math.max(0, 50 - (scrollY - 1000) / 10) * (i % 2 === 0 ? -1 : 1)}px)`,
                  transition: `opacity 0.6s ease ${i * 0.2}s, transform 0.6s ease ${i * 0.2}s`
                }}
              >
                <p className="text-gray-600 italic mb-6">{testimonial.quote}</p>
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 mr-4" />
                  <div>
                    <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                    <p className="text-gray-500 text-sm">{testimonial.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to action with parallax */}
      <div className="relative w-full py-32 bg-gradient-to-r from-purple-700 to-indigo-700 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-10"
          style={{ transform: `translateY(${scrollY * 0.05}px)` }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div 
              key={i}
              className="absolute bg-white"
              style={{
                width: `${Math.random() * 300 + 100}px`,
                height: `${Math.random() * 300 + 100}px`,
                borderRadius: `${Math.random() * 50}%`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.4 + 0.1,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
          <h2 
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            style={{ transform: `translateY(${-(scrollY * 0.03)}px)` }}
          >
            Ready to Get Started?
          </h2>
          <p 
            className="text-xl text-white/80 mb-10"
            style={{ transform: `translateY(${-(scrollY * 0.02)}px)` }}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum.
          </p>
          <button 
            className="px-8 py-4 bg-yellow-400 text-purple-900 rounded-full text-lg font-bold shadow-lg hover:shadow-xl transform transition hover:-translate-y-1 hover:bg-white"
          >
            Get Started Now
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-gray-900 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h3 className="text-xl font-bold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition">About</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition">Features</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition">Works</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition">Career</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Help</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition">Customer Support</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition">Terms & Conditions</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition">Blog</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition">Documentation</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition">Community</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Subscribe</h3>
            <p className="text-gray-400 mb-4">Stay updated with our latest features and releases.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="px-4 py-2 rounded-l-md focus:outline-none text-gray-800 w-full"
              />
              <button className="bg-indigo-600 hover:bg-indigo-700 transition px-4 py-2 rounded-r-md">
                →
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>© {new Date().getFullYear()} Your Company. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}