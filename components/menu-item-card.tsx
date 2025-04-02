import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { MenuItem } from "@/types/schema"
import { getRandomFoodImage } from "@/lib/utils"

interface MenuItemCardProps {
  item: MenuItem
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const foodImage = getRandomFoodImage(item.category)

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={foodImage || "/placeholder.svg"}
          alt={item.name}
          fill
          className="object-cover transition-transform hover:scale-105"
        />
        <div className="absolute top-2 right-2">
          <Badge className="bg-white text-black font-medium">{item.price}</Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg truncate" title={item.name}>
          {item.name}
        </h3>
        <div className="text-sm text-muted-foreground">{item.category}</div>
      </CardContent>
    </Card>
  )
}

