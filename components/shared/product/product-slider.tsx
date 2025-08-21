'use client'

import * as React from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import ProductCard from './product-card'
import { IProduct } from '@/lib/db/models/product.model'

interface ProductSliderProps {
  title?: string
  products: IProduct[]
  hideDetails?: boolean
  variant?: 'default' | 'promotional' | 'popular'
}

export default function ProductSlider({
  title,
  products,
  hideDetails = false,
  variant = 'default'
}: ProductSliderProps) {
  const getBasisClass = () => {
    if (hideDetails) return 'md:basis-1/5 lg:basis-1/6'
    return 'md:basis-1/3 lg:basis-1/4 xl:basis-1/5'
  }

  return (
    <div className='w-full'>
      {title && (
        <div className='flex items-center justify-between mb-6'>
          {/* <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
            {title}
          </h2> */}
        </div>
      )}
      
      <div className='relative group'>
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className='w-full'
        >
          <CarouselContent className='-ml-2'>
            {products.map((product, index) => (
              <CarouselItem
                key={product.slug}
                className={`pl-2 ${getBasisClass()}`}
              >
                <div 
                  className='animate-fade-in'
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProductCard
                    hideDetails={hideDetails}
                    hideAddToCart={hideDetails}
                    hideBorder={false}
                    product={product}
                    variant={variant}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        
        {/* Custom navigation buttons outside of Carousel */}
        <div className='absolute top-1/2 left-2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
          <button
            onClick={() => {
              // You'll need to implement custom navigation logic
              // or use a ref to control the carousel
              const event = new CustomEvent('carousel-prev');
              window.dispatchEvent(event);
            }}
            className='w-10 h-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-md'
          >
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
            </svg>
          </button>
        </div>
        
        <div className='absolute top-1/2 right-2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
          <button
            onClick={() => {
              const event = new CustomEvent('carousel-next');
              window.dispatchEvent(event);
            }}
            className='w-10 h-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-md'
          >
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
