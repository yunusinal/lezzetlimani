
import { Star } from 'lucide-react';
import { Restaurant } from '@/types';

interface RestaurantReviewsProps {
  restaurant: Restaurant;
}

const RestaurantReviews = ({ restaurant }: RestaurantReviewsProps) => {
  return (
    <div className="py-4">
      <div className="flex items-center mb-6">
        <div className="flex items-center bg-yellow-50 px-3 py-2 rounded">
          <Star className="h-6 w-6 text-yellow-500 mr-2" />
          <span className="text-xl font-bold">{restaurant.rating}</span>
          <span className="text-gray-500 ml-2">({restaurant.reviewCount} değerlendirme)</span>
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Sample Reviews */}
        <div className="border-b pb-4">
          <div className="flex justify-between mb-2">
            <div className="font-semibold">Ahmet Y.</div>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-500" />
              <Star className="h-4 w-4 text-yellow-500" />
              <Star className="h-4 w-4 text-yellow-500" />
              <Star className="h-4 w-4 text-yellow-500" />
              <Star className="h-4 w-4 text-gray-300" />
            </div>
          </div>
          <p className="text-gray-600 text-sm">
            Lezzetli yemekler ve hızlı teslimat. Kesinlikle tavsiye ederim.
          </p>
        </div>
        
        <div className="border-b pb-4">
          <div className="flex justify-between mb-2">
            <div className="font-semibold">Ayşe K.</div>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-500" />
              <Star className="h-4 w-4 text-yellow-500" />
              <Star className="h-4 w-4 text-yellow-500" />
              <Star className="h-4 w-4 text-gray-300" />
              <Star className="h-4 w-4 text-gray-300" />
            </div>
          </div>
          <p className="text-gray-600 text-sm">
            Yemekler güzeldi fakat sipariş biraz geç geldi.
          </p>
        </div>
        
        <div>
          <div className="flex justify-between mb-2">
            <div className="font-semibold">Mehmet S.</div>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-500" />
              <Star className="h-4 w-4 text-yellow-500" />
              <Star className="h-4 w-4 text-yellow-500" />
              <Star className="h-4 w-4 text-yellow-500" />
              <Star className="h-4 w-4 text-yellow-500" />
            </div>
          </div>
          <p className="text-gray-600 text-sm">
            Muhteşem lezzet! Tam zamanında teslim ve çok sıcak geldi. Tekrar sipariş vereceğim.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RestaurantReviews;
