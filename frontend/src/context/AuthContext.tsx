import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
  useCallback,
} from "react";
import { login as loginAPI } from "../api/auth/auth.api";
import { getCurrentUser, updateCurrentUser } from "../api/user/user.api";
import { getUserAddresses } from "../api/address/address";
import type { LoginDTO, UserUpdateSchema, AddressResponseDTO } from "../types";
import { jwtDecode } from "jwt-decode";
import { AxiosError } from "axios";

interface User {
  id: string;
  full_name: string;
  phone: string;
  gender: string;
  born_date: string;
}

interface TokenPayload {
  sub: string;
}

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginDTO) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  setUserFromToken: (token: string) => void;
  setUser: (user: User) => void;
  update: (data: UserUpdateSchema) => Promise<void>;

  // Address-specific
  addresses: AddressResponseDTO[];
  refreshAddresses: () => Promise<void>;
  addressLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [addresses, setAddresses] = useState<AddressResponseDTO[]>([]);
  const [addressLoading, setAddressLoading] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);

  const setUserFromToken = (token: string) => {
    try {
      const decoded: TokenPayload = jwtDecode(token);
      setUser({
        id: decoded.sub,
        full_name: "",
        phone: "",
        gender: "",
        born_date: "",
      });
      localStorage.setItem("access_token", token);
    } catch (e) {
      setUser(null);
      localStorage.removeItem("access_token");
    }
  };

  const login = async (credentials: LoginDTO) => {
    try {
      const response = await loginAPI(credentials);
      const { access_token } = response.data;
      setUserFromToken(access_token);

      const userResponse = await getCurrentUser();
      setUser(userResponse.data);
      await refreshAddresses();
    } catch (err) {
      console.error("Login error:", err);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    setAddresses([]);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  };

  const update = async (data: UserUpdateSchema) => {
    try {
      const response = await updateCurrentUser(data);
      setUser(response.data);
    } catch (err) {
      console.error("Update error:", err);
      throw err;
    }
  };

  const refreshAddresses = useCallback(async () => {
    const currentToken = localStorage.getItem("access_token");
    if (!currentToken) {
      setAddresses([]);
      return;
    }

    // Prevent multiple calls within 1 second
    const now = Date.now();
    if (now - lastFetchTime < 1000) {
      return;
    }

    setAddressLoading(true);
    try {
      const response = await getUserAddresses();
      setAddresses(response.data || []);
      setLastFetchTime(now);
    } catch (err) {
      console.error("Error fetching addresses:", err);
      setAddresses([]);
      if (err instanceof AxiosError && err.response?.status === 401) {
        logout();
      }
    } finally {
      setAddressLoading(false);
    }
  }, [lastFetchTime]);

  useEffect(() => {
    const currentToken = localStorage.getItem("access_token");
    if (currentToken) {
      try {
        const decoded = jwtDecode<any>(currentToken);
        if (decoded.exp && decoded.exp * 1000 > Date.now()) {
          fetchUserData();
        } else {
          logout();
        }
      } catch (e) {
        console.error("Token decode error:", e);
        logout();
      }
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData.data);
      await refreshAddresses();
    } catch (err) {
      console.error("Error fetching user data:", err);
      if (err instanceof AxiosError && err.response?.status === 401) {
        logout();
      }
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated,
        setUserFromToken,
        setUser,
        update,
        addresses,
        refreshAddresses,
        addressLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
