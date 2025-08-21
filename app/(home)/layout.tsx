import Header from '@/components/shared/header'
import Footer from '@/components/shared/footer'

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='flex flex-col min-h-screen justify-center items-center'>
      <Header />
      <main className='flex-1 flex flex-col w-[100%] lg:w-[100%]'>{children}</main>
      <Footer />
    </div>
  )
}
