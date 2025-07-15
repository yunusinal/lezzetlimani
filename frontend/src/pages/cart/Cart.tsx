import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  Clock,
  Gift,
  CreditCard,
  MapPin,
  Truck,
  Tag,
  Calendar,
  MessageSquare,
  CheckCircle,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { checkoutOrder } from "../../api/cart/cart";
import type { OrderCreate, OrderResponse } from "../../types";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../hooks/useNotifications";
import { showSuccessNotification, showErrorNotification } from "../../components/ui/notification-container";

export default function CartPage() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    updateNote,
    updateSchedule,
    clearCart,
  } = useCart();
  const { id: restaurantId } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useNotifications();
  const userId = user?.id || "test-user";
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<
    "credit_card" | "cash" | "pos"
  >("credit_card");
  const [orderResult, setOrderResult] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const deliveryFee = subtotal >= 75 ? 0 : 9.9;
  const discount = appliedCoupon ? subtotal * 0.1 : 0; // 10% discount
  const total = subtotal + deliveryFee - discount;
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleApplyCoupon = () => {
    if (couponCode.toLowerCase() === "lezzet10") {
      setAppliedCoupon(couponCode);
      setCouponCode("");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      showToast.error("Sipariş verebilmek için giriş yapmalısınız.");
      showErrorNotification("Giriş Gerekli", "Sipariş verebilmek için giriş yapmalısınız.");
      return;
    }
    setLoading(true);
    setOrderResult(null);
    try {
      const order: OrderCreate = {
        user_id: userId,
        restaurant_id: restaurantId || "test-restaurant",
        items: items.map((item) => ({
          meal_id: item.id,
          quantity: item.quantity,
          note: item.note,
        })),
        payment_method: paymentMethod,
        coupon_code: appliedCoupon || undefined,
      };
      const result = await checkoutOrder(order);
      setOrderResult(result);
      if (result && result.id) {
        await clearCart();
        showToast.success("Siparişiniz başarıyla oluşturuldu!");
        showSuccessNotification("Sipariş Oluşturuldu", `Sipariş numaranız: #${result.id}`);
      }
    } catch (e) {
      setOrderResult({
        id: 0,
        user_id: "",
        restaurant_id: "",
        items: [],
        subtotal: 0,
        discount: 0,
        total: 0,
        payment_method: paymentMethod,
        created_at: new Date().toISOString(),
        message: "Sipariş oluşturulamadı!",
      });
      showToast.error("Sipariş oluşturulamadı!");
      showErrorNotification("Sipariş Hatası", "Sipariş oluşturulamadı. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Cart Header */}
      <section className="bg-card border-b border-border">
        <div className="section-container py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to={
                  restaurantId ? `/restaurants/${restaurantId}` : "/dashboard"
                }
                className="inline-flex items-center space-x-2 text-muted-foreground hover:text-primary 
                          transition-colors duration-200 group"
              >
                <ArrowLeft
                  size={18}
                  className="group-hover:-translate-x-1 transition-transform duration-200"
                />
                <span>Geri Dön</span>
              </Link>
              <div className="flex items-center space-x-3">
                <div
                  className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl 
                               flex items-center justify-center text-white"
                >
                  <ShoppingCart size={20} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    Sepetim
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {itemCount} ürün
                  </p>
                </div>
              </div>
            </div>
            {items.length > 0 && (
              <Badge className="badge-primary hidden sm:flex">
                Toplam: ₺{total.toFixed(2)}
              </Badge>
            )}
          </div>
        </div>
      </section>

      <div className="section-container py-8">
        {items.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <Card className="max-w-md mx-auto border-border bg-card">
              <CardContent className="p-12 text-center">
                <div className="w-24 h-24 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground" />
                </div>
                <CardTitle className="text-xl mb-2 text-foreground">
                  Sepetiniz Boş
                </CardTitle>
                <CardDescription className="mb-6">
                  Henüz sepetinize ürün eklemediniz. Restoranları keşfedin ve
                  lezzetli yemekleri sepetinize ekleyin!
                </CardDescription>
                <Link to="/dashboard">
                  <Button size="lg" className="btn-primary">
                    <ArrowLeft size={16} className="mr-2" />
                    Restoranları Keşfet
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Items List */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-foreground">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    <span>Sipariş Detayları</span>
                  </CardTitle>
                  <CardDescription>
                    Ürünlerinizi gözden geçirin ve özel notlarınızı ekleyin
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <AnimatePresence>
                    {items.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-muted/5 rounded-2xl p-6 border border-border 
                                   hover:border-primary/30 transition-all duration-200"
                      >
                        <div className="flex flex-col space-y-4">
                          {/* Item Header */}
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-semibold text-foreground text-lg mb-1">
                                {item.name}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                ₺{item.price} × {item.quantity}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-xl text-primary">
                                ₺{(item.quantity * item.price).toFixed(2)}
                              </p>
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <span className="text-sm font-medium text-foreground">
                                Adet:
                              </span>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() =>
                                    updateQuantity(item.id, item.quantity - 1)
                                  }
                                >
                                  <Minus size={14} />
                                </Button>
                                <span className="w-8 text-center font-semibold text-foreground">
                                  {item.quantity}
                                </span>
                                <Button
                                  size="icon"
                                  className="h-8 w-8 btn-primary"
                                  onClick={() =>
                                    updateQuantity(item.id, item.quantity + 1)
                                  }
                                >
                                  <Plus size={14} />
                                </Button>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromCart(item.id)}
                              className="text-secondary hover:text-secondary hover:bg-secondary/10"
                            >
                              <Trash2 size={16} className="mr-1" />
                              Sil
                            </Button>
                          </div>

                          {/* Notes Section */}
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-foreground mb-2">
                                <MessageSquare
                                  size={14}
                                  className="inline mr-1"
                                />
                                Sipariş Notu (Opsiyonel)
                              </label>
                              <Input
                                placeholder="Örn: Soğansız olsun, az baharatlı..."
                                value={item.note || ""}
                                onChange={(e) =>
                                  updateNote(item.id, e.target.value)
                                }
                                className="text-sm"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-foreground mb-2">
                                <Calendar size={14} className="inline mr-1" />
                                Teslimat Zamanı (Opsiyonel)
                              </label>
                              <Input
                                type="datetime-local"
                                value={
                                  item.schedule_date
                                    ? new Date(item.schedule_date)
                                        .toISOString()
                                        .slice(0, 16)
                                    : ""
                                }
                                onChange={(e) =>
                                  updateSchedule(
                                    item.id,
                                    new Date(e.target.value).toISOString()
                                  )
                                }
                                className="text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </CardContent>
              </Card>

              {/* Coupon Section */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-foreground">
                    <Tag className="h-5 w-5 text-accent" />
                    <span>İndirim Kuponu</span>
                  </CardTitle>
                  <CardDescription>
                    Varsa indirim kuponunuzu kullanın
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!appliedCoupon ? (
                    <div className="flex gap-3">
                      <Input
                        placeholder="Kupon kodunu girin"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1"
                      />
                      <Button onClick={handleApplyCoupon} variant="outline">
                        Uygula
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-4 bg-success/10 border border-success/20 rounded-xl">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-success" />
                        <span className="font-medium text-success">
                          {appliedCoupon} kuponu uygulandı
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveCoupon}
                        className="text-success hover:text-success"
                      >
                        Kaldır
                      </Button>
                    </div>
                  )}
                  <div className="mt-3 text-xs text-muted-foreground">
                    💡 İpucu: "LEZZET10" kodunu deneyin!
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Summary Card */}
                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-foreground">
                      <CreditCard className="h-5 w-5 text-primary" />
                      <span>Sipariş Özeti</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Ara Toplam
                        </span>
                        <span className="font-medium text-foreground">
                          ₺{subtotal.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Teslimat Ücreti
                        </span>
                        <span
                          className={`font-medium ${
                            deliveryFee === 0
                              ? "text-success"
                              : "text-foreground"
                          }`}
                        >
                          {deliveryFee === 0
                            ? "Ücretsiz"
                            : `₺${deliveryFee.toFixed(2)}`}
                        </span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">İndirim</span>
                          <span className="font-medium text-success">
                            -₺{discount.toFixed(2)}
                          </span>
                        </div>
                      )}
                      <hr className="border-border" />
                      <div className="flex justify-between text-lg font-bold">
                        <span className="text-foreground">Toplam</span>
                        <span className="text-primary">
                          ₺{total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <Button
                      className="w-full btn-primary"
                      size="lg"
                      onClick={handleCheckout}
                      disabled={loading || !isAuthenticated}
                    >
                      <CreditCard size={18} className="mr-2" />
                      {loading ? "Sipariş Gönderiliyor..." : "Siparişi Tamamla"}
                    </Button>

                    {/* Delivery Info */}
                    <div className="space-y-3 pt-4">
                      <div className="flex items-center space-x-3 p-3 bg-primary/10 rounded-xl">
                        <Clock className="h-5 w-5 text-primary" />
                        <div className="text-sm">
                          <div className="font-medium text-foreground">
                            20-30 dakika
                          </div>
                          <div className="text-muted-foreground">
                            Tahmini teslimat
                          </div>
                        </div>
                      </div>

                      {deliveryFee > 0 && (
                        <div className="flex items-center space-x-3 p-3 bg-accent/10 rounded-xl">
                          <Truck className="h-5 w-5 text-accent-600" />
                          <div className="text-sm">
                            <div className="font-medium text-foreground">
                              ₺{(75 - subtotal).toFixed(2)} daha ekleyin
                            </div>
                            <div className="text-muted-foreground">
                              Ücretsiz teslimat için
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Methods */}
                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle className="text-lg text-foreground">
                      Ödeme Seçenekleri
                    </CardTitle>
                    <CardDescription>Güvenli ödeme yöntemleri</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-3">
                      <label
                        className={`p-3 border rounded-xl text-center cursor-pointer ${
                          paymentMethod === "credit_card"
                            ? "border-primary"
                            : "border-border"
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value="credit_card"
                          checked={paymentMethod === "credit_card"}
                          onChange={() => setPaymentMethod("credit_card")}
                          className="hidden"
                        />
                        <CreditCard className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                        <div className="text-xs font-medium text-foreground">
                          Kredi Kartı
                        </div>
                      </label>
                      <label
                        className={`p-3 border rounded-xl text-center cursor-pointer ${
                          paymentMethod === "cash"
                            ? "border-primary"
                            : "border-border"
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value="cash"
                          checked={paymentMethod === "cash"}
                          onChange={() => setPaymentMethod("cash")}
                          className="hidden"
                        />
                        <Gift className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                        <div className="text-xs font-medium text-foreground">
                          Nakit
                        </div>
                      </label>
                      <label
                        className={`p-3 border rounded-xl text-center cursor-pointer ${
                          paymentMethod === "pos"
                            ? "border-primary"
                            : "border-border"
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value="pos"
                          checked={paymentMethod === "pos"}
                          onChange={() => setPaymentMethod("pos")}
                          className="hidden"
                        />
                        <Gift className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                        <div className="text-xs font-medium text-foreground">
                          Kapıda POS
                        </div>
                      </label>
                    </div>
                  </CardContent>
                </Card>

                {/* Address Info */}
                <Card className="border-border bg-card">
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-primary mt-0.5" />
                      <div className="text-sm">
                        <div className="font-medium text-foreground mb-1">
                          Teslimat Adresi
                        </div>
                        <div className="text-muted-foreground">
                          Varsayılan adresinize teslim edilecek
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>

      {orderResult && (
        <Card className="border mt-4">
          <CardContent>
            <div className="text-lg font-bold mb-2">{orderResult.message}</div>
            <div>Toplam: ₺{orderResult.total.toFixed(2)}</div>
            {orderResult.discount > 0 && (
              <div>İndirim: ₺{orderResult.discount.toFixed(2)}</div>
            )}
            <div>Ödeme Yöntemi: {orderResult.payment_method}</div>
            {orderResult.coupon_code && (
              <div>Kupon: {orderResult.coupon_code}</div>
            )}
            <div>
              Sipariş Tarihi:{" "}
              {new Date(orderResult.created_at).toLocaleString()}
            </div>
            <div className="mt-2">
              <b>Ürünler:</b>
              <ul className="list-disc ml-5">
                {orderResult.items.map((item, i) => (
                  <li key={i}>
                    {item.meal_id} × {item.quantity}{" "}
                    {item.note && `- Not: ${item.note}`}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
