import { ChevronRight, ShoppingBag, Info, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartItem as CartItemType, Restaurant } from '@/types';
import CartItem from './CartItem';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface CartProps {
  cart: CartItemType[];
  restaurant: Restaurant;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
  calculateCartTotal: () => number;
  onClearCart?: () => void;
}

const Cart = ({ cart, restaurant, onUpdateQuantity, onRemove, calculateCartTotal, onClearCart }: CartProps) => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  
  const formatPrice = (price: number) => {
    return price.toLocaleString('tr-TR') + ' TL';
  };

  const handleOrderComplete = () => {
    if (!isLoggedIn) {
      toast.warning("Siparişi tamamlamak için önce giriş yapmalısınız");
      setTimeout(() => {
        navigate('/login?redirectTo=/cart');
      }, 1500);
      return;
    }
    navigate('/cart');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-24">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Sepetim</h3>
        {cart.length > 0 && onClearCart && (
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => {
              if (window.confirm('Sepetinizi tamamen temizlemek istediğinize emin misiniz?')) {
                onClearCart();
                toast.success('Sepetiniz temizlendi');
              }
            }}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Sepeti Temizle
          </Button>
        )}
      </div>
      
      {cart.length > 0 ? (
        <>
          <div className="max-h-64 overflow-y-auto mb-4 space-y-4">
            {cart.map(item => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={onUpdateQuantity}
                onRemove={onRemove}
              />
            ))}
          </div>
          
          {/* Cart Summary */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Ara Toplam:</span>
              <span>{formatPrice(calculateCartTotal())}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Teslimat Ücreti:</span>
              <span>{restaurant.deliveryFee > 0 ? formatPrice(restaurant.deliveryFee) : 'Ücretsiz'}</span>
            </div>
            <div className="flex justify-between font-bold mt-2 pt-2 border-t">
              <span>Toplam:</span>
              <span>{formatPrice(calculateCartTotal() + restaurant.deliveryFee)}</span>
            </div>
          </div>
          
          <Button 
            onClick={handleOrderComplete}
            className="w-full mt-4 bg-brand-red text-white hover:bg-brand-red/90"
          >
            Siparişi Tamamla
            <ChevronRight className="h-5 w-5 ml-1" />
          </Button>
        </>
      ) : (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <ShoppingBag className="h-12 w-12 mx-auto" />
          </div>
          <h4 className="font-medium mb-1">Sepetiniz Boş</h4>
          <p className="text-gray-500 text-sm mb-4">
            Lütfen sepetinize ürün ekleyin
          </p>
        </div>
      )}
      
      {/* Min Order Warning */}
      {cart.length > 0 && calculateCartTotal() < restaurant.minOrderAmount && (
        <div className="mt-4 py-2 px-3 bg-yellow-50 rounded border border-yellow-100 text-sm">
          <Info className="h-4 w-4 text-yellow-500 inline mr-1" />
          Minimum sipariş tutarı {formatPrice(restaurant.minOrderAmount)}. 
          Siparişinizi tamamlamak için {formatPrice(restaurant.minOrderAmount - calculateCartTotal())} 
          daha eklemeniz gerekiyor.
        </div>
      )}
    </div>
  );
};

export default Cart;
