'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

import Link from 'next/link';
import { Book, Code, Sparkles, BarChart, GraduationCap, Leaf, Mountain } from 'lucide-react';

export default function AboutPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0.8, 1, 1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [100, 0, 0, -100]);
  
  // Butterfly path animation
  const butterflyPath = useRef<HTMLDivElement>(null);
  const butterflyInView = useInView(butterflyPath, { once: true });

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-b from-white to-blue-50">
      {/* Hero Section with parallax effect */}
      <div className="relative h-[70vh] overflow-hidden flex items-center justify-center">
        <motion.div 
          className="absolute inset-0 z-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-80"></div>
          <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-10"></div>
        </motion.div>

        <motion.div 
          className="z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-4 inline-block"
          >
            <div className="relative w-32 h-32 mx-auto">
              <motion.div
                animate={{ 
                  rotateZ: [0, 10, -10, 0],
                  x: [0, 5, -5, 0],
                }}
                transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <div className="w-32 h-32 bg-gradient-to-tr from-blue-400 to-purple-500 rounded-full opacity-20 blur-2xl"></div>
              </motion.div>
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div 
                  className="text-indigo-600 text-6xl font-bold"
                  animate={{ rotateY: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles size={64} />
                </motion.div>
              </div>
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            O <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">Papil.io</span>
          </motion.h1>
          
          <motion.p 
            className="max-w-2xl mx-auto text-xl text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            Przekształcamy pliki PDF w interaktywne doświadczenia edukacyjne
          </motion.p>
          
          <motion.div
            className="mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <motion.a
              href="#story"
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              Nasza Historia
            </motion.a>
          </motion.div>
        </motion.div>
        
        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-8 h-8 rounded-full bg-gradient-to-r from-blue-300 to-indigo-300 opacity-40"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: Math.random() * 0.5 + 0.5,
              }}
              animate={{
                y: [null, Math.random() * -100 - 50],
                opacity: [0.4, 0]
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear",
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10 pb-32">
        {/* Butterfly path animation */}
        <div
          ref={butterflyPath}
          className="absolute w-full h-full overflow-hidden pointer-events-none top-0 left-0 z-0"
        >
          <motion.div
            initial={{ left: "-10%", top: "70%" }}
            animate={butterflyInView ? { 
              left: ["-10%", "30%", "50%", "70%", "110%"],
              top: ["70%", "40%", "60%", "30%", "20%"],
            } : {}}
            transition={{ 
              duration: 15, 
              ease: "easeInOut",
            }}
            className="absolute"
          >
            <motion.div
              animate={{ 
                rotateZ: [0, -10, 10, -5, 5, 0],
                y: [0, -10, 10, -5, 5, 0],
              }}
              transition={{ 
                repeat: Infinity, 
                repeatType: "mirror", 
                duration: 5,
                ease: "easeInOut",
              }}
            >
              <div className="relative w-24 h-24">
                <motion.div
                  animate={{
                    scaleY: [1, 1.2, 0.8, 1],
                    scaleX: [1, 0.8, 1.2, 1],
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0"
                >
                  <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M50 20C60 5 80 10 85 25C90 40 70 45 50 30C30 45 10 40 15 25C20 10 40 5 50 20Z" fill="url(#paint0_linear)" />
                    <defs>
                      <linearGradient id="paint0_linear" x1="15" y1="25" x2="85" y2="25" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#4F46E5" />
                        <stop offset="1" stopColor="#7C3AED" />
                      </linearGradient>
                    </defs>
                  </svg>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div ref={containerRef} id="story" className="pb-16">
            <motion.div
              style={{ opacity, y, scale }}
              className="mb-24"
            >
              <div className="max-w-3xl mx-auto text-center">
                <motion.h2 
                  className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-8"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6 }}
                >
                  Historia Papil.io
                </motion.h2>
                
                <motion.div
                  className="prose prose-lg mx-auto text-gray-600"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.8 }}
                >
                  <p>
                    Nazwa <span className="font-medium text-blue-600">Papil.io</span> pochodzi od słowa <em>Papilio</em>, łacińskiego określenia motyla. Tak jak motyl przechodzi piękną metamorfozę, nasza platforma przekształca zwykłe, statyczne dokumenty PDF w pełne życia, interaktywne doświadczenia edukacyjne.
                  </p>
                  
                  <div className="my-12 relative">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-white px-4">
                        <motion.div
                          animate={{ 
                            rotate: [0, 5, -5, 0], 
                            scale: [1, 1.1, 1],
                          }}
                          transition={{ 
                            duration: 3, 
                            repeat: Infinity, 
                            repeatType: "mirror"
                          }}
                        >
                          <img src="/PhButterflyBold.svg" alt="Motyl" className="w-10 h-10" />
                        </motion.div>
                      </span>
                    </div>
                  </div>
                  
                  <p>
                    Platforma ta została stworzona w ramach pracy magisterskiej przez <span className="font-medium">Jan Mańczak</span> na <span className="font-medium">Uniwersytecie Ekonomicznym w Poznaniu</span>, gdzie studiuje <span className="font-medium">Przemysł 4.0</span>. Projekt stanowi połączenie technologii, edukacji oraz transformacji cyfrowej.
                  </p>
                  
                  <p>
                    Naszą misją jest uczynienie nauki bardziej dostępną i angażującą poprzez wykorzystanie sztucznej inteligencji do przekształcania statycznych materiałów edukacyjnych w dynamiczne, interaktywne kursy.
                  </p>
                </motion.div>
              </div>
            </motion.div>
            
            {/* Thesis info */}
            <div className="my-24">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden"
              >
                <div className="px-6 py-12 sm:px-12 lg:px-16">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Projekt pracy magisterskiej</h3>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <div className="flex items-start mb-3">
                          <GraduationCap className="h-5 w-5 text-indigo-500 mt-1 mr-3" />
                          <p className="text-gray-700">Uniwersytet Ekonomiczny w Poznaniu</p>
                        </div>
                        <div className="flex items-start mb-3">
                          <Book className="h-5 w-5 text-indigo-500 mt-1 mr-3" />
                          <p className="text-gray-700">Program Przemysłu 4.0</p>
                        </div>
                        <div className="flex items-start mb-3">
                          <BarChart className="h-5 w-5 text-indigo-500 mt-1 mr-3" />
                          <p className="text-gray-700">Skupiony na transformacji cyfrowej i uczeniu wspomaganym przez sztuczną inteligencję</p>
                        </div>
                      </motion.div>
                      
                      <div className="mt-8">
                        <motion.a
                          href="https://ue.poznan.pl/en/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                          Odwiedź Uniwersytet
                        </motion.a>
                      </div>
                    </div>
                    
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className="relative h-64 sm:h-80 rounded-xl overflow-hidden shadow-lg"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 opacity-20"></div>
                      <div className="absolute inset-0 flex items-center justify-center p-6">
                        <div className="text-center">
                          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl">
                            <motion.div
                              animate={{ 
                                scale: [1, 1.05, 1],
                                rotate: [0, 1, -1, 0],
                              }}
                              transition={{ 
                                duration: 3, 
                                repeat: Infinity,
                                repeatType: "mirror", 
                              }}
                              className="relative inline-block"
                            >
                              <img src="/PhButterflyBold.svg" alt="Motyl" className="w-16 h-16" />
                              <div className="absolute -top-2 -right-2">
                                <span className="text-3xl">✨</span>
                              </div>
                            </motion.div>
                            <h4 className="mt-4 text-xl font-bold text-gray-900">Papilio</h4>
                            <p className="mt-1 text-gray-600">Droga przemiany</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Features */}
            <div className="my-24">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Nasze Podejście</h2>
                <p className="max-w-2xl mx-auto text-xl text-gray-600">
                  Jak przekształcamy tradycyjne dokumenty w angażujące doświadczenia edukacyjne
                </p>
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    icon: <Sparkles className="h-6 w-6 fill-blue-800"   />,
                    title: "Przesyłanie PDF",
                    description: "Prześlij dowolny dokument PDF edukacyjny, niezależnie od jego gęstości lub złożoności."
                  },
                  {
                    icon: <Code className="h-6 w-6 fill-blue-800" />,
                    title: "Przetwarzanie AI",
                    description: "Nasza zaawansowana AI analizuje zawartość, identyfikując kluczowe pojęcia i punkty nauki."
                  },
                  {
                    icon: <Sparkles className="h-6 w-6 fill-blue-800" />,
                    title: "Interaktywna Transformacja",
                    description: "Statyczna treść przekształca się w dynamiczne quizy, fiszki i materiały do nauki."
                  },
                  {
                    icon: <Leaf className="h-6 w-6 fill-blue-800" />,
                    title: "Adaptacyjne Nauczanie",
                    description: "Materiał dostosowuje się do Twojego poziomu zrozumienia i stylu nauki."
                  },
                  {
                    icon: <BarChart className="h-6 w-6 fill-blue-800" />,
                    title: "Śledzenie Postępów",
                    description: "Monitoruj swoje postępy dzięki szczegółowej analizie i wglądowi."
                  },
                  {
                    icon: <Mountain className="h-6 w-6 fill-blue-800" />,
                    title: "Ciągły Rozwój",
                    description: "Platforma rozwija się i udoskonala przy każdej interakcji użytkownika."
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 hover:shadow-md transition-shadow duration-300"
                  >
                    <motion.div
                      whileHover={{ 
                        scale: 1.05, 
                        rotate: [-1, 1, -1, 1, 0], 
                      }}
                      transition={{ duration: 0.5 }}
                      className="bg-blue-50 w-14 h-14 rounded-full flex items-center justify-center mb-6 mx-auto"
                    >
                      {feature.icon}
                    </motion.div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8 }}
              className="mt-24 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-8 sm:p-12 shadow-sm"
            >
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Nasza Wizja</h2>
                <p className="text-xl text-gray-700 mb-8">
                  Wierzymy, że edukacja powinna być dostępna, angażująca i adaptacyjna. Z Papil.io budujemy przyszłość, w której materiały edukacyjne przekształcają się, aby sprostać potrzebom każdego ucznia, tak jak motyl wyłania się z kokon z nowymi zdolnościami i pięknem.
                </p>
                
                <div className="mt-8">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link href="/" className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      Wypróbuj Papil.io już dziś
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
