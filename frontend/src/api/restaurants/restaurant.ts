import api from "../../api/axios";
import type { RestaurantResponseDTO } from "../../types";

export const getRestaurants = async (): Promise<RestaurantResponseDTO[]> => {
  try {
    const response = await api.get<RestaurantResponseDTO[]>("/restaurants");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// New search function with filters
export interface RestaurantFilters {
  query?: string;
  city?: string;
  district?: string;
  min_rating?: number;
  max_delivery?: number;
  min_order?: number;
  max_prep_time?: number;
  cuisines?: string[];
  sort_by?: string;
  sort_order?: "asc" | "desc";
  page?: number;
  page_size?: number;
}

export interface RestaurantSearchResult {
  restaurants: RestaurantResponseDTO[];
  total: number;
  page: number;
  page_size: number;
  has_next: boolean;
}

export const searchRestaurants = async (
  filters: RestaurantFilters
): Promise<RestaurantSearchResult> => {
  try {
    const params = new URLSearchParams();

    // Add all filter parameters
    if (filters.query) params.append("query", filters.query);
    if (filters.city) params.append("city", filters.city);
    if (filters.district) params.append("district", filters.district);
    if (filters.min_rating !== undefined)
      params.append("min_rating", filters.min_rating.toString());
    if (filters.max_delivery !== undefined)
      params.append("max_delivery", filters.max_delivery.toString());
    if (filters.min_order !== undefined)
      params.append("min_order", filters.min_order.toString());
    if (filters.max_prep_time !== undefined)
      params.append("max_prep_time", filters.max_prep_time.toString());
    if (filters.cuisines && filters.cuisines.length > 0)
      params.append("cuisines", filters.cuisines.join(","));
    if (filters.sort_by) params.append("sort_by", filters.sort_by);
    if (filters.sort_order) params.append("sort_order", filters.sort_order);
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.page_size)
      params.append("page_size", filters.page_size.toString());

    const response = await api.get<RestaurantSearchResult>(
      `/restaurants/search?${params.toString()}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export interface Campaign {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  restaurant_id: string;
}

export const getCampaigns = async (): Promise<Campaign[]> => {
  const response = await api.get<Campaign[]>("/campaigns");
  return response.data;
};
