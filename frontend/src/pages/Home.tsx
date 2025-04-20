
import { useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CampaignSlider from '@/components/CampaignSlider';
import CuisineCard from '@/components/CuisineCard';
import RestaurantCard from '@/components/RestaurantCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { cuisineTypes, campaignBanners, restaurants } from '@/data/mockData';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const popularRestaurants = [...restaurants].sort((a, b) => b.rating - a.rating);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would redirect with the search query
    window.location.href = `/restaurants?search=${searchQuery}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-brand-red to-red-700 text-white py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                En sevdiğiniz yemekler kapınızda
              </h1>
              <p className="text-lg md:text-xl mb-8 text-white/90">
                Yüzlerce restoranı keşfedin ve lezzetli yemekleri dakikalar içinde sipariş edin.
              </p>

              <form onSubmit={handleSearch} className="relative max-w-md mx-auto">
                <Input
                  type="text"
                  placeholder="Restaurant veya mutfak arayın..."
                  className="pr-12 h-12 bg-white text-gray-900"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button
                  type="submit"
                  className="absolute right-0 top-0 h-12 px-3 bg-brand-red"
                >
                  <Search className="h-5 w-5" />
                </Button>
              </form>
            </div>
          </div>
        </section>

        {/* Campaigns Section */}
        <section className="py-8">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="text-2xl font-bold mb-4">Kampanyalar</h2>
            <CampaignSlider campaigns={campaignBanners} />
          </div>
        </section>

        {/* Cuisines Section */}
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Mutfaklar</h2>
              <Link to="/restaurants" className="text-brand-red font-medium flex items-center hover:underline">
                <span>Tümünü Gör</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 gap-4">
              {cuisineTypes.map(cuisine => (
                <CuisineCard key={cuisine.id} cuisine={cuisine} />
              ))}
            </div>
          </div>
        </section>


        {/* Popular Restaurants Section */}
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Popüler Restoranlar</h2>
              <Link to="/restaurants" className="text-brand-red font-medium flex items-center hover:underline">
                <span>Tümünü Gör</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {popularRestaurants.slice(0, 4).map(restaurant => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          </div>
        </section>


      </main>

      <Footer />
    </div>
  );
};

export default Index;
