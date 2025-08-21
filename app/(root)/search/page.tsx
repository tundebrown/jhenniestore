import Link from 'next/link'
import { Suspense } from 'react'

import Pagination from '@/components/shared/pagination'
import ProductCard from '@/components/shared/product/product-card'
import { Button } from '@/components/ui/button'
import {
  getAllCategories,
  getAllProducts,
  getAllTags,
} from '@/lib/actions/product.actions'
import { IProduct } from '@/lib/db/models/product.model'
import ProductSortSelector from '@/components/shared/product/product-sort-selector'
import { getFilterUrl, toSlug } from '@/lib/utils'
import Rating from '@/components/shared/product/rating'

import CollapsibleOnMobile from '@/components/shared/collapsible-on-mobile'
import { Filter, X, SlidersHorizontal, Grid3X3, List } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

const sortOrders = [
  { value: 'price-low-to-high', name: 'Price: Low to high' },
  { value: 'price-high-to-low', name: 'Price: High to low' },
  { value: 'newest-arrivals', name: 'Newest arrivals' },
  { value: 'avg-customer-review', name: 'Avg. customer review' },
  { value: 'best-selling', name: 'Best selling' },
]

const prices = [
  {
    name: '₦2,000 to ₦5,000',
    value: '2000-5000',
  },
  {
    name: '₦5,100 to ₦15,000',
    value: '5100-15000',
  },
  {
    name: '₦15,100 to ₦100,000',
    value: '15100-100000',
  },
]

const ratings = [
  { value: '4', label: '4 Stars & Up', stars: 4 },
  { value: '3', label: '3 Stars & Up', stars: 3 },
  { value: '2', label: '2 Stars & Up', stars: 2 },
]

export async function generateMetadata(props: {
  searchParams: Promise<{
    q: string
    category: string
    tag: string
    price: string
    rating: string
    sort: string
    page: string
  }>
}) {
  const searchParams = await props.searchParams
  const {
    q = 'all',
    category = 'all',
    tag = 'all',
    price = 'all',
    rating = 'all',
  } = searchParams

  if (
    (q !== 'all' && q !== '') ||
    category !== 'all' ||
    tag !== 'all' ||
    rating !== 'all' ||
    price !== 'all'
  ) {
    return {
      title: `${"Search"} ${q !== 'all' ? q : ''}
          ${category !== 'all' ? ` : ${"Category"} ${category}` : ''}
          ${tag !== 'all' ? ` : ${"Tag"} ${tag}` : ''}
          ${price !== 'all' ? ` : ${"Price"} ${price}` : ''}
          ${rating !== 'all' ? ` : ${"Rating"} ${rating}` : ''}`,
    }
  } else {
    return {
      title: "Search Products",
    }
  }
}

function FilterSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-6 w-32" />
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
    </div>
  )
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-48 rounded-lg" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-6 w-20" />
        </div>
      ))}
    </div>
  )
}

