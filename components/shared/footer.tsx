'use client'
import { ChevronUp, Mail, Phone, MapPin, Globe, CreditCard } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import useSettingStore from '@/hooks/use-setting-store'
import { Select, SelectContent, SelectItem, SelectTrigger } from '../ui/select'
import { SelectValue } from '@radix-ui/react-select'

export default function Footer() {
  const {
    setting: { site, availableCurrencies, currency },
    setCurrency,
  } = useSettingStore()
  
  const [email, setEmail] = useState('')
  
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle subscription logic
    setEmail('')
  }

  const currentYear = new Date().getFullYear()

  return (
    <footer className='bg-gray-900 text-white w-full'>
      {/* Back to top button */}
      <div className='border-t border-gray-700'>
        <Button
          variant='ghost'
          className='w-full rounded-none bg-gray-800 hover:bg-gray-700 py-6 flex items-center justify-center gap-2 transition-colors'
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ChevronUp className='h-5 w-5' />
          <span className='font-medium'>Back to top</span>
        </Button>
      </div>

      {/* Main footer content */}
      <div className='max-w-7xl mx-auto px-4 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12'>
          {/* Company info */}
          <div className='space-y-4'>
            <Link href='/' className='inline-block'>
              <div className='flex items-center gap-3 mb-4'>
                <div className='relative w-10 h-10  p-1.5'>
                  <Image
                    src={site.logo || '/icons/jhennie_logo.png'}
                    width={36}
                    height={36}
                    alt={`${site.name} logo`}
                    className='object-contain'
                  />
                </div>
                <span className='text-xl font-bold bg-gradient-to-r from-blue-400 to-slate-400 bg-clip-text text-transparent'>
                  {site.name}
                </span>
              </div>
            </Link>
            <p className='text-gray-400 max-w-xs'>
              {site.description || 'Your trusted partner for quality products and exceptional service.'}
            </p>
            <div className='flex items-center gap-2 text-gray-400'>
              <MapPin className='h-4 w-4' />
              <span className='text-sm'>{site.address}</span>
            </div>
            <div className='flex items-center gap-2 text-gray-400'>
              <Phone className='h-4 w-4' />
              <span className='text-sm'>{site.phone}</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className='font-bold text-lg mb-4 pb-2 border-b border-gray-700'>Get to Know Us</h3>
            <ul className='space-y-3'>
              <li>
                <Link href='/page/careers' className='text-gray-400 hover:text-white transition-colors'>
                  Careers
                </Link>
              </li>
              <li>
                <Link href='/page/blog' className='text-gray-400 hover:text-white transition-colors'>
                  Blog
                </Link>
              </li>
              <li>
                <Link href='/page/about-us' className='text-gray-400 hover:text-white transition-colors'>
                  About {site.name}
                </Link>
              </li>
            </ul>
          </div>

          {/* Business opportunities */}
          <div>
            <h3 className='font-bold text-lg mb-4 pb-2 border-b border-gray-700'>Make Money with Us</h3>
            <ul className='space-y-3'>
              <li>
                <Link href='/page/sell' className='text-gray-400 hover:text-white transition-colors'>
                  Sell on {site.name}
                </Link>
              </li>
              <li>
                <Link href='/page/become-affiliate' className='text-gray-400 hover:text-white transition-colors'>
                  Become an Affiliate
                </Link>
              </li>
              <li>
                <Link href='/page/advertise' className='text-gray-400 hover:text-white transition-colors'>
                  Advertise Your Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer support */}
          <div>
            <h3 className='font-bold text-lg mb-4 pb-2 border-b border-gray-700'>Customer Support</h3>
            <ul className='space-y-3 mb-6'>
              <li>
                <Link href='/page/shipping' className='text-gray-400 hover:text-white transition-colors'>
                  Shipping & Policies
                </Link>
              </li>
              <li>
                <Link href='/page/returns-policy' className='text-gray-400 hover:text-white transition-colors'>
                  Returns & Replacements
                </Link>
              </li>
              <li>
                <Link href='/page/help' className='text-gray-400 hover:text-white transition-colors'>
                  Help Center
                </Link>
              </li>
            </ul>
            
            {/* Newsletter subscription */}
            <div>
              <h4 className='font-medium mb-3'>Stay Updated</h4>
              <form onSubmit={handleSubscribe} className='space-y-2'>
                <div className='flex'>
                  <input
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='Your email address'
                    className='flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    required
                  />
                  <Button
                    type='submit'
                    className='bg-gradient-to-r py-6 from-blue-600 to-slate-600 hover:from-blue-700 hover:to-slate-700 rounded-l-none'
                  >
                    <Mail className='h-4 w-4 mr-1' />
                    Subscribe
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Currency selector and additional info */}
        <div className='border-t border-gray-800 pt-8'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-6'>
            <div className='flex items-center gap-4'>
              <div className='flex items-center gap-2 text-sm text-gray-400'>
                <Globe className='h-4 w-4' />
                <span>Language & Currency</span>
              </div>
              
              <Select
                value={currency}
                onValueChange={(value) => {
                  setCurrency(value)
                }}
              >
                <SelectTrigger className='w-[180px] bg-gray-800 border-gray-700'>
                  <SelectValue placeholder='Select currency' />
                </SelectTrigger>
                <SelectContent className='bg-gray-800 border-gray-700 text-white'>
                  {availableCurrencies
                    .filter((x) => x.code)
                    .map((currency, index) => (
                      <SelectItem 
                        key={index} 
                        value={currency.code}
                        className='focus:bg-gray-700'
                      >
                        {currency.name} ({currency.code})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className='flex items-center gap-4'>
              <span className='text-sm text-gray-400'>We accept:</span>
              <div className='flex gap-2'>
                <CreditCard className='h-6 w-6 text-gray-400' />
                <div className='h-6 w-10 bg-gray-700 rounded-md flex items-center justify-center text-xs'>
                  PayPal
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom footer */}
      <div className='border-t border-gray-800 py-6'>
        <div className='max-w-7xl mx-auto px-4'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
            <p className='text-gray-500 text-sm text-center md:text-left'>
              © {currentYear} {site.name}. {site.copyright}
            </p>
            
            <div className='flex flex-wrap justify-center gap-4 text-sm'>
              <Link 
                href='/page/conditions-of-use' 
                className='text-gray-500 hover:text-white transition-colors'
              >
                Terms of Service
              </Link>
              <Link 
                href='/page/privacy-policy' 
                className='text-gray-500 hover:text-white transition-colors'
              >
                Privacy Policy
              </Link>
              <Link 
                href='/page/help' 
                className='text-gray-500 hover:text-white transition-colors'
              >
                Help
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}