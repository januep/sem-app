"use client";
import React, { useState } from "react";
import Link from "next/link";
import ThemeToggle from "./components/ThemeToggle";

const navItems = ["Główna", "Kursy", "O nas"];

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-sm shadow-sm z-50 border-b border-gray-200 animate-slideDown">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Name */}
          <div className="flex items-center space-x-3">
            <img
              src="/LucideLabButterfly.svg"
              alt="Papil.io Logo"
              width={32}
              height={32}
              className="transition-transform duration-300 hover:scale-110 hover:rotate-3"
            />
            <span className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Papil.io
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item}
                href={item === "Główna" ? "/" : "/courses"}
                className="relative group py-1 text-gray-800 font-medium hover:text-blue-600 transition-colors"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Mobile: Hamburger Menu & Theme Toggle */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              className="mr-2 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {mobileMenuOpen ? (
                // X Icon
                <svg
                  className="w-6 h-6 text-gray-800"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                // Hamburger Icon
                <svg
                  className="w-6 h-6 text-gray-800"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
            <ThemeToggle />
          </div>

          {/* Desktop Theme Toggle */}
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col space-y-2 py-2">
              {navItems.map((item) => (
                <Link
                  key={item}
                  href={item === "Główna" ? "/" : "/courses"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-gray-800 font-medium hover:text-blue-600 transition-colors"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
