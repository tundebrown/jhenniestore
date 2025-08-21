import { auth } from '@/auth'
import AddToCart from '@/components/shared/product/add-to-cart'
import { Card, CardContent } from '@/components/ui/card'
import {
  getProductBySlug,
  getRelatedProductsByCategory,
} from '@/lib/actions/product.actions'

import ReviewList from './review-list'
import { generateId, round2 } from '@/lib/utils'
import SelectVariant from '@/components/shared/product/select-variant'
import ProductPrice from '@/components/shared/product/product-price'
import ProductGallery from '@/components/shared/product/product-gallery'
import AddToBrowsingHistory from '@/components/shared/product/add-to-browsing-history'
import { Separator } from '@/components/ui/separator'
import BrowsingHistoryList from '@/components/shared/browsing-history-list'
import RatingSummary from '@/components/shared/product/rating-summary'
import ProductSlider from '@/components/shared/product/product-slider'
import { Badge } from '@/components/ui/badge'
import { Truck, Shield, ArrowLeft, Heart, Share2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}) {
  const params = await props.params
  const product = await getProductBySlug(params.slug)
  if (!product) {
    return {
      title: "Product not found"
    }
  }
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      images: [product.images[0]],
    },
  }
}

export default async function ProductDetails(props: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page: string; color: string; size: string }>
}) {
  const searchParams = await props.searchParams
  const { page, color, size } = searchParams
  const params = await props.params
  const { slug } = params
  const session = await auth()
  const product = await getProductBySlug(slug)
  const relatedProducts = await getRelatedProductsByCategory({
    category: product.category,
    productId: product._id,
    page: Number(page || '1'),
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AddToBrowsingHistory id={product._id} category={product.category} />
      
      {/* Breadcrumb Navigation */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container-custom py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Link href="/" className="hover:text-gray-900 dark:hover:text-white">
              Home
            </Link>
            <span>/</span>
            <Link href="/search" className="hover:text-gray-900 dark:hover:text-white">
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Back Button */}
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link href="/search">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Link>
        </Button>

        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6">
            {/* Product Gallery */}
            <div className='lg:col-span-6'>
              <ProductGallery images={product.images} />
            </div>

            {/* Product Info */}
            <div className='lg:col-span-4 flex flex-col gap-6'>
              <div className='flex flex-col gap-4'>
                {/* Brand and Category */}
                <div className='flex items-center gap-3 flex-wrap'>
                  <Badge variant="secondary" className="text-xs">
                    {product.brand}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {product.category}
                  </Badge>
                  {product.tags === 'todays-deal' && (
                    <Badge variant="destructive" className="text-xs">
                      🔥 Today's Deal
                    </Badge>
                  )}
                </div>

                {/* Product Title */}
                <h1 className='text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white leading-tight'>
                  {product.name}
                </h1>

                {/* Rating Summary */}
                <RatingSummary
                  avgRating={product.avgRating}
                  numReviews={product.numReviews}
                  asPopover
                  ratingDistribution={product.ratingDistribution}
                />

                <Separator />

                {/* Price */}
                <div className='flex items-center gap-4'>
                  <ProductPrice
                    price={product.price}
                    listPrice={product.listPrice}
                    isDeal={product.tags === 'todays-deal'}
                    forListing={false}
                    // size="lg"
                  />
                </div>
              </div>

              {/* Variant Selection */}
              <div className='space-y-4'>
                <SelectVariant
                  product={product}
                  size={size || product.sizes[0]}
                  color={color || product?.colors[0]?.name}
                />
              </div>

              <Separator />

              {/* Description */}
              <div className='space-y-3'>
                <h3 className='font-semibold text-gray-900 dark:text-white'>
                  Description:
                </h3>
                <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>
                  {product.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className='flex items-center gap-3 pt-4'>
                <Button variant="outline" size="icon" className="flex-shrink-0">
                  <Heart className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="icon" className="flex-shrink-0">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Purchase Card */}
            <div className='lg:col-span-2'>
              <Card className='sticky top-6 border-gray-200 dark:border-gray-700 shadow-lg'>
                <CardContent className='p-6 space-y-5'>
                  <ProductPrice 
                    price={product.price} 
                    listPrice={product.listPrice}
                    isDeal={product.tags === 'todays-deal'}
                    className="text-2xl font-bold"
                  />

                  {/* Stock Status */}
                  <div className='space-y-2'>
                    {product.countInStock > 0 && product.countInStock <= 3 ? (
                      <div className='text-orange-600 dark:text-orange-400 font-medium text-sm bg-orange-50 dark:bg-orange-900/20 px-3 py-2 rounded-lg'>
                        ⚡ Only {product.countInStock} left in stock
                      </div>
                    ) : product.countInStock > 3 ? (
                      <div className='text-green-600 dark:text-green-400 font-medium text-sm bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg'>
                        ✅ In Stock
                      </div>
                    ) : (
                      <div className='text-red-600 dark:text-red-400 font-medium text-sm bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg'>
                        ❌ Out of Stock
                      </div>
                    )}
                  </div>

                  {/* Add to Cart */}
                  {product.countInStock > 0 && (
                    <div className='space-y-3'>
                      <AddToCart
                        item={{
                          clientId: generateId(),
                          product: product._id,
                          countInStock: product.countInStock,
                          name: product.name,
                          slug: product.slug,
                          category: product.category,
                          price: round2(product.price),
                          quantity: 1,
                          image: product.images[0],
                          size: size || product.sizes[0],
                          color: color || product?.colors[0]?.name,
                        }}
                        // className="w-full"
                      />
                    </div>
                  )}

                  {/* Trust Badges */}
                  <div className='space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700'>
                    <div className='flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400'>
                      <Truck className='w-5 h-5 text-green-500' />
                      <span>Free shipping on orders over ₦50,000</span>
                    </div>
                    <div className='flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400'>
                      <Shield className='w-5 h-5 text-blue-500' />
                      <span>2-year warranty included</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Customer Reviews */}
        <section className='mt-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8'>
          <div className='flex items-center justify-between mb-8'>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-white' id='reviews'>
              Customer Reviews
            </h2>
            {product.numReviews > 0 && (
              <Badge variant="secondary" className="text-sm">
                {product.numReviews} reviews
              </Badge>
            )}
          </div>
          <ReviewList product={product} userId={session?.user.id} />
        </section>

        {/* Related Products */}
        {relatedProducts.data.length > 0 && (
          <section className='mt-12'>
            <div className='flex items-center justify-between mb-8'>
              <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                Customers also bought
              </h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/search?category=${product.category}`}>
                  View all in {product.category}
                </Link>
              </Button>
            </div>
            <ProductSlider
              products={relatedProducts.data}
              title={``}
              variant="promotional"
            />
          </section>
        )}

        {/* Browsing History */}
        <section className='mt-12'>
          <BrowsingHistoryList />
        </section>
      </div>
    </div>
  )
}