export interface Restaurant {
  id: string
  name: string
  cuisineType: string
  location: string
  rating: string
  numberOfOrders: string
}

export interface MenuItem {
  id: string
  name: string
  price: string
  category: string
  restaurantId: string
}

export interface Review {
  id: string
  restaurantId: string
  customerId: string
  customerName: string
  rating: string
  reviewText: string
  date: string
}

export interface Order {
  id: string
  customerId: string
  customerName: string
  restaurantId: string
  date: string
  time: string
  status: string
  total: string
}

export interface Customer {
  id: string
  name: string
  email: string
  phoneNumber: string
  membershipStatus: string
  registrationDate: string
}

export interface DeliveryPartner {
  id: string
  name: string
  vehicleType: string
  averageRating: string
  totalDeliveries: string
}

