import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getCuisineImage(cuisineType: string): string {
  // Map cuisine types to realistic food images
  const cuisineImages: Record<string, string> = {
    Indian: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop",
    Italian: "https://images.unsplash.com/photo-1595295333158-4742f28fbd85?w=800&auto=format&fit=crop",
    Japanese: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop",
    Mexican: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop",
    American: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop",
    Chinese: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop",
    "Middle Eastern": "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=800&auto=format&fit=crop",
    Thai: "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=800&auto=format&fit=crop",
    Vietnamese: "https://images.unsplash.com/photo-1576577445504-6af96477db52?w=800&auto=format&fit=crop",
    Seafood: "https://images.unsplash.com/photo-1579631542720-3a87824fff86?w=800&auto=format&fit=crop",
    Breakfast: "https://images.unsplash.com/photo-1533089860892-a7c6f10a081a?w=800&auto=format&fit=crop",
    French: "https://images.unsplash.com/photo-1608855238293-a8853e7f7c98?w=800&auto=format&fit=crop",
    Dessert: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&auto=format&fit=crop",
  }

  return (
    cuisineImages[cuisineType] || "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop"
  )
}

// Add a function to get random food images for menu items
export function getRandomFoodImage(category: string): string {
  const categoryImages: Record<string, string[]> = {
    "Main Course": [
      "https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop",
    ],
    Pasta: [
      "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1608219992759-ceb5b1ab1aab?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&auto=format&fit=crop",
    ],
    Pizza: [
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&auto=format&fit=crop",
    ],
    Sushi: [
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1617196034183-421b4917c92d?w=800&auto=format&fit=crop",
    ],
    Dessert: [
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551106652-a5bcf4b29ab6?w=800&auto=format&fit=crop",
    ],
    Beverage: [
      "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1543362906-acfc16c67564?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop",
    ],
    Bread: [
      "https://images.unsplash.com/photo-1549931319-a545dcf3bc7b?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop",
    ],
    Soup: [
      "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1616501268209-edfff098fdd2?w=800&auto=format&fit=crop",
    ],
    Salad: [
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1607532941433-304659e8198a?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop",
    ],
    Appetizer: [
      "https://images.unsplash.com/photo-1541529086526-db283c563270?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?w=800&auto=format&fit=crop",
    ],
  }

  // Default images for categories not in the map
  const defaultImages = [
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800&auto=format&fit=crop",
  ]

  // Get the array of images for the category, or use default
  const images = categoryImages[category] || defaultImages

  // Return a random image from the array
  return images[Math.floor(Math.random() * images.length)]
}

// Add a function to get restaurant storefront images
export function getRestaurantImage(id: string): string {
  // Array of restaurant storefront images
  const restaurantImages = [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1555992336-fb0d29498b13?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1555992457-b8fefdd46da2?w=800&auto=format&fit=crop",
  ]

  // Use the restaurant ID to deterministically select an image
  // This ensures the same restaurant always gets the same image
  const index = Number.parseInt(id) % restaurantImages.length
  return restaurantImages[index]
}

