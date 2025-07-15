import type { CartItemCreate, OrderCreate, OrderResponse } from "../../types";
import api from "../axios";

export const addToCart = async (cartItem: CartItemCreate) => {
  const response = await api.post("/carts/add", cartItem);
  return response.data;
};

export const getCartItems = async (user_id: string) => {
  const response = await api.get("/carts/get", {
    params: { user_id },
  });
  return response.data;
};

export const removeFromCart = async (user_id: string, mealId: string) => {
  const response = await api.delete(`/carts/remove/${mealId}`, {
    params: { user_id },
  });
  return response.data;
};

export const clearCart = async (user_id: string) => {
  const response = await api.delete("/carts/clear", {
    params: { user_id },
  });
  return response.data;
};

export const checkoutOrder = async (
  order: OrderCreate
): Promise<OrderResponse> => {
  const response = await api.post("/carts/checkout", order);
  return response.data;
};

export const getOrders = async (user_id: string): Promise<OrderResponse[]> => {
  const response = await api.get("/carts/orders", { params: { user_id } });
  return response.data;
};
