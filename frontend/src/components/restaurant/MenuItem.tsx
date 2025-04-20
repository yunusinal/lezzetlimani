
import { Plus } from 'lucide-react';
import { MenuItem as MenuItemType } from '@/types';
import { Button } from '@/components/ui/button';

interface MenuItemProps {
  item: MenuItemType;
  onAddToCart: (item: MenuItemType) => void;
}

const MenuItem = ({ item, onAddToCart }: MenuItemProps) => {
  const formatPrice = (price: number) => {
    return price.toLocaleString('tr-TR') + ' TL';
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg hover:shadow-sm transition-shadow">
      {item.image && (
        <div className="md:w-1/4">
          <img 
            src={item.image || 'https://placehold.co/200x200'} 
            alt={item.name} 
            className="w-full h-32 md:h-24 object-cover rounded-lg"
          />
        </div>
      )}
      <div className={`${item.image ? 'md:w-3/4' : 'w-full'} flex flex-col justify-between`}>
        <div>
          <div className="flex justify-between items-start">
            <h4 className="font-bold">
              {item.name}
              {item.isPopular && (
                <span className="ml-2 badge badge-secondary text-xs">
                  Popüler
                </span>
              )}
            </h4>
            <div className="flex items-center">
              {item.discountedPrice ? (
                <>
                  <span className="text-gray-500 line-through mr-2 text-sm">
                    {formatPrice(item.price)}
                  </span>
                  <span className="font-bold">
                    {formatPrice(item.discountedPrice)}
                  </span>
                </>
              ) : (
                <span className="font-bold">
                  {formatPrice(item.price)}
                </span>
              )}
            </div>
          </div>
          
          <p className="text-gray-600 text-sm mt-1">
            {item.description}
          </p>
        </div>
        
        <div className="flex justify-end mt-4">
          <Button 
            onClick={() => onAddToCart(item)}
            className="bg-brand-red text-white hover:bg-brand-red/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Sepete Ekle
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MenuItem;
