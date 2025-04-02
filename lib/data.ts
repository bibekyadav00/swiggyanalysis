import type { Restaurant, MenuItem, Review, Order } from "@/types/schema"

// Full restaurant data from CSV
const restaurants: Restaurant[] = [
  { id: "1", name: "Spice Garden", cuisineType: "Indian", location: "Downtown", rating: "4.7", numberOfOrders: "1850" },
  {
    id: "2",
    name: "Pasta Paradise",
    cuisineType: "Italian",
    location: "Uptown",
    rating: "4.5",
    numberOfOrders: "1650",
  },
  {
    id: "3",
    name: "Sushi Sensation",
    cuisineType: "Japanese",
    location: "Midtown",
    rating: "4.8",
    numberOfOrders: "2100",
  },
  { id: "4", name: "Taco Temple", cuisineType: "Mexican", location: "Downtown", rating: "4.3", numberOfOrders: "1450" },
  {
    id: "5",
    name: "Burger Bliss",
    cuisineType: "American",
    location: "Suburbs",
    rating: "4.2",
    numberOfOrders: "1900",
  },
  {
    id: "6",
    name: "Wok Wonderland",
    cuisineType: "Chinese",
    location: "Chinatown",
    rating: "4.6",
    numberOfOrders: "1750",
  },
  {
    id: "7",
    name: "Falafel Factory",
    cuisineType: "Middle Eastern",
    location: "Downtown",
    rating: "4.4",
    numberOfOrders: "1200",
  },
  { id: "8", name: "Pizza Palace", cuisineType: "Italian", location: "Uptown", rating: "4.1", numberOfOrders: "2200" },
  { id: "9", name: "Curry Corner", cuisineType: "Indian", location: "Midtown", rating: "4.5", numberOfOrders: "1550" },
  {
    id: "10",
    name: "Noodle Nirvana",
    cuisineType: "Thai",
    location: "Downtown",
    rating: "4.7",
    numberOfOrders: "1650",
  },
  {
    id: "11",
    name: "Steak Supreme",
    cuisineType: "American",
    location: "Suburbs",
    rating: "4.9",
    numberOfOrders: "1400",
  },
  {
    id: "12",
    name: "Dim Sum Delight",
    cuisineType: "Chinese",
    location: "Chinatown",
    rating: "4.6",
    numberOfOrders: "1300",
  },
  {
    id: "13",
    name: "Pho Phenomenon",
    cuisineType: "Vietnamese",
    location: "Downtown",
    rating: "4.4",
    numberOfOrders: "1100",
  },
  {
    id: "14",
    name: "Kebab Kingdom",
    cuisineType: "Middle Eastern",
    location: "Midtown",
    rating: "4.3",
    numberOfOrders: "950",
  },
  {
    id: "15",
    name: "Seafood Sensation",
    cuisineType: "Seafood",
    location: "Waterfront",
    rating: "4.8",
    numberOfOrders: "1250",
  },
  {
    id: "16",
    name: "Bagel Bonanza",
    cuisineType: "Breakfast",
    location: "Downtown",
    rating: "4.2",
    numberOfOrders: "1800",
  },
  {
    id: "17",
    name: "Ramen Republic",
    cuisineType: "Japanese",
    location: "Uptown",
    rating: "4.7",
    numberOfOrders: "1400",
  },
  { id: "18", name: "Crepe Corner", cuisineType: "French", location: "Midtown", rating: "4.5", numberOfOrders: "1050" },
  { id: "19", name: "BBQ Barn", cuisineType: "American", location: "Suburbs", rating: "4.6", numberOfOrders: "1700" },
  {
    id: "20",
    name: "Gelato Garden",
    cuisineType: "Dessert",
    location: "Downtown",
    rating: "4.9",
    numberOfOrders: "2000",
  },
  {
    id: "21",
    name: "Tandoori Tastes",
    cuisineType: "Indian",
    location: "Uptown",
    rating: "4.4",
    numberOfOrders: "1350",
  },
  {
    id: "22",
    name: "Burrito Brothers",
    cuisineType: "Mexican",
    location: "Downtown",
    rating: "4.2",
    numberOfOrders: "1600",
  },
  {
    id: "23",
    name: "Sizzling Steakhouse",
    cuisineType: "American",
    location: "Suburbs",
    rating: "4.7",
    numberOfOrders: "1950",
  },
  {
    id: "24",
    name: "Dumpling Dynasty",
    cuisineType: "Chinese",
    location: "Chinatown",
    rating: "4.5",
    numberOfOrders: "1400",
  },
  { id: "25", name: "Feta Fantasy", cuisineType: "Greek", location: "Midtown", rating: "4.3", numberOfOrders: "1150" },
  {
    id: "26",
    name: "Tempura Terrace",
    cuisineType: "Japanese",
    location: "Downtown",
    rating: "4.6",
    numberOfOrders: "1300",
  },
  {
    id: "27",
    name: "Croissant Cafe",
    cuisineType: "French",
    location: "Uptown",
    rating: "4.4",
    numberOfOrders: "1250",
  },
  {
    id: "28",
    name: "Taqueria Treats",
    cuisineType: "Mexican",
    location: "Midtown",
    rating: "4.1",
    numberOfOrders: "1500",
  },
  {
    id: "29",
    name: "Pasta Perfection",
    cuisineType: "Italian",
    location: "Downtown",
    rating: "4.8",
    numberOfOrders: "1700",
  },
  { id: "30", name: "Curry Castle", cuisineType: "Indian", location: "Suburbs", rating: "4.5", numberOfOrders: "1400" },
  {
    id: "31",
    name: "Waffle Wonderland",
    cuisineType: "Breakfast",
    location: "Uptown",
    rating: "4.3",
    numberOfOrders: "1600",
  },
  {
    id: "32",
    name: "Sushi Supreme",
    cuisineType: "Japanese",
    location: "Waterfront",
    rating: "4.9",
    numberOfOrders: "1800",
  },
  { id: "33", name: "Taco Town", cuisineType: "Mexican", location: "Downtown", rating: "4.2", numberOfOrders: "1550" },
  { id: "34", name: "Bistro Bliss", cuisineType: "French", location: "Midtown", rating: "4.7", numberOfOrders: "1350" },
  { id: "35", name: "Naan Nook", cuisineType: "Indian", location: "Uptown", rating: "4.4", numberOfOrders: "1250" },
  {
    id: "36",
    name: "Peking Palace",
    cuisineType: "Chinese",
    location: "Chinatown",
    rating: "4.6",
    numberOfOrders: "1450",
  },
  {
    id: "37",
    name: "Pancake Paradise",
    cuisineType: "Breakfast",
    location: "Suburbs",
    rating: "4.3",
    numberOfOrders: "1700",
  },
  {
    id: "38",
    name: "Risotto Retreat",
    cuisineType: "Italian",
    location: "Downtown",
    rating: "4.5",
    numberOfOrders: "1300",
  },
  { id: "39", name: "Bento Box", cuisineType: "Japanese", location: "Midtown", rating: "4.7", numberOfOrders: "1400" },
  {
    id: "40",
    name: "Fajita Fiesta",
    cuisineType: "Mexican",
    location: "Uptown",
    rating: "4.2",
    numberOfOrders: "1500",
  },
  {
    id: "41",
    name: "Biryani Bistro",
    cuisineType: "Indian",
    location: "Downtown",
    rating: "4.6",
    numberOfOrders: "1350",
  },
  {
    id: "42",
    name: "Patisserie Palace",
    cuisineType: "French",
    location: "Midtown",
    rating: "4.8",
    numberOfOrders: "1200",
  },
  {
    id: "43",
    name: "Wonton World",
    cuisineType: "Chinese",
    location: "Chinatown",
    rating: "4.4",
    numberOfOrders: "1400",
  },
  {
    id: "44",
    name: "Omelette Oasis",
    cuisineType: "Breakfast",
    location: "Suburbs",
    rating: "4.3",
    numberOfOrders: "1600",
  },
  {
    id: "45",
    name: "Lasagna Lounge",
    cuisineType: "Italian",
    location: "Downtown",
    rating: "4.5",
    numberOfOrders: "1350",
  },
  {
    id: "46",
    name: "Teriyaki Tavern",
    cuisineType: "Japanese",
    location: "Uptown",
    rating: "4.7",
    numberOfOrders: "1250",
  },
  {
    id: "47",
    name: "Quesadilla Quest",
    cuisineType: "Mexican",
    location: "Midtown",
    rating: "4.2",
    numberOfOrders: "1450",
  },
  {
    id: "48",
    name: "Samosa Shack",
    cuisineType: "Indian",
    location: "Downtown",
    rating: "4.4",
    numberOfOrders: "1300",
  },
  { id: "49", name: "Macaron Manor", cuisineType: "French", location: "Uptown", rating: "4.9", numberOfOrders: "1150" },
  {
    id: "50",
    name: "Szechuan Star",
    cuisineType: "Chinese",
    location: "Chinatown",
    rating: "4.6",
    numberOfOrders: "1400",
  },
]

