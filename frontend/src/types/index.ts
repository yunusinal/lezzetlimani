export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  addresses: Address[];
  orders?: Order[];
  phone: string;
  password: string;
}

export interface Address {
  id: string;
  title: string;
  fullAddress: string;
  city: string;
  district: string;
  postalCode: string;
  isDefault: boolean;
  phoneNumber?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  logo: string;
  coverImage: string;
  cuisineType: string[];
  rating: number;
  reviewCount: number;
  deliveryTime: number;
  deliveryFee: number;
  minOrderAmount: number;
  distance: number;
  priceRange: 1 | 2 | 3 | 4;
  isPromoted: boolean;
  isFavorite: boolean;
  isNew?: boolean;
  discount?: {
    type: 'percentage' | 'fixed';
    value: number;
    minOrderAmount?: number;
  };
  categories: MenuCategory[];
  description: string;
  image: string;
  ratingCount: number;
  cuisine: string[];
  address: string;
  menu: MenuItem[];
}

export interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  discountedPrice?: number;
  image: string;
  category: string;
  isPopular?: boolean;
  customizationOptions?: CustomizationOption[];
}

export interface CustomizationOption {
  id: string;
  name: string;
  required: boolean;
  multiple: boolean;
  min?: number;
  max?: number;
  choices: {
    id: string;
    name: string;
    price: number;
  }[];
}

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string;
  customizations?: {
    optionId: string;
    choiceIds: string[];
  }[];
  totalPrice: number;
  restaurantId: string;
  restaurantName: string;
}

export interface Cart {
  restaurantId: string;
  restaurantName: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  couponCode?: string;
  discount?: number;
}

export interface OrderStatus {
  id: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'on_the_way' | 'delivered' | 'cancelled';
  timestamp: Date;
}

export interface Order extends Cart {
  id: string;
  userId: string;
  addressId: string;
  address: Address;
  orderDate: Date;
  paymentMethod: string;
  statusHistory: OrderStatus[];
  currentStatus: OrderStatus['status'];
  estimatedDeliveryTime?: Date;
}

export interface CuisineType {
  id: string;
  name: string;
  image: string;
}

export interface CampaignBanner {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  backgroundColor?: string;
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  image: string;
  backgroundColor?: string;
  endDate: string;
  link: string;
  tags: string[];
  code?: string;
  minOrderAmount?: number;
  discountType?: 'percentage' | 'fixed';
  discountValue?: number;
  restaurants: string[];
}

export interface DeliveryAddress {
  fullAddress: string;
  district: string;
  city: string;
  postalCode: string;
}

export interface OrderItem extends CartItem {
  name: string;
  price: number;
}

export interface Category {
  id: string;
  name: string;
  items: MenuItem[];
}
