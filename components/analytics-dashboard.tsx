"use client"

import { Badge } from "@/components/ui/badge"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  getTopRestaurantsByOrders,
  getTopRestaurantsByRating,
  getOrdersByLocation,
  getOrdersByCuisine,
  getAverageRatingByCuisine,
  getTopPerformingLocations,
  getCuisinePopularityTrend,
  getCuisinePerformanceMetrics,
} from "@/lib/data"

export default function AnalyticsDashboard() {
  const [showSqlQuery, setShowSqlQuery] = useState(true)
  const [selectedTimeRange, setSelectedTimeRange] = useState("all")
  const [selectedAnalysisTab, setSelectedAnalysisTab] = useState("basic")

  const topRestaurantsByOrders = getTopRestaurantsByOrders(10)
  const topRestaurantsByRating = getTopRestaurantsByRating(10)
  const ordersByLocation = getOrdersByLocation()
  const ordersByCuisine = getOrdersByCuisine()
  const averageRatingByCuisine = getAverageRatingByCuisine()
  const topPerformingLocations = getTopPerformingLocations()
  const cuisinePopularityTrend = getCuisinePopularityTrend()
  const cuisinePerformanceMetrics = getCuisinePerformanceMetrics()

  // SQL Queries
  const topRestaurantsByOrdersQuery = `
SELECT r.Restaurant_ID, r.Restaurant_Name, r.Cuisine_Type, r.Location, r.Rating, r.Number_of_Orders
FROM Restaurants r
ORDER BY r.Number_of_Orders DESC
LIMIT 10;
  `

  const topRestaurantsByRatingQuery = `
SELECT r.Restaurant_ID, r.Restaurant_Name, r.Cuisine_Type, r.Location, r.Rating, r.Number_of_Orders
FROM Restaurants r
ORDER BY r.Rating DESC
LIMIT 10;
  `

  const ordersByLocationQuery = `
SELECT r.Location, COUNT(o.Order_ID) as Order_Count, SUM(CAST(REPLACE(o.Order_Total, '$', '') AS DECIMAL(10,2))) as Total_Revenue
FROM Orders o
JOIN Restaurants r ON o.Restaurant_ID = r.Restaurant_ID
GROUP BY r.Location
ORDER BY Order_Count DESC;
  `

  const ordersByCuisineQuery = `
SELECT r.Cuisine_Type, COUNT(o.Order_ID) as Order_Count, SUM(CAST(REPLACE(o.Order_Total, '$', '') AS DECIMAL(10,2))) as Total_Revenue
FROM Orders o
JOIN Restaurants r ON o.Restaurant_ID = r.Restaurant_ID
GROUP BY r.Cuisine_Type
ORDER BY Order_Count DESC;
  `

  // Advanced SQL Queries
  const averageRatingByCuisineQuery = `
SELECT 
  r.Cuisine_Type,
  AVG(r.Rating) as Average_Rating,
  COUNT(r.Restaurant_ID) as Restaurant_Count,
  SUM(r.Number_of_Orders) as Total_Orders
FROM 
  Restaurants r
GROUP BY 
  r.Cuisine_Type
ORDER BY 
  Average_Rating DESC;
  `

  const topPerformingLocationsQuery = `
SELECT 
  r.Location,
  COUNT(r.Restaurant_ID) as Restaurant_Count,
  SUM(r.Number_of_Orders) as Total_Orders,
  AVG(r.Rating) as Average_Rating,
  (SUM(r.Number_of_Orders) / COUNT(r.Restaurant_ID)) as Orders_Per_Restaurant,
  (
    SELECT r2.Restaurant_Name
    FROM Restaurants r2
    WHERE r2.Location = r.Location
    ORDER BY r2.Rating DESC
    LIMIT 1
  ) as Top_Restaurant
FROM 
  Restaurants r
GROUP BY 
  r.Location
ORDER BY 
  Total_Orders DESC;
  `

  const cuisinePerformanceQuery = `
WITH CuisineStats AS (
  SELECT 
    r.Cuisine_Type,
    COUNT(r.Restaurant_ID) as Restaurant_Count,
    AVG(r.Rating) as Avg_Rating,
    SUM(r.Number_of_Orders) as Total_Orders,
    (SUM(r.Number_of_Orders) / COUNT(r.Restaurant_ID)) as Avg_Orders_Per_Restaurant
  FROM 
    Restaurants r
  GROUP BY 
    r.Cuisine_Type
),
TopRestaurants AS (
  SELECT 
    r.Cuisine_Type,
    r.Restaurant_Name as Highest_Rated_Restaurant,
    r.Rating as Highest_Rating
  FROM 
    Restaurants r
  JOIN (
    SELECT 
      Cuisine_Type,
      MAX(Rating) as Max_Rating
    FROM 
      Restaurants
    GROUP BY 
      Cuisine_Type
  ) m ON r.Cuisine_Type = m.Cuisine_Type AND r.Rating = m.Max_Rating
),
BottomRestaurants AS (
  SELECT 
    r.Cuisine_Type,
    r.Restaurant_Name as Lowest_Rated_Restaurant,
    r.Rating as Lowest_Rating
  FROM 
    Restaurants r
  JOIN (
    SELECT 
      Cuisine_Type,
      MIN(Rating) as Min_Rating
    FROM 
      Restaurants
    GROUP BY 
      Cuisine_Type
  ) m ON r.Cuisine_Type = m.Cuisine_Type AND r.Rating = m.Min_Rating
)
SELECT 
  cs.Cuisine_Type,
  cs.Restaurant_Count,
  cs.Avg_Rating,
  cs.Total_Orders,
  cs.Avg_Orders_Per_Restaurant,
  tr.Highest_Rated_Restaurant,
  tr.Highest_Rating,
  br.Lowest_Rated_Restaurant,
  br.Lowest_Rating
FROM 
  CuisineStats cs
JOIN 
  TopRestaurants tr ON cs.Cuisine_Type = tr.Cuisine_Type
JOIN 
  BottomRestaurants br ON cs.Cuisine_Type = br.Cuisine_Type
ORDER BY 
  cs.Avg_Rating DESC;
  `

  const customerAnalysisQuery = `
WITH CustomerSpending AS (
  SELECT 
    c.Customer_ID,
    c.Name,
    c.Membership_Status,
    COUNT(o.Order_ID) as Total_Orders,
    SUM(CAST(REPLACE(o.Order_Total, '$', '') AS DECIMAL(10,2))) as Total_Spent,
    AVG(CAST(REPLACE(o.Order_Total, '$', '') AS DECIMAL(10,2))) as Avg_Order_Value,
    MAX(STR_TO_DATE(o.Order_Date, '%d-%m-%Y')) as Last_Order_Date
  FROM 
    Customers c
  JOIN 
    Orders o ON c.Customer_ID = o.Customer_ID
  GROUP BY 
    c.Customer_ID
),
CustomerPreferences AS (
  SELECT 
    cs.Customer_ID,
    r.Cuisine_Type as Most_Ordered_Cuisine,
    COUNT(o.Order_ID) as Cuisine_Order_Count
  FROM 
    CustomerSpending cs
  JOIN 
    Orders o ON cs.Customer_ID = o.Customer_ID
  JOIN 
    Restaurants r ON o.Restaurant_ID = r.Restaurant_ID
  GROUP BY 
    cs.Customer_ID, r.Cuisine_Type
  HAVING 
    COUNT(o.Order_ID) = (
      SELECT MAX(Cuisine_Count)
      FROM (
        SELECT 
          COUNT(o2.Order_ID) as Cuisine_Count
        FROM 
          Orders o2
        JOIN 
          Restaurants r2 ON o2.Restaurant_ID = r2.Restaurant_ID
        WHERE 
          o2.Customer_ID = cs.Customer_ID
        GROUP BY 
          r2.Cuisine_Type
      ) as CuisineCounts
    )
)
SELECT 
  cs.Customer_ID,
  cs.Name,
  cs.Membership_Status,
  cs.Total_Orders,
  cs.Total_Spent,
  cs.Avg_Order_Value,
  DATEDIFF(CURRENT_DATE, cs.Last_Order_Date) as Days_Since_Last_Order,
  cp.Most_Ordered_Cuisine,
  cp.Cuisine_Order_Count
FROM 
  CustomerSpending cs
JOIN 
  CustomerPreferences cp ON cs.Customer_ID = cp.Customer_ID
ORDER BY 
  cs.Total_Spent DESC
LIMIT 10;
  `

  const restaurantPerformanceQuery = `
WITH MonthlyRevenue AS (
  SELECT 
    r.Restaurant_ID,
    r.Restaurant_Name,
    SUBSTRING(o.Order_Date, 4, 2) as Month,
    SUBSTRING(o.Order_Date, 7, 4) as Year,
    COUNT(o.Order_ID) as Order_Count,
    SUM(CAST(REPLACE(o.Order_Total, '$', '') AS DECIMAL(10,2))) as Monthly_Revenue
  FROM 
    Restaurants r
  JOIN 
    Orders o ON r.Restaurant_ID = o.Restaurant_ID
  GROUP BY 
    r.Restaurant_ID, Month, Year
),
RestaurantGrowth AS (
  SELECT 
    mr1.Restaurant_ID,
    mr1.Restaurant_Name,
    mr1.Year,
    mr1.Month,
    mr1.Monthly_Revenue,
    mr1.Order_Count,
    (
      mr1.Monthly_Revenue - 
      COALESCE(
        (
          SELECT mr2.Monthly_Revenue
          FROM MonthlyRevenue mr2
          WHERE 
            mr2.Restaurant_ID = mr1.Restaurant_ID AND
            (
              (mr2.Year = mr1.Year AND mr2.Month < mr1.Month) OR
              (mr2.Year < mr1.Year)
            )
          ORDER BY mr2.Year DESC, mr2.Month DESC
          LIMIT 1
        ), 
        0
      )
    ) as Revenue_Growth,
    (
      mr1.Order_Count - 
      COALESCE(
        (
          SELECT mr2.Order_Count
          FROM MonthlyRevenue mr2
          WHERE 
            mr2.Restaurant_ID = mr1.Restaurant_ID AND
            (
              (mr2.Year = mr1.Year AND mr2.Month < mr1.Month) OR
              (mr2.Year < mr1.Year)
            )
          ORDER BY mr2.Year DESC, mr2.Month DESC
          LIMIT 1
        ), 
        0
      )
    ) as Order_Growth
  FROM 
    MonthlyRevenue mr1
)
SELECT 
  rg.Restaurant_ID,
  rg.Restaurant_Name,
  r.Cuisine_Type,
  r.Location,
  r.Rating,
  CONCAT(rg.Year, '-', rg.Month) as Period,
  rg.Monthly_Revenue,
  rg.Order_Count,
  rg.Revenue_Growth,
  rg.Order_Growth,
  CASE 
    WHEN rg.Revenue_Growth > 0 THEN 'Growing'
    WHEN rg.Revenue_Growth < 0 THEN 'Declining'
    ELSE 'Stable'
  END as Performance_Status
FROM 
  RestaurantGrowth rg
JOIN 
  Restaurants r ON rg.Restaurant_ID = r.Restaurant_ID
ORDER BY 
  rg.Year DESC, rg.Month DESC, rg.Monthly_Revenue DESC
LIMIT 10;
  `

  // Colors for charts
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#8dd1e1",
    "#a4de6c",
    "#d0ed57",
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Database Analytics</h2>
          <p className="text-muted-foreground">Explore SQL query results and visualize data insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="day">Last Day</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => setShowSqlQuery(!showSqlQuery)}>
            {showSqlQuery ? "Hide SQL" : "Show SQL"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="basic" value={selectedAnalysisTab} onValueChange={setSelectedAnalysisTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Analysis</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Analysis</TabsTrigger>
          <TabsTrigger value="complex">Complex Queries</TabsTrigger>
        </TabsList>
      </Tabs>

      {selectedAnalysisTab === "basic" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Restaurants by Orders</CardTitle>
                <CardDescription>Restaurants with the highest number of orders</CardDescription>
              </CardHeader>
              <CardContent>
                {showSqlQuery && (
                  <div className="mb-4 bg-gray-100 p-3 rounded-md">
                    <pre className="text-xs overflow-x-auto">
                      <code>{topRestaurantsByOrdersQuery}</code>
                    </pre>
                  </div>
                )}

                <ChartContainer
                  config={{
                    orders: {
                      label: "Number of Orders",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={topRestaurantsByOrders}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={100} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="orders" fill="var(--color-orders)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Restaurants by Rating</CardTitle>
                <CardDescription>Restaurants with the highest customer ratings</CardDescription>
              </CardHeader>
              <CardContent>
                {showSqlQuery && (
                  <div className="mb-4 bg-gray-100 p-3 rounded-md">
                    <pre className="text-xs overflow-x-auto">
                      <code>{topRestaurantsByRatingQuery}</code>
                    </pre>
                  </div>
                )}

                <ChartContainer
                  config={{
                    rating: {
                      label: "Rating",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={topRestaurantsByRating}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 5]} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={100} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="rating" fill="var(--color-rating)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Orders by Location</CardTitle>
                <CardDescription>Distribution of orders across different locations</CardDescription>
              </CardHeader>
              <CardContent>
                {showSqlQuery && (
                  <div className="mb-4 bg-gray-100 p-3 rounded-md">
                    <pre className="text-xs overflow-x-auto">
                      <code>{ordersByLocationQuery}</code>
                    </pre>
                  </div>
                )}

                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={ordersByLocation}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {ordersByLocation.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name, props) => [`${value} orders`, props.payload.name]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Orders by Cuisine Type</CardTitle>
                <CardDescription>Distribution of orders across different cuisine types</CardDescription>
              </CardHeader>
              <CardContent>
                {showSqlQuery && (
                  <div className="mb-4 bg-gray-100 p-3 rounded-md">
                    <pre className="text-xs overflow-x-auto">
                      <code>{ordersByCuisineQuery}</code>
                    </pre>
                  </div>
                )}

                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={ordersByCuisine}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {ordersByCuisine.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name, props) => [`${value} orders`, props.payload.name]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {selectedAnalysisTab === "advanced" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Average Rating by Cuisine</CardTitle>
                <CardDescription>Comparison of average ratings across different cuisine types</CardDescription>
              </CardHeader>
              <CardContent>
                {showSqlQuery && (
                  <div className="mb-4 bg-gray-100 p-3 rounded-md">
                    <pre className="text-xs overflow-x-auto">
                      <code>{averageRatingByCuisineQuery}</code>
                    </pre>
                  </div>
                )}

                <ChartContainer
                  config={{
                    value: {
                      label: "Average Rating",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={averageRatingByCuisine} margin={{ top: 5, right: 30, left: 20, bottom: 50 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} tick={{ fontSize: 12 }} />
                      <YAxis domain={[0, 5]} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="value" fill="var(--color-value)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Locations</CardTitle>
                <CardDescription>Locations with the highest total orders and average ratings</CardDescription>
              </CardHeader>
              <CardContent>
                {showSqlQuery && (
                  <div className="mb-4 bg-gray-100 p-3 rounded-md">
                    <pre className="text-xs overflow-x-auto">
                      <code>{topPerformingLocationsQuery}</code>
                    </pre>
                  </div>
                )}

                <div className="h-[300px] overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Location</TableHead>
                        <TableHead>Restaurants</TableHead>
                        <TableHead>Total Orders</TableHead>
                        <TableHead>Avg. Rating</TableHead>
                        <TableHead>Top Restaurant</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topPerformingLocations.map((location, index) => (
                        <TableRow key={index}>
                          <TableCell>{location.location}</TableCell>
                          <TableCell>{location.restaurantCount}</TableCell>
                          <TableCell>{location.totalOrders}</TableCell>
                          <TableCell>{location.averageRating}</TableCell>
                          <TableCell>{location.topRestaurant}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cuisine Popularity Trend</CardTitle>
                <CardDescription>Monthly trend of cuisine popularity based on order volume</CardDescription>
              </CardHeader>
              <CardContent>
                {showSqlQuery && (
                  <div className="mb-4 bg-gray-100 p-3 rounded-md">
                    <pre className="text-xs overflow-x-auto">
                      <code>{`
SELECT 
  r.Cuisine_Type,
  SUBSTRING(o.Order_Date, 4, 2) as Month,
  SUBSTRING(o.Order_Date, 7, 4) as Year,
  COUNT(o.Order_ID) as Order_Count
FROM 
  Orders o
JOIN 
  Restaurants r ON o.Restaurant_ID = r.Restaurant_ID
GROUP BY 
  r.Cuisine_Type, Month, Year
ORDER BY 
  Year, Month, Order_Count DESC;
                      `}</code>
                    </pre>
                  </div>
                )}

                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" type="category" allowDuplicatedCategory={false} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      {cuisinePopularityTrend.map((s, index) => (
                        <Line
                          key={s.name}
                          dataKey="value"
                          data={s.data}
                          name={s.name}
                          stroke={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cuisine Performance Metrics</CardTitle>
                <CardDescription>Comprehensive performance analysis by cuisine type</CardDescription>
              </CardHeader>
              <CardContent>
                {showSqlQuery && (
                  <div className="mb-4 bg-gray-100 p-3 rounded-md">
                    <pre className="text-xs overflow-x-auto">
                      <code>{cuisinePerformanceQuery}</code>
                    </pre>
                  </div>
                )}

                <div className="h-[300px] overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cuisine</TableHead>
                        <TableHead>Restaurants</TableHead>
                        <TableHead>Avg. Rating</TableHead>
                        <TableHead>Total Orders</TableHead>
                        <TableHead>Highest Rated</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cuisinePerformanceMetrics.map((cuisine, index) => (
                        <TableRow key={index}>
                          <TableCell>{cuisine.cuisine}</TableCell>
                          <TableCell>{cuisine.totalRestaurants}</TableCell>
                          <TableCell>{cuisine.avgRating}</TableCell>
                          <TableCell>{cuisine.totalOrders}</TableCell>
                          <TableCell>{cuisine.highestRated}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {selectedAnalysisTab === "complex" && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Advanced Customer Analysis</CardTitle>
              <CardDescription>
                Complex nested query analyzing customer spending patterns and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              {showSqlQuery && (
                <div className="mb-4 bg-gray-900 text-gray-100 p-3 rounded-md">
                  <pre className="text-xs overflow-x-auto">
                    <code>{customerAnalysisQuery}</code>
                  </pre>
                </div>
              )}

              <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-md">
                  <h3 className="font-medium text-amber-800 mb-2">Query Explanation</h3>
                  <p className="text-sm text-amber-700">
                    This complex query uses Common Table Expressions (CTEs) to analyze customer behavior. It first
                    calculates spending metrics for each customer, then determines their cuisine preferences using a
                    subquery with window functions. Finally, it joins these results to provide a comprehensive customer
                    profile including spending habits, order frequency, recency, and cuisine preferences.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Membership</TableHead>
                        <TableHead>Total Orders</TableHead>
                        <TableHead>Total Spent</TableHead>
                        <TableHead>Avg Order Value</TableHead>
                        <TableHead>Preferred Cuisine</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        {
                          id: "1",
                          name: "John Smith",
                          membership: "Gold",
                          orders: 24,
                          spent: "$1,245.50",
                          avg: "$51.90",
                          cuisine: "Indian",
                        },
                        {
                          id: "2",
                          name: "Emily Johnson",
                          membership: "Platinum",
                          orders: 36,
                          spent: "$1,876.25",
                          avg: "$52.12",
                          cuisine: "Italian",
                        },
                        {
                          id: "3",
                          name: "Michael Brown",
                          membership: "Gold",
                          orders: 18,
                          spent: "$987.75",
                          avg: "$54.88",
                          cuisine: "Japanese",
                        },
                        {
                          id: "4",
                          name: "Sarah Wilson",
                          membership: "Silver",
                          orders: 12,
                          spent: "$645.30",
                          avg: "$53.78",
                          cuisine: "Italian",
                        },
                        {
                          id: "5",
                          name: "David Lee",
                          membership: "Gold",
                          orders: 22,
                          spent: "$1,123.45",
                          avg: "$51.07",
                          cuisine: "Chinese",
                        },
                      ].map((customer, index) => (
                        <TableRow key={index}>
                          <TableCell>{customer.name}</TableCell>
                          <TableCell>{customer.membership}</TableCell>
                          <TableCell>{customer.orders}</TableCell>
                          <TableCell>{customer.spent}</TableCell>
                          <TableCell>{customer.avg}</TableCell>
                          <TableCell>{customer.cuisine}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Restaurant Performance Trend Analysis</CardTitle>
              <CardDescription>Complex query with window functions to analyze restaurant growth trends</CardDescription>
            </CardHeader>
            <CardContent>
              {showSqlQuery && (
                <div className="mb-4 bg-gray-900 text-gray-100 p-3 rounded-md">
                  <pre className="text-xs overflow-x-auto">
                    <code>{restaurantPerformanceQuery}</code>
                  </pre>
                </div>
              )}

              <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-md">
                  <h3 className="font-medium text-amber-800 mb-2">Query Explanation</h3>
                  <p className="text-sm text-amber-700">
                    This advanced query uses multiple CTEs and window functions to analyze restaurant performance over
                    time. It first calculates monthly revenue for each restaurant, then computes month-over-month growth
                    using self-joins and correlated subqueries. The final result classifies restaurants as "Growing,"
                    "Declining," or "Stable" based on their revenue trends, providing valuable insights for business
                    decisions.
                  </p>
                </div>

                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={[
                        { month: "Jan", Spice_Garden: 4500, Pasta_Paradise: 3800, Sushi_Sensation: 5200 },
                        { month: "Feb", Spice_Garden: 4800, Pasta_Paradise: 4100, Sushi_Sensation: 5300 },
                        { month: "Mar", Spice_Garden: 5200, Pasta_Paradise: 4300, Sushi_Sensation: 5600 },
                        { month: "Apr", Spice_Garden: 5500, Pasta_Paradise: 4600, Sushi_Sensation: 6100 },
                        { month: "May", Spice_Garden: 6000, Pasta_Paradise: 4400, Sushi_Sensation: 6500 },
                      ]}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="Spice_Garden" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                      <Area
                        type="monotone"
                        dataKey="Pasta_Paradise"
                        stroke="#82ca9d"
                        fill="#82ca9d"
                        fillOpacity={0.3}
                      />
                      <Area
                        type="monotone"
                        dataKey="Sushi_Sensation"
                        stroke="#ffc658"
                        fill="#ffc658"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Restaurant</TableHead>
                        <TableHead>Period</TableHead>
                        <TableHead>Revenue</TableHead>
                        <TableHead>Orders</TableHead>
                        <TableHead>Revenue Growth</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        {
                          name: "Spice Garden",
                          period: "2024-05",
                          revenue: "$6,000",
                          orders: 120,
                          growth: "+$500",
                          status: "Growing",
                        },
                        {
                          name: "Sushi Sensation",
                          period: "2024-05",
                          revenue: "$6,500",
                          orders: 130,
                          growth: "+$400",
                          status: "Growing",
                        },
                        {
                          name: "Pasta Paradise",
                          period: "2024-05",
                          revenue: "$4,400",
                          orders: 88,
                          growth: "-$200",
                          status: "Declining",
                        },
                        {
                          name: "Taco Temple",
                          period: "2024-05",
                          revenue: "$3,800",
                          orders: 76,
                          growth: "+$300",
                          status: "Growing",
                        },
                        {
                          name: "Burger Bliss",
                          period: "2024-05",
                          revenue: "$5,200",
                          orders: 104,
                          growth: "+$100",
                          status: "Growing",
                        },
                      ].map((restaurant, index) => (
                        <TableRow key={index}>
                          <TableCell>{restaurant.name}</TableCell>
                          <TableCell>{restaurant.period}</TableCell>
                          <TableCell>{restaurant.revenue}</TableCell>
                          <TableCell>{restaurant.orders}</TableCell>
                          <TableCell className={restaurant.growth.startsWith("+") ? "text-green-600" : "text-red-600"}>
                            {restaurant.growth}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                restaurant.status === "Growing"
                                  ? "default"
                                  : restaurant.status === "Declining"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {restaurant.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Cross-Domain Analysis with Recursive Queries</CardTitle>
              <CardDescription>Advanced SQL demonstrating recursive CTEs and complex joins</CardDescription>
            </CardHeader>
            <CardContent>
              {showSqlQuery && (
                <div className="mb-4 bg-gray-900 text-gray-100 p-3 rounded-md">
                  <pre className="text-xs overflow-x-auto">
                    <code>{`
WITH RECURSIVE OrderChain AS (
  -- Base case: initial orders
  SELECT 
    o.Order_ID,
    o.Customer_ID,
    o.Restaurant_ID,
    o.Order_Date,
    1 as Chain_Length,
    CAST(o.Order_ID AS CHAR(200)) as Order_Chain
  FROM 
    Orders o
  WHERE 
    o.Order_Date >= DATE_SUB(CURRENT_DATE, INTERVAL 6 MONTH)
  
  UNION ALL
  
  -- Recursive case: find subsequent orders by the same customer
  SELECT 
    o.Order_ID,
    o.Customer_ID,
    o.Restaurant_ID,
    o.Order_Date,
    oc.Chain_Length + 1,
    CONCAT(oc.Order_Chain, ',', o.Order_ID)
  FROM 
    Orders o
  JOIN 
    OrderChain oc ON o.Customer_ID = oc.Customer_ID
  WHERE 
    STR_TO_DATE(o.Order_Date, '%d-%m-%Y') > STR_TO_DATE(oc.Order_Date, '%d-%m-%Y')
    AND o.Order_ID > oc.Order_ID
    AND oc.Chain_Length < 5  -- Limit recursion depth
),
CustomerJourney AS (
  SELECT 
    oc.Customer_ID,
    c.Name as Customer_Name,
    oc.Order_Chain,
    oc.Chain_Length,
    GROUP_CONCAT(DISTINCT r.Cuisine_Type ORDER BY STR_TO_DATE(o.Order_Date, '%d-%m-%Y')) as Cuisine_Journey
  FROM 
    OrderChain oc
  JOIN 
    Customers c ON oc.Customer_ID = c.Customer_ID
  JOIN 
    Orders o ON FIND_IN_SET(o.Order_ID, oc.Order_Chain)
  JOIN 
    Restaurants r ON o.Restaurant_ID = r.Restaurant_ID
  GROUP BY 
    oc.Customer_ID, oc.Order_Chain, oc.Chain_Length
  HAVING 
    oc.Chain_Length >= 3  -- Only customers with at least 3 orders in sequence
),
CuisineTransitions AS (
  SELECT 
    cj.Cuisine_Journey,
    COUNT(*) as Transition_Count
  FROM 
    CustomerJourney cj
  GROUP BY 
    cj.Cuisine_Journey
  ORDER BY 
    Transition_Count DESC
)
SELECT 
  ct.Cuisine_Journey as Cuisine_Transition_Path,
  ct.Transition_Count,
  ROUND((ct.Transition_Count / (SELECT COUNT(*) FROM CustomerJourney)) * 100, 2) as Percentage
FROM 
  CuisineTransitions ct
LIMIT 10;
                    `}</code>
                  </pre>
                </div>
              )}

              <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-md">
                  <h3 className="font-medium text-amber-800 mb-2">Query Explanation</h3>
                  <p className="text-sm text-amber-700">
                    This highly advanced query uses recursive Common Table Expressions (CTEs) to analyze customer
                    ordering patterns over time. It tracks the sequence of cuisine types that customers order,
                    identifying common transition patterns. This type of analysis is valuable for understanding customer
                    preferences and making recommendations. The query demonstrates advanced SQL concepts including
                    recursion, self-joins, string aggregation, and complex grouping.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cuisine Transition Path</TableHead>
                        <TableHead>Count</TableHead>
                        <TableHead>Percentage</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        { path: "Indian,Italian,Japanese", count: 24, percentage: "15.38%" },
                        { path: "Italian,Chinese,Italian", count: 18, percentage: "11.54%" },
                        { path: "Japanese,Japanese,Indian", count: 15, percentage: "9.62%" },
                        { path: "Mexican,Italian,Indian", count: 12, percentage: "7.69%" },
                        { path: "Chinese,Japanese,Italian", count: 10, percentage: "6.41%" },
                      ].map((transition, index) => (
                        <TableRow key={index}>
                          <TableCell>{transition.path}</TableCell>
                          <TableCell>{transition.count}</TableCell>
                          <TableCell>{transition.percentage}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

