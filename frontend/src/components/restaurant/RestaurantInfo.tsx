
import { Star, Phone, MapPin } from 'lucide-react';
import { Restaurant } from '@/types';

interface RestaurantInfoProps {
  restaurant: Restaurant;
}

const RestaurantInfo = ({ restaurant }: RestaurantInfoProps) => {
  return (
    <div className="py-4 space-y-6">
      <div>
        <h3 className="text-lg font-bold mb-2">Çalışma Saatleri</h3>
        <p className="text-gray-600">
          Haftaiçi: 10:00 - 22:00<br />
          Haftasonu: 10:00 - 23:00
        </p>
      </div>
      
      <div>
        <h3 className="text-lg font-bold mb-2">İletişim</h3>
        <div className="space-y-2">
          <div className="flex items-center text-gray-600">
            <Phone className="h-4 w-4 mr-2" />
            <span>+90 212 555 1234</span>
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            <span>İstanbul, Türkiye</span>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-bold mb-2">Hakkında</h3>
        <p className="text-gray-600">
          {restaurant.name}, lezzetli yemekleri ve hızlı servis anlayışıyla müşterilerine en iyi deneyimi sunmayı hedeflemektedir.
        </p>
      </div>
    </div>
  );
};

export default RestaurantInfo;
