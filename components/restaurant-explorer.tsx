"use client"

import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Search,
  Filter,
  SortAsc,
  SortDesc,
  MapPin,
  Star,
  Utensils,
  ChevronDown,
  BarChart2,
  Database,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { RestaurantCard } from "@/components/restaurant-card"
import { NlpSqlSearch } from "@/components/nlp-sql-search"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { getAllRestaurants, getAllCuisines, getAllLocations } from "@/lib/data"
import type { Restaurant } from "@/types/schema"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

type SortOption = "name_asc" | "name_desc" | "rating_desc" | "rating_asc" | "orders_desc" | "orders_asc"

export default function RestaurantExplorer() {
  const allRestaurants = getAllRestaurants()
  const allCuisines = getAllCuisines()
  const allLocations = getAllLocations()

  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("rating_desc")
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>(allRestaurants)
  const [displayedRestaurants, setDisplayedRestaurants] = useState<Restaurant[]>([])
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([])
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [ratingFilter, setRatingFilter] = useState([0, 5])
  const [activeTab, setActiveTab] = useState("all")
  const [showSqlQuery, setShowSqlQuery] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [isNlpSearchOpen, setIsNlpSearchOpen] = useState(false)
  const [customSqlQuery, setCustomSqlQuery] = useState("")

  const restaurantsPerPage = 12
  const totalPages = Math.ceil(filteredRestaurants.length / restaurantsPerPage)

  // Generate SQL query based on current filters and sorting
  const generateSqlQuery = () => {
    if (customSqlQuery) return customSqlQuery

    let query = "SELECT * FROM Restaurants"
    const whereConditions = []

    if (selectedCuisines.length > 0) {
      whereConditions.push(`Cuisine_Type IN ('${selectedCuisines.join("', '")}')`)
    }

    if (selectedLocations.length > 0) {
      whereConditions.push(`Location IN ('${selectedLocations.join("', '")}')`)
    }

    if (ratingFilter[0] > 0 || ratingFilter[1] < 5) {
      whereConditions.push(`Rating BETWEEN ${ratingFilter[0]} AND ${ratingFilter[1]}`)
    }

    if (searchQuery) {
      whereConditions.push(`(Restaurant_Name LIKE '%${searchQuery}%' OR Cuisine_Type LIKE '%${searchQuery}%')`)
    }

    if (activeTab === "top_rated") {
      whereConditions.push("Rating >= 4.5")
    } else if (activeTab === "popular") {
      whereConditions.push("Number_of_Orders >= 1000")
    }

    if (whereConditions.length > 0) {
      query += " WHERE " + whereConditions.join(" AND ")
    }

    // Add ORDER BY clause
    switch (sortBy) {
      case "name_asc":
        query += " ORDER BY Restaurant_Name ASC"
        break
      case "name_desc":
        query += " ORDER BY Restaurant_Name DESC"
        break
      case "rating_desc":
        query += " ORDER BY Rating DESC"
        break
      case "rating_asc":
        query += " ORDER BY Rating ASC"
        break
      case "orders_desc":
        query += " ORDER BY Number_of_Orders DESC"
        break
      case "orders_asc":
        query += " ORDER BY Number_of_Orders ASC"
        break
    }

    return query + ";"
  }

  // Handle SQL query from NLP
  const handleSqlGenerated = (sql: string) => {
    setCustomSqlQuery(sql)
    setIsNlpSearchOpen(false)

    // Reset other filters when using custom SQL
    setSelectedCuisines([])
    setSelectedLocations([])
    setRatingFilter([0, 5])
    setActiveTab("all")

    // Apply the custom SQL filter logic
    applyCustomSqlFilter(sql)
  }

  // Apply custom SQL filter logic
  const applyCustomSqlFilter = (sql: string) => {
    try {
      let result = [...allRestaurants]
      console.log("Applying custom SQL filter:", sql)

      // Extract WHERE conditions
      const whereMatch = sql.match(/WHERE\s+(.*?)(?:ORDER BY|GROUP BY|LIMIT|;|$)/i)
      if (whereMatch && whereMatch[1]) {
        const conditions = whereMatch[1].trim()
        console.log("Extracted WHERE conditions:", conditions)

        // Handle cuisine type conditions
        if (conditions.toLowerCase().includes("cuisine_type")) {
          // Handle IN clause
          const cuisineInMatch = conditions.match(/Cuisine_Type\s+IN\s+$$(.*?)$$/i)
          if (cuisineInMatch && cuisineInMatch[1]) {
            const cuisineValues = cuisineInMatch[1].split(",").map((v) => v.trim().replace(/['"]/g, ""))
            console.log("Cuisine IN values:", cuisineValues)
            result = result.filter((r) => cuisineValues.includes(r.cuisineType))
          } else {
            // Handle = clause
            const cuisineEqualMatch = conditions.match(/Cuisine_Type\s*=\s*['"](.+?)['"]/i)
            if (cuisineEqualMatch && cuisineEqualMatch[1]) {
              const cuisineValue = cuisineEqualMatch[1]
              console.log("Cuisine = value:", cuisineValue)
              result = result.filter((r) => r.cuisineType === cuisineValue)
            }

            // Handle LIKE clause
            const cuisineLikeMatch = conditions.match(/Cuisine_Type\s+LIKE\s+['"]%(.+?)%['"]/i)
            if (cuisineLikeMatch && cuisineLikeMatch[1]) {
              const cuisineValue = cuisineLikeMatch[1].toLowerCase()
              console.log("Cuisine LIKE value:", cuisineValue)
              result = result.filter((r) => r.cuisineType.toLowerCase().includes(cuisineValue))
            }
          }
        }

        // Handle location conditions
        if (conditions.toLowerCase().includes("location")) {
          // Handle IN clause
          const locationInMatch = conditions.match(/Location\s+IN\s+$$(.*?)$$/i)
          if (locationInMatch && locationInMatch[1]) {
            const locationValues = locationInMatch[1].split(",").map((v) => v.trim().replace(/['"]/g, ""))
            console.log("Location IN values:", locationValues)
            result = result.filter((r) => locationValues.includes(r.location))
          } else {
            // Handle = clause
            const locationEqualMatch = conditions.match(/Location\s*=\s*['"](.+?)['"]/i)
            if (locationEqualMatch && locationEqualMatch[1]) {
              const locationValue = locationEqualMatch[1]
              console.log("Location = value:", locationValue)
              result = result.filter((r) => r.location === locationValue)
            }

            // Handle LIKE clause
            const locationLikeMatch = conditions.match(/Location\s+LIKE\s+['"]%(.+?)%['"]/i)
            if (locationLikeMatch && locationLikeMatch[1]) {
              const locationValue = locationLikeMatch[1].toLowerCase()
              console.log("Location LIKE value:", locationValue)
              result = result.filter((r) => r.location.toLowerCase().includes(locationValue))
            }
          }
        }

        // Handle restaurant name conditions
        if (conditions.toLowerCase().includes("restaurant_name")) {
          const nameMatch = conditions.match(/Restaurant_Name\s+LIKE\s+['"]%(.+?)%['"]/i)
          if (nameMatch && nameMatch[1]) {
            const nameValue = nameMatch[1].toLowerCase()
            console.log("Name LIKE value:", nameValue)
            result = result.filter((r) => r.name.toLowerCase().includes(nameValue))
          }
        }

        // Handle rating conditions
        if (conditions.toLowerCase().includes("rating")) {
          // Handle comparison operators
          const ratingMatch = conditions.match(/Rating\s+([><]=?|=)\s+(\d+\.?\d*)/i)
          if (ratingMatch && ratingMatch[2]) {
            const operator = ratingMatch[1]
            const ratingValue = Number.parseFloat(ratingMatch[2])
            console.log("Rating comparison:", operator, ratingValue)

            if (operator === ">") {
              result = result.filter((r) => Number.parseFloat(r.rating) > ratingValue)
            } else if (operator === ">=") {
              result = result.filter((r) => Number.parseFloat(r.rating) >= ratingValue)
            } else if (operator === "<") {
              result = result.filter((r) => Number.parseFloat(r.rating) < ratingValue)
            } else if (operator === "<=") {
              result = result.filter((r) => Number.parseFloat(r.rating) <= ratingValue)
            } else if (operator === "=") {
              result = result.filter((r) => Number.parseFloat(r.rating) === ratingValue)
            }
          }

          // Handle BETWEEN clause
          const betweenMatch = conditions.match(/Rating\s+BETWEEN\s+(\d+\.?\d*)\s+AND\s+(\d+\.?\d*)/i)
          if (betweenMatch && betweenMatch[1] && betweenMatch[2]) {
            const minRating = Number.parseFloat(betweenMatch[1])
            const maxRating = Number.parseFloat(betweenMatch[2])
            console.log("Rating BETWEEN:", minRating, "AND", maxRating)
            result = result.filter((r) => {
              const rating = Number.parseFloat(r.rating)
              return rating >= minRating && rating <= maxRating
            })
          }
        }

        // Handle number of orders conditions
        if (conditions.toLowerCase().includes("number_of_orders")) {
          const ordersMatch = conditions.match(/Number_of_Orders\s+([><]=?|=)\s+(\d+)/i)
          if (ordersMatch && ordersMatch[2]) {
            const operator = ordersMatch[1]
            const ordersValue = Number.parseInt(ordersMatch[2])
            console.log("Orders comparison:", operator, ordersValue)

            if (operator === ">") {
              result = result.filter((r) => Number.parseInt(r.numberOfOrders) > ordersValue)
            } else if (operator === ">=") {
              result = result.filter((r) => Number.parseInt(r.numberOfOrders) >= ordersValue)
            } else if (operator === "<") {
              result = result.filter((r) => Number.parseInt(r.numberOfOrders) < ordersValue)
            } else if (operator === "<=") {
              result = result.filter((r) => Number.parseInt(r.numberOfOrders) <= ordersValue)
            } else if (operator === "=") {
              result = result.filter((r) => Number.parseInt(r.numberOfOrders) === ordersValue)
            }
          }
        }
      }

      // Extract ORDER BY
      const orderMatch = sql.match(/ORDER BY\s+(.*?)(?:LIMIT|;|$)/i)
      if (orderMatch && orderMatch[1]) {
        const orderBy = orderMatch[1].trim()
        console.log("ORDER BY clause:", orderBy)

        if (orderBy.toLowerCase().includes("restaurant_name")) {
          const isDesc = orderBy.toLowerCase().includes("desc")
          console.log("Ordering by name:", isDesc ? "descending" : "ascending")
          result.sort((a, b) => {
            return isDesc ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name)
          })
        } else if (orderBy.toLowerCase().includes("rating")) {
          const isDesc = orderBy.toLowerCase().includes("desc")
          console.log("Ordering by rating:", isDesc ? "descending" : "ascending")
          result.sort((a, b) => {
            return isDesc
              ? Number.parseFloat(b.rating) - Number.parseFloat(a.rating)
              : Number.parseFloat(a.rating) - Number.parseFloat(b.rating)
          })
        } else if (orderBy.toLowerCase().includes("number_of_orders")) {
          const isDesc = orderBy.toLowerCase().includes("desc")
          console.log("Ordering by orders:", isDesc ? "descending" : "ascending")
          result.sort((a, b) => {
            return isDesc
              ? Number.parseInt(b.numberOfOrders) - Number.parseInt(a.numberOfOrders)
              : Number.parseInt(a.numberOfOrders) - Number.parseInt(b.numberOfOrders)
          })
        }
      }

      // Extract LIMIT
      const limitMatch = sql.match(/LIMIT\s+(\d+)/i)
      if (limitMatch && limitMatch[1]) {
        const limit = Number.parseInt(limitMatch[1])
        console.log("LIMIT clause:", limit)
        result = result.slice(0, limit)
      }

      console.log("Filtered results count:", result.length)
      setFilteredRestaurants(result)
      setCurrentPage(1)
    } catch (error) {
      console.error("Error applying custom SQL filter:", error)
      // Fallback to default filtering
      setFilteredRestaurants(allRestaurants)
    }
  }

  useEffect(() => {
    if (customSqlQuery) {
      applyCustomSqlFilter(customSqlQuery)
      return
    }

    let result = [...allRestaurants]

    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        (restaurant) =>
          restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          restaurant.cuisineType.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply cuisine filter
    if (selectedCuisines.length > 0) {
      result = result.filter((restaurant) => selectedCuisines.includes(restaurant.cuisineType))
    }

    // Apply location filter
    if (selectedLocations.length > 0) {
      result = result.filter((restaurant) => selectedLocations.includes(restaurant.location))
    }

    // Apply rating filter
    result = result.filter(
      (restaurant) =>
        Number.parseFloat(restaurant.rating) >= ratingFilter[0] &&
        Number.parseFloat(restaurant.rating) <= ratingFilter[1],
    )

    // Apply tab filter
    if (activeTab === "top_rated") {
      result = result.filter((restaurant) => Number.parseFloat(restaurant.rating) >= 4.5)
    } else if (activeTab === "popular") {
      result = result.filter((restaurant) => Number.parseInt(restaurant.numberOfOrders) >= 1000)
    }

    // Apply sorting
    switch (sortBy) {
      case "name_asc":
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "name_desc":
        result.sort((a, b) => b.name.localeCompare(a.name))
        break
      case "rating_desc":
        result.sort((a, b) => Number.parseFloat(b.rating) - Number.parseFloat(a.rating))
        break
      case "rating_asc":
        result.sort((a, b) => Number.parseFloat(a.rating) - Number.parseFloat(b.rating))
        break
      case "orders_desc":
        result.sort((a, b) => Number.parseInt(b.numberOfOrders) - Number.parseInt(a.numberOfOrders))
        break
      case "orders_asc":
        result.sort((a, b) => Number.parseInt(a.numberOfOrders) - Number.parseInt(b.numberOfOrders))
        break
    }

    setFilteredRestaurants(result)
    setCurrentPage(1)
  }, [
    searchQuery,
    sortBy,
    selectedCuisines,
    selectedLocations,
    ratingFilter,
    activeTab,
    allRestaurants,
    customSqlQuery,
  ])

  // Update displayed restaurants when page changes or filtered results change
  useEffect(() => {
    const startIndex = (currentPage - 1) * restaurantsPerPage
    const endIndex = startIndex + restaurantsPerPage
    setDisplayedRestaurants(filteredRestaurants.slice(startIndex, endIndex))
  }, [currentPage, filteredRestaurants, restaurantsPerPage])

  const toggleCuisine = (cuisine: string) => {
    setSelectedCuisines((prev) => (prev.includes(cuisine) ? prev.filter((c) => c !== cuisine) : [...prev, cuisine]))
    setCustomSqlQuery("")
  }

  const toggleLocation = (location: string) => {
    setSelectedLocations((prev) => (prev.includes(location) ? prev.filter((l) => l !== location) : [...prev, location]))
    setCustomSqlQuery("")
  }

  const getSortLabel = (sort: SortOption): string => {
    switch (sort) {
      case "name_asc":
        return "Name (A-Z)"
      case "name_desc":
        return "Name (Z-A)"
      case "rating_desc":
        return "Rating (High to Low)"
      case "rating_asc":
        return "Rating (Low to High)"
      case "orders_desc":
        return "Popularity (High to Low)"
      case "orders_asc":
        return "Popularity (Low to High)"
    }
  }

  const getSortIcon = (sort: SortOption) => {
    if (sort.endsWith("_asc")) {
      return <SortAsc className="h-4 w-4 ml-1" />
    } else {
      return <SortDesc className="h-4 w-4 ml-1" />
    }
  }

  const resetFilters = () => {
    setSelectedCuisines([])
    setSelectedLocations([])
    setRatingFilter([0, 5])
    setActiveTab("all")
    setSearchQuery("")
    setCustomSqlQuery("")
  }

  return (
    <div className="space-y-6">
      {/* Search and SQL Query Toggle */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative w-full md:w-[400px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search restaurants, cuisines..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCustomSqlQuery("")
            }}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setIsNlpSearchOpen(!isNlpSearchOpen)}
          >
            <Search className="h-4 w-4" />
            Natural Language Search
          </Button>
          <Button variant="outline" className="flex items-center gap-2" onClick={() => setShowSqlQuery(!showSqlQuery)}>
            <BarChart2 className="h-4 w-4" />
            {showSqlQuery ? "Hide SQL Query" : "Show SQL Query"}
          </Button>
        </div>
      </div>

      {/* NLP Search */}
      {isNlpSearchOpen && <NlpSqlSearch onSqlGenerated={handleSqlGenerated} />}

      {/* SQL Query Display */}
      {showSqlQuery && (
        <Card className="bg-gray-900 text-gray-100 overflow-hidden">
          <CardContent className="p-4">
            <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
              <code>{generateSqlQuery()}</code>
            </pre>
          </CardContent>
        </Card>
      )}

      {/* Tabs and Filters */}
      <div className="flex flex-col gap-4">
        <Tabs
          defaultValue="all"
          className="w-full"
          onValueChange={(value) => {
            setActiveTab(value)
            setCustomSqlQuery("")
          }}
          value={activeTab}
        >
          <TabsList className="grid grid-cols-3 w-full md:w-[400px]">
            <TabsTrigger value="all">All Restaurants</TabsTrigger>
            <TabsTrigger value="top_rated">Top Rated</TabsTrigger>
            <TabsTrigger value="popular">Most Popular</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-wrap gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Cuisines
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[240px]">
              <DropdownMenuLabel>Filter by Cuisine</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <ScrollArea className="h-[300px]">
                {allCuisines.map((cuisine) => (
                  <DropdownMenuItem
                    key={cuisine}
                    className="flex items-center justify-between"
                    onSelect={(e) => {
                      e.preventDefault()
                      toggleCuisine(cuisine)
                    }}
                  >
                    <span>{cuisine}</span>
                    {selectedCuisines.includes(cuisine) && <div className="h-2 w-2 rounded-full bg-primary" />}
                  </DropdownMenuItem>
                ))}
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Locations
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[240px]">
              <DropdownMenuLabel>Filter by Location</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <ScrollArea className="h-[300px]">
                {allLocations.map((location) => (
                  <DropdownMenuItem
                    key={location}
                    className="flex items-center justify-between"
                    onSelect={(e) => {
                      e.preventDefault()
                      toggleLocation(location)
                    }}
                  >
                    <span>{location}</span>
                    {selectedLocations.includes(location) && <div className="h-2 w-2 rounded-full bg-primary" />}
                  </DropdownMenuItem>
                ))}
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                Rating
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[240px] p-4">
              <div className="space-y-4">
                <h4 className="font-medium">Filter by Rating</h4>
                <div className="flex justify-between text-sm">
                  <span>{ratingFilter[0]}</span>
                  <span>{ratingFilter[1]}</span>
                </div>
                <Slider
                  defaultValue={[0, 5]}
                  min={0}
                  max={5}
                  step={0.5}
                  value={ratingFilter}
                  onValueChange={(value) => {
                    setRatingFilter(value)
                    setCustomSqlQuery("")
                  }}
                />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <Select
            value={sortBy}
            onValueChange={(value) => {
              setSortBy(value as SortOption)
              setCustomSqlQuery("")
            }}
          >
            <SelectTrigger className="w-[180px] md:w-[220px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name_asc">Name (A-Z)</SelectItem>
              <SelectItem value="name_desc">Name (Z-A)</SelectItem>
              <SelectItem value="rating_desc">Rating (High to Low)</SelectItem>
              <SelectItem value="rating_asc">Rating (Low to High)</SelectItem>
              <SelectItem value="orders_desc">Popularity (High to Low)</SelectItem>
              <SelectItem value="orders_asc">Popularity (Low to High)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Active filters */}
        {(selectedCuisines.length > 0 ||
          selectedLocations.length > 0 ||
          ratingFilter[0] > 0 ||
          ratingFilter[1] < 5 ||
          customSqlQuery) && (
          <div className="flex flex-wrap gap-2 mt-2">
            {customSqlQuery && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1 cursor-pointer"
                onClick={() => setCustomSqlQuery("")}
              >
                <Database className="h-3 w-3 mr-1" />
                Custom SQL Query
                <span className="ml-1">×</span>
              </Badge>
            )}

            {!customSqlQuery && (
              <>
                {selectedCuisines.map((cuisine) => (
                  <Badge
                    key={cuisine}
                    variant="secondary"
                    className="flex items-center gap-1 cursor-pointer"
                    onClick={() => toggleCuisine(cuisine)}
                  >
                    <Utensils className="h-3 w-3 mr-1" />
                    {cuisine}
                    <span className="ml-1">×</span>
                  </Badge>
                ))}

                {selectedLocations.map((location) => (
                  <Badge
                    key={location}
                    variant="secondary"
                    className="flex items-center gap-1 cursor-pointer"
                    onClick={() => toggleLocation(location)}
                  >
                    <MapPin className="h-3 w-3 mr-1" />
                    {location}
                    <span className="ml-1">×</span>
                  </Badge>
                ))}

                {(ratingFilter[0] > 0 || ratingFilter[1] < 5) && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1 cursor-pointer"
                    onClick={() => setRatingFilter([0, 5])}
                  >
                    <Star className="h-3 w-3 mr-1" />
                    Rating: {ratingFilter[0]} - {ratingFilter[1]}
                    <span className="ml-1">×</span>
                  </Badge>
                )}
              </>
            )}

            <Button variant="ghost" size="sm" onClick={resetFilters} className="h-6 text-xs">
              Clear all filters
            </Button>
          </div>
        )}
      </div>

      {/* Sort info */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">{filteredRestaurants.length} Restaurants</h2>
        <div className="text-sm text-muted-foreground flex items-center">
          Sorted by: {getSortLabel(sortBy)}
          {getSortIcon(sortBy)}
        </div>
      </div>

      {/* Restaurant grid */}
      {filteredRestaurants.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedRestaurants.map((restaurant) => (
              <Link href={`/restaurants/${restaurant.id}`} key={restaurant.id}>
                <RestaurantCard restaurant={restaurant} />
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage > 1) setCurrentPage(currentPage - 1)
                    }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Show pages around current page
                  let pageNum
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }

                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          setCurrentPage(pageNum)
                        }}
                        isActive={currentPage === pageNum}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  )
                })}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                    }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      ) : (
        <div className="text-center py-12 border rounded-lg bg-gray-50">
          <div className="text-6xl mb-4">🍽️</div>
          <h3 className="text-xl font-semibold mb-2">No restaurants found</h3>
          <p className="text-muted-foreground">Try changing your filters or search query</p>
        </div>
      )}
    </div>
  )
}

