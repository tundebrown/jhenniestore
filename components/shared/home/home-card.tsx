
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { ArrowRight, ChevronRight } from 'lucide-react'

type CardItem = {
  title: string
  link: { text: string; href: string }
  items: {
    name: string
    items?: string[]
    image: string
    href: string
  }[]
}

export function HomeCard({ cards }: { cards: CardItem[] }) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4 md:px-6'>
      {cards.map((card, index) => (
        <Card 
          key={card.title} 
          className='rounded-xl overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col group bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800'
          style={{
            animationDelay: `${index * 100}ms`,
            animation: 'fadeIn 0.5s ease-out forwards'
          }}
        >
          <CardContent className='p-6 flex-1'>
            <div className='flex items-center justify-between mb-6'>
              <h3 className='text-xl font-bold text-gray-900 dark:text-white'>{card.title}</h3>
              <div className='w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center'>
                <span className='text-blue-600 dark:text-blue-400 font-semibold text-sm'>
                  {card.items.length}
                </span>
              </div>
            </div>
            
            <div className='grid grid-cols-2 gap-4'>
              {card.items.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className='flex flex-col group/item transition-all duration-300 hover:-translate-y-1'
                >
                  <div className='relative aspect-square overflow-hidden rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 shadow-sm'>
                    <Image
                      src={item.image}
                      alt={item.name}
                      className='object-contain transition-transform duration-500 group-hover/item:scale-110'
                      fill
                      sizes='(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300' />
                  </div>
                  
                  <p className='text-center text-sm font-medium text-gray-700 dark:text-gray-300 mt-3 line-clamp-2 leading-tight group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 transition-colors'>
                    {item.name}
                  </p>
                  
                  {item.items && item.items.length > 0 && (
                    <div className='mt-1 flex justify-center'>
                      <span className='text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full'>
                        +{item.items.length} more
                      </span>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </CardContent>
          
          {card.link && (
            <CardFooter className='px-6 pb-6 pt-0'>
              <Link 
                href={card.link.href} 
                className='w-full flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 group/link transition-all duration-300'
              >
                <span className='text-blue-600 dark:text-blue-400 font-medium text-sm'>
                  {card.link.text}
                </span>
                <div className='flex items-center justify-center w-6 h-6 bg-blue-600 dark:bg-blue-500 rounded-full group-hover/link:bg-blue-700 dark:group-hover/link:bg-blue-600 transition-colors'>
                  <ChevronRight className='h-4 w-4 text-white' />
                </div>
              </Link>
            </CardFooter>
          )}
        </Card>
      ))}
      
      {/* <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style> */}
    </div>
  )
}
