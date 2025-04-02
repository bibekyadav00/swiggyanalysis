import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getCuisineImage } from "@/lib/utils"
import { getAllCuisines } from "@/lib/data"

export function FeaturedSection() {
  const cuisines = getAllCuisines().slice(0, 6)

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Explore Cuisines</h2>
            <p className="text-muted-foreground">Discover restaurants by your favorite cuisine type</p>
          </div>
          <Button variant="outline" className="mt-4 md:mt-0">
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {cuisines.map((cuisine) => (
            <Link href={`/?cuisine=${cuisine}`} key={cuisine}>
              <Card className="overflow-hidden h-full transition-all hover:shadow-md">
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={getCuisineImage(cuisine) || "/placeholder.svg"}
                    alt={cuisine}
                    fill
                    className="object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardContent className="p-3 text-center">
                  <h3 className="font-medium">{cuisine}</h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

