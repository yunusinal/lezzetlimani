export interface RegisterDTO {
  email: string;
  password: string;
}

export interface RegisterCompleteDTO {
  id: string;
  full_name: string;
  born_date?: string;
  gender?: string;
  phone?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface UserUpdateSchema {
  full_name?: string;
  born_date?: string;
  gender?: string;
  phone?: string;
}

export interface AddressCreateDTO {
  title: string;
  address: string;
  city: string;
  district: string;
  full_address: string;
  zip_code: string;
  apartment?: string;
  floor?: string;
  door_number?: string;
  latitude?: number;
  longitude?: number;
  is_default: boolean;
}

export interface AddressUpdateDTO extends Partial<AddressCreateDTO> {}

export interface AddressResponseDTO extends AddressCreateDTO {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}
export interface RestaurantResponseDTO {
  id: string;
  name: string;
  description: string;
  logo: string;
  address: AddressDTO;
  phone_number: string;
  email: string;
  status: string;
  opening_hours: Record<string, string>;
  prep_time: number;
  rating_avg: number;
  rating_count: number;
  delivery_fee: number;
  min_order_price: number;
  created_at: string;
  updated_at: string;
}

export interface RestaurantQueryParams {
  city?: string;
  status?: "open" | "closed";
  owner_id?: string;
  sort?: string;
  limit?: number;
  offset?: number;
}
export interface AddressDTO {
  id: string;
  title: string;
  city: string;
  district: string;
  full_address: string;
  zip_code: string;
}

export type Meal = {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  restaurant_id: string;
};

export type CartItem = Meal & {
  quantity: number;
  note?: string;
  schedule_date?: string;
};

export type CartItemCreate = {
  user_id: string;
  restaurant_id: string;
  meal_id: string;
  quantity: number;
  note?: string;
  schedule_date?: string;
};

export type CartItemResponse = {
  id: number;
  user_id: string;
  restaurant_id: string;
  meal_id: string;
  quantity: number;
  note?: string;
  schedule_date?: string;
  created_at: string;
};

export type OrderItem = {
  meal_id: string;
  quantity: number;
  note?: string;
};

export type OrderCreate = {
  user_id: string;
  restaurant_id: string;
  items: OrderItem[];
  payment_method: "credit_card" | "cash" | "pos";
  coupon_code?: string;
};

export type OrderResponse = {
  id: number;
  user_id: string;
  restaurant_id: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  payment_method: string;
  coupon_code?: string;
  created_at: string;
  message: string;
};
