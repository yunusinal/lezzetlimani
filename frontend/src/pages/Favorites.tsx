import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RestaurantCard from '@/components/RestaurantCard';
import { useFavorites } from '@/hooks/useFavorites';

const Favorites = () => {
    const { favorites } = useFavorites();

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow bg-gray-50 py-8">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold mb-2">Favori Restoranlarım</h1>
                        <p className="text-gray-600">
                            {favorites.length} restoran bulundu
                        </p>
                    </div>

                    {favorites.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {favorites.map(restaurant => (
                                <RestaurantCard
                                    key={restaurant.id}
                                    restaurant={restaurant}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Heart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                            <h2 className="text-xl font-semibold mb-2">Henüz favori restoranınız yok</h2>
                            <p className="text-gray-600 mb-6">
                                Favori restoranlarınızı burada görmek için restoranlara göz atın ve beğendiklerinizi favorilere ekleyin.
                            </p>
                            <Button asChild>
                                <Link to="/restaurants">Restoranları Keşfet</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Favorites; 