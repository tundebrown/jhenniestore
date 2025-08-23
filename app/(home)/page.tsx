import BrowsingHistoryList from '@/components/shared/browsing-history-list'
import { HomeCard } from '@/components/shared/home/home-card'
import { HomeCarousel } from '@/components/shared/home/home-carousel'
import ProductSlider from '@/components/shared/product/product-slider'
import { Card, CardContent } from '@/components/ui/card'

import {
  getProductsForCard,
  getProductsByTag,
  getAllCategories,
} from '@/lib/actions/product.actions'
import { getSetting } from '@/lib/actions/setting.actions'
import { toSlug } from '@/lib/utils'

export default async function HomePage() {
  const { carousels } = await getSetting()
  const todaysDeals = await getProductsByTag({ tag: 'todays-deal' })
  const bestSellingProducts = await getProductsByTag({ tag: 'best-seller' })

  const categories = (await getAllCategories()).slice(0, 4)
  const newArrivals = await getProductsForCard({
    tag: 'new-arrival',
  })
  const featureds = await getProductsForCard({
    tag: 'featured',
  })
  const bestSellers = await getProductsForCard({
    tag: 'best-seller',
  })

  const cards = [
    {
      title: "Categories to explore",
      link: {
        text: "See More",
        href: '/search',
      },
      items: categories.map((category) => ({
        name: category,
        image: `/images/${(category)}.jpg`,
        href: `/search?category=${category}`,
      })),
    },
    {
      title: "Explore New Arrivals",
      items: newArrivals,
      link: {
        text: "View All",
        href: '/search?tag=new-arrival',
      },
    },
    {
      title: "Discover Best Sellers",
      items: bestSellers,
      link: {
        text: "View All",
        href: '/search?tag=best-seller',
      },
    },
    {
      title: "Featured Products",
      items: featureds,
      link: {
        text: "Shop Now",
        href: '/search?tag=featured',
      },
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Hero Carousel Section */}
      <section className="mb-8">
        <HomeCarousel items={carousels} categories={categories} />
      </section>

      {/* Main Content Container */}
      <div className="container-custom space-y-8 pb-12">
        {/* Feature Cards Grid */}
        <section className="animate-fade-in">
          <HomeCard cards={cards} />
        </section>

        {/* Today's Deals Section */}
        <section className="animate-slide-up" style={{ animationDelay: '100ms' }}>
          <Card className="w-full rounded-2xl overflow-hidden border-0 shadow-lg bg-gradient-to-r from-blue-50 to-violet-50 dark:from-neutral-950/30 dark:to-slate-950/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm md:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                    Today's Deals
                  </span>
                  <span className="text-sm bg-orange-500 text-white px-2 py-1 rounded-full">
                    Limited Time
                  </span>
                </h2>
                <div className="flex items-center gap-2 text-xs md:text-sm text-orange-600 dark:text-orange-400">
                  <span className="h-2 w-2 bg-orange-500 rounded-full animate-pulse"></span>
                  Ending soon
                </div>
              </div>
              <ProductSlider
                title={"Today's Deals"}
                products={todaysDeals}
                variant="promotional"
              />
            </CardContent>
          </Card>
        </section>

        {/* Best Selling Products Section */}
        <section className="animate-slide-up" style={{ animationDelay: '200ms' }}>
          <Card className="w-full rounded-2xl overflow-hidden border-0 shadow-lg bg-white dark:bg-gray-900">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm md:text-2xl font-bold text-gray-900 dark:text-white">
                  Best Selling Products
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                    ⭐ Customer Favorites
                  </span>
                </div>
              </div>
              <ProductSlider
                title={"Best Selling Products"}
                products={bestSellingProducts}
                hideDetails={false}
                variant="popular"
              />
            </CardContent>
          </Card>
        </section>

        {/* Categories Banner Section */}
        {/* <section className="animate-slide-up" style={{ animationDelay: '300ms' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="group relative overflow-hidden rounded-2xl border-0 h-48 cursor-pointer">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: "url('/images/category-banner-1.jpg')" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <CardContent className="relative h-full flex flex-col justify-end p-6 text-white">
                <h3 className="text-xl font-bold mb-2">Summer Collection</h3>
                <p className="text-gray-200 mb-4">Discover the latest trends for the season</p>
                <button className="self-start bg-white text-gray-900 px-6 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors">
                  Shop Now
                </button>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden rounded-2xl border-0 h-48 cursor-pointer">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: "url('/images/category-banner-2.jpg')" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <CardContent className="relative h-full flex flex-col justify-end p-6 text-white">
                <h3 className="text-xl font-bold mb-2">Winter Essentials</h3>
                <p className="text-gray-200 mb-4">Stay warm with our premium collection</p>
                <button className="self-start bg-white text-gray-900 px-6 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors">
                  Explore
                </button>
              </CardContent>
            </Card>
          </div>
        </section> */}

        {/* Newsletter Section */}
        <section className="animate-slide-up" style={{ animationDelay: '400ms' }}>
          <Card className="w-full rounded-2xl overflow-hidden border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 mx-4">
            <CardContent className="p-6 md:p-8 text-center">
              <div className="max-w-md mx-auto">
                {/* Icon for visual appeal */}
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-full">
                    <svg
                      className="w-6 h-6 text-blue-600 dark:text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>

                <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Stay Updated
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-5 text-sm md:text-base">
                  Get exclusive offers and product updates delivered to your inbox
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                    aria-label="Email address for newsletter subscription"
                  />
                  <button className="bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors whitespace-nowrap text-base">
                    Subscribe
                  </button>
                </div>

                {/* Privacy assurance text */}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Browsing History Section */}
        <section className="animate-slide-up" style={{ animationDelay: '500ms' }}>
          <Card className="w-full rounded-2xl overflow-hidden border-0 shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Recently Viewed
              </h3>
              <BrowsingHistoryList />
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center hover:scale-110">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>
    </div>
  )
}