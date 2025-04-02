import Image from "next/image"
import { Star, MapPin, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { Restaurant } from "@/types/schema"
import { getRestaurantImage } from "@/lib/utils"

interface RestaurantCardProps {
  restaurant: Restaurant
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  // Use restaurant image for the card
  const restaurantImage = getRestaurantImage(restaurant.id)

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md h-full">
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={restaurantImage || "/placeholder.svg"}
          alt={restaurant.name}
          fill
          className="object-cover transition-transform hover:scale-105"
        />
        <div className="absolute top-2 right-2">
          <Badge className="bg-white text-black font-medium">
            <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
            {restaurant.rating}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="mb-1">
          <h3 className="font-semibold text-lg truncate" title={restaurant.name}>
            {restaurant.name}
          </h3>
        </div>
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <MapPin className="h-3 w-3 mr-1" />
          {restaurant.location}
        </div>
        <div className="flex justify-between items-center">
          <Badge variant="outline" className="text-xs">
            {restaurant.cuisineType}
          </Badge>
          <div className="flex items-center text-xs text-muted-foreground">
            <TrendingUp className="h-3 w-3 mr-1" />
            {restaurant.numberOfOrders} orders
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

