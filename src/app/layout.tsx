import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { Providers } from "./providers"; // import your provider
import ThemeToggle from "./components/ThemeToggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Papil.io",
  description: "Automatic Course Making App",
};

const Header = () => {
  return (
    <header className="fixed top-0 left-0 w-full bg-gray-50/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-sm z-50 border-b border-gray-100 dark:border-gray-700 animate-slideDown">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left: Logo and name */}
          <div className="flex items-center group">
            <div className="transform transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:rotate-3">
              <div className="svg-logo-container">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  className="svg-logo"
                  aria-label="Butterfly logo"
                >
                  <defs>
                    <linearGradient
                      id="butterfly-gradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop className="gradient-stop-1" offset="0%" />
                      <stop className="gradient-stop-2" offset="100%" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M18.5 5c.3 0 .5.1.7.3.8.8.3 2.7-1.3 4.5-1.6 1.8-2 5.1-2 5.1s2.8-.5 4.6-2c1.8-1.5 3.7-2 4.2-1.2.5.8-1.2 2.3-3 3.8-2.2 1.8-5 2.2-5 2.2s1.4 3.6.4 4.6c-.5.5-1.5.5-2-.2-1-1.4-1.2-3.5-1.1-4.7 0 0-1.5 1.4-3.9 1.5-2.4 0-3.5-1.1-3.5-1.1.2 1.2.1 3.3-.9 4.7-.5.7-1.5.7-2 .2-1.1-1 .3-4.6.3-4.6s-2.8-.4-5-2.2c-1.8-1.5-3.5-3-3-3.8.5-.8 2.4-.3 4.2 1.2 1.8 1.5 4.6 2 4.6 2s-.5-3.3-2-5.1c-1.6-1.8-2-3.7-1.3-4.5.8-.8 2.7.3 4.5 1.9 1.8 1.6 3.1 3.4 3.1 3.4s1.3-1.8 3.1-3.4c1.7-1.6 3.7-2.7 4.3-1.9z"
                    fill="url(#butterfly-gradient)"
                  />
                </svg>
              </div>
            </div>
            <span className="ml-3 font-semibold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Papil.io
            </span>
          </div>
          
          {/* Center: Navigation links */}
          <nav className="flex space-x-8">
            {["Główna", "Kursy", "O nas"].map((item) => (
              <div key={item} className="relative group py-1">
                <Link
                  href={item === "Główna" ? "/" : `/courses`}
                  className="text-gray-800 dark:text-gray-200 font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-300 ease-out group-hover:w-full"></span>
                </Link>
              </div>
            ))}
          </nav>
          
          {/* Right: Dark/Light Toggle */}
          <div className="transform transition-all duration-200 hover:scale-105">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen flex flex-col`}
      >
        <Providers>
          <Header />
          <main className="flex-1 pt-16">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
