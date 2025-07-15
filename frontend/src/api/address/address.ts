import api from "../axios";
import type {
  AddressCreateDTO,
  AddressUpdateDTO,
  AddressResponseDTO,
} from "../../types";
import { AxiosError } from "axios";

export const createAddress = async (data: AddressCreateDTO) => {
  try {
    const response = await api.post<AddressResponseDTO>("/addresses/", data);
    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error;
    }
    throw new Error("Failed to create address");
  }
};

export const getUserAddresses = async () => {
  try {
    const response = await api.get<AddressResponseDTO[]>("/addresses/");
    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error;
    }
    throw new Error("Failed to fetch addresses");
  }
};

export const getAddressById = async (id: string) => {
  try {
    const response = await api.get<AddressResponseDTO>(`/addresses/${id}`);
    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error;
    }
    throw new Error("Failed to fetch address");
  }
};

export const updateAddress = async (id: string, data: AddressUpdateDTO) => {
  try {
    const response = await api.put<AddressResponseDTO>(
      `/addresses/${id}`,
      data
    );
    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error;
    }
    throw new Error("Failed to update address");
  }
};

export const deleteAddress = async (id: string) => {
  try {
    const response = await api.delete<AddressResponseDTO>(`/addresses/${id}`);
    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error;
    }
    throw new Error("Failed to delete address");
  }
};
