import api from "../axios";
import type { RegisterDTO, LoginDTO } from "../../types";

// AUTH SERVICE
export const register = (data: RegisterDTO) => {
  return api.post("/auth/register", data);
};

export const verifyEmail = (token: string) => {
  return api.post("/auth/verify-email", { token });
};

export const login = (data: LoginDTO) => {
  return api.post("/auth/login", data);
};

export const logout = () => {
  return api.post("/auth/logout");
};

export const forgotPassword = (email: string) => {
  return api.post("/auth/forgot-password", { email });
};

export const resetPassword = (token: string, password: string) => {
  return api.post("/auth/reset-password", { token, password });
};
