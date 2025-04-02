import { Suspense } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import RestaurantExplorer from "@/components/restaurant-explorer"
import { RestaurantSkeleton } from "@/components/restaurant-skeleton"
import { FeaturedSection } from "@/components/featured-section"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Discover the Best Food <br className="hidden md:block" />
              in Your City
            </h1>
            <p className="text-xl text-muted-foreground mb-6 max-w-2xl">
              Explore restaurants, read reviews, and find the perfect meal with our comprehensive food database
              explorer.
            </p>
          </div>
        </div>

        <FeaturedSection />

        <div className="container mx-auto px-4 py-8">
          <h2 className="text-3xl font-bold mb-2">Explore Restaurants</h2>
          <p className="text-muted-foreground mb-6">Discover the best food from over 100 restaurants</p>
          <Suspense fallback={<RestaurantSkeleton />}>
            <RestaurantExplorer />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  )
}

