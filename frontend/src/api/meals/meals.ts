import api from "../axios";

export const getMeals = async (restaurantId: string) => {
  const response = await api.get(`/meals/restaurant/${restaurantId}`);
  return response.data;
};
