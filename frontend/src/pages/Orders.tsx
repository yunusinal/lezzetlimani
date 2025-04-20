import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Home, MapPin, Package, LogOut, ExternalLink, Info, ShoppingBag } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from "@/contexts/AuthContext";
import { Link } from 'react-router-dom';
import { Order } from '@/types';

// Sidebar bileşeni
const Sidebar = ({ activeTab }: { activeTab: string }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
        toast.success('Başarıyla çıkış yaptınız');
    };

    return (
        <div className="w-full md:w-64 mb-6 md:mb-0">
            <Card>
                <CardContent className="p-4">
                    <nav className="flex flex-col space-y-1">
                        <Link
                            to="/profile"
                            className={`flex items-center px-4 py-2 rounded-md hover:bg-gray-100 transition-colors ${activeTab === 'profile' ? 'bg-gray-100 font-medium' : ''
                                }`}
                        >
                            <Home className="h-5 w-5 mr-3 text-gray-600" />
                            <span>Profilim</span>
                        </Link>
                        <Link
                            to="/addresses"
                            className={`flex items-center px-4 py-2 rounded-md hover:bg-gray-100 transition-colors ${activeTab === 'addresses' ? 'bg-gray-100 font-medium' : ''
                                }`}
                        >
                            <MapPin className="h-5 w-5 mr-3 text-gray-600" />
                            <span>Adreslerim</span>
                        </Link>
                        <Link
                            to="/orders"
                            className={`flex items-center px-4 py-2 rounded-md hover:bg-gray-100 transition-colors ${activeTab === 'orders' ? 'bg-gray-100 font-medium' : ''
                                }`}
                        >
                            <Package className="h-5 w-5 mr-3 text-gray-600" />
                            <span>Siparişlerim</span>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex items-center px-4 py-2 rounded-md hover:bg-red-50 text-red-600 transition-colors"
                        >
                            <LogOut className="h-5 w-5 mr-3" />
                            <span>Çıkış Yap</span>
                        </button>
                    </nav>
                </CardContent>
            </Card>
        </div>
    );
};

// OrderStatus bileşeni
const OrderStatus = ({ status }: { status: string }) => {
    let color = "";
    let label = "";

    switch (status) {
        case "processing":
            color = "bg-yellow-100 text-yellow-800";
            label = "Hazırlanıyor";
            break;
        case "shipped":
            color = "bg-blue-100 text-blue-800";
            label = "Yolda";
            break;
        case "delivered":
            color = "bg-green-100 text-green-800";
            label = "Teslim Edildi";
            break;
        case "cancelled":
            color = "bg-red-100 text-red-800";
            label = "İptal Edildi";
            break;
        default:
            color = "bg-gray-100 text-gray-800";
            label = "Beklemede";
    }

    return (
        <Badge variant="outline" className={`${color} border-none`}>
            {label}
        </Badge>
    );
};

// OrderDetails bileşeni
const OrderDetails = ({ order }: { order: Order }) => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-medium">Sipariş #{order.id.slice(-6)}</h3>
                    <p className="text-sm text-gray-500">
                        {new Date(order.date).toLocaleDateString('tr-TR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </p>
                </div>
                <OrderStatus status={order.status} />
            </div>

            <div className="space-y-1">
                <h4 className="font-medium">Teslimat Adresi</h4>
                <p className="text-sm text-gray-700">{order.deliveryAddress.fullAddress}</p>
                <p className="text-sm text-gray-500">
                    {order.deliveryAddress.district}, {order.deliveryAddress.city}, {order.deliveryAddress.postalCode}
                </p>
            </div>

            <div>
                <h4 className="font-medium mb-3">Sipariş Özeti</h4>
                <div className="space-y-3">
                    {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                            <div className="flex items-center">
                                <div className="h-12 w-12 rounded-md bg-gray-100 flex items-center justify-center mr-3">
                                    <ShoppingBag className="h-6 w-6 text-gray-500" />
                                </div>
                                <div>
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-sm text-gray-500">
                                        {item.quantity} x {item.price.toFixed(2)} ₺
                                    </p>
                                </div>
                            </div>
                            <p className="font-medium">{(item.quantity * item.price).toFixed(2)} ₺</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                    <p className="text-gray-600">Ara Toplam</p>
                    <p>{order.subtotal.toFixed(2)} ₺</p>
                </div>
                <div className="flex justify-between">
                    <p className="text-gray-600">Teslimat Ücreti</p>
                    <p>{order.deliveryFee.toFixed(2)} ₺</p>
                </div>
                <div className="flex justify-between font-medium">
                    <p>Toplam</p>
                    <p>{order.total.toFixed(2)} ₺</p>
                </div>
            </div>

            <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <Info className="h-4 w-4 text-gray-500 mr-2" />
                        <p className="text-sm text-gray-500">Ödeme Yöntemi</p>
                    </div>
                    <p className="text-sm font-medium">{order.paymentMethod}</p>
                </div>
            </div>
        </div>
    );
};

const Orders = () => {
    const { currentUser } = useAuth();
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <h1 className="text-2xl font-bold mb-6">Hesabım</h1>

                    <div className="flex flex-col md:flex-row gap-6">
                        <Sidebar activeTab="orders" />

                        <div className="flex-1">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Siparişlerim</CardTitle>
                                    <CardDescription>
                                        Tüm siparişlerinizi buradan takip edebilirsiniz
                                    </CardDescription>
                                </CardHeader>

                                <CardContent>
                                    {currentUser?.orders && currentUser.orders.length > 0 ? (
                                        <div className="space-y-4">
                                            {currentUser.orders.map(order => (
                                                <div
                                                    key={order.id}
                                                    className="p-4 rounded-lg border border-gray-200 bg-white hover:shadow-md transition-shadow cursor-pointer"
                                                    onClick={() => setSelectedOrder(order)}
                                                >
                                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                        <div>
                                                            <div className="flex items-center mb-2">
                                                                <h3 className="font-medium mr-3">Sipariş #{order.id.slice(-6)}</h3>
                                                                <OrderStatus status={order.status} />
                                                            </div>
                                                            <p className="text-sm text-gray-500 mb-2">
                                                                {new Date(order.date).toLocaleDateString('tr-TR', {
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric'
                                                                })}
                                                            </p>
                                                            <p className="text-sm">
                                                                {order.items.length} ürün · {order.total.toFixed(2)} ₺
                                                            </p>
                                                        </div>

                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={() => setSelectedOrder(order)}>
                                                                    <ExternalLink className="h-4 w-4" />
                                                                    <span>Detaylar</span>
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent className="max-w-md">
                                                                <DialogHeader>
                                                                    <DialogTitle>Sipariş Detayları</DialogTitle>
                                                                    <DialogDescription>
                                                                        Siparişiniz hakkında detaylı bilgi
                                                                    </DialogDescription>
                                                                </DialogHeader>
                                                                {selectedOrder && <OrderDetails order={selectedOrder} />}
                                                            </DialogContent>
                                                        </Dialog>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <Package className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900 mb-1">
                                                Henüz siparişiniz bulunmuyor
                                            </h3>
                                            <p className="text-gray-500 mb-4">
                                                Siparişleriniz burada görüntülenecektir
                                            </p>
                                            <Link to="/">
                                                <Button>
                                                    Hemen Sipariş Ver
                                                </Button>
                                            </Link>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Orders; 