import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Search,
  Clock,
  Star,
  Heart,
  Settings,
  Plus,
  ChefHat,
  Truck,
  Gift,
  ChevronRight,
  Filter,
  Sparkles,
} from "lucide-react";
import { getRestaurants } from "../../api/restaurants/restaurant";
import type { RestaurantResponseDTO } from "../../types";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";

const Dashboard = () => {
  const { user, addresses } = useAuth();
  const [restaurants, setRestaurants] = useState<RestaurantResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getRestaurants();
        setRestaurants(data);
      } catch (err) {
        // Silent error handling
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const quickActions = [
    {
      icon: MapPin,
      label: "Adreslerim",
      href: "/addresses",
      color: "bg-primary/10 text-primary",
      count: addresses.length,
    },
    {
      icon: Clock,
      label: "Siparişlerim",
      href: "/orders",
      color: "bg-accent/10 text-accent-600",
    },
    {
      icon: Heart,
      label: "Favorilerim",
      href: "/favorites",
      color: "bg-secondary/10 text-secondary",
    },
    {
      icon: Settings,
      label: "Profil",
      href: "/profile",
      color: "bg-muted/30 text-muted-foreground",
    },
  ];

  const foodCategories = [
    { name: "Pizza", emoji: "🍕", count: 12 },
    { name: "Burger", emoji: "🍔", count: 8 },
    { name: "Sushi", emoji: "🍣", count: 5 },
    { name: "Döner", emoji: "🥙", count: 15 },
    { name: "Tatlı", emoji: "🍰", count: 7 },
    { name: "Çin", emoji: "🥡", count: 4 },
  ];

  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="section-container py-8 space-y-8">
          <Skeleton className="h-32 w-full" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20" />
            ))}
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
              Merhaba,{" "}
              <span className="text-primary-gradient">{user?.full_name}</span>!
              👋
            </h1>
          </div>
          <p className="text-lg text-muted-foreground mb-8">
            Bugün hangi lezzeti denemek istersin?
          </p>

          {/* Location & Search */}
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-center space-x-2 text-primary mb-4">
              <MapPin size={18} />
              <span className="font-medium">
                {addresses.length > 0 ? addresses[0].city : "Konum seçin"}
              </span>
            </div>

            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                size={20}
              />
              <Input
                type="text"
                placeholder="Restoran, yemek, mutfak türü ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-4 text-lg rounded-2xl input-modern"
              />
            </div>
          </div>
        </motion.section>

        {/* Quick Actions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Hızlı Erişim</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
              >
                <Link to={action.href}>
                  <Card className="hover-lift cursor-pointer group border-border bg-card shadow-sm hover:shadow-md">
                    <CardContent className="p-6 text-center">
                      <div
                        className={`w-12 h-12 ${action.color} rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-200`}
                      >
                        <action.icon size={24} />
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">
                        {action.label}
                      </h3>
                      {action.count !== undefined && (
                        <Badge className="badge-primary text-xs">
                          {action.count}
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Food Categories */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Kategoriler</h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:text-primary hover:bg-primary/5"
            >
              <Filter size={16} className="mr-2" />
              Filtrele
            </Button>
          </div>

          <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-thin">
            {foodCategories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className="flex-shrink-0"
              >
                <Card className="w-24 hover-lift cursor-pointer group border-border bg-card shadow-sm hover:shadow-md">
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">
                      {category.emoji}
                    </div>
                    <h3 className="text-sm font-medium text-foreground mb-1">
                      {category.name}
                    </h3>
                    <Badge className="badge-primary text-xs">
                      {category.count}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Restaurants Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              {searchQuery
                ? `"${searchQuery}" için sonuçlar`
                : "Yakındaki Restoranlar"}
            </h2>
            <div className="text-sm text-muted-foreground">
              {filteredRestaurants.length} restoran
            </div>
          </div>

          {filteredRestaurants.length === 0 ? (
            <Card className="text-center py-16 border-border bg-card">
              <CardContent>
                <div className="w-24 h-24 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ChefHat className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {searchQuery
                    ? "Sonuç bulunamadı"
                    : "Yakında daha fazla restoran!"}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery
                    ? "Farklı bir arama terimi deneyin"
                    : "Şu anda bu bölgede restoran bulunmuyor"}
                </p>
                {searchQuery && (
                  <Button
                    onClick={() => setSearchQuery("")}
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary hover:text-white"
                  >
                    Tüm restoranları göster
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRestaurants.map((restaurant, index) => (
                <motion.div
                  key={restaurant.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
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
                              4.5
                            </span>
                          </div>
                        </div>

                        <CardDescription className="flex items-center text-muted-foreground mb-4">
                          <MapPin size={14} className="mr-1" />
                          {restaurant.address.district},{" "}
                          {restaurant.address.city}
                        </CardDescription>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Truck size={14} />
                              <span>20-30 dk</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Gift size={14} />
                              <span>Min 50₺</span>
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

        {/* Add Address CTA */}
        {addresses.length === 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-r from-primary to-secondary text-white border-0">
              <CardContent className="p-8 text-center">
                <MapPin className="h-16 w-16 mx-auto mb-4 opacity-80" />
                <h3 className="text-xl font-bold mb-2">
                  Sipariş vermek için adres eklemelisin
                </h3>
                <p className="opacity-90 mb-6">
                  Hızlı teslimat için adresini kaydet ve lezzetli yemeklere
                  ulaş!
                </p>
                <Link to="/addresses/new">
                  <Button className="bg-white text-primary hover:bg-gray-100 shadow-lg">
                    <Plus size={18} className="mr-2" />
                    İlk Adresini Ekle
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.section>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
