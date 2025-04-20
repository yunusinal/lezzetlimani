
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Restaurant, MenuItem } from '@/types';
import RestaurantMenu from './RestaurantMenu';
import RestaurantInfo from './RestaurantInfo';
import RestaurantReviews from './RestaurantReviews';

interface RestaurantTabsProps {
  restaurant: Restaurant;
  onAddToCart: (item: MenuItem) => void;
}

const RestaurantTabs = ({ restaurant, onAddToCart }: RestaurantTabsProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <Tabs defaultValue="menu">
        <TabsList className="w-full">
          <TabsTrigger value="menu" className="flex-1">Menü</TabsTrigger>
          <TabsTrigger value="info" className="flex-1">Restaurant Bilgileri</TabsTrigger>
          <TabsTrigger value="reviews" className="flex-1">Değerlendirmeler</TabsTrigger>
        </TabsList>

        <TabsContent value="menu">
          <RestaurantMenu
            categories={restaurant.categories}
            onAddToCart={onAddToCart}
          />
        </TabsContent>

        <TabsContent value="info">
          <RestaurantInfo restaurant={restaurant} />
        </TabsContent>

        <TabsContent value="reviews">
          <RestaurantReviews restaurant={restaurant} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RestaurantTabs;
