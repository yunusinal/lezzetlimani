import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import {
  addToCart as apiAddToCart,
  removeFromCart as apiRemoveFromCart,
  clearCart as apiClearCart,
} from "../api/cart/cart";
import { useAuth } from "./AuthContext";

type Meal = {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  restaurant_id: string;
};

type CartItem = Meal & {
  quantity: number;
  note?: string;
  schedule_date?: string;
};

type CartError = {
  type: "different_restaurant" | "general" | "login_required";
  message: string;
  pendingMeal?: Meal;
} | null;

type CartContextType = {
  items: CartItem[];
  error: CartError;
  addToCart: (meal: Meal) => Promise<void>;
  removeFromCart: (mealId: string) => Promise<void>;
  updateQuantity: (mealId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  updateNote: (mealId: string, note: string) => void;
  updateSchedule: (mealId: string, scheduleDate: string) => void;
  clearError: () => void;
  clearCartAndAddMeal: (meal: Meal) => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

// localStorage key
const CART_STORAGE_KEY = "lezzet-cart-items";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [error, setError] = useState<CartError>(null);
  const { user } = useAuth();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart);
      } catch (error) {
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = async (meal: Meal) => {
    // Check if user is authenticated
    if (!user?.id) {
      setError({
        type: "login_required",
        message: "Sepete ürün eklemek için giriş yapmanız gerekiyor.",
      });
      return;
    }

    const existing = items.find((i) => i.id === meal.id);
    const newQuantity = existing ? existing.quantity + 1 : 1;

    const newItem: CartItem = {
      ...meal,
      quantity: newQuantity,
      note: existing?.note,
      schedule_date: existing?.schedule_date,
    };

    try {
      await apiAddToCart({
        user_id: user?.id || "",
        restaurant_id: meal.restaurant_id,
        meal_id: meal.id,
        quantity: newQuantity,
        note: newItem.note,
        schedule_date: undefined,
      });

      setItems((prev) => {
        if (existing) {
          return prev.map((i) =>
            i.id === meal.id ? { ...i, quantity: newQuantity } : i
          );
        }
        return [...prev, { ...meal, quantity: 1 }];
      });
    } catch (error: any) {
      // Check if it's a "different restaurant" error
      const errorMessage =
        error?.response?.data?.detail || error?.message || "Bilinmeyen hata";

      if (errorMessage.includes("different restaurant")) {
        setError({
          type: "different_restaurant",
          message:
            "Sepetinizde farklı bir restorandan ürünler var. Yeni ürün eklemek için sepeti temizlemeniz gerekiyor.",
          pendingMeal: meal,
        });
      } else {
        setError({
          type: "general",
          message: errorMessage,
        });
      }
    }
  };

  const removeFromCart = async (mealId: string) => {
    try {
      await apiRemoveFromCart(user?.id || "", mealId);
      setItems((prev) => prev.filter((i) => i.id !== mealId));
    } catch (error) {
      // Silently handle error
    }
  };

  const updateQuantity = async (mealId: string, quantity: number) => {
    const item = items.find((i) => i.id === mealId);
    if (!item) {
      return;
    }

    // Store original quantity for rollback
    const originalQuantity = item.quantity;

    if (quantity < 1) {
      await removeFromCart(mealId);
      return;
    }

    try {
      // Clear any existing errors
      setError(null);

      // Update local state immediately for better UX (optimistic update)
      setItems((prev) =>
        prev.map((i) => (i.id === mealId ? { ...i, quantity } : i))
      );

      // Try to update via API
      // First remove the old item
      await apiRemoveFromCart(user?.id || "", mealId);

      // Then add the item with new quantity
      await apiAddToCart({
        user_id: user?.id || "",
        restaurant_id: item.restaurant_id,
        meal_id: item.id,
        quantity,
        note: item.note,
        schedule_date: undefined,
      });
    } catch (error: any) {
      // Revert the optimistic update on error
      setItems((prev) =>
        prev.map((i) =>
          i.id === mealId ? { ...i, quantity: originalQuantity } : i
        )
      );

      // Show user-friendly error
      setError({
        type: "general",
        message: "Ürün miktarı güncellenemedi. Lütfen tekrar deneyin.",
      });
    }
  };

  const clearCart = async () => {
    try {
      await apiClearCart(user?.id || "");
      setItems([]);
    } catch (error) {
      // Silently handle error
    }
  };

  const clearError = () => {
    setError(null);
  };

  const clearCartAndAddMeal = async (meal: Meal) => {
    try {
      // First clear the cart
      await apiClearCart(user?.id || "");
      setItems([]);

      // Then add the new meal
      await apiAddToCart({
        user_id: user?.id || "",
        restaurant_id: meal.restaurant_id,
        meal_id: meal.id,
        quantity: 1,
        note: undefined,
        schedule_date: undefined,
      });

      setItems([{ ...meal, quantity: 1 }]);
      setError(null);
    } catch (error) {
      // Silently handle error
    }
  };

  const updateNote = (mealId: string, note: string) => {
    const item = items.find((i) => i.id === mealId);
    if (!item) return;

    const updatedItem = { ...item, note };

    apiAddToCart({
      user_id: user?.id || "",
      restaurant_id: item.restaurant_id,
      meal_id: item.id,
      quantity: item.quantity,
      note: updatedItem.note,
      schedule_date: undefined,
    });

    setItems((prev) => prev.map((i) => (i.id === mealId ? updatedItem : i)));
  };

  const updateSchedule = (mealId: string, scheduleDate: string) => {
    const item = items.find((i) => i.id === mealId);
    if (!item) return;

    const updatedItem = { ...item, schedule_date: scheduleDate };

    apiAddToCart({
      user_id: user?.id || "",
      restaurant_id: item.restaurant_id,
      meal_id: item.id,
      quantity: item.quantity,
      note: updatedItem.note,
      schedule_date: undefined,
    });

    setItems((prev) => prev.map((i) => (i.id === mealId ? updatedItem : i)));
  };

  return (
    <CartContext.Provider
      value={{
        items,
        error,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        updateNote,
        updateSchedule,
        clearError,
        clearCartAndAddMeal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