// Extended menu items to cover more restaurants
const menuItems: MenuItem[] = [
  // Restaurant 1 - Spice Garden (Indian)
  { id: "101", name: "Butter Chicken", price: "$14.99", category: "Main Course", restaurantId: "1" },
  { id: "102", name: "Garlic Naan", price: "$3.99", category: "Bread", restaurantId: "1" },
  { id: "103", name: "Vegetable Biryani", price: "$12.99", category: "Rice", restaurantId: "1" },
  { id: "104", name: "Mango Lassi", price: "$4.99", category: "Beverage", restaurantId: "1" },
  { id: "105", name: "Gulab Jamun", price: "$5.99", category: "Dessert", restaurantId: "1" },
  { id: "106", name: "Chicken Tikka", price: "$13.99", category: "Appetizer", restaurantId: "1" },
  { id: "107", name: "Palak Paneer", price: "$11.99", category: "Main Course", restaurantId: "1" },
  { id: "108", name: "Samosa", price: "$4.99", category: "Appetizer", restaurantId: "1" },

  // Restaurant 2 - Pasta Paradise (Italian)
  { id: "201", name: "Spaghetti Carbonara", price: "$15.99", category: "Pasta", restaurantId: "2" },
  { id: "202", name: "Margherita Pizza", price: "$13.99", category: "Pizza", restaurantId: "2" },
  { id: "203", name: "Tiramisu", price: "$6.99", category: "Dessert", restaurantId: "2" },
  { id: "204", name: "Garlic Bread", price: "$4.99", category: "Appetizer", restaurantId: "2" },
  { id: "205", name: "Caprese Salad", price: "$8.99", category: "Salad", restaurantId: "2" },
  { id: "206", name: "Lasagna", price: "$16.99", category: "Pasta", restaurantId: "2" },
  { id: "207", name: "Panna Cotta", price: "$5.99", category: "Dessert", restaurantId: "2" },
  { id: "208", name: "Minestrone Soup", price: "$7.99", category: "Soup", restaurantId: "2" },

  // Restaurant 3 - Sushi Sensation (Japanese)
  { id: "301", name: "Salmon Nigiri", price: "$5.99", category: "Sushi", restaurantId: "3" },
  { id: "302", name: "Dragon Roll", price: "$14.99", category: "Sushi Roll", restaurantId: "3" },
  { id: "303", name: "Miso Soup", price: "$3.99", category: "Soup", restaurantId: "3" },
  { id: "304", name: "Tempura Udon", price: "$12.99", category: "Noodles", restaurantId: "3" },
  { id: "305", name: "Green Tea Ice Cream", price: "$4.99", category: "Dessert", restaurantId: "3" },
  { id: "306", name: "Gyoza", price: "$6.99", category: "Appetizer", restaurantId: "3" },
  { id: "307", name: "Chicken Katsu", price: "$13.99", category: "Main Course", restaurantId: "3" },
  { id: "308", name: "Matcha Latte", price: "$4.99", category: "Beverage", restaurantId: "3" },

  // Restaurant 4 - Taco Temple (Mexican)
  { id: "401", name: "Beef Tacos", price: "$10.99", category: "Main Course", restaurantId: "4" },
  { id: "402", name: "Chicken Quesadilla", price: "$9.99", category: "Main Course", restaurantId: "4" },
  { id: "403", name: "Guacamole & Chips", price: "$6.99", category: "Appetizer", restaurantId: "4" },
  { id: "404", name: "Churros", price: "$5.99", category: "Dessert", restaurantId: "4" },
  { id: "405", name: "Margarita", price: "$7.99", category: "Beverage", restaurantId: "4" },

  // Restaurant 5 - Burger Bliss (American)
  { id: "501", name: "Classic Cheeseburger", price: "$11.99", category: "Main Course", restaurantId: "5" },
  { id: "502", name: "BBQ Ribs", price: "$18.99", category: "Main Course", restaurantId: "5" },
  { id: "503", name: "Onion Rings", price: "$5.99", category: "Appetizer", restaurantId: "5" },
  { id: "504", name: "Apple Pie", price: "$6.99", category: "Dessert", restaurantId: "5" },
  { id: "505", name: "Chocolate Milkshake", price: "$4.99", category: "Beverage", restaurantId: "5" },

  // Restaurant 6 - Wok Wonderland (Chinese)
  { id: "601", name: "Kung Pao Chicken", price: "$13.99", category: "Main Course", restaurantId: "6" },
  { id: "602", name: "Vegetable Spring Rolls", price: "$5.99", category: "Appetizer", restaurantId: "6" },
  { id: "603", name: "Beef Chow Mein", price: "$12.99", category: "Noodles", restaurantId: "6" },
  { id: "604", name: "Fried Rice", price: "$9.99", category: "Rice", restaurantId: "6" },
  { id: "605", name: "Fortune Cookies", price: "$2.99", category: "Dessert", restaurantId: "6" },

  // Add more menu items for other restaurants as needed
  // Restaurant 7 - Falafel Factory (Middle Eastern)
  { id: "701", name: "Falafel Wrap", price: "$9.99", category: "Main Course", restaurantId: "7" },
  { id: "702", name: "Hummus with Pita", price: "$6.99", category: "Appetizer", restaurantId: "7" },
  { id: "703", name: "Shawarma Plate", price: "$14.99", category: "Main Course", restaurantId: "7" },
  { id: "704", name: "Tabbouleh Salad", price: "$7.99", category: "Salad", restaurantId: "7" },
  { id: "705", name: "Baklava", price: "$5.99", category: "Dessert", restaurantId: "7" },

  // Restaurant 8 - Pizza Palace (Italian)
  { id: "801", name: "Pepperoni Pizza", price: "$14.99", category: "Pizza", restaurantId: "8" },
  { id: "802", name: "Cheese Calzone", price: "$12.99", category: "Main Course", restaurantId: "8" },
  { id: "803", name: "Caesar Salad", price: "$8.99", category: "Salad", restaurantId: "8" },
  { id: "804", name: "Mozzarella Sticks", price: "$7.99", category: "Appetizer", restaurantId: "8" },
  { id: "805", name: "Cannoli", price: "$5.99", category: "Dessert", restaurantId: "8" },
]

