
import { Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartItem as CartItemType } from '@/types';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
}

const CartItem = ({ item, onUpdateQuantity, onRemove }: CartItemProps) => {
  const formatPrice = (price: number) => {
    return price.toLocaleString('tr-TR') + ' TL';
  };

  return (
    <div className="flex justify-between border-b pb-3">
      <div>
        <div className="font-medium">{item.menuItem.name}</div>
        <div className="text-sm text-gray-600">
          {formatPrice(item.menuItem.discountedPrice || item.menuItem.price)}
        </div>
        <div className="flex items-center mt-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-6 w-6"
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="mx-2 text-sm font-medium">{item.quantity}</span>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-6 w-6"
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <div className="font-medium">{formatPrice(item.totalPrice)}</div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-red-500 h-6 px-2 mt-2"
          onClick={() => onRemove(item.id)}
        >
          Kaldır
        </Button>
      </div>
    </div>
  );
};

export default CartItem;
