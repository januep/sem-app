'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type HeaderProps = {
  logo?: React.ReactNode
}

export default function Header({ logo }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  // Handle scroll event to add shadow and background opacity
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActivePath = (path: string) => {
    return pathname === path
  }

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Datasets', path: '/datasets' },
    { name: 'Modules', path: '/modules' },
    { name: 'About', path: '/about' }
  ]

  return (
    <>
      <header className={`w-full bg-white ${isScrolled ? 'shadow-md' : 'shadow-sm'} fixed top-0 left-0 right-0 z-50 transition-shadow duration-300`}>
        <div className="max-w-7xl mx-auto py-4 px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            {logo || (
              <>
                <div className="w-8 h-8 bg-indigo-600 rounded-md" />
                <span className="font-bold text-xl text-gray-800">LearnAI</span>
              </>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                href={item.path}
                className={`transition ${isActivePath(item.path) 
                  ? 'text-indigo-600 font-medium' 
                  : 'text-gray-600 hover:text-indigo-600'}`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-indigo-600 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Account Button */}
          <button className="hidden md:block px-4 py-2 bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200 transition">
            Account
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white py-2 px-6 shadow-lg">
            <nav className="flex flex-col gap-3">
              {navItems.map((item) => (
                <Link 
                  key={item.path} 
                  href={item.path}
                  className={`py-2 transition ${isActivePath(item.path) 
                    ? 'text-indigo-600 font-medium' 
                    : 'text-gray-600 hover:text-indigo-600'}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <button className="mt-3 w-full px-4 py-2 bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200 transition text-left">
                Account
              </button>
            </nav>
          </div>
        )}
      </header>
      
      {/* Spacer div to prevent content from hiding behind the fixed header */}
      <div className="h-16"></div>
    </>
  )
}