// Reviews data
const reviews: Review[] = [
  {
    id: "1001",
    restaurantId: "1",
    customerId: "5001",
    customerName: "John Smith",
    rating: "4.8",
    reviewText: "Amazing butter chicken, authentic flavors!",
    date: "15-05-2024",
  },
  {
    id: "1002",
    restaurantId: "1",
    customerId: "5002",
    customerName: "Emily Johnson",
    rating: "4.5",
    reviewText: "Great food but service was a bit slow.",
    date: "10-05-2024",
  },
  {
    id: "1003",
    restaurantId: "1",
    customerId: "5003",
    customerName: "Michael Brown",
    rating: "5.0",
    reviewText: "Best Indian food in town! Will definitely come back.",
    date: "05-05-2024",
  },
  {
    id: "2001",
    restaurantId: "2",
    customerId: "5004",
    customerName: "Sarah Wilson",
    rating: "4.7",
    reviewText: "Authentic Italian pasta, loved the carbonara!",
    date: "12-05-2024",
  },
  {
    id: "2002",
    restaurantId: "2",
    customerId: "5005",
    customerName: "David Lee",
    rating: "4.2",
    reviewText: "Good food but a bit pricey for the portion size.",
    date: "08-05-2024",
  },
  {
    id: "3001",
    restaurantId: "3",
    customerId: "5006",
    customerName: "Jennifer Martinez",
    rating: "4.9",
    reviewText: "Freshest sushi I've had in a long time!",
    date: "14-05-2024",
  },
  {
    id: "3002",
    restaurantId: "3",
    customerId: "5007",
    customerName: "Robert Taylor",
    rating: "4.6",
    reviewText: "Dragon roll was amazing, will order again.",
    date: "09-05-2024",
  },
  // Add more reviews for other restaurants
  {
    id: "4001",
    restaurantId: "4",
    customerId: "5008",
    customerName: "Lisa Anderson",
    rating: "4.4",
    reviewText: "Authentic Mexican flavors, loved the tacos!",
    date: "13-05-2024",
  },
  {
    id: "5001",
    restaurantId: "5",
    customerId: "5009",
    customerName: "James Wilson",
    rating: "4.7",
    reviewText: "Best burgers in town, juicy and flavorful.",
    date: "11-05-2024",
  },
  {
    id: "6001",
    restaurantId: "6",
    customerId: "5010",
    customerName: "Patricia Moore",
    rating: "4.5",
    reviewText: "Excellent Chinese food, generous portions.",
    date: "10-05-2024",
  },
]

