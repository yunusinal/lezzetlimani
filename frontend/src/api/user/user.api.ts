import api from "../axios";
import type { RegisterCompleteDTO, UserUpdateSchema } from "../../types";

export const registerComplete = (data: Omit<RegisterCompleteDTO, "id">) => {
  return api.post("/users/register/complete", data);
};

export const getCurrentUser = () => {
  return api.get("/users/me");
};

export const updateCurrentUser = (data: UserUpdateSchema) => {
  return api.put("/users/me", data);
};

export const addFavoriteRestaurant = (restaurant_id: string) => {
  return api.post("/favorites/restaurant", { restaurant_id });
};

export const removeFavoriteRestaurant = (restaurant_id: string) => {
  return api.delete(`/favorites/restaurant/${restaurant_id}`);
};

export const addFavoriteCuisine = (cuisine: string) => {
  return api.post("/favorites/cuisine", { cuisine });
};

export const removeFavoriteCuisine = (cuisine: string) => {
  return api.delete(`/favorites/cuisine/${cuisine}`);
};
