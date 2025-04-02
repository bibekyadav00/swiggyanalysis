"use client"

import { useState } from "react"
import Image from "next/image"
import { Star, MapPin, TrendingUp, Clock, Utensils, Phone, Mail, Calendar, User, MessageSquare } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  getRestaurantById,
  getMenuItemsByRestaurantId,
  getReviewsByRestaurantId,
  getOrdersByRestaurantId,
} from "@/lib/data"
import { getCuisineImage, getRestaurantImage } from "@/lib/utils"
import { MenuItemCard } from "@/components/menu-item-card"

interface RestaurantDetailProps {
  restaurantId: string
}

export default function RestaurantDetail({ restaurantId }: RestaurantDetailProps) {
  const restaurant = getRestaurantById(restaurantId)
  const menuItems = getMenuItemsByRestaurantId(restaurantId)
  const reviews = getReviewsByRestaurantId(restaurantId)
  const orders = getOrdersByRestaurantId(restaurantId)
  const [showSqlQuery, setShowSqlQuery] = useState(false)

  if (!restaurant) {
    return <div>Restaurant not found</div>
  }

  const cuisineImage = getCuisineImage(restaurant.cuisineType)

  // Generate SQL queries
  const menuItemsQuery = `
SELECT m.Item_ID, m.Item_Name, m.Price, m.Category
FROM Menu_Items m
WHERE m.Restaurant_ID = ${restaurantId}
ORDER BY m.Category, m.Price;
  `

  const reviewsQuery = `
SELECT r.Review_ID, r.Rating, r.Review_Text, r.Date, c.Name as Customer_Name
FROM Reviews_and_Ratings r
JOIN Customers c ON r.Customer_ID = c.Customer_ID
WHERE r.Restaurant_ID = ${restaurantId}
ORDER BY r.Date DESC;
  `

  const ordersQuery = `
SELECT o.Order_ID, o.Order_Date, o.Order_Time, o.Order_Status, o.Order_Total, o.Payment_Method, c.Name as Customer_Name
FROM Orders o
JOIN Customers c ON o.Customer_ID = c.Customer_ID
WHERE o.Restaurant_ID = ${restaurantId}
ORDER BY o.Order_Date DESC, o.Order_Time DESC;
  `

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="relative aspect-video rounded-lg overflow-hidden mb-6">
            <Image
              src={getRestaurantImage(restaurant.id) || "/placeholder.svg"}
              alt={restaurant.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
            <div className="flex flex-wrap gap-3 mb-4">
              <Badge variant="outline" className="flex items-center">
                <Utensils className="h-3 w-3 mr-1" />
                {restaurant.cuisineType}
              </Badge>
              <Badge variant="outline" className="flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                {restaurant.location}
              </Badge>
              <Badge variant="outline" className="flex items-center">
                <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                {restaurant.rating} Rating
              </Badge>
              <Badge variant="outline" className="flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                {restaurant.numberOfOrders} Orders
              </Badge>
            </div>

            <p className="text-muted-foreground">
              {restaurant.name} is a popular {restaurant.cuisineType} restaurant located in {restaurant.location}. With
              a rating of {restaurant.rating} stars and over {restaurant.numberOfOrders} orders, it's one of the most
              sought-after dining options in the area.
            </p>
          </div>

          <Tabs defaultValue="menu">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="menu">Menu</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
            </TabsList>

            <div className="mt-2 mb-4">
              <Button variant="outline" size="sm" onClick={() => setShowSqlQuery(!showSqlQuery)}>
                {showSqlQuery ? "Hide SQL Query" : "Show SQL Query"}
              </Button>
            </div>

            <TabsContent value="menu">
              {showSqlQuery && (
                <Card className="mb-4 bg-gray-900 text-gray-100">
                  <CardContent className="p-4">
                    <pre className="text-sm overflow-x-auto">
                      <code>{menuItemsQuery}</code>
                    </pre>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Menu Items</CardTitle>
                </CardHeader>
                <CardContent>
                  {menuItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {menuItems.map((item) => (
                        <MenuItemCard key={item.id} item={item} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p>No menu items found</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews">
              {showSqlQuery && (
                <Card className="mb-4 bg-gray-900 text-gray-100">
                  <CardContent className="p-4">
                    <pre className="text-sm overflow-x-auto">
                      <code>{reviewsQuery}</code>
                    </pre>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Customer Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  {reviews.length > 0 ? (
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div key={review.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center">
                              <User className="h-5 w-5 mr-2 text-muted-foreground" />
                              <span className="font-medium">{review.customerName}</span>
                            </div>
                            <Badge>
                              <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                              {review.rating}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{review.reviewText}</p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1" />
                            {review.date}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <MessageSquare className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                      <p>No reviews yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders">
              {showSqlQuery && (
                <Card className="mb-4 bg-gray-900 text-gray-100">
                  <CardContent className="p-4">
                    <pre className="text-sm overflow-x-auto">
                      <code>{ordersQuery}</code>
                    </pre>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.length > 0 ? (
                        orders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.id}</TableCell>
                            <TableCell>
                              {order.date} {order.time}
                            </TableCell>
                            <TableCell>{order.customerName}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  order.status === "Completed"
                                    ? "default"
                                    : order.status === "Pending"
                                      ? "secondary"
                                      : order.status === "Cancelled"
                                        ? "destructive"
                                        : "outline"
                                }
                              >
                                {order.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">{order.total}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center">
                            No orders found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Restaurant Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="font-medium">Location</h4>
                    <p className="text-sm text-muted-foreground">123 Food Street, {restaurant.location}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="font-medium">Opening Hours</h4>
                    <p className="text-sm text-muted-foreground">Monday - Sunday: 10:00 AM - 10:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="font-medium">Contact</h4>
                    <p className="text-sm text-muted-foreground">+91 1234567890</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="font-medium">Email</h4>
                    <p className="text-sm text-muted-foreground">
                      {restaurant.name.toLowerCase().replace(/\s+/g, ".")}@example.com
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SQL Queries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-1">Restaurant Details</h4>
                  <div className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                    <pre>
                      <code>{`SELECT * FROM Restaurants
WHERE Restaurant_ID = ${restaurantId};`}</code>
                    </pre>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-1">Top Menu Items</h4>
                  <div className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                    <pre>
                      <code>{`SELECT m.Item_Name, COUNT(o.Order_ID) as Order_Count
FROM Menu_Items m
JOIN Order_Items oi ON m.Item_ID = oi.Item_ID
JOIN Orders o ON oi.Order_ID = o.Order_ID
WHERE m.Restaurant_ID = ${restaurantId}
GROUP BY m.Item_ID
ORDER BY Order_Count DESC
LIMIT 5;`}</code>
                    </pre>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-1">Average Rating</h4>
                  <div className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                    <pre>
                      <code>{`SELECT AVG(Rating) as Average_Rating
FROM Reviews_and_Ratings
WHERE Restaurant_ID = ${restaurantId};`}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