// Orders data
const orders: Order[] = [
  {
    id: "10001",
    customerId: "5001",
    customerName: "John Smith",
    restaurantId: "1",
    date: "15-05-2024",
    time: "12:30 PM",
    status: "Completed",
    total: "$35.96",
  },
  {
    id: "10002",
    customerId: "5002",
    customerName: "Emily Johnson",
    restaurantId: "1",
    date: "14-05-2024",
    time: "07:45 PM",
    status: "Completed",
    total: "$42.95",
  },
  {
    id: "10003",
    customerId: "5003",
    customerName: "Michael Brown",
    restaurantId: "1",
    date: "13-05-2024",
    time: "01:15 PM",
    status: "Completed",
    total: "$28.97",
  },
  {
    id: "10004",
    customerId: "5004",
    customerName: "Sarah Wilson",
    restaurantId: "2",
    date: "15-05-2024",
    time: "06:30 PM",
    status: "Completed",
    total: "$45.96",
  },
  {
    id: "10005",
    customerId: "5005",
    customerName: "David Lee",
    restaurantId: "2",
    date: "12-05-2024",
    time: "08:00 PM",
    status: "Completed",
    total: "$37.97",
  },
  {
    id: "10006",
    customerId: "5006",
    customerName: "Jennifer Martinez",
    restaurantId: "3",
    date: "14-05-2024",
    time: "07:15 PM",
    status: "Completed",
    total: "$52.95",
  },
  {
    id: "10007",
    customerId: "5007",
    customerName: "Robert Taylor",
    restaurantId: "3",
    date: "11-05-2024",
    time: "12:45 PM",
    status: "Completed",
    total: "$39.96",
  },
  {
    id: "10008",
    customerId: "5008",
    customerName: "Lisa Anderson",
    restaurantId: "4",
    date: "15-05-2024",
    time: "01:30 PM",
    status: "Pending",
    total: "$32.97",
  },
  {
    id: "10009",
    customerId: "5009",
    customerName: "James Wilson",
    restaurantId: "5",
    date: "14-05-2024",
    time: "07:00 PM",
    status: "Completed",
    total: "$41.95",
  },
  {
    id: "10010",
    customerId: "5010",
    customerName: "Patricia Moore",
    restaurantId: "6",
    date: "13-05-2024",
    time: "06:45 PM",
    status: "Cancelled",
    total: "$29.98",
  },
  // Add more orders for other restaurants
  {
    id: "10011",
    customerId: "5011",
    customerName: "Thomas Johnson",
    restaurantId: "7",
    date: "15-05-2024",
    time: "12:15 PM",
    status: "Completed",
    total: "$27.96",
  },
  {
    id: "10012",
    customerId: "5012",
    customerName: "Jessica Brown",
    restaurantId: "8",
    date: "14-05-2024",
    time: "07:30 PM",
    status: "Completed",
    total: "$33.95",
  },
]

