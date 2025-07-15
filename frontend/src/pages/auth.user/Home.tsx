import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Clock,
  Star,
  ArrowRight,
  Smartphone,
  Play,
  Apple,
  Truck,
  CreditCard,
  Zap,
  Gift,
  ChevronRight,
  Users,
  Utensils,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

const Home = () => {
  const { isAuthenticated } = useAuth();

  const foodCategories = [
    {
      name: "Pizza",
      emoji: "🍕",
      color: "from-red-400 to-red-600",
      orders: "2.5K+",
    },
    {
      name: "Burger",
      emoji: "🍔",
      color: "from-yellow-400 to-orange-500",
      orders: "1.8K+",
    },
    {
      name: "Sushi",
      emoji: "🍣",
      color: "from-blue-400 to-blue-600",
      orders: "900+",
    },
    {
      name: "Döner",
      emoji: "🥙",
      color: "from-green-400 to-green-600",
      orders: "3.2K+",
    },
    {
      name: "Tatlı",
      emoji: "🍰",
      color: "from-pink-400 to-pink-600",
      orders: "1.1K+",
    },
    {
      name: "Kahve",
      emoji: "☕",
      color: "from-amber-600 to-brown-700",
      orders: "2.8K+",
    },
    {
      name: "Çin Yemeği",
      emoji: "🥡",
      color: "from-purple-400 to-purple-600",
      orders: "750+",
    },
    {
      name: "Türk Mutfağı",
      emoji: "🍖",
      color: "from-orange-400 to-red-500",
      orders: "4.1K+",
    },
  ];

  const featuredRestaurants = [
    {
      name: "Adana Sofrası",
      cuisine: "Türk Mutfağı",
      rating: 4.8,
      deliveryTime: "20-30 dk",
      deliveryFee: "Ücretsiz",
      image: "🥘",
      promo: "İlk sipariş %20 indirim",
      minOrder: "₺40",
    },
    {
      name: "Pizza Palace",
      cuisine: "İtalyan",
      rating: 4.6,
      deliveryTime: "25-35 dk",
      deliveryFee: "₺4.99",
      image: "🍕",
      promo: "2. pizza %50 indirim",
      minOrder: "₺50",
    },
    {
      name: "Burger House",
      cuisine: "Fast Food",
      rating: 4.7,
      deliveryTime: "15-25 dk",
      deliveryFee: "Ücretsiz",
      image: "🍔",
      promo: "Combo menü indirim",
      minOrder: "₺35",
    },
  ];

  const promotions = [
    {
      title: "İlk Siparişte %25 İndirim",
      subtitle: "Yeni üyelere özel fırsat",
      code: "HOSGELDIN25",
      color: "from-primary to-blue-600",
      icon: "🎉",
    },
    {
      title: "100₺ ve Üzeri Ücretsiz Teslimat",
      subtitle: "Haftanın her günü geçerli",
      code: "BEDAVATESLIMAT",
      color: "from-green-500 to-emerald-600",
      icon: "🚚",
    },
    {
      title: "Hafta Sonu %15 İndirim",
      subtitle: "Cumartesi & Pazar özel",
      code: "HAFTASONU15",
      color: "from-purple-500 to-pink-600",
      icon: "🎊",
    },
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Konumunuzu Seçin",
      description: "Adresinizi girin veya mevcut konumunuzu kullanın",
      icon: MapPin,
      color: "bg-primary",
    },
    {
      step: "2",
      title: "Restoran Seçin",
      description: "Binlerce restoran arasından favorinizi bulun",
      icon: Utensils,
      color: "bg-secondary",
    },
    {
      step: "3",
      title: "Sipariş Verin",
      description: "Sepetinizi oluşturun ve güvenle ödeme yapın",
      icon: CreditCard,
      color: "bg-accent",
    },
    {
      step: "4",
      title: "Lezzetin Tadını Çıkarın",
      description: "Siparişiniz ortalama 25 dakikada kapınızda",
      icon: Zap,
      color: "bg-success",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Food Delivery Style */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 pt-8 pb-16">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div>
                <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                  🍽️ Türkiye'nin #1 Yemek Teslimat Uygulaması
                </Badge>

                <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-4">
                  Lezzetin En
                  <span className="text-primary"> Hızlı </span>
                  Adresi
                </h1>

                <p className="text-lg text-muted-foreground mb-6">
                  Binlerce restoran, anlık teslimat. En sevdiğin yemekleri
                  dakikalar içinde kapında!
                </p>
              </div>

              {/* Location Search */}
              <div className="bg-card rounded-2xl p-6 border border-border shadow-lg">
                <h3 className="font-semibold text-foreground mb-4 flex items-center">
                  <MapPin className="h-5 w-5 text-primary mr-2" />
                  Teslimat adresinizi girin
                </h3>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      placeholder="Örn: Kadıköy, İstanbul"
                      className="pl-4 py-3 text-base rounded-xl"
                    />
                  </div>
                  <Button className="btn-primary px-6 py-3 rounded-xl">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  📍 Mevcut konumu kullan
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: Clock, value: "18 dk", label: "Ort. teslimat" },
                  { icon: Users, value: "50K+", label: "Mutlu müşteri" },
                  { icon: Utensils, value: "1200+", label: "Restoran" },
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <stat.icon className="h-6 w-6 text-primary mx-auto mb-2" />
                    <div className="font-bold text-foreground">
                      {stat.value}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to={isAuthenticated ? "/restaurants" : "/register"}
                  className="flex-1"
                >
                  <Button className="w-full btn-primary py-3 text-base font-semibold rounded-xl">
                    <Utensils className="mr-2 h-5 w-5" />
                    {isAuthenticated
                      ? "Restoranları Keşfet"
                      : "Sipariş Vermeye Başla"}
                  </Button>
                </Link>
                {!isAuthenticated && (
                  <Link to="/login" className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full py-3 text-base font-semibold rounded-xl"
                    >
                      Giriş Yap
                    </Button>
                  </Link>
                )}
              </div>
            </motion.div>

            {/* Right Visual */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl p-8 text-center">
                <div className="text-8xl mb-4">🍽️</div>
                <div className="text-2xl font-bold text-foreground mb-2">
                  1200+ Restoran
                </div>
                <div className="text-muted-foreground">
                  Her lezzet bir tık uzağında
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-success text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl animate-bounce">
                🚚
              </div>
              <div className="absolute -bottom-4 -left-4 bg-accent text-white rounded-full w-12 h-12 flex items-center justify-center text-xl animate-pulse">
                ⚡
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Food Categories */}
      <section className="py-16 bg-background">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Kategorilere Göz At
            </h2>
            <p className="text-muted-foreground">
              En popüler lezzetleri keşfet
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {foodCategories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link to="/restaurants">
                  <Card className="hover-lift cursor-pointer group h-full border-border bg-card shadow-sm hover:shadow-md">
                    <CardContent className="p-4 text-center">
                      <div
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center text-2xl mb-3 mx-auto group-hover:scale-110 transition-transform duration-300`}
                      >
                        {category.emoji}
                      </div>
                      <h3 className="font-medium text-foreground text-sm mb-1">
                        {category.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {category.orders} sipariş
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Promotions */}
      <section className="py-16 bg-muted/20">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Özel Kampanyalar
            </h2>
            <p className="text-muted-foreground">Kaçırılmayacak fırsatlar</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {promotions.map((promo, index) => (
              <motion.div
                key={promo.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card
                  className={`overflow-hidden border-0 bg-gradient-to-br ${promo.color} text-white hover-lift cursor-pointer group`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-3xl">{promo.icon}</div>
                      <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{promo.title}</h3>
                    <p className="text-white/90 text-sm mb-4">
                      {promo.subtitle}
                    </p>
                    <div className="bg-white/20 rounded-lg px-3 py-2 text-center">
                      <span className="text-xs font-semibold">
                        Kod: {promo.code}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="py-16 bg-background">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Öne Çıkan Restoranlar
              </h2>
              <p className="text-muted-foreground">En popüler seçimler</p>
            </div>
            <Link to="/restaurants">
              <Button variant="outline" className="flex items-center">
                Tümünü Gör
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredRestaurants.map((restaurant, index) => (
              <motion.div
                key={restaurant.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link to="/restaurants">
                  <Card className="restaurant-card group border-border bg-card shadow-sm hover:shadow-lg">
                    <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-6xl rounded-t-xl">
                      {restaurant.image}
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                            {restaurant.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {restaurant.cuisine}
                          </p>
                        </div>
                        <div className="flex items-center bg-primary/10 rounded-lg px-2 py-1">
                          <Star className="h-3 w-3 text-primary fill-current mr-1" />
                          <span className="text-sm font-semibold text-primary">
                            {restaurant.rating}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {restaurant.deliveryTime}
                          </span>
                          <span className="text-muted-foreground flex items-center">
                            <Truck className="h-3 w-3 mr-1" />
                            {restaurant.deliveryFee}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            Min. sipariş: {restaurant.minOrder}
                          </span>
                        </div>
                      </div>

                      {restaurant.promo && (
                        <Badge className="bg-secondary/10 text-secondary border-secondary/20">
                          <Gift className="h-3 w-3 mr-1" />
                          {restaurant.promo}
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Nasıl Çalışır?
            </h2>
            <p className="text-muted-foreground text-lg">
              4 basit adımda lezzetin tadını çıkarın
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center"
              >
                <div
                  className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6`}
                >
                  {step.step}
                </div>
                <step.icon className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="font-bold text-foreground text-lg mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Download App Section */}
      <section className="py-16 bg-background">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-primary to-secondary rounded-3xl p-8 md:p-12 text-white text-center"
          >
            <div className="max-w-2xl mx-auto">
              <Smartphone className="h-16 w-16 mx-auto mb-6 opacity-90" />
              <h2 className="text-3xl font-bold mb-4">
                Mobil Uygulamayı İndir
              </h2>
              <p className="text-xl mb-8 opacity-95">
                Daha hızlı sipariş, özel indirimler ve anlık bildirimler için
                mobil uygulamamızı indirin!
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button className="bg-black text-white hover:bg-gray-800 flex items-center px-6 py-3 rounded-xl">
                  <Apple className="mr-2 h-5 w-5" />
                  <div className="text-left">
                    <div className="text-xs">Download on the</div>
                    <div className="font-semibold">App Store</div>
                  </div>
                </Button>
                <Button className="bg-black text-white hover:bg-gray-800 flex items-center px-6 py-3 rounded-xl">
                  <Play className="mr-2 h-5 w-5" />
                  <div className="text-left">
                    <div className="text-xs">Get it on</div>
                    <div className="font-semibold">Google Play</div>
                  </div>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      {!isAuthenticated && (
        <section className="py-16 bg-muted/20">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Hemen Başla!
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Ücretsiz hesap oluştur ve lezzetli yemeklerin tadını çıkarmaya
                başla. İlk siparişinde{" "}
                <span className="font-bold text-primary">%25 indirim</span> seni
                bekliyor!
              </p>
              <Link to="/register">
                <Button className="btn-primary text-lg px-8 py-3 shadow-lg">
                  <ArrowRight className="mr-2 h-5 w-5" />
                  Ücretsiz Kayıt Ol
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
