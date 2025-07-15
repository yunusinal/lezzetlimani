import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Search,
  Star,
  ChefHat,
  Truck,
  ChevronRight,
  Sparkles,
  Clock,
  SlidersHorizontal,
  X,
  ChevronLeft,
} from "lucide-react";
import {
  searchRestaurants,
  type RestaurantFilters,
  type RestaurantSearchResult,
} from "../api/restaurants/restaurant";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import { SimpleSelect, SimpleSelectItem } from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";

const RestaurantsPage = () => {
  const [searchResult, setSearchResult] = useState<RestaurantSearchResult>({
    restaurants: [],
    total: 0,
    page: 1,
    page_size: 12,
    has_next: false,
  });
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [filters, setFilters] = useState<RestaurantFilters>({
    query: "",
    page: 1,
    page_size: 12,
    sort_by: "rating",
    sort_order: "desc",
  });

  const cuisineOptions = [
    "Türk Mutfağı",
    "Pizza",
    "Burger",
    "Sushi",
    "Döner",
    "Tatlı",
    "Çin Mutfağı",
    "İtalyan",
    "Fast Food",
    "Deniz Ürünleri",
  ];

  const cityOptions = ["İstanbul", "Ankara", "İzmir", "Antalya", "Bursa"];

  const sortOptions = [
    { value: "rating:desc", label: "En Yüksek Puan" },
    { value: "rating:asc", label: "En Düşük Puan" },
    { value: "delivery_fee:asc", label: "En Ucuz Teslimat" },
    { value: "delivery_fee:desc", label: "En Pahalı Teslimat" },
    { value: "prep_time:asc", label: "En Hızlı Hazırlık" },
    { value: "prep_time:desc", label: "En Yavaş Hazırlık" },
    { value: "name:asc", label: "A-Z" },
    { value: "name:desc", label: "Z-A" },
  ];

  // Fetch restaurants with current filters
  const fetchRestaurants = async (newFilters: RestaurantFilters = filters) => {
    setLoading(true);
    try {
      const data = await searchRestaurants(newFilters);
      setSearchResult(data);
    } catch (err) {
      // Silent error handling
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  // Handle filter changes
  const updateFilter = (key: keyof RestaurantFilters, value: any) => {
    const newFilters = { ...filters, [key]: value, page: 1 }; // Reset to page 1 when filters change
    setFilters(newFilters);
    fetchRestaurants(newFilters);
  };

  const updateSort = (sortValue: string) => {
    const [sort_by, sort_order] = sortValue.split(":") as [
      string,
      "asc" | "desc"
    ];
    const newFilters = { ...filters, sort_by, sort_order, page: 1 };
    setFilters(newFilters);
    fetchRestaurants(newFilters);
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    const newFilters = { ...filters, page: newPage };
    setFilters(newFilters);
    fetchRestaurants(newFilters);
  };

  // Clear all filters
  const clearFilters = () => {
    const newFilters: RestaurantFilters = {
      query: "",
      page: 1,
      page_size: 12,
      sort_by: "rating",
      sort_order: "desc",
    };
    setFilters(newFilters);
    fetchRestaurants(newFilters);
  };

  // Remove cuisine filter
  const removeCuisine = (cuisine: string) => {
    const newCuisines = filters.cuisines?.filter((c) => c !== cuisine) || [];
    updateFilter("cuisines", newCuisines.length > 0 ? newCuisines : undefined);
  };

  // Toggle cuisine filter
  const toggleCuisine = (cuisine: string) => {
    const currentCuisines = filters.cuisines || [];
    let newCuisines;

    if (currentCuisines.includes(cuisine)) {
      newCuisines = currentCuisines.filter((c) => c !== cuisine);
    } else {
      newCuisines = [...currentCuisines, cuisine];
    }

    updateFilter("cuisines", newCuisines.length > 0 ? newCuisines : undefined);
  };

  const activeFiltersCount = [
    filters.query,
    filters.city,
    filters.min_rating,
    filters.max_delivery,
    filters.max_prep_time,
    filters.cuisines?.length,
  ].filter(Boolean).length;

  if (loading && searchResult.restaurants.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="section-container py-8 space-y-8">
          <Skeleton className="h-32 w-full" />
          <div className="flex gap-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="section-container py-8 space-y-8">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary/5 via-background to-accent/5 rounded-3xl p-8 md:p-12 text-center border border-border"
        >
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-6 w-6 text-accent mr-2" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              <span className="text-primary-gradient">
                Lezzetli Restoranlar
              </span>
              ! 🍽️
            </h1>
          </div>
          <p className="text-lg text-muted-foreground mb-8">
            En sevdiğin yemekleri keşfet ve kolayca sipariş ver
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                size={20}
              />
              <Input
                type="text"
                placeholder="Restoran, yemek, mutfak türü ara..."
                value={filters.query || ""}
                onChange={(e) =>
                  updateFilter("query", e.target.value || undefined)
                }
                className="pl-12 py-4 text-lg rounded-2xl input-modern"
              />
            </div>
          </div>
        </motion.section>

        {/* Filters and Sorting */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-4">
            <Dialog open={showFilters} onOpenChange={setShowFilters}>
              <DialogTrigger asChild>
                <Button variant="outline" className="relative">
                  <SlidersHorizontal size={16} className="mr-2" />
                  Filtreler
                  {activeFiltersCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Filtreler</DialogTitle>
                  <DialogDescription>
                    Arama kriterlerinizi seçin
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                  {/* City Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Şehir
                    </label>
                    <SimpleSelect
                      value={filters.city || ""}
                      onValueChange={(value: string) =>
                        updateFilter("city", value || undefined)
                      }
                      placeholder="Şehir seçin"
                    >
                      <SimpleSelectItem value="">Tümü</SimpleSelectItem>
                      {cityOptions.map((city) => (
                        <SimpleSelectItem key={city} value={city}>
                          {city}
                        </SimpleSelectItem>
                      ))}
                    </SimpleSelect>
                  </div>

                  {/* Rating Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Minimum Puan
                    </label>
                    <SimpleSelect
                      value={filters.min_rating?.toString() || ""}
                      onValueChange={(value: string) =>
                        updateFilter(
                          "min_rating",
                          value ? parseFloat(value) : undefined
                        )
                      }
                      placeholder="Puan seçin"
                    >
                      <SimpleSelectItem value="">Tümü</SimpleSelectItem>
                      <SimpleSelectItem value="4.5">
                        4.5+ ⭐⭐⭐⭐⭐
                      </SimpleSelectItem>
                      <SimpleSelectItem value="4.0">
                        4.0+ ⭐⭐⭐⭐
                      </SimpleSelectItem>
                      <SimpleSelectItem value="3.5">
                        3.5+ ⭐⭐⭐
                      </SimpleSelectItem>
                      <SimpleSelectItem value="3.0">3.0+ ⭐⭐</SimpleSelectItem>
                    </SimpleSelect>
                  </div>

                  {/* Delivery Fee Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Maksimum Teslimat Ücreti
                    </label>
                    <SimpleSelect
                      value={filters.max_delivery?.toString() || ""}
                      onValueChange={(value: string) =>
                        updateFilter(
                          "max_delivery",
                          value ? parseFloat(value) : undefined
                        )
                      }
                      placeholder="Teslimat ücreti seçin"
                    >
                      <SimpleSelectItem value="">Tümü</SimpleSelectItem>
                      <SimpleSelectItem value="0">
                        Ücretsiz teslimat
                      </SimpleSelectItem>
                      <SimpleSelectItem value="5">5₺ ve altı</SimpleSelectItem>
                      <SimpleSelectItem value="10">
                        10₺ ve altı
                      </SimpleSelectItem>
                      <SimpleSelectItem value="15">
                        15₺ ve altı
                      </SimpleSelectItem>
                    </SimpleSelect>
                  </div>

                  {/* Prep Time Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Maksimum Hazırlık Süresi
                    </label>
                    <SimpleSelect
                      value={filters.max_prep_time?.toString() || ""}
                      onValueChange={(value: string) =>
                        updateFilter(
                          "max_prep_time",
                          value ? parseInt(value) : undefined
                        )
                      }
                      placeholder="Hazırlık süresi seçin"
                    >
                      <SimpleSelectItem value="">Tümü</SimpleSelectItem>
                      <SimpleSelectItem value="15">
                        15 dakika ve altı
                      </SimpleSelectItem>
                      <SimpleSelectItem value="30">
                        30 dakika ve altı
                      </SimpleSelectItem>
                      <SimpleSelectItem value="45">
                        45 dakika ve altı
                      </SimpleSelectItem>
                      <SimpleSelectItem value="60">
                        60 dakika ve altı
                      </SimpleSelectItem>
                    </SimpleSelect>
                  </div>

                  {/* Cuisine Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Mutfak Türü
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {cuisineOptions.map((cuisine) => (
                        <Button
                          key={cuisine}
                          variant={
                            filters.cuisines?.includes(cuisine)
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => toggleCuisine(cuisine)}
                          className="justify-start"
                        >
                          {cuisine}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Clear Filters Button */}
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="w-full"
                  >
                    Filtreleri Temizle
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Sort Dropdown */}
            <SimpleSelect
              value={`${filters.sort_by}:${filters.sort_order}`}
              onValueChange={(value: string) => updateSort(value)}
              className="w-48"
            >
              {sortOptions.map((option) => (
                <SimpleSelectItem key={option.value} value={option.value}>
                  {option.label}
                </SimpleSelectItem>
              ))}
            </SimpleSelect>

            <div className="text-sm text-muted-foreground ml-auto">
              {searchResult.total} restoran
            </div>
          </div>

          {/* Active Filter Tags */}
          <AnimatePresence>
            {activeFiltersCount > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap gap-2"
              >
                {filters.query && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <Search size={12} />"{filters.query}"
                    <X
                      size={12}
                      className="cursor-pointer hover:text-destructive"
                      onClick={() => updateFilter("query", undefined)}
                    />
                  </Badge>
                )}
                {filters.city && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <MapPin size={12} />
                    {filters.city}
                    <X
                      size={12}
                      className="cursor-pointer hover:text-destructive"
                      onClick={() => updateFilter("city", undefined)}
                    />
                  </Badge>
                )}
                {filters.min_rating && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <Star size={12} />
                    {filters.min_rating}+ puan
                    <X
                      size={12}
                      className="cursor-pointer hover:text-destructive"
                      onClick={() => updateFilter("min_rating", undefined)}
                    />
                  </Badge>
                )}
                {filters.max_delivery !== undefined && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <Truck size={12} />
                    Max {filters.max_delivery}₺ teslimat
                    <X
                      size={12}
                      className="cursor-pointer hover:text-destructive"
                      onClick={() => updateFilter("max_delivery", undefined)}
                    />
                  </Badge>
                )}
                {filters.max_prep_time && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <Clock size={12} />
                    Max {filters.max_prep_time}dk
                    <X
                      size={12}
                      className="cursor-pointer hover:text-destructive"
                      onClick={() => updateFilter("max_prep_time", undefined)}
                    />
                  </Badge>
                )}
                {filters.cuisines?.map((cuisine) => (
                  <Badge
                    key={cuisine}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <ChefHat size={12} />
                    {cuisine}
                    <X
                      size={12}
                      className="cursor-pointer hover:text-destructive"
                      onClick={() => removeCuisine(cuisine)}
                    />
                  </Badge>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-6 px-2 text-xs"
                >
                  Tümünü Temizle
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* Restaurants Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-64" />
              ))}
            </div>
          ) : searchResult.restaurants.length === 0 ? (
            <Card className="text-center py-16 border-border bg-card">
              <CardContent>
                <div className="w-24 h-24 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ChefHat className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Sonuç bulunamadı
                </h3>
                <p className="text-muted-foreground mb-6">
                  Arama kriterlerinize uygun restoran bulunamadı. Filtrelerinizi
                  değiştirmeyi deneyin.
                </p>
                <Button onClick={clearFilters} variant="outline">
                  Filtreleri Temizle
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResult.restaurants.map((restaurant, index) => (
                <motion.div
                  key={restaurant.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`/restaurants/${restaurant.id}`}>
                    <Card className="restaurant-card group border-border bg-card shadow-sm hover:shadow-lg">
                      {/* Restaurant Image */}
                      <div className="food-card-image">
                        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                          <ChefHat className="h-16 w-16 text-primary" />
                        </div>
                      </div>

                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-2">
                          <CardTitle className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-200">
                            {restaurant.name}
                          </CardTitle>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-accent fill-current" />
                            <span className="text-sm font-medium text-foreground">
                              {restaurant.rating_avg?.toFixed(1) || "4.5"}
                            </span>
                          </div>
                        </div>

                        <CardDescription className="flex items-center text-muted-foreground mb-4">
                          <MapPin size={14} className="mr-1" />
                          {restaurant.address?.district &&
                          restaurant.address?.city
                            ? `${restaurant.address.district}, ${restaurant.address.city}`
                            : "Konum bilgisi yok"}
                        </CardDescription>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Clock size={14} />
                              <span>{restaurant.prep_time || 25} dk</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Truck size={14} />
                              <span>
                                {restaurant.address
                                  ? "Teslimat var"
                                  : "Bilgi yok"}
                              </span>
                            </div>
                          </div>
                          <ChevronRight
                            size={18}
                            className="text-primary group-hover:translate-x-1 transition-transform duration-200"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>

        {/* Pagination */}
        {searchResult.total > searchResult.page_size && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-2"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(filters.page! - 1)}
              disabled={filters.page === 1}
            >
              <ChevronLeft size={16} />
              Önceki
            </Button>

            <div className="flex items-center gap-1">
              {/* Page numbers */}
              {Array.from(
                {
                  length: Math.min(
                    5,
                    Math.ceil(searchResult.total / searchResult.page_size)
                  ),
                },
                (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <Button
                      key={pageNum}
                      variant={filters.page === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      className="w-10"
                    >
                      {pageNum}
                    </Button>
                  );
                }
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(filters.page! + 1)}
              disabled={!searchResult.has_next}
            >
              Sonraki
              <ChevronRight size={16} />
            </Button>
          </motion.section>
        )}
      </div>
    </div>
  );
};

export default RestaurantsPage;