// Data access functions
export function getAllRestaurants(): Restaurant[] {
  return restaurants
}

export function getRestaurantById(id: string): Restaurant | undefined {
  return restaurants.find((restaurant) => restaurant.id === id)
}

export function getAllCuisines(): string[] {
  return [...new Set(restaurants.map((restaurant) => restaurant.cuisineType))]
}

export function getAllLocations(): string[] {
  return [...new Set(restaurants.map((restaurant) => restaurant.location))]
}

export function getMenuItemsByRestaurantId(restaurantId: string): MenuItem[] {
  return menuItems.filter((item) => item.restaurantId === restaurantId)
}

export function getReviewsByRestaurantId(restaurantId: string): Review[] {
  return reviews.filter((review) => review.restaurantId === restaurantId)
}

export function getOrdersByRestaurantId(restaurantId: string): Order[] {
  return orders.filter((order) => order.restaurantId === restaurantId)
}

export function getTopRestaurantsByOrders(limit = 10): any[] {
  return restaurants
    .sort((a, b) => Number.parseInt(b.numberOfOrders) - Number.parseInt(a.numberOfOrders))
    .slice(0, limit)
    .map((restaurant) => ({
      name: restaurant.name,
      orders: Number.parseInt(restaurant.numberOfOrders),
    }))
}

