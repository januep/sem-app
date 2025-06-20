// Header.tsx
"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "./components/ThemeToggle";
import {
  Home,
  BookOpen,
  FileText,
  Info,
  Menu,
  X,
} from "lucide-react";

// Define navigation items with labels, hrefs, and icons
const navItems = [
  { label: "Główna", href: "/", icon: Home },
  { label: "Quizy", href: "/courses", icon: BookOpen },
  { label: "PDF", href: "/pdf", icon: FileText },
  { label: "O nas", href: "/about", icon: Info },
];

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-sm shadow-sm z-50 border-b border-gray-200 animate-slideDown">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Name */}
          <div className="flex items-center space-x-3">
            <Image
              src="/PhButterflyBold.svg"
              alt="Papil.io Logo"
              width={32}
              height={32}
              className="transition-transform duration-300 hover:scale-110 hover:rotate-3"
            />
            <span className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">
              Papil.io
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map(({ label, href, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                className="relative group flex items-center space-x-1 py-1 text-gray-700 font-bold hover:text-blue-600 transition-colors"
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Mobile Menu & Theme Toggle */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              className="mr-2 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-gray-800" /> : <Menu className="w-6 h-6 text-gray-800" />}
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
              {navItems.map(({ label, href, icon: Icon }) => (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 py-2 text-gray-800 font-medium hover:text-blue-600 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
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