export default async function SearchPage(props: {
  searchParams: Promise<{
    q: string
    category: string
    tag: string
    price: string
    rating: string
    sort: string
    page: string
    view: string
  }>
}) {
  const searchParams = await props.searchParams

  const {
    q = 'all',
    category = 'all',
    tag = 'all',
    price = 'all',
    rating = 'all',
    sort = 'best-selling',
    page = '1',
    view = 'grid',
  } = searchParams

  const params = { q, category, tag, price, rating, sort, page, view }

  const categories = await getAllCategories()
  const tags = await getAllTags()
  const data = await getAllProducts({
    category,
    tag,
    query: q,
    price,
    rating,
    page: Number(page),
    sort,
  })

  const hasActiveFilters = (q !== 'all' && q !== '') ||
    (category !== 'all' && category !== '') ||
    (tag !== 'all' && tag !== '') ||
    rating !== 'all' ||
    price !== 'all'

  const activeFilters = [
    ...(q !== 'all' && q !== '' ? [{ key: 'query', label: q }] : []),
    ...(category !== 'all' && category !== '' ? [{ key: 'category', label: category }] : []),
    ...(tag !== 'all' && tag !== '' ? [{ key: 'tag', label: tag }] : []),
    ...(price !== 'all' ? [{ key: 'price', label: price }] : []),
    ...(rating !== 'all' ? [{ key: 'rating', label: `${rating}+ stars` }] : []),
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container-custom py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Search Results
              </h1>
              {data.totalProducts > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {data.totalProducts} products
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">View:</span>
                <Button
                  variant={view === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  asChild
                >
                  <Link href={""}>
                    <Grid3X3 className="w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  variant={view === 'list' ? 'default' : 'outline'}
                  size="sm"
                  asChild
                >
                  <Link href={""}>
                    <List className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
              
              <ProductSortSelector
                sortOrders={sortOrders}
                sort={sort}
                params={params}
              />
            </div>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
              {activeFilters.map((filter) => (
                <Badge
                  key={filter.key}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {filter.label}
                  <Link
                    href={getFilterUrl({ [filter.key]: 'all', params })}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </Link>
                </Badge>
              ))}
              <Button variant="ghost" size="sm" asChild>
                <Link href="/search" className="text-blue-600 hover:text-blue-700">
                  Clear all
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <CollapsibleOnMobile 
            title='Filters'
              // title={
              //   <div className="flex items-center gap-2">
              //     <Filter className="w-4 h-4" />
              //     <span>Filters</span>
              //   </div>
              // }
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-6 shadow-sm border border-gray-200 dark:border-gray-700">
                {/* Department Filter */}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center justify-between">
                    Department
                    {category !== 'all' && (
                      <Link
                        href={getFilterUrl({ category: 'all', params })}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        Clear
                      </Link>
                    )}
                  </h3>
                  <div className="space-y-2">
                    <Link
                      className={`block px-3 py-2 rounded-lg transition-colors ${
                        ('all' === category || '' === category) 
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      href={getFilterUrl({ category: 'all', params })}
                    >
                      All Departments
                    </Link>
                    {categories.map((c: string) => (
                      <Link
                        key={c}
                        className={`block px-3 py-2 rounded-lg transition-colors ${
                          c === category 
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        href={getFilterUrl({ category: c, params })}
                      >
                        {c}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center justify-between">
                    Price
                    {price !== 'all' && (
                      <Link
                        href={getFilterUrl({ price: 'all', params })}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        Clear
                      </Link>
                    )}
                  </h3>
                  <div className="space-y-2">
                    <Link
                      className={`block px-3 py-2 rounded-lg transition-colors ${
                        'all' === price 
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      href={getFilterUrl({ price: 'all', params })}
                    >
                      Any Price
                    </Link>
                    {prices.map((p) => (
                      <Link
                        key={p.value}
                        href={getFilterUrl({ price: p.value, params })}
                        className={`block px-3 py-2 rounded-lg transition-colors ${
                          p.value === price 
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        {p.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Rating Filter */}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center justify-between">
                    Customer Review
                    {rating !== 'all' && (
                      <Link
                        href={getFilterUrl({ rating: 'all', params })}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        Clear
                      </Link>
                    )}
                  </h3>
                  <div className="space-y-2">
                    <Link
                      href={getFilterUrl({ rating: 'all', params })}
                      className={`block px-3 py-2 rounded-lg transition-colors ${
                        'all' === rating 
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      All Ratings
                    </Link>
                    {ratings.map((r) => (
                      <Link
                        key={r.value}
                        href={getFilterUrl({ rating: r.value, params })}
                        className={`block px-3 py-2 rounded-lg transition-colors ${
                          r.value === rating 
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Rating size={8} rating={r.stars} />
                          <span>& Up</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Tag Filter */}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center justify-between">
                    Tags
                    {tag !== 'all' && (
                      <Link
                        href={getFilterUrl({ tag: 'all', params })}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        Clear
                      </Link>
                    )}
                  </h3>
                  <div className="space-y-2">
                    <Link
                      className={`block px-3 py-2 rounded-lg transition-colors ${
                        ('all' === tag || '' === tag) 
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      href={getFilterUrl({ tag: 'all', params })}
                    >
                      All Tags
                    </Link>
                    {tags.map((t: string) => (
                      <Link
                        key={t}
                        className={`block px-3 py-2 rounded-lg transition-colors ${
                          toSlug(t) === tag 
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        href={getFilterUrl({ tag: t, params })}
                      >
                        {t}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </CollapsibleOnMobile>
          </aside>

          {/* Products Grid */}
          <main className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              {/* Results Header */}
              {data.products.length > 0 && (
                <div className="mb-6">
                  <p className="text-gray-600 dark:text-gray-400">
                    Showing {data.from}-{data.to} of {data.totalProducts} results
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Prices and availability are subject to change
                  </p>
                </div>
              )}

              {/* Products Grid/List */}
              <Suspense fallback={<ProductGridSkeleton />}>
                {data.products.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8 max-w-md mx-auto">
                      <SlidersHorizontal className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        No products found
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Try adjusting your filters or search terms
                      </p>
                      <Button asChild>
                        <Link href="/search">Clear all filters</Link>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className={view === 'grid' 
                      ? 'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3' 
                      : 'space-y-4'
                    }>
                      {data.products.map((product: IProduct) => (
                        <ProductCard 
                          key={product._id} 
                          product={product} 
                          // variant={view === 'list' ? 'horizontal' : 'default'}
                        />
                      ))}
                    </div>

                    {/* Pagination */}
                    {data.totalPages > 1 && (
                      <div className="mt-8">
                        <Pagination page={page} totalPages={data.totalPages} />
                      </div>
                    )}
                  </>
                )}
              </Suspense>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}