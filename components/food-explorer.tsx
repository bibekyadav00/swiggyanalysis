"use client"

import { useState, useEffect } from "react"
import { Search, Filter, ChevronDown, MapPin, Utensils, Pizza, Coffee, Beef, IceCream } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { RestaurantCard } from "@/components/restaurant-card"
import { restaurants } from "@/data/restaurants"

type SortOption = "relevance" | "rating" | "deliveryTime" | "costLowToHigh" | "costHighToLow"

export default function FoodExplorer() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("relevance")
  const [filteredRestaurants, setFilteredRestaurants] = useState(restaurants)
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    let result = [...restaurants]

    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        (restaurant) =>
          restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          restaurant.cuisines.some((cuisine) => cuisine.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    // Apply cuisine filter
    if (selectedCuisines.length > 0) {
      result = result.filter((restaurant) => selectedCuisines.some((cuisine) => restaurant.cuisines.includes(cuisine)))
    }

    // Apply tab filter
    if (activeTab !== "all") {
      if (activeTab === "veg") {
        result = result.filter((restaurant) => restaurant.isVeg)
      } else if (activeTab === "offers") {
        result = result.filter((restaurant) => restaurant.offers.length > 0)
      } else if (activeTab === "fastest") {
        result = result.filter((restaurant) => restaurant.deliveryTime <= 30)
      }
    }

    // Apply sorting
    switch (sortBy) {
      case "rating":
        result.sort((a, b) => b.rating - a.rating)
        break
      case "deliveryTime":
        result.sort((a, b) => a.deliveryTime - b.deliveryTime)
        break
      case "costLowToHigh":
        result.sort((a, b) => a.costForTwo - b.costForTwo)
        break
      case "costHighToLow":
        result.sort((a, b) => b.costForTwo - a.costForTwo)
        break
      default:
        // relevance is default order in the data
        break
    }

    setFilteredRestaurants(result)
  }, [searchQuery, sortBy, selectedCuisines, activeTab])

  const toggleCuisine = (cuisine: string) => {
    setSelectedCuisines((prev) => (prev.includes(cuisine) ? prev.filter((c) => c !== cuisine) : [...prev, cuisine]))
  }

  const getSortLabel = (sort: SortOption): string => {
    switch (sort) {
      case "relevance":
        return "Relevance"
      case "rating":
        return "Rating (High to Low)"
      case "deliveryTime":
        return "Delivery Time"
      case "costLowToHigh":
        return "Cost (Low to High)"
      case "costHighToLow":
        return "Cost (High to Low)"
    }
  }

  const cuisineOptions = ["North Indian", "South Indian", "Chinese", "Italian", "Fast Food", "Desserts", "Beverages"]

  const cuisineIcons = {
    "North Indian": <Utensils className="h-4 w-4 mr-2" />,
    "South Indian": <Utensils className="h-4 w-4 mr-2" />,
    Chinese: <Utensils className="h-4 w-4 mr-2" />,
    Italian: <Pizza className="h-4 w-4 mr-2" />,
    "Fast Food": <Beef className="h-4 w-4 mr-2" />,
    Desserts: <IceCream className="h-4 w-4 mr-2" />,
    Beverages: <Coffee className="h-4 w-4 mr-2" />,
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Food Delivery</h1>
          <div className="flex items-center mt-2">
            <MapPin className="h-4 w-4 text-primary mr-1" />
            <span className="text-sm text-muted-foreground">Bangalore, Karnataka</span>
          </div>
        </div>

        <div className="mt-4 md:mt-0 w-full md:w-auto">
          <div className="relative w-full md:w-[300px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for restaurants and food"
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 w-full md:w-auto">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="veg">Veg Only</TabsTrigger>
              <TabsTrigger value="offers">Offers</TabsTrigger>
              <TabsTrigger value="fastest">Fastest</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex gap-2 w-full md:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-1">
                  <Filter className="h-4 w-4 mr-1" />
                  Cuisines
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[200px]">
                {cuisineOptions.map((cuisine) => (
                  <DropdownMenuItem
                    key={cuisine}
                    className="flex items-center"
                    onSelect={(e) => {
                      e.preventDefault()
                      toggleCuisine(cuisine)
                    }}
                  >
                    {cuisineIcons[cuisine as keyof typeof cuisineIcons]}
                    <span className="flex-1">{cuisine}</span>
                    {selectedCuisines.includes(cuisine) && <div className="h-2 w-2 rounded-full bg-primary ml-2" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-1">
                  Sort
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuItem onSelect={() => setSortBy("relevance")}>
                  Relevance
                  {sortBy === "relevance" && <div className="h-2 w-2 rounded-full bg-primary ml-2" />}
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setSortBy("rating")}>
                  Rating (High to Low)
                  {sortBy === "rating" && <div className="h-2 w-2 rounded-full bg-primary ml-2" />}
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setSortBy("deliveryTime")}>
                  Delivery Time
                  {sortBy === "deliveryTime" && <div className="h-2 w-2 rounded-full bg-primary ml-2" />}
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setSortBy("costLowToHigh")}>
                  Cost (Low to High)
                  {sortBy === "costLowToHigh" && <div className="h-2 w-2 rounded-full bg-primary ml-2" />}
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setSortBy("costHighToLow")}>
                  Cost (High to Low)
                  {sortBy === "costHighToLow" && <div className="h-2 w-2 rounded-full bg-primary ml-2" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Active filters */}
        {selectedCuisines.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {selectedCuisines.map((cuisine) => (
              <Badge
                key={cuisine}
                variant="secondary"
                className="flex items-center gap-1 cursor-pointer"
                onClick={() => toggleCuisine(cuisine)}
              >
                {cuisine}
                <span className="ml-1">×</span>
              </Badge>
            ))}
            {selectedCuisines.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setSelectedCuisines([])} className="h-6 text-xs">
                Clear all
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Sort info */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{filteredRestaurants.length} Restaurants</h2>
        <div className="text-sm text-muted-foreground">Sorted by: {getSortLabel(sortBy)}</div>
      </div>

      {/* Restaurant grid */}
      {filteredRestaurants.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🍽️</div>
          <h3 className="text-xl font-semibold mb-2">No restaurants found</h3>
          <p className="text-muted-foreground">Try changing your filters or search query</p>
        </div>
      )}
    </div>
  )
}

