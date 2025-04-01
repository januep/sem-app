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
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">Papil.io</span>
          </motion.h1>
          
          <motion.p 
            className="max-w-2xl mx-auto text-xl text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            Transforming PDFs into interactive learning experiences
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
              Our Story
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
                  The Story Behind Papil.io
                </motion.h2>
                
                <motion.div
                  className="prose prose-lg mx-auto text-gray-600"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.8 }}
                >
                  <p>
                    The name <span className="font-medium text-blue-600">Papil.io</span> comes from <em>Papilio</em>, the Latin word for butterfly. Just as a butterfly undergoes a beautiful metamorphosis, our platform transforms ordinary, static PDF documents into vibrant, interactive learning experiences.
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
                          <span className="text-blue-500 text-3xl">🦋</span>
                        </motion.div>
                      </span>
                    </div>
                  </div>
                  
                  <p>
                    This platform was created as part of a master's thesis by <span className="font-medium">Jan Mańczak</span> at the <span className="font-medium">Poznan University of Economics and Business</span>, where he studies <span className="font-medium">Industry 4.0</span>. The project represents the intersection of technology, education, and digital transformation.
                  </p>
                  
                  <p>
                    Our mission is to make learning more accessible and engaging by leveraging artificial intelligence to convert static educational materials into dynamic, interactive courses.
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
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Master's Thesis Project</h3>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <div className="flex items-start mb-3">
                          <GraduationCap className="h-5 w-5 text-indigo-500 mt-1 mr-3" />
                          <p className="text-gray-700">Poznan University of Economics and Business</p>
                        </div>
                        <div className="flex items-start mb-3">
                          <Book className="h-5 w-5 text-indigo-500 mt-1 mr-3" />
                          <p className="text-gray-700">Industry 4.0 Program</p>
                        </div>
                        <div className="flex items-start mb-3">
                          <BarChart className="h-5 w-5 text-indigo-500 mt-1 mr-3" />
                          <p className="text-gray-700">Focused on digital transformation and AI-enhanced learning</p>
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
                          Visit University
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
                              <span className="text-7xl">🦋</span>
                              <div className="absolute -top-2 -right-2">
                                <span className="text-3xl">✨</span>
                              </div>
                            </motion.div>
                            <h4 className="mt-4 text-xl font-bold text-gray-900">Papilio</h4>
                            <p className="mt-1 text-gray-600">The transformation journey</p>
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
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Approach</h2>
                <p className="max-w-2xl mx-auto text-xl text-gray-600">
                  How we transform traditional documents into engaging learning experiences
                </p>
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    icon: <Sparkles className="h-6 w-6 text-blue-600" />,
                    title: "PDF Upload",
                    description: "Upload any educational PDF document, no matter how dense or complex."
                  },
                  {
                    icon: <Code className="h-6 w-6 text-indigo-600" />,
                    title: "AI Processing",
                    description: "Our advanced AI analyzes the content, identifying key concepts and learning points."
                  },
                  {
                    icon: <Sparkles className="h-6 w-6 text-purple-600" />,
                    title: "Interactive Transformation",
                    description: "Static content becomes dynamic quizzes, flashcards, and study materials."
                  },
                  {
                    icon: <Leaf className="h-6 w-6 text-green-600" />,
                    title: "Adaptive Learning",
                    description: "Material adapts to your understanding and learning style."
                  },
                  {
                    icon: <BarChart className="h-6 w-6 text-orange-600" />,
                    title: "Progress Tracking",
                    description: "Monitor your improvement with detailed analytics and insights."
                  },
                  {
                    icon: <Mountain className="h-6 w-6 text-teal-600" />,
                    title: "Continuous Growth",
                    description: "The platform evolves and improves with each user interaction."
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
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Vision</h2>
                <p className="text-xl text-gray-700 mb-8">
                  We believe that education should be accessible, engaging, and adaptive. 
                  With Papil.io, we're building a future where learning materials transform 
                  to meet the needs of every student, just as a butterfly emerges from its 
                  chrysalis with new capabilities and beauty.
                </p>
                
                <div className="mt-8">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link href="/" className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      Try Papil.io Today
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
