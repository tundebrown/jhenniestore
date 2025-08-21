'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { IProduct } from '@/lib/db/models/product.model'

import Rating from './rating'
import { formatNumber, generateId, round2 } from '@/lib/utils'
import ProductPrice from './product-price'
import ImageHover from './image-hover'
import AddToCart from './add-to-cart'
import { Heart, Eye, Zap } from 'lucide-react'

interface ProductCardProps {
  product: IProduct
  hideBorder?: boolean
  hideDetails?: boolean
  hideAddToCart?: boolean
  variant?: 'default' | 'promotional' | 'popular'
}

const ProductCard = ({
  product,
  hideBorder = false,
  hideDetails = false,
  hideAddToCart = false,
  variant = 'default'
}: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const ProductImage = () => (
    <div className='relative group'>
      <Link href={`/product/${product.slug}`}>
        <div className='relative h-60 md:h-72 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800'>
          {product.images.length > 1 ? (
            <ImageHover
              src={product.images[0]}
              hoverSrc={product.images[1]}
              alt={product.name}
            />
          ) : (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes='(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw'
              className='object-contain transition-transform duration-500 group-hover:scale-105'
            />
          )}
          
          {/* Quick actions overlay */}
          <div className='absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setIsWishlisted(!isWishlisted)
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-all ${
                isWishlisted
                  ? 'bg-red-500 text-white'
                  : 'bg-white/90 text-gray-700 hover:bg-red-500 hover:text-white'
              }`}
            >
              <Heart className='w-4 h-4' fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>
            
            <button className='w-10 h-10 rounded-full bg-white/90 text-gray-700 flex items-center justify-center backdrop-blur-sm hover:bg-gray-900 hover:text-white transition-all'>
              <Eye className='w-4 h-4' />
            </button>
          </div>

          {/* Promotional badge */}
          {variant === 'promotional' && (
            <div className='absolute top-3 left-3'>
              <span className='bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1'>
                <Zap className='w-3 h-3' />
                Sale
              </span>
            </div>
          )}

          {/* Popular badge */}
          {variant === 'popular' && product.avgRating >= 4 && (
            <div className='absolute top-3 left-3'>
              <span className='bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium'>
                Popular
              </span>
            </div>
          )}

          {/* Out of stock overlay */}
          {product.countInStock === 0 && (
            <div className='absolute inset-0 bg-black/50 flex items-center justify-center'>
              <span className='text-white font-medium bg-black/70 px-3 py-2 rounded-lg'>
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </Link>
    </div>
  )

  const ProductDetails = () => (
    <div className='space-y-3'>
      {product.brand && (
        <p className='text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide'>
          {product.brand}
        </p>
      )}
      
      <Link
        href={`/product/${product.slug}`}
        className='block group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'
      >
        <h3 
          className='font-medium text-gray-900 dark:text-white line-clamp-2 leading-tight'
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {product.name}
        </h3>
      </Link>

      <div className='flex items-center gap-2'>
        <Rating rating={product.avgRating} />
        <span className='text-sm text-gray-600 dark:text-gray-400'>
          ({formatNumber(product.numReviews)})
        </span>
      </div>

      <ProductPrice
        isDeal={product.tags === 'todays-deal'}
        price={product.price}
        listPrice={product.listPrice}
        forListing
        // variant={variant}
      />
    </div>
  )

  const AddButton = () => (
    <AddToCart
      minimal
      item={{
        clientId: generateId(),
        product: product._id,
        size: product.sizes[0],
        countInStock: product.countInStock,
        name: product.name,
        slug: product.slug,
        category: product.category,
        price: round2(product.price),
        quantity: 1,
        image: product.images[0],
      }}
      // className='w-full mt-3'
    />
  )

  const cardContent = (
    <div 
      className='flex flex-col h-full group'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className='flex-1'>
        <ProductImage />
        {!hideDetails && (
          <div className='p-4'>
            <ProductDetails />
          </div>
        )}
      </div>
      
      {!hideAddToCart && product.countInStock > 0 && (
        <div className='p-4 pt-0'>
          <AddButton />
        </div>
      )}
    </div>
  )

  if (hideBorder) {
    return cardContent
  }

  return (
    <Card className='flex flex-col h-full overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 group'>
      {cardContent}
    </Card>
  )
}

export default ProductCard
