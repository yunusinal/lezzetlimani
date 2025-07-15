import { useState, useEffect, useCallback } from 'react';
import anonymousCartService from '../services/anonymousCart';

export const useAnonymousCart = () => {
  const [cart, setCart] = useState({
    items: [],
    item_count: 0,
    restaurant_id: null,
    cart_id: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load cart
  const loadCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const cartData = await anonymousCartService.getCart();
      setCart(cartData);
    } catch (err) {
      console.error('Failed to load anonymous cart:', err);
      setError('Failed to load cart');
    } finally {
      setLoading(false);
    }
  }, []);

  // Add item to cart
  const addItem = useCallback(async (restaurantId, mealId, quantity = 1, note = null, scheduleDate = null) => {
    setLoading(true);
    setError(null);
    try {
      // Check for different restaurant
      if (cart.restaurant_id && cart.restaurant_id !== restaurantId) {
        throw new Error('Cannot add items from different restaurant');
      }

      const updatedCart = await anonymousCartService.addToCart(
        restaurantId, mealId, quantity, note, scheduleDate
      );
      setCart(updatedCart);
      return true;
    } catch (err) {
      console.error('Failed to add item to cart:', err);
      setError(err.message || 'Failed to add item');
      return false;
    } finally {
      setLoading(false);
    }
  }, [cart.restaurant_id]);

  // Update item
  const updateItem = useCallback(async (mealId, quantity = null, note = null, scheduleDate = null) => {
    setLoading(true);
    setError(null);
    try {
      const updatedCart = await anonymousCartService.updateCartItem(mealId, quantity, note, scheduleDate);
      setCart(updatedCart);
      return true;
    } catch (err) {
      console.error('Failed to update cart item:', err);
      setError('Failed to update item');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Remove item
  const removeItem = useCallback(async (mealId) => {
    setLoading(true);
    setError(null);
    try {
      const updatedCart = await anonymousCartService.removeFromCart(mealId);
      setCart(updatedCart);
      return true;
    } catch (err) {
      console.error('Failed to remove cart item:', err);
      setError('Failed to remove item');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear cart
  const clearCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const updatedCart = await anonymousCartService.clearCart();
      setCart(updatedCart);
      return true;
    } catch (err) {
      console.error('Failed to clear cart:', err);
      setError('Failed to clear cart');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Validate cart
  const validateCart = useCallback(async () => {
    try {
      return await anonymousCartService.validateCart();
    } catch (err) {
      console.error('Failed to validate cart:', err);
      return { is_valid: false, exists: false };
    }
  }, []);

  // Merge to user cart
  const mergeToUserCart = useCallback(async (userId, mergeStrategy = 'add_quantities') => {
    setLoading(true);
    setError(null);
    try {
      const result = await anonymousCartService.mergeToUserCart(userId, mergeStrategy);
      // Clear local cart after merge
      setCart({
        items: [],
        item_count: 0,
        restaurant_id: null,
        cart_id: null
      });
      return result;
    } catch (err) {
      console.error('Failed to merge cart:', err);
      setError('Failed to merge cart');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Extend cart expiry
  const extendExpiry = useCallback(async (days = 30) => {
    try {
      return await anonymousCartService.extendCartExpiry(days);
    } catch (err) {
      console.error('Failed to extend cart expiry:', err);
      return false;
    }
  }, []);

  // Helper functions
  const getItemCount = useCallback(() => cart.item_count || 0, [cart.item_count]);
  
  const hasItems = useCallback(() => cart.item_count > 0, [cart.item_count]);
  
  const hasItemsFromRestaurant = useCallback((restaurantId) => {
    return cart.restaurant_id === restaurantId;
  }, [cart.restaurant_id]);
  
  const hasItemsFromDifferentRestaurant = useCallback((restaurantId) => {
    return cart.restaurant_id && cart.restaurant_id !== restaurantId;
  }, [cart.restaurant_id]);

  const getCartTotal = useCallback(() => {
    // Placeholder calculation - replace with actual price logic
    return cart.items.reduce((total, item) => {
      const itemPrice = 100; // Get from meal service
      return total + (itemPrice * item.quantity);
    }, 0);
  }, [cart.items]);

  // Load cart on mount
  useEffect(() => {
    loadCart();
  }, [loadCart]);

  return {
    cart,
    loading,
    error,
    loadCart,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    validateCart,
    mergeToUserCart,
    extendExpiry,
    getItemCount,
    hasItems,
    hasItemsFromRestaurant,
    hasItemsFromDifferentRestaurant,
    getCartTotal,
    cartId: cart.cart_id
  };
};