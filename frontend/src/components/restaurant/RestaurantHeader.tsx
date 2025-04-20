import { Heart, Star, Clock, Tag, MapPin, Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Restaurant } from '@/types';
import { toast } from 'sonner';
import { useFavorites } from '@/hooks/useFavorites';

interface RestaurantHeaderProps {
  restaurant: Restaurant;
}

const RestaurantHeader = ({ restaurant }: RestaurantHeaderProps) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const handleFavoriteClick = () => {
    toggleFavorite(restaurant);
    toast.success(
      isFavorite(restaurant.id) 
        ? `${restaurant.name} favorilerden çıkarıldı` 
        : `${restaurant.name} favorilere eklendi`
    );
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('tr-TR') + ' TL';
  };
  
  const renderPriceRange = (range: number) => {
    return '₺'.repeat(range);
  };

  return (
    <div className="relative">
      <div className="h-48 md:h-64 bg-gray-300 overflow-hidden">
        <img 
          src={restaurant.coverImage || 'https://placehold.co/1200x400'} 
          alt={restaurant.name} 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="container mx-auto px-4 lg:px-8 relative -mt-16">
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center">
          <div className="bg-white rounded-lg shadow-sm p-1 mr-4 mb-4 md:mb-0">
            <img 
              src={restaurant.logo || 'https://placehold.co/120x120'} 
              alt={`${restaurant.name} logo`}
              className="w-20 h-20 rounded-lg object-cover"
            />
          </div>
          
          <div className="flex-grow">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">{restaurant.name}</h1>
                <div className="flex flex-wrap gap-2 mt-1">
                  {restaurant.cuisineType.map((type, index) => (
                    <span key={index} className="text-sm text-gray-600">
                      {type}{index < restaurant.cuisineType.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                  <span className="text-sm text-gray-600 ml-2">
                    {renderPriceRange(restaurant.priceRange)}
                  </span>
                </div>
              </div>
              
              <div className="mt-3 md:mt-0">
                <Button 
                  variant="outline" 
                  className="hover:bg-gray-50"
                  onClick={handleFavoriteClick}
                >
                  <Heart 
                    className={`h-5 w-5 mr-2 ${isFavorite(restaurant.id) ? 'fill-brand-red text-brand-red' : 'text-gray-500'}`} 
                  />
                  <span>{isFavorite(restaurant.id) ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}</span>
                </Button>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center text-sm text-gray-600">
                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                <span>{restaurant.rating}</span>
                <span className="text-xs text-gray-500 ml-1">({restaurant.reviewCount})</span>
              </div>
              
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-1" />
                <span>{restaurant.deliveryTime} dk</span>
              </div>
              
              <div className="flex items-center text-sm text-gray-600">
                <Tag className="h-4 w-4 mr-1" />
                <span>Min. {formatPrice(restaurant.minOrderAmount)}</span>
              </div>
              
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{restaurant.distance} km</span>
              </div>
            </div>
            
            {restaurant.discount && (
              <div className="mt-4 py-2 px-3 bg-red-50 rounded border border-red-100 text-sm text-brand-red inline-flex items-center">
                <Info className="h-4 w-4 mr-2" />
                {restaurant.discount.type === 'percentage' 
                  ? `%${restaurant.discount.value} indirim` 
                  : `${formatPrice(restaurant.discount.value)} indirim`}
                {restaurant.discount.minOrderAmount && 
                  ` (min. ${formatPrice(restaurant.discount.minOrderAmount)})`}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantHeader;