export function getTopRestaurantsByRating(limit = 10): any[] {
  return restaurants
    .sort((a, b) => Number.parseFloat(b.rating) - Number.parseFloat(a.rating))
    .slice(0, limit)
    .map((restaurant) => ({
      name: restaurant.name,
      rating: Number.parseFloat(restaurant.rating),
    }))
}

export function getOrdersByLocation(): any[] {
  const locationCounts: Record<string, number> = {}

  restaurants.forEach((restaurant) => {
    const location = restaurant.location
    const orderCount = Number.parseInt(restaurant.numberOfOrders)

    if (locationCounts[location]) {
      locationCounts[location] += orderCount
    } else {
      locationCounts[location] = orderCount
    }
  })

  return Object.entries(locationCounts).map(([name, value]) => ({ name, value }))
}

export function getOrdersByCuisine(): any[] {
  const cuisineCounts: Record<string, number> = {}

  restaurants.forEach((restaurant) => {
    const cuisine = restaurant.cuisineType
    const orderCount = Number.parseInt(restaurant.numberOfOrders)

    if (cuisineCounts[cuisine]) {
      cuisineCounts[cuisine] += orderCount
    } else {
      cuisineCounts[cuisine] = orderCount
    }
  })

  return Object.entries(cuisineCounts).map(([name, value]) => ({ name, value }))
}

// New functions for complex analytics
export function getAverageRatingByCuisine(): any[] {
  const cuisineRatings: Record<string, { sum: number; count: number }> = {}

  restaurants.forEach((restaurant) => {
    const cuisine = restaurant.cuisineType
    const rating = Number.parseFloat(restaurant.rating)

    if (!cuisineRatings[cuisine]) {
      cuisineRatings[cuisine] = { sum: 0, count: 0 }
    }

    cuisineRatings[cuisine].sum += rating
    cuisineRatings[cuisine].count += 1
  })

  return Object.entries(cuisineRatings).map(([cuisine, data]) => ({
    name: cuisine,
    value: Number.parseFloat((data.sum / data.count).toFixed(2)),
  }))
}

