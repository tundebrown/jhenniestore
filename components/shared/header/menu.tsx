import { EllipsisVertical } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import CartButton from './cart-button'
import UserButton from './user-button'
import ThemeSwitcher from './theme-switcher'
import Link from 'next/link'

interface MenuProps {
  forAdmin?: boolean;
  menuList?: any;
}

const Menu: React.FC<MenuProps> = ({ forAdmin = false, menuList }) => {
  return (
    <div className='flex justify-end'>
      <nav className='md:flex gap-3 hidden w-full'>
        {/* <LanguageSwitcher /> */}
        <ThemeSwitcher />
        <UserButton />
        {forAdmin ? null : <CartButton />}
      </nav>
      <nav className='md:hidden'>
        <Sheet>
          <SheetTrigger className='align-middle header-button'>
            <EllipsisVertical className='h-6 w-6' />
          </SheetTrigger>
          <SheetContent className='bg-black text-white  flex flex-col items-start  '>
            <SheetHeader className='w-full'>
              <div className='flex items-center justify-between '>
                <SheetTitle className='  '>{"Site Menu"}</SheetTitle>
                <SheetDescription></SheetDescription>
              </div>
            </SheetHeader>
            {/* <LanguageSwitcher /> */}
            <ThemeSwitcher />
            <UserButton />
            <CartButton />
            <div className='flex flex-col items-left flex-wrap gap-2'>
              {menuList?.map((menu: any) => (
                <Link
                  href={menu.href}
                  key={menu.href}
                  className='px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-700 rounded-md transition-all duration-200 hover:shadow-sm'
                >
                  {menu.name}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>

      </nav>
    </div>
  )
}

export default Menu
