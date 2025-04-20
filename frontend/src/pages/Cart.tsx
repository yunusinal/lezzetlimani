import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ChevronRight, Clock, MessageSquare, Tag, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { toast } from "sonner";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CartItem as CartItemType } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

const Cart = () => {
    const [cart, setCart] = useState<CartItemType[]>([]);
    const [couponCode, setCouponCode] = useState('');
    const [deliveryTime, setDeliveryTime] = useState<string>('asap');
    const [customDeliveryDate, setCustomDeliveryDate] = useState<Date | undefined>(new Date());
    const [customDeliveryTime, setCustomDeliveryTime] = useState<string>('12:00');
    const [orderNote, setOrderNote] = useState('');
    const [couponApplied, setCouponApplied] = useState(false);
    const [couponDiscount, setCouponDiscount] = useState(0);
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // localStorage'dan sepet verilerini yükle
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    const formatPrice = (price: number) => {
        return price.toLocaleString('tr-TR') + ' TL';
    };

    const calculateCartTotal = () => {
        return cart.reduce((total, item) => total + item.totalPrice, 0);
    };

    const removeFromCart = (itemId: string) => {
        const updatedCart = cart.filter(item => item.id !== itemId);
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const updateQuantity = (itemId: string, newQuantity: number) => {
        if (newQuantity < 1) return;

        const updatedCart = cart.map(item => {
            if (item.id === itemId) {
                return {
                    ...item,
                    quantity: newQuantity,
                    totalPrice: (item.menuItem.discountedPrice || item.menuItem.price) * newQuantity
                };
            }
            return item;
        });

        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const applyCoupon = () => {
        // Bu örnek için basit bir kupon kodu kontrolü yapıyoruz
        if (couponCode.toLowerCase() === 'yemek10') {
            const discount = calculateCartTotal() * 0.1; // %10 indirim
            setCouponDiscount(discount);
            setCouponApplied(true);
        } else {
            setCouponDiscount(0);
            setCouponApplied(false);
            alert('Geçersiz kupon kodu');
        }
    };

    const getFinalTotal = () => {
        return calculateCartTotal() - couponDiscount;
    };

    const handleCheckout = () => {
        if (!isLoggedIn) {
            toast.warning("Siparişi tamamlamak için önce giriş yapmalısınız");
            setTimeout(() => {
                navigate('/login?redirectTo=/cart');
            }, 1500);
            return;
        }

        // Sipariş detaylarını localStorage'a kaydet
        localStorage.setItem('orderDetails', JSON.stringify({
            deliveryTime: deliveryTime === 'scheduled'
                ? { date: customDeliveryDate, time: customDeliveryTime }
                : 'asap',
            orderNote,
            couponCode: couponApplied ? couponCode : '',
            couponDiscount
        }));
        
        // Checkout sayfasına yönlendir
        navigate('/checkout');
    };

    const clearCart = () => {
        if (window.confirm('Sepetinizi tamamen temizlemek istediğinize emin misiniz?')) {
            setCart([]);
            localStorage.setItem('cart', JSON.stringify([]));
            toast.success('Sepetiniz temizlendi');
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow bg-gray-50 py-8">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="mb-6 flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Sepetim</h1>
                            <p className="text-gray-600">
                                {cart.length} ürün bulundu
                            </p>
                        </div>
                        {cart.length > 0 && (
                            <Button
                                variant="ghost"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={clearCart}
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Sepeti Temizle
                            </Button>
                        )}
                    </div>

                    {cart.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Sepet Ürünleri */}
                            <div className="lg:col-span-2 space-y-4">
                                {cart.map(item => (
                                    <div key={item.id} className="bg-white rounded-lg shadow-sm p-4">
                                        <div className="flex justify-between">
                                            <div>
                                                <h3 className="font-medium">{item.menuItem.name}</h3>
                                                <p className="text-sm text-gray-600">
                                                    {formatPrice(item.menuItem.discountedPrice || item.menuItem.price)}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">{formatPrice(item.totalPrice)}</p>
                                                <div className="flex items-center justify-end mt-2">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="w-8 h-8 flex items-center justify-center border rounded-l-md hover:bg-gray-100"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="w-8 h-8 flex items-center justify-center border-t border-b">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-8 h-8 flex items-center justify-center border rounded-r-md hover:bg-gray-100"
                                                    >
                                                        +
                                                    </button>
                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="ml-4 text-red-500 hover:text-red-700"
                                                    >
                                                        Kaldır
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Sipariş Detayları */}
                                <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
                                    <h3 className="text-lg font-semibold">Sipariş Detayları</h3>

                                    {/* Teslimat Zamanı */}
                                    <Accordion type="single" collapsible className="w-full">
                                        <AccordionItem value="delivery-time">
                                            <AccordionTrigger className="py-2 text-sm font-medium">
                                                <span className="flex items-center">
                                                    <Clock className="h-4 w-4 mr-2" />
                                                    Teslimat Zamanı
                                                </span>
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <div className="space-y-3 py-2">
                                                    <div className="flex items-center">
                                                        <input
                                                            type="radio"
                                                            id="asap"
                                                            name="deliveryTime"
                                                            value="asap"
                                                            checked={deliveryTime === 'asap'}
                                                            onChange={() => setDeliveryTime('asap')}
                                                            className="mr-2"
                                                        />
                                                        <label htmlFor="asap">En kısa sürede</label>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <input
                                                            type="radio"
                                                            id="scheduled"
                                                            name="deliveryTime"
                                                            value="scheduled"
                                                            checked={deliveryTime === 'scheduled'}
                                                            onChange={() => setDeliveryTime('scheduled')}
                                                            className="mr-2"
                                                        />
                                                        <label htmlFor="scheduled">İleri bir tarih/saat seç</label>
                                                    </div>

                                                    {deliveryTime === 'scheduled' && (
                                                        <div className="flex flex-col sm:flex-row gap-3 mt-3">
                                                            <div className="flex-1">
                                                                <Popover>
                                                                    <PopoverTrigger asChild>
                                                                        <Button
                                                                            variant="outline"
                                                                            className="w-full justify-start text-left"
                                                                        >
                                                                            {customDeliveryDate ? format(customDeliveryDate, 'PPP', { locale: tr }) : "Tarih seçin"}
                                                                        </Button>
                                                                    </PopoverTrigger>
                                                                    <PopoverContent className="w-auto p-0">
                                                                        <Calendar
                                                                            mode="single"
                                                                            selected={customDeliveryDate}
                                                                            onSelect={setCustomDeliveryDate}
                                                                            initialFocus
                                                                            disabled={(date) => date < new Date()}
                                                                        />
                                                                    </PopoverContent>
                                                                </Popover>
                                                            </div>
                                                            <div className="flex-1">
                                                                <Select
                                                                    value={customDeliveryTime}
                                                                    onValueChange={setCustomDeliveryTime}
                                                                >
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Saat seçin" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {Array.from({ length: 24 }).map((_, i) => (
                                                                            <SelectItem key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                                                                                {`${i.toString().padStart(2, '0')}:00`}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>

                                    {/* Sipariş Notu */}
                                    <Accordion type="single" collapsible className="w-full">
                                        <AccordionItem value="order-note">
                                            <AccordionTrigger className="py-2 text-sm font-medium">
                                                <span className="flex items-center">
                                                    <MessageSquare className="h-4 w-4 mr-2" />
                                                    Sipariş Notu
                                                </span>
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <Textarea
                                                    placeholder="Siparişiniz için özel isteklerinizi buraya yazabilirsiniz..."
                                                    value={orderNote}
                                                    onChange={(e) => setOrderNote(e.target.value)}
                                                    className="mt-2"
                                                />
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>

                                    {/* Kupon Kodu */}
                                    <Accordion type="single" collapsible className="w-full">
                                        <AccordionItem value="coupon-code">
                                            <AccordionTrigger className="py-2 text-sm font-medium">
                                                <span className="flex items-center">
                                                    <Tag className="h-4 w-4 mr-2" />
                                                    Kupon Kodu
                                                </span>
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <div className="flex gap-2 mt-2">
                                                    <Input
                                                        placeholder="Kupon kodunuzu girin: (yemek10) "
                                                        value={couponCode}
                                                        onChange={(e) => setCouponCode(e.target.value)}
                                                        className="flex-1"
                                                        disabled={couponApplied}
                                                    />
                                                    <Button
                                                        onClick={couponApplied ? () => {
                                                            setCouponApplied(false);
                                                            setCouponDiscount(0);
                                                            setCouponCode('');
                                                        } : applyCoupon}
                                                        variant={couponApplied ? "destructive" : "default"}
                                                    >
                                                        {couponApplied ? "İptal Et" : "Uygula"}
                                                    </Button>
                                                </div>
                                                {couponApplied && (
                                                    <p className="text-green-600 text-sm mt-2">
                                                        "{couponCode}" kuponu uygulandı! {formatPrice(couponDiscount)} indirim kazandınız.
                                                    </p>
                                                )}
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                </div>
                            </div>

                            {/* Sepet Özeti */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-lg shadow-sm p-4 sticky top-24">
                                    <h3 className="text-xl font-bold mb-4">Sipariş Özeti</h3>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Ara Toplam:</span>
                                            <span>{formatPrice(calculateCartTotal())}</span>
                                        </div>
                                        {couponApplied && (
                                            <div className="flex justify-between text-sm text-green-600">
                                                <span>Kupon İndirimi:</span>
                                                <span>-{formatPrice(couponDiscount)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between text-sm">
                                            <span>Teslimat Ücreti:</span>
                                            <span>Ücretsiz</span>
                                        </div>
                                        <div className="flex justify-between font-bold mt-2 pt-2 border-t">
                                            <span>Toplam:</span>
                                            <span>{formatPrice(getFinalTotal())}</span>
                                        </div>
                                    </div>

                                    <Button 
                                        onClick={handleCheckout}
                                        className="w-full mt-4 bg-brand-red text-white hover:bg-brand-red/90"
                                    >
                                        Siparişi Tamamla
                                        <ChevronRight className="h-5 w-5 ml-1" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-2">
                                <ShoppingBag className="h-12 w-12 mx-auto" />
                            </div>
                            <h4 className="font-medium mb-1">Sepetiniz Boş</h4>
                            <p className="text-gray-500 text-sm mb-4">
                                Lütfen sepetinize ürün ekleyin
                            </p>
                            <Link to="/restaurants">
                                <Button className="bg-brand-red text-white hover:bg-brand-red/90">
                                    Restoranları Keşfet
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Cart; 