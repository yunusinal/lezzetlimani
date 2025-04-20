import { Star, Clock, Tag, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Restaurant } from '@/types';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useFavorites } from '@/hooks/useFavorites';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

const RestaurantCard = ({ restaurant }: RestaurantCardProps) => {
  const { isFavorite, toggleFavorite } = useFavorites();

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
    <Link to={`/restaurant/${restaurant.id}`}>
      <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 card-hover">
        <div className="relative">
          <img
            src={restaurant.coverImage || 'https://placehold.co/400x200'}
            alt={restaurant.name}
            className="w-full h-48 object-cover"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-white rounded-full shadow-md"
            onClick={handleFavoriteClick}
          >
            <Heart
              className={`h-5 w-5 ${isFavorite(restaurant.id) ? 'fill-brand-red text-brand-red' : 'text-gray-500'}`}
            />
          </Button>

          {restaurant.isPromoted && (
            <div className="absolute top-2 left-2 badge badge-primary">
              Öne Çıkan
            </div>
          )}

          {restaurant.isNew && (
            <div className="absolute bottom-2 left-2 badge badge-secondary">
              Yeni
            </div>
          )}

          <div className="absolute -bottom-6 left-4">
            <div className="bg-white rounded-full p-1 shadow-md">
              <img
                src={restaurant.logo || 'https://placehold.co/80x80'}
                alt={`${restaurant.name} logo`}
                className="w-12 h-12 rounded-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="p-4 pt-8">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-lg line-clamp-1">{restaurant.name}</h3>
            <div className="flex items-center bg-gray-100 px-2 py-1 rounded-md">
              <Star className="h-4 w-4 text-yellow-500 mr-1" />
              <span className="text-sm font-medium">{restaurant.rating}</span>
              <span className="text-xs text-gray-500 ml-1">({restaurant.reviewCount})</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mt-2">
            {restaurant.cuisineType.map((type, index) => (
              <span
                key={index}
                className="text-xs text-gray-500"
              >
                {type}{index < restaurant.cuisineType.length - 1 ? ', ' : ''}
              </span>
            ))}
            <span className="text-xs text-gray-500 ml-2">
              {renderPriceRange(restaurant.priceRange)}
            </span>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-1" />
              <span>{restaurant.deliveryTime} dk</span>
            </div>

            <div className="flex items-center text-sm text-gray-600">
              <Tag className="h-4 w-4 mr-1" />
              <span>Min. {formatPrice(restaurant.minOrderAmount)}</span>
            </div>
          </div>

          {restaurant.discount && (
            <div className="mt-3 py-2 px-3 bg-red-50 rounded border border-red-100 text-sm text-brand-red">
              {restaurant.discount.type === 'percentage'
                ? `%${restaurant.discount.value} indirim`
                : `${formatPrice(restaurant.discount.value)} indirim`}
              {restaurant.discount.minOrderAmount &&
                ` (min. ${formatPrice(restaurant.discount.minOrderAmount)})`}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
