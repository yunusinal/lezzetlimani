import api from '../api/axios';
import { v4 as uuidv4 } from 'uuid';

const CART_ID_KEY = 'anonymous_cart_id';
const API_BASE = '/carts/anonymous';

class AnonymousCartService {
  constructor() {
    this.cartId = this.getCartId();
  }

  /**
   * Get or generate cart ID
   */
  getCartId() {
    let cartId = localStorage.getItem(CART_ID_KEY);
    if (!cartId) {
      cartId = uuidv4();
      localStorage.setItem(CART_ID_KEY, cartId);
    }
    return cartId;
  }

  /**
   * Clear cart ID from localStorage
   */
  clearCartId() {
    localStorage.removeItem(CART_ID_KEY);
    this.cartId = null;
  }

  /**
   * Generate new cart ID from backend
   */
  async generateNewCartId() {
    try {
      const response = await api.post(`${API_BASE}/generate-id`);
      this.cartId = response.data.cart_id;
      localStorage.setItem(CART_ID_KEY, this.cartId);
      return this.cartId;
    } catch (error) {
      console.error('Failed to generate new cart ID:', error);
      // Fallback to local generation
      this.cartId = uuidv4();
      localStorage.setItem(CART_ID_KEY, this.cartId);
      return this.cartId;
    }
  }

  /**
   * Add item to anonymous cart
   */
  async addToCart(restaurantId, mealId, quantity = 1, note = null, scheduleDate = null) {
    try {
      const response = await api.post(`${API_BASE}/add`, {
        cart_id: this.cartId,
        restaurant_id: restaurantId,
        meal_id: mealId,
        quantity,
        note,
        schedule_date: scheduleDate
      });
      return response.data;
    } catch (error) {
      console.error('Failed to add item to anonymous cart:', error);
      throw error;
    }
  }

  /**
   * Get anonymous cart
   */
  async getCart() {
    try {
      const response = await api.get(`${API_BASE}/${this.cartId}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        // Cart not found, return empty cart
        return {
          cart_id: this.cartId,
          restaurant_id: null,
          items: [],
          item_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      }
      console.error('Failed to get anonymous cart:', error);
      throw error;
    }
  }

  /**
   * Update cart item
   */
  async updateCartItem(mealId, quantity = null, note = null, scheduleDate = null) {
    try {
      const updateData = {};
      if (quantity !== null) updateData.quantity = quantity;
      if (note !== null) updateData.note = note;
      if (scheduleDate !== null) updateData.schedule_date = scheduleDate;

      const response = await api.patch(`${API_BASE}/${this.cartId}/items/${mealId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Failed to update cart item:', error);
      throw error;
    }
  }

  /**
   * Remove item from cart
   */
  async removeFromCart(mealId) {
    try {
      const response = await api.delete(`${API_BASE}/${this.cartId}/items/${mealId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
      throw error;
    }
  }

  /**
   * Clear entire cart
   */
  async clearCart() {
    try {
      const response = await api.delete(`${API_BASE}/${this.cartId}/clear`);
      return response.data;
    } catch (error) {
      console.error('Failed to clear cart:', error);
      throw error;
    }
  }

  /**
   * Validate cart
   */
  async validateCart() {
    try {
      const response = await api.get(`${API_BASE}/${this.cartId}/validate`);
      return response.data;
    } catch (error) {
      console.error('Failed to validate cart:', error);
      return {
        cart_id: this.cartId,
        is_valid: false,
        exists: false,
        item_count: 0,
        restaurant_id: null,
        expires_at: null
      };
    }
  }

  /**
   * Merge anonymous cart to user cart (after login)
   */
  async mergeToUserCart(userId, mergeStrategy = 'add_quantities') {
    try {
      const response = await api.post(`${API_BASE}/merge`, {
        anonymous_cart_id: this.cartId,
        user_id: userId,
        merge_strategy: mergeStrategy
      });
      
      // Clear local cart after successful merge
      this.clearCartId();
      
      return response.data;
    } catch (error) {
      console.error('Failed to merge cart to user:', error);
      throw error;
    }
  }

  /**
   * Extend cart expiry
   */
  async extendCartExpiry(days = 30) {
    try {
      const response = await api.post(`${API_BASE}/${this.cartId}/extend?days=${days}`);
      return response.data;
    } catch (error) {
      console.error('Failed to extend cart expiry:', error);
      throw error;
    }
  }

  /**
   * Get cart item count
   */
  async getCartItemCount() {
    try {
      const cart = await this.getCart();
      return cart.item_count || 0;
    } catch (error) {
      console.error('Failed to get cart item count:', error);
      return 0;
    }
  }

  /**
   * Check if cart has items from specific restaurant
   */
  async hasItemsFromRestaurant(restaurantId) {
    try {
      const cart = await this.getCart();
      return cart.restaurant_id === restaurantId;
    } catch (error) {
      console.error('Failed to check restaurant items:', error);
      return false;
    }
  }

  /**
   * Check if cart has items from different restaurant
   */
  async hasItemsFromDifferentRestaurant(restaurantId) {
    try {
      const cart = await this.getCart();
      return cart.restaurant_id && cart.restaurant_id !== restaurantId;
    } catch (error) {
      console.error('Failed to check different restaurant items:', error);
      return false;
    }
  }
}

// Export singleton instance
const anonymousCartService = new AnonymousCartService();
export default anonymousCartService;