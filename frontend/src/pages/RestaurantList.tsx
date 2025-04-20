import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, X, Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RestaurantCard from '@/components/RestaurantCard';
import FilterSidebar from '@/components/FilterSidebar';
import { Restaurant } from '@/types';
import { restaurants, cuisineTypes } from '@/data/mockData';
import { debounce } from '@/lib/utils';

const RestaurantList = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>(restaurants);
  const [filters, setFilters] = useState({
    priceRange: [0, 4],
    deliveryTime: 60,
    minRating: 0,
    cuisines: [] as string[],
    sortOption: 'popular'
  });

  // Parse URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    const cuisineParam = params.get('cuisine');
    const resetParam = params.get('reset');

    // Eğer reset parametresi varsa, tüm filtreleri sıfırla
    if (resetParam === 'true') {
      setSearchQuery('');
      setFilters({
        priceRange: [0, 4],
        deliveryTime: 60,
        minRating: 0,
        cuisines: [],
        sortOption: 'popular'
      });
      return; // Diğer filtrelerin uygulanmasını engelle
    }

    if (searchParam) {
      setSearchQuery(searchParam);
    }

    if (cuisineParam) {
      // Kategori ID'sine göre kategori ismini bulan fonksiyon
      const getCuisineNameById = (id: string) => {
        const cuisine = cuisineTypes.find(c => c.id === id);
        return cuisine ? cuisine.name : '';
      };

      // Kategori adını filtre listesine ekle
      const cuisineName = getCuisineNameById(cuisineParam);
      if (cuisineName) {
        setFilters(prev => ({
          ...prev,
          cuisines: [cuisineName]
        }));
      }
    }

    applyFilters();
  }, [location.search]);

  const applyFilters = () => {
    let result = [...restaurants];

    // Apply search filter
    if (searchQuery) {
      result = result.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.cuisineType.some(cuisine =>
          cuisine.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Apply cuisine filter
    if (filters.cuisines.length > 0) {
      result = result.filter(restaurant =>
        restaurant.cuisineType.some(cuisineType =>
          filters.cuisines.some(filterCuisine => 
            cuisineType.toLowerCase() === filterCuisine.toLowerCase()
          )
        )
      );
    }

    // Apply price range filter
    result = result.filter(restaurant =>
      restaurant.priceRange >= filters.priceRange[0] &&
      restaurant.priceRange <= filters.priceRange[1]
    );

    // Apply delivery time filter
    result = result.filter(restaurant =>
      restaurant.deliveryTime <= filters.deliveryTime
    );

    // Apply rating filter
    result = result.filter(restaurant =>
      restaurant.rating >= filters.minRating
    );

    // Apply sorting
    switch (filters.sortOption) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'delivery':
        result.sort((a, b) => a.deliveryTime - b.deliveryTime);
        break;
      case 'min_price':
        result.sort((a, b) => a.minOrderAmount - b.minOrderAmount);
        break;
      case 'popular':
      default:
        // Sort by promoted first, then by rating
        result.sort((a, b) => {
          if (a.isPromoted && !b.isPromoted) return -1;
          if (!a.isPromoted && b.isPromoted) return 1;
          return b.rating - a.rating;
        });
        break;
    }

    setFilteredRestaurants(result);
  };

  // Debounced search
  const debouncedSearch = debounce(() => {
    applyFilters();
  }, 300);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    debouncedSearch();
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    applyFilters();
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  useEffect(() => {
    applyFilters();
  }, [filters, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Restoranlar</h1>
            <p className="text-gray-600">
              {filteredRestaurants.length} restoran bulundu
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Filter Sidebar - Desktop */}
            <div className="hidden md:block md:w-1/4 lg:w-1/5">
              <FilterSidebar onFilterChange={handleFilterChange} />
            </div>

            {/* Main Content */}
            <div className="md:w-3/4 lg:w-4/5">
              {/* Search Bar */}
              <div className="bg-white rounded-lg p-4 mb-6 shadow-sm border border-gray-200">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Restaurant veya mutfak arayın..."
                    className="pl-10 pr-10"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  {searchQuery && (
                    <button
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      onClick={handleClearSearch}
                    >
                      <X className="h-5 w-5 text-gray-400" />
                    </button>
                  )}
                </div>

                {/* Mobile Filter Button */}
                <div className="md:hidden mt-4">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full flex justify-between"
                      >
                        <span>Filtrele ve Sırala</span>
                        <Filter className="h-5 w-5" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="overflow-y-auto">
                      <FilterSidebar onFilterChange={handleFilterChange} />
                    </SheetContent>
                  </Sheet>
                </div>
              </div>

              {/* Restaurant Grid */}
              {filteredRestaurants.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRestaurants.map(restaurant => (
                    <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-xl font-semibold mb-2">
                    Aradığınız kriterlere uygun restoran bulunamadı
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Lütfen farklı filtreler deneyiniz.
                  </p>
                  <Button
                    onClick={() => {
                      setSearchQuery('');
                      setFilters({
                        priceRange: [0, 4],
                        deliveryTime: 60,
                        minRating: 0,
                        cuisines: [],
                        sortOption: 'popular'
                      });
                    }}
                  >
                    Filtreleri Temizle
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RestaurantList;
