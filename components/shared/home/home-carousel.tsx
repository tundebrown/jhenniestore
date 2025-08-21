'use client'

import * as React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ICarousel } from '@/types'
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, ArrowRight, Play, Pause } from "lucide-react"

export function HomeCarousel({ items, categories }: { items: ICarousel[]; categories: any }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const toggleAutoplay = () => {
    setIsPlaying(!isPlaying)
  }

  useEffect(() => {
    if (!isPlaying || isHovered) return
    
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [isPlaying, isHovered])

  return (
    <div className="w-full flex flex-col lg:flex-row gap-6 mt-5 mb-5 md:mt-10 md:mb-10 px-4 max-w-7xl mx-auto">
      {/* Categories Sidebar - Desktop */}
      <div className='hidden lg:block w-full lg:w-1/4'>
        <div className='bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800'>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
            Shop Categories
          </h3>
          <nav className='space-y-2'>
            <Link 
              href={`/search?category=all`}
              className="flex items-center justify-between p-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 group"
            >
              <span className="font-medium">All Categories</span>
              <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            {categories.map((category: any) => (
              <Link
                key={category}
                href={`/search?category=${category}`}
                className="flex items-center justify-between p-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 group"
              >
                <span className="font-medium capitalize">{category}</span>
                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Carousel */}
      <div className="w-full lg:w-3/4">
        <div 
          className="relative h-[40vh] md:h-[50vh] lg:h-[55vh] rounded-2xl overflow-hidden shadow-xl"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <AnimatePresence mode="wait">
            {items.map((item, index) => (
              index === currentIndex && (
                <motion.div
                  key={index}
                  className="absolute inset-0 flex items-center justify-start p-8 md:p-12 text-white bg-cover bg-center"
                  style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.4)), url(${item.image})` }}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                >
                  <motion.div 
                    className="max-w-md space-y-4"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <motion.h2 
                      className="text-2xl md:text-4xl lg:text-5xl font-bold uppercase tracking-wide drop-shadow-lg"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    >
                      {item.title}
                    </motion.h2>
                    
                    <motion.p 
                      className="text-sm md:text-base text-gray-100 drop-shadow-md max-w-prose"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.7, duration: 0.5 }}
                    >
                      {"Discover amazing products and exclusive offers"}
                    </motion.p>
                    
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.9, duration: 0.5 }}
                    >
                      <Link href={item.url}>
                        <Button 
                          size="lg" 
                          className="bg-white text-gray-900 hover:bg-gray-100 font-semibold px-8 py-6 text-lg rounded-full shadow-lg hover:scale-105 transition-transform duration-200"
                        >
                          {item.buttonCaption}
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </Link>
                    </motion.div>
                  </motion.div>
                </motion.div>
              )
            ))}
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-black/30 backdrop-blur-sm rounded-full p-2">
            {/* Previous Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={prevSlide}
              className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white border-0"
            >
              <ChevronLeft size={20} />
            </Button>
            
            {/* Play/Pause Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleAutoplay}
              className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white border-0"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </Button>
            
            {/* Next Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={nextSlide}
              className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white border-0"
            >
              <ChevronRight size={20} />
            </Button>
          </div>

          {/* Progress Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2">
            {items.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'w-8 bg-white' 
                    : 'w-2 bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Slide Counter */}
          <div className="absolute top-4 right-4 bg-black/50 text-white text-sm px-3 py-1 rounded-full">
            {currentIndex + 1} / {items.length}
          </div>
        </div>

        {/* Categories Sidebar - Mobile */}
        <div className='lg:hidden mt-6'>
          <div className='bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-800'>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
              Quick Categories
            </h3>
            <div className="flex flex-wrap gap-2">
              <Link 
                href={`/search?category=all`}
                className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors"
              >
                All
              </Link>
              {categories.slice(0, 4).map((category: any) => (
                <Link
                  key={category}
                  href={`/search?category=${category}`}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors capitalize"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
