import React, { createContext, useContext, useState, useEffect } from 'react';
import anonymousCartService from '../services/anonymousCart';
import { cartAPI } from '../api/cart/cart.api';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({
    items: [],
    item_count: 0,
    restaurant_id: null,
    cart_id: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if user is logged in
  const isLoggedIn = () => {
    return !!localStorage.getItem('access_token');
  };

  // Get user ID from token or context
  const getUserId = () => {
    // You may need to decode JWT token or get from auth context
    return localStorage.getItem('user_id');
  };

  // Load cart on component mount
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    setLoading(true);
    setError(null);
    try {
      if (isLoggedIn()) {
        // Load user cart
        const userId = getUserId();
        if (userId) {
          const userCart = await cartAPI.getCartItems(userId);
          setCart({
            items: userCart.data || [],
            item_count: userCart.data?.length || 0,
            restaurant_id: userCart.data?.[0]?.restaurant_id || null,
            cart_id: null // User cart doesn't have cart_id
          });
        }
      } else {
        // Load anonymous cart
        const anonymousCart = await anonymousCartService.getCart();
        setCart({
          items: anonymousCart.items || [],
          item_count: anonymousCart.item_count || 0,
          restaurant_id: anonymousCart.restaurant_id,
          cart_id: anonymousCart.cart_id
        });
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
      setError('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (restaurantId, mealId, quantity = 1, note = null, scheduleDate = null) => {
    setLoading(true);
    setError(null);
    try {
      // Check for different restaurant items
      if (cart.restaurant_id && cart.restaurant_id !== restaurantId) {
        const confirmClear = window.confirm(
          'You have items from a different restaurant. Adding this item will clear your current cart. Continue?'
        );
        if (!confirmClear) {
          setLoading(false);
          return false;
        }
        await clearCart();
      }

      if (isLoggedIn()) {
        // Add to user cart
        const userId = getUserId();
        await cartAPI.addToCart({
          user_id: userId,
          restaurant_id: restaurantId,
          meal_id: mealId,
          quantity,
          note,
          schedule_date: scheduleDate
        });
      } else {
        // Add to anonymous cart
        await anonymousCartService.addToCart(restaurantId, mealId, quantity, note, scheduleDate);
      }

      await loadCart();
      return true;
    } catch (error) {
      console.error('Failed to add to cart:', error);
      setError(error.response?.data?.detail || 'Failed to add item to cart');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (mealId, quantity = null, note = null, scheduleDate = null) => {
    setLoading(true);
    setError(null);
    try {
      if (isLoggedIn()) {
        // Update user cart item
        await cartAPI.updateCartItem(mealId, {
          meal_id: mealId,
          quantity,
          note,
          schedule_date: scheduleDate
        });
      } else {
        // Update anonymous cart item
        await anonymousCartService.updateCartItem(mealId, quantity, note, scheduleDate);
      }

      await loadCart();
      return true;
    } catch (error) {
      console.error('Failed to update cart item:', error);
      setError('Failed to update cart item');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (mealId) => {
    setLoading(true);
    setError(null);
    try {
      if (isLoggedIn()) {
        // Remove from user cart
        const userId = getUserId();
        await cartAPI.removeFromCart(userId, mealId);
      } else {
        // Remove from anonymous cart
        await anonymousCartService.removeFromCart(mealId);
      }

      await loadCart();
      return true;
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      setError('Failed to remove item from cart');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    setError(null);
    try {
      if (isLoggedIn()) {
        // Clear user cart
        const userId = getUserId();
        await cartAPI.clearCart(userId);
      } else {
        // Clear anonymous cart
        await anonymousCartService.clearCart();
      }

      await loadCart();
      return true;
    } catch (error) {
      console.error('Failed to clear cart:', error);
      setError('Failed to clear cart');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const mergeAnonymousCartOnLogin = async (userId) => {
    try {
      // Check if there's an anonymous cart to merge
      const validation = await anonymousCartService.validateCart();
      if (!validation.exists || validation.item_count === 0) {
        return { merged: false, message: 'No anonymous cart to merge' };
      }

      // Merge anonymous cart to user cart
      const mergeResult = await anonymousCartService.mergeToUserCart(userId, 'add_quantities');
      
      // Reload cart after merge
      await loadCart();
      
      return {
        merged: true,
        message: `Merged ${mergeResult.merged_items_count} items to your cart`,
        conflicts_resolved: mergeResult.conflicts_resolved
      };
    } catch (error) {
      console.error('Failed to merge anonymous cart:', error);
      return { merged: false, message: 'Failed to merge cart items' };
    }
  };

  const getCartItemCount = () => {
    return cart.item_count || 0;
  };

  const hasItemsFromRestaurant = (restaurantId) => {
    return cart.restaurant_id === restaurantId;
  };

  const hasItemsFromDifferentRestaurant = (restaurantId) => {
    return cart.restaurant_id && cart.restaurant_id !== restaurantId;
  };

  const getCartTotal = () => {
    // Calculate total based on items (you may need to fetch meal prices)
    return cart.items.reduce((total, item) => {
      // Placeholder: replace with actual price calculation
      const itemPrice = 100; // Get from meal service or item data
      return total + (itemPrice * item.quantity);
    }, 0);
  };

  const value = {
    cart,
    loading,
    error,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    loadCart,
    mergeAnonymousCartOnLogin,
    getCartItemCount,
    hasItemsFromRestaurant,
    hasItemsFromDifferentRestaurant,
    getCartTotal,
    isLoggedIn: isLoggedIn()
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};