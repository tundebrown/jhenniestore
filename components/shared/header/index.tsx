import Image from 'next/image'
import Link from 'next/link'
import { getAllCategories } from '@/lib/actions/product.actions'
import Menu from './menu'
import Search from './search'
import data from '@/lib/data'
import Sidebar from './sidebar'
import { getSetting } from '@/lib/actions/setting.actions'

export default async function Header() {
  const categories = await getAllCategories()
  const { site } = await getSetting()
  
  return (
    <header className='bg-white dark:bg-gray-900 text-gray-900 dark:text-white w-full shadow-lg border-b border-gray-200 dark:border-gray-700'>
      <div className='container mx-auto px-4'>
        {/* Top Section */}
        <div className='flex items-center justify-between py-4'>
          {/* Logo */}
          <Link
            href='/'
            className='flex items-center font-bold text-2xl gap-3 group transition-all duration-200'
          >
            <div className='relative w-10 h-10 rounded-lg dark:bg-gradient-to-r from-slate-100 to-slate-100 p-2 pb-2 group-hover:scale-105 transition-transform'>
              <Image
                src={site.logo}
                width={36}
                height={36}
                alt={`${site.name} logo`}
                className='object-contain'
              />
            </div>
            <span className='hidden sm:block bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent'>
              {site.name}
            </span>
          </Link>

          {/* Desktop Search */}
          <div className='hidden md:block flex-1 max-w-xl mx-8'>
            <Search />
          </div>

          {/* Menu */}
          <Menu />
        </div>

        {/* Mobile Search */}
        <div className='md:hidden block pb-4'>
          <Search />
        </div>

        {/* Navigation */}
        <div className='flex items-center bg-gray-50 dark:bg-gray-800 px-4 py-3 rounded-lg mb-2'>
          <Sidebar categories={categories} />
          <div className='flex items-center flex-wrap gap-2 ml-4'>
            {data.headerMenus.map((menu) => (
              <Link
                href={menu.href}
                key={menu.href}
                className='px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-700 rounded-md transition-all duration-200 hover:shadow-sm'
              >
                {menu.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}