export function getTopPerformingLocations(): any[] {
  const locationStats: Record<
    string,
    {
      totalOrders: number
      restaurantCount: number
      averageRating: number
      topRestaurant: string
    }
  > = {}

  restaurants.forEach((restaurant) => {
    const location = restaurant.location
    const orders = Number.parseInt(restaurant.numberOfOrders)
    const rating = Number.parseFloat(restaurant.rating)

    if (!locationStats[location]) {
      locationStats[location] = {
        totalOrders: 0,
        restaurantCount: 0,
        averageRating: 0,
        topRestaurant: "",
      }
    }

    locationStats[location].totalOrders += orders
    locationStats[location].restaurantCount += 1
    locationStats[location].averageRating += rating

    // Track top restaurant by rating in this location
    if (
      !locationStats[location].topRestaurant ||
      Number.parseFloat(restaurant.rating) >
        Number.parseFloat(restaurants.find((r) => r.name === locationStats[location].topRestaurant)?.rating || "0")
    ) {
      locationStats[location].topRestaurant = restaurant.name
    }
  })

  // Calculate average rating for each location
  Object.keys(locationStats).forEach((location) => {
    locationStats[location].averageRating = Number.parseFloat(
      (locationStats[location].averageRating / locationStats[location].restaurantCount).toFixed(2),
    )
  })

  // Convert to array and sort by total orders
  return Object.entries(locationStats)
    .map(([location, stats]) => ({
      location,
      totalOrders: stats.totalOrders,
      restaurantCount: stats.restaurantCount,
      averageRating: stats.averageRating,
      topRestaurant: stats.topRestaurant,
      ordersPerRestaurant: Math.round(stats.totalOrders / stats.restaurantCount),
    }))
    .sort((a, b) => b.totalOrders - a.totalOrders)
}

export function getCuisinePopularityTrend(): any[] {
  // Simulate trend data based on cuisine popularity
  const cuisines = getAllCuisines()
  const months = ["Jan", "Feb", "Mar", "Apr", "May"]

  return cuisines.map((cuisine) => {
    const baseValue =
      restaurants
        .filter((r) => r.cuisineType === cuisine)
        .reduce((sum, r) => sum + Number.parseInt(r.numberOfOrders), 0) / 500

    // Create trend data with some random variation
    return {
      name: cuisine,
      data: months.map((month, index) => {
        // Add some random variation to simulate trends
        const variation = Math.random() * 0.4 - 0.2 // -20% to +20%
        const value = Math.round(baseValue * (1 + variation) * (1 + index * 0.1))
        return { month, value }
      }),
    }
  })
}

// Function to get cuisine performance metrics
export function getCuisinePerformanceMetrics(): any[] {
  const cuisineMetrics: Record<
    string,
    {
      totalRestaurants: number
      avgRating: number
      totalOrders: number
      highestRated: string
      lowestRated: string
    }
  > = {}

  restaurants.forEach((restaurant) => {
    const cuisine = restaurant.cuisineType
    const rating = Number.parseFloat(restaurant.rating)
    const orders = Number.parseInt(restaurant.numberOfOrders)

    if (!cuisineMetrics[cuisine]) {
      cuisineMetrics[cuisine] = {
        totalRestaurants: 0,
        avgRating: 0,
        totalOrders: 0,
        highestRated: restaurant.name,
        lowestRated: restaurant.name,
      }
    }

    cuisineMetrics[cuisine].totalRestaurants += 1
    cuisineMetrics[cuisine].totalOrders += orders
    cuisineMetrics[cuisine].avgRating += rating

    // Track highest and lowest rated restaurants
    const highestRatedRestaurant = restaurants.find((r) => r.name === cuisineMetrics[cuisine].highestRated)
    const lowestRatedRestaurant = restaurants.find((r) => r.name === cuisineMetrics[cuisine].lowestRated)

    if (Number.parseFloat(highestRatedRestaurant?.rating || "0") < rating) {
      cuisineMetrics[cuisine].highestRated = restaurant.name
    }

    if (Number.parseFloat(lowestRatedRestaurant?.rating || "5") > rating) {
      cuisineMetrics[cuisine].lowestRated = restaurant.name
    }
  })

  // Calculate average ratings
  Object.keys(cuisineMetrics).forEach((cuisine) => {
    cuisineMetrics[cuisine].avgRating = Number.parseFloat(
      (cuisineMetrics[cuisine].avgRating / cuisineMetrics[cuisine].totalRestaurants).toFixed(2),
    )
  })

  return Object.entries(cuisineMetrics).map(([cuisine, metrics]) => ({
    cuisine,
    ...metrics,
    avgOrdersPerRestaurant: Math.round(metrics.totalOrders / metrics.totalRestaurants),
  }))
}

