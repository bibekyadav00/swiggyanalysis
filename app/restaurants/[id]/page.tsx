import { Suspense } from "react"
import { notFound } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import RestaurantDetail from "@/components/restaurant-detail"
import { RestaurantDetailSkeleton } from "@/components/restaurant-skeleton"
import { getRestaurantById } from "@/lib/data"

export default function RestaurantPage({ params }: { params: { id: string } }) {
  const restaurantId = params.id
  const restaurant = getRestaurantById(restaurantId)

  if (!restaurant) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50">
        <Suspense fallback={<RestaurantDetailSkeleton />}>
          <RestaurantDetail restaurantId={restaurantId} />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

