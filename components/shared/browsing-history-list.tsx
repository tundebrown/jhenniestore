'use client'
import useBrowsingHistory from '@/hooks/use-browsing-history'
import React, { useEffect, useState } from 'react'
import ProductSlider from './product/product-slider'
import { Separator } from '../ui/separator'
import { cn } from '@/lib/utils'
import { Clock, Sparkles, Eye, History, TrendingUp } from 'lucide-react'
import { Skeleton } from '../ui/skeleton'

export default function BrowsingHistoryList({
  className,
}: {
  className?: string
}) {
  const { products } = useBrowsingHistory()
  
  if (products.length === 0) return null

  return (
    <div className={cn(' space-y-6', className)}>
      <div className='animate-fade-in'>
        <Separator className='mb-6' />
        <ProductList
          title={
            <div className='flex items-center gap-2'>
              <Sparkles className='w-5 h-5 text-purple-500' />
              <span>Related to items you've viewed</span>
            </div>
          }
          type='related'
        />
      </div>
      
      <div className='animate-fade-in' style={{ animationDelay: '100ms' }}>
        <Separator className='mb-6' />
        <ProductList
          title={
            <div className='flex items-center gap-2'>
              <History className='w-5 h-5 text-blue-500' />
              <span>Your browsing history</span>
            </div>
          }
          hideDetails
          type='history'
        />
      </div>
    </div>
  )
}

function ProductList({
  title,
  type = 'history',
  hideDetails = false,
  excludeId = '',
}: {
  title: string | React.ReactNode
  type: 'history' | 'related'
  excludeId?: string
  hideDetails?: boolean
}) {
  const { products } = useBrowsingHistory()
  const [data, setData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      if (products.length === 0) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        
        const res = await fetch(
          `/api/products/browsing-history?type=${type}&excludeId=${excludeId}&categories=${products
            .map((product) => product.category)
            .join(',')}&ids=${products.map((product) => product.id).join(',')}`
        )
        
        if (!res.ok) {
          throw new Error('Failed to fetch browsing history')
        }
        
        const data = await res.json()
        setData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        console.error('Error fetching browsing history:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [excludeId, products, type])

  if (isLoading) {
    return (
      <div className='space-y-4'>
        <div className='flex items-center gap-2 text-gray-700 dark:text-gray-300'>
          {typeof title === 'string' ? (
            <h3 className='text-lg font-semibold'>{title}</h3>
          ) : (
            <h3 className='text-lg font-semibold'>{title}</h3>
          )}
        </div>
        <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4'>
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className='space-y-3'>
              <Skeleton className='h-48 rounded-lg' />
              {!hideDetails && (
                <>
                  <Skeleton className='h-4 w-3/4' />
                  <Skeleton className='h-4 w-1/2' />
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='text-center py-8'>
        <div className='bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4 max-w-md mx-auto'>
          <Eye className='w-8 h-8 text-red-500 mx-auto mb-2' />
          <p className='text-red-700 dark:text-red-300 font-medium'>Unable to load browsing history</p>
          <p className='text-red-600 dark:text-red-400 text-sm mt-1'>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className='mt-3 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md text-sm hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors'
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className='text-center py-8'>
        <div className='bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700 rounded-lg p-6 max-w-md mx-auto'>
          <Clock className='w-10 h-10 text-gray-400 mx-auto mb-3' />
          <h3 className='text-gray-700 dark:text-gray-300 font-medium mb-1'>
            {type === 'history' ? 'No browsing history yet' : 'No related items found'}
          </h3>
          <p className='text-gray-500 dark:text-gray-400 text-sm'>
            {type === 'history' 
              ? 'Start browsing products to see your history here' 
              : 'We\'ll show related items as you browse more products'
            }
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className='animate-fade-in'>
      <div className='flex items-center justify-between mb-6'>
        <div className='flex items-center gap-2'>
          {typeof title === 'string' ? (
            <h3 className='text-xl font-bold text-gray-900 dark:text-white'>{title}</h3>
          ) : (
            title
          )}
        </div>
        
        {type === 'history' && (
          <button className='text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors'>
            Clear history
          </button>
        )}
      </div>
      
      <ProductSlider 
        title={undefined} 
        products={data} 
        hideDetails={hideDetails}
        variant={type === 'related' ? 'promotional' : 'default'}
      />
      
      {type === 'related' && (
        <p className='text-sm text-gray-500 dark:text-gray-400 mt-3 text-center'>
          Based on your recent browsing activity
        </p>
      )}
    </div>
  )
}

// Additional utility component for empty states
function EmptyState({ type }: { type: 'history' | 'related' }) {
  return (
    <div className='text-center py-12'>
      <div className='bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 max-w-md mx-auto'>
        <div className='w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4'>
          {type === 'history' ? (
            <History className='w-8 h-8 text-blue-500' />
          ) : (
            <TrendingUp className='w-8 h-8 text-purple-500' />
          )}
        </div>
        <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
          {type === 'history' ? 'Your history is empty' : 'Discover related items'}
        </h3>
        <p className='text-gray-600 dark:text-gray-300 text-sm mb-4'>
          {type === 'history' 
            ? 'Browse products to build your personalized history'
            : 'As you explore more products, we\'ll show you relevant suggestions'
          }
        </p>
        <button className='bg-blue-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors'>
          Start Browsing
        </button>
      </div>
    </div>
  )
}