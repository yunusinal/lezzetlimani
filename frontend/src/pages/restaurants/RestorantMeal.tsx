import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  Star,
  MapPin,
  Plus,
  Minus,
  ShoppingCart,
  Heart,
  Info,
  Truck,
  Award,
  AlertTriangle,
  Trash2,
  LogIn,
} from "lucide-react";
import api from "../../api/axios";
import { useCart } from "../../context/CartContext";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";

type Meal = {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  restaurant_id: string;
};

type ApiResponse = {
  data: Meal[];
};

export default function RestaurantMealsPage() {
  const { id: restaurantId } = useParams();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const {
    addToCart,
    items,
    updateQuantity,
    error,
    clearError,
    clearCartAndAddMeal,
  } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMeals = async () => {
      if (restaurantId) {
        setLoading(true);
        try {
          const res = await api.get<ApiResponse>(
            `/meals/restaurant/${restaurantId}`
          );
          if (res.data && Array.isArray(res.data)) {
            setMeals(res.data);
          } else if (res.data && Array.isArray(res.data.data)) {
            setMeals(res.data.data);
          } else {
            setMeals([]);
          }
        } catch (error) {
          setMeals([]);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMeals();
  }, [restaurantId]);

  const cartItemsForRestaurant = items.filter(
    (item) => item.restaurant_id === restaurantId
  );
  const cartItemCount = cartItemsForRestaurant.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const cartTotal = cartItemsForRestaurant.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const getItemQuantity = (mealId: string): number => {
    const cartItem = items.find((item) => item.id === mealId);
    return cartItem ? cartItem.quantity : 0;
  };

  const handleAddToCart = (meal: Meal) => {
    addToCart(meal);
  };

  const handleUpdateQuantity = (mealId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      updateQuantity(mealId, 0);
    } else {
      updateQuantity(mealId, newQuantity);
    }
  };

  const handleClearCartAndAdd = () => {
    if (error?.pendingMeal) {
      clearCartAndAddMeal(error.pendingMeal);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="section-container py-8 space-y-8">
          <Skeleton className="h-64 w-full rounded-3xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-48 w-full rounded-2xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Restaurant Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border-b border-border"
      >
        <div className="section-container py-8">
          {/* Back Navigation */}
          <div className="mb-6">
            <Link
              to="/dashboard"
              className="inline-flex items-center space-x-2 text-muted-foreground hover:text-primary 
                        transition-colors duration-200 group"
            >
              <ArrowLeft
                size={18}
                className="group-hover:-translate-x-1 transition-transform duration-200"
              />
              <span>Restoranlar</span>
            </Link>
          </div>

          {/* Restaurant Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-start gap-4 mb-6">
                <div
                  className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl 
                               flex items-center justify-center text-white text-3xl shadow-lg"
                >
                  🍽️
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    Lezzet Restaurant
                  </h1>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-accent fill-current" />
                      <span className="font-medium">4.8</span>
                      <span>(324 değerlendirme)</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin size={14} />
                      <span>Kadıköy, İstanbul</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Geleneksel Türk mutfağından modern füzyon lezzetlerine, taze
                    malzemelerle özenle hazırlanmış yemekler.
                  </p>
                </div>
              </div>

              {/* Restaurant Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-primary/10 rounded-2xl p-4 text-center">
                  <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
                  <div className="text-sm font-medium text-foreground">
                    20-30 dk
                  </div>
                  <div className="text-xs text-muted-foreground">Teslimat</div>
                </div>
                <div className="bg-success/10 rounded-2xl p-4 text-center">
                  <Truck className="h-6 w-6 text-success mx-auto mb-2" />
                  <div className="text-sm font-medium text-foreground">
                    Ücretsiz
                  </div>
                  <div className="text-xs text-muted-foreground">Min 75₺</div>
                </div>
                <div className="bg-accent/10 rounded-2xl p-4 text-center">
                  <Award className="h-6 w-6 text-accent-600 mx-auto mb-2" />
                  <div className="text-sm font-medium text-foreground">
                    Premium
                  </div>
                  <div className="text-xs text-muted-foreground">Restoran</div>
                </div>
                <div className="bg-secondary/10 rounded-2xl p-4 text-center">
                  <Heart className="h-6 w-6 text-secondary mx-auto mb-2" />
                  <div className="text-sm font-medium text-foreground">%95</div>
                  <div className="text-xs text-muted-foreground">Beğeni</div>
                </div>
              </div>
            </div>

            {/* Restaurant Image */}
            <div className="lg:col-span-1">
              <div
                className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 
                             rounded-3xl flex items-center justify-center"
              >
                <div className="text-8xl opacity-60">🍽️</div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <div className="section-container py-8">
        {meals.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <Card className="max-w-md mx-auto border-border bg-card">
              <CardContent className="p-12 text-center">
                <div className="w-24 h-24 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Info className="h-12 w-12 text-muted-foreground" />
                </div>
                <CardTitle className="text-xl mb-2 text-foreground">
                  Menü Hazırlanıyor
                </CardTitle>
                <CardDescription className="mb-6">
                  Bu restoran için menü henüz hazırlanıyor. Lütfen daha sonra
                  tekrar kontrol edin.
                </CardDescription>
                <Link to="/dashboard">
                  <Button>
                    <ArrowLeft size={16} className="mr-2" />
                    Diğer Restoranları Keşfet
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <>
            {/* Menu Header */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    Menümüz
                  </h2>
                  <p className="text-muted-foreground">
                    Taze ve lezzetli seçeneklerimizi keşfedin
                  </p>
                </div>
                <Badge className="badge-primary text-sm">
                  {meals.length} yemek
                </Badge>
              </div>
            </motion.section>

            {/* Meals Grid */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
                {meals.map((meal, index) => {
                  const quantity = getItemQuantity(meal.id);

                  return (
                    <motion.div
                      key={meal.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      <Card className="food-card group border-border bg-card shadow-sm hover:shadow-lg">
                        {/* Meal Image */}
                        <div className="food-card-image">
                          {meal.image_url ? (
                            <img
                              src={meal.image_url}
                              alt={meal.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div
                              className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 
                                           flex items-center justify-center"
                            >
                              <span className="text-6xl opacity-60">🍽️</span>
                            </div>
                          )}
                        </div>

                        {/* Meal Content */}
                        <CardContent className="p-6">
                          <CardTitle className="text-lg mb-2 line-clamp-1 text-foreground">
                            {meal.name}
                          </CardTitle>
                          <CardDescription className="mb-4 line-clamp-2">
                            {meal.description ||
                              "Taze malzemelerle özenle hazırlanmış lezzetli yemek."}
                          </CardDescription>

                          <div className="flex items-center justify-between">
                            <div className="text-xl font-bold text-primary">
                              ₺{meal.price}
                            </div>

                            {quantity === 0 ? (
                              <Button
                                onClick={() => handleAddToCart(meal)}
                                className="btn-primary"
                                size="sm"
                              >
                                <Plus size={16} className="mr-1" />
                                Ekle
                              </Button>
                            ) : (
                              <div className="flex items-center space-x-3">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() =>
                                    handleUpdateQuantity(meal.id, quantity - 1)
                                  }
                                >
                                  <Minus size={14} />
                                </Button>
                                <span className="font-semibold text-lg min-w-[2rem] text-center text-foreground">
                                  {quantity}
                                </span>
                                <Button
                                  size="icon"
                                  className="h-8 w-8 btn-primary"
                                  onClick={() =>
                                    handleUpdateQuantity(meal.id, quantity + 1)
                                  }
                                >
                                  <Plus size={14} />
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>
          </>
        )}
      </div>

      {/* Floating Cart Button */}
      <AnimatePresence>
        {cartItemCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-6 left-4 right-4 z-50 md:left-auto md:right-6 md:w-auto"
          >
            <Link to={`/restaurants/${restaurantId}/order`}>
              <Button
                className="w-full md:w-auto bg-gradient-to-r from-primary to-secondary 
                          text-white font-semibold py-4 px-6 rounded-2xl shadow-2xl 
                          hover:shadow-primary-glow transition-all duration-300 group"
                size="lg"
              >
                <div className="flex items-center justify-between w-full md:w-auto">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white/20 p-2 rounded-xl">
                      <ShoppingCart size={20} />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">Sepetim</div>
                      <div className="text-sm opacity-90">
                        {cartItemCount} ürün
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-6">
                    <div className="font-bold text-lg">
                      ₺{cartTotal.toFixed(2)}
                    </div>
                    <div className="text-xs opacity-90">Toplam</div>
                  </div>
                </div>
              </Button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Different Restaurant Dialog */}
      <Dialog
        open={error?.type === "different_restaurant"}
        onOpenChange={clearError}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold text-foreground">
                  Farklı Restoran Uyarısı
                </DialogTitle>
              </div>
            </div>
            <DialogDescription className="text-muted-foreground leading-relaxed">
              Sepetinizde başka bir restorandan ürünler bulunuyor. Yeni ürün
              eklemek için mevcut sepeti temizlemeniz gerekiyor.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-muted/20 rounded-lg p-4 my-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Trash2 size={16} />
              <span>
                Bu işlem mevcut sepetinizdeki tüm ürünleri silecektir.
              </span>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={clearError}
              className="w-full sm:w-auto"
            >
              İptal Et
            </Button>
            <Button
              onClick={handleClearCartAndAdd}
              className="btn-secondary w-full sm:w-auto"
            >
              <Trash2 size={16} className="mr-2" />
              Sepeti Temizle ve Ekle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Login Required Dialog */}
      <Dialog open={error?.type === "login_required"} onOpenChange={clearError}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                <LogIn className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold text-foreground">
                  Giriş Yapmanız Gerekiyor
                </DialogTitle>
              </div>
            </div>
            <DialogDescription className="text-muted-foreground leading-relaxed">
              Bu işlemi tamamlamak için lütfen giriş yapın.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-muted/20 rounded-lg p-4 my-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>
                Giriş yapmak için
                <Link to="/login" className="text-primary ml-2">
                  buraya tıklayın
                </Link>
              </span>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={clearError}
              className="w-full sm:w-auto"
            >
              İptal Et
            </Button>
            <Button
              onClick={() => navigate("/login")}
              className="btn-secondary w-full sm:w-auto"
            >
              <LogIn className="mr-2" />
              Giriş Yap
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
