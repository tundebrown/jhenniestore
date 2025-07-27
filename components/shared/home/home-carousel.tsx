'use client'

import * as React from 'react'
// import Image from 'next/image'
import Autoplay from 'embla-carousel-autoplay'
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from '@/components/ui/carousel'
import Link from 'next/link'
// import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { ICarousel } from '@/types'

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const images = [
  {
    title: "SUNRISE ON PEAKS",
    name: "Sunrise",
    des: "Witness the serene beauty of the sunrise over majestic mountain peaks. A moment of pure tranquility.",
    url: "https://images.pexels.com/photos/552785/pexels-photo-552785.jpeg",
  },
  {
    title: "RUGGED ROCKS",
    name: "Rocky",
    des: "Explore the rugged beauty of barren rocky mountains. A testament to nature's raw power.",
    url: "https://images.pexels.com/photos/17804524/pexels-photo-17804524/free-photo-of-barren-rocky-mountains.jpeg",
  },
  {
    title: "FOREST PATHWAY",
    name: "Forest",
    des: "A peaceful trail through dense green forests. Perfect for reconnecting with nature.",
    url: "https://images.pexels.com/photos/6439041/pexels-photo-6439041.jpeg",
  },
  {
    title: "COLORFUL MEADOW",
    name: "Meadow",
    des: "A colorful meadow filled with butterflies and blooming flowers. Nature at its best.",
    url: "https://images.pexels.com/photos/2832061/pexels-photo-2832061.jpeg",
  },
  {
    title: "SERENE LAKE",
    name: "Lake",
    des: "A calm and serene lake surrounded by towering trees and mountains. A perfect escape.",
    url: "https://images.pexels.com/photos/552784/pexels-photo-552784.jpeg",
  },
];



export function HomeCarousel({ items, categories }: { items: ICarousel[]; categories: any }) {
  // const plugin = React.useRef(
  //   Autoplay({ delay: 3000, stopOnInteraction: true })
  // )

  const t = useTranslations('Home')

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const nextSlide2 = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide2 = () => {
    setDirection(-1);
    setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  // Auto-scroll every 3 seconds
  useEffect(() => {
    const interval = setInterval(nextSlide2, 3000);
    return () => clearInterval(interval);
  }, []);

  // Get the 3 images to display
  const getVisibleImages = () => {
    let visible = [];
    for (let i = 0; i < 3; i++) {
      visible.push(images[(index + i) % images.length]);
    }
    return visible;
  };


  return (
    <div className="w-full flex mt-5 mb-5 md:mt-10 md:mb-10">
      <div className='basis-1/4 hidden md:block'>
        <div className='flex-1 overflow-y-auto'>
          <nav className='flex flex-col'>
            <Link href={`/search?category=all`}
              className={`flex items-center justify-between item-button`}>
              <span>All</span> <ChevronRight className='h-4 w-4' /></Link>
            {categories.map((category: any) => (
              <Link
                key={category}
                href={`/search?category=${category}`}
                className={`flex items-center justify-between item-button`}
              >
                <span>{category}</span>
                <ChevronRight className='h-4 w-4' />
              </Link>

            ))}
          </nav>
        </div>
      </div>

      <div className="relative w-full h-[20vh] md:h-[35vh] flex basis-4/4 md:3/4 justify-center items-center overflow-hidden">
        <div className="relative w-[100%] md:w-[100%] h-[100%]">
          <AnimatePresence>
            {items.map((image, index) => (
              index === currentIndex && (
                <motion.div
                  key={index}
                  className="absolute inset-0 flex items-end justify-center p-6 text-white text-center bg-cover bg-center shadow-lg"
                  style={{ backgroundImage: `url(${image.image})` }}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 1 }}
                >
                  <div className="bg-black/50 p-4 rounded-lg">
                    <h2 className="text-xs md:text-lg uppercase font-semibold">{image.title}</h2>
                    {/* <p className="text-sm font-light">{image.des}</p> */}
                    <Button className='text-xs md:text-lg p-2 md:p-5'>{t(`${image.buttonCaption}`)}</Button>
                  </div>
                </motion.div>
              )
            ))}
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <Button
          variant="outline"
          size="icon"
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white z-10 bg-transparent border-none p-2 hover:bg-black/5 hover:text-white transition h-[60%] w-[10%]"
        >
          <ChevronLeft size={24} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white z-10 bg-transparent border-none p-2 hover:bg-black/5 hover:text-white transition h-[60%] w-[10%]"
        >
          <ChevronRight size={24} />
        </Button>
      </div>







    </div>


    // <Carousel
    //   dir='ltr'
    //   plugins={[plugin.current]}
    //   className='w-full mx-auto '
    //   onMouseEnter={plugin.current.stop}
    //   onMouseLeave={plugin.current.reset}
    // >
    //   <CarouselContent>
    //     {items.map((item) => (
    //       <CarouselItem key={item.title}>
    //         <Link href={item.url}>
    //           <div className='flex aspect-[16/6] items-center justify-center p-6 relative -m-1'>
    //             <Image
    //               src={item.image}
    //               alt={item.title}
    //               fill
    //               className='object-cover'
    //               priority
    //             />
    //             <div className='absolute w-1/3 left-16 md:left-32 top-1/2 transform -translate-y-1/2'>
    //               <h2
    //                 className={cn(
    //                   'text-xl md:text-6xl font-bold mb-4 text-primary  '
    //                 )}
    //               >
    //                 {/* {t(`${item.title}`)} */}
    //               </h2>
    //               <Button className='hidden md:block'>
    //                 {t(`${item.buttonCaption}`)}
    //               </Button>
    //             </div>
    //           </div>
    //         </Link>
    //       </CarouselItem>
    //     ))}
    //   </CarouselContent>
    //   <CarouselPrevious className='left-0 md:left-12' />
    //   <CarouselNext className='right-0 md:right-12' />
    // </Carousel>
  )
}
