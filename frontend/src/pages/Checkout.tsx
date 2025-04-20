import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CreditCard, MapPin, ChevronRight, Clock, MessageSquare, Tag, CreditCard as CreditCardIcon, DollarSign, Smartphone, Plus, Pencil } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CartItem as CartItemType, Address } from '@/types';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface OrderDetails {
    deliveryTime: string | { date: Date; time: string };
    orderNote: string;
    couponCode: string;
    couponDiscount: number;
}

interface PaymentDetails {
    method: string;
    cardNumber?: string;
    cardName?: string;
    expiryDate?: string;
}

const Checkout = () => {
    const navigate = useNavigate();
    const { currentUser, isLoggedIn, addAddress, updateAddress } = useAuth();
    const [cart, setCart] = useState<CartItemType[]>([]);
    const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
    const [selectedAddress, setSelectedAddress] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [showNewAddressDialog, setShowNewAddressDialog] = useState(false);
    const [showEditAddressDialog, setShowEditAddressDialog] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [newAddress, setNewAddress] = useState({
        title: '',
        fullAddress: '',
        city: '',
        district: '',
        postalCode: '',
        isDefault: false,
        phoneNumber: ''
    });
    const [paymentMethod, setPaymentMethod] = useState('creditCard');
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [savedPhoneNumber, setSavedPhoneNumber] = useState<string>('');

    useEffect(() => {
        // localStorage'dan sepet verilerini yükle
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }

        // Sipariş detaylarını yükle
        const savedOrderDetails = localStorage.getItem('orderDetails');
        if (savedOrderDetails) {
            const details = JSON.parse(savedOrderDetails);
            if (details.deliveryTime && typeof details.deliveryTime !== 'string') {
                details.deliveryTime.date = new Date(details.deliveryTime.date);
            }
            setOrderDetails(details);
        }

        // Kullanıcının varsayılan adresini seç
        if (currentUser?.addresses) {
            const defaultAddress = currentUser.addresses.find(addr => addr.isDefault);
            if (defaultAddress) {
                setSelectedAddress(defaultAddress.id);
            } else if (currentUser.addresses.length > 0) {
                setSelectedAddress(currentUser.addresses[0].id);
            }
        }

        // Kullanıcının telefon numarasını yükle
        const savedPhone = localStorage.getItem('userPhone');
        if (savedPhone) {
            setSavedPhoneNumber(savedPhone);
            setPhoneNumber(savedPhone);
        }
    }, [currentUser]);

    const handleAddNewAddress = () => {
        if (newAddress.phoneNumber.length !== 10) {
            toast.error('Lütfen geçerli bir telefon numarası girin');
            return;
        }

        if (!newAddress.title || !newAddress.fullAddress || !newAddress.city || !newAddress.district) {
            toast.error('Lütfen tüm alanları doldurun');
            return;
        }

        // AuthContext üzerinden adresi ekle
        addAddress({
            title: newAddress.title,
            fullAddress: newAddress.fullAddress,
            city: newAddress.city,
            district: newAddress.district,
            postalCode: newAddress.postalCode,
            isDefault: newAddress.isDefault,
            phoneNumber: newAddress.phoneNumber
        });

        setShowNewAddressDialog(false);
        setNewAddress({
            title: '',
            fullAddress: '',
            city: '',
            district: '',
            postalCode: '',
            isDefault: false,
            phoneNumber: ''
        });
        toast.success('Adres başarıyla eklendi');
    };

    const handlePhoneNumberChangeInModal = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '');
        if (value.length <= 10) {
            setNewAddress({ ...newAddress, phoneNumber: value });
        }
    };

    const formatPrice = (price: number) => {
        return price.toLocaleString('tr-TR') + ' TL';
    };

    const calculateCartTotal = () => {
        return cart.reduce((total, item) => total + item.totalPrice, 0);
    };

    const getFinalTotal = () => {
        return calculateCartTotal() - (orderDetails?.couponDiscount || 0);
    };

    const formatDeliveryTime = () => {
        if (!orderDetails) return 'En kısa sürede';

        if (orderDetails.deliveryTime === 'asap') {
            return 'En kısa sürede';
        } else if (typeof orderDetails.deliveryTime === 'object') {
            const { date, time } = orderDetails.deliveryTime;
            return `${format(new Date(date), 'PPP', { locale: tr })} - ${time}`;
        }

        return 'En kısa sürede';
    };

    const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, ''); // Sadece rakamları al
        if (value.length <= 10) {
            setPhoneNumber(value);
        }
    };

    const savePhoneNumber = () => {
        if (phoneNumber.length === 10) {
            localStorage.setItem('userPhone', phoneNumber);
            setSavedPhoneNumber(phoneNumber);
            toast.success('Telefon numarası kaydedildi');
        } else {
            toast.error('Lütfen geçerli bir telefon numarası girin');
        }
    };

    const formatPhoneNumber = (value: string) => {
        if (value.length === 0) return '';
        if (value.length <= 3) return value;
        if (value.length <= 6) return `${value.slice(0, 3)} ${value.slice(3)}`;
        return `${value.slice(0, 3)} ${value.slice(3, 6)} ${value.slice(6)}`;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedAddress) {
            alert('Lütfen bir teslimat adresi seçin');
            return;
        }

        if (!phoneNumber) {
            alert('Lütfen telefon numaranızı girin');
            return;
        }

        // Telefon numarasını kaydet
        localStorage.setItem('userPhone', phoneNumber);

        // Kredi kartı seçildiyse ve gerekli alanlar boşsa
        if (paymentMethod === 'creditCard' &&
            (!cardNumber || !cardName || !expiryDate || !cvv)) {
            alert('Lütfen kredi kartı bilgilerini eksiksiz doldurun.');
            return;
        }

        // Seçilen ödeme yöntemini localStorage'a kaydet
        let paymentDetails: PaymentDetails = { method: paymentMethod };
        if (paymentMethod === 'creditCard') {
            paymentDetails = {
                ...paymentDetails,
                cardNumber,
                cardName,
                expiryDate
            };
        }

        localStorage.setItem('paymentDetails', JSON.stringify(paymentDetails));

        // Ödeme işlemi başarılı olduğunda
        localStorage.removeItem('cart');
        localStorage.removeItem('orderDetails');
        setCart([]);

        navigate('/payment-success');
    };

    const handleEditAddress = (address: Address) => {
        setEditingAddress(address);
        setShowEditAddressDialog(true);
    };

    const handleUpdateAddress = () => {
        if (!editingAddress) return;

        if (editingAddress.phoneNumber && editingAddress.phoneNumber.length !== 10) {
            toast.error('Telefon numarası 10 haneli olmalıdır');
            return;
        }

        updateAddress(editingAddress);
        setShowEditAddressDialog(false);
        setEditingAddress(null);
        toast.success('Adres başarıyla güncellendi');
    };

    const handlePhoneNumberChangeInEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '');
        if (value.length <= 10) {
            setEditingAddress(prev => prev ? {
                ...prev,
                phoneNumber: value
            } : null);
        }
    };

    const formatPhoneNumberForDisplay = (phone: string) => {
        if (phone.length === 0) return '';
        if (phone.length <= 3) return phone;
        if (phone.length <= 6) return `${phone.slice(0, 3)} ${phone.slice(3)}`;
        return `${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6)}`;
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-grow bg-gray-50 py-8">
                    <div className="container mx-auto px-4 lg:px-8 text-center">
                        <h1 className="text-3xl font-bold mb-4">Sepetiniz Boş</h1>
                        <p className="text-gray-600 mb-6">
                            Ödeme yapabilmek için sepetinizde ürün bulunmalıdır.
                        </p>
                        <Link to="/restaurants">
                            <Button className="bg-brand-red text-white hover:bg-brand-red/90">
                                Restoranları Keşfet
                            </Button>
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow bg-gray-50 py-8">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold mb-2">Ödeme</h1>
                        <p className="text-gray-600">
                            Siparişinizi tamamlamak için lütfen bilgilerinizi girin
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Teslimat Adresi */}
                                <div className="bg-white rounded-lg shadow-sm p-4">
                                    <h3 className="text-xl font-bold mb-4 flex items-center">
                                        <MapPin className="h-5 w-5 mr-2" />
                                        Teslimat Bilgileri
                                    </h3>
                                    <div className="space-y-4">
                                        

                                        <div className="border-t my-4"></div>

                                        {/* Kayıtlı Adresler */}
                                        {currentUser?.addresses.length > 0 ? (
                                            <div className="space-y-2">
                                                <Label>Kayıtlı Adresleriniz</Label>
                                                <RadioGroup
                                                    value={selectedAddress}
                                                    onValueChange={setSelectedAddress}
                                                >
                                                    {currentUser.addresses.map((address) => (
                                                        <div key={address.id} className="flex items-center space-x-2">
                                                            <RadioGroupItem value={address.id} id={address.id} />
                                                            <Label htmlFor={address.id} className="flex flex-col cursor-pointer flex-1">
                                                                <span className="font-medium">{address.title}</span>
                                                                <span className="text-sm text-gray-600">
                                                                    {address.fullAddress}, {address.district}, {address.city}
                                                                </span>
                                                                {address.phoneNumber && (
                                                                    <span className="text-sm text-gray-600">
                                                                        Tel: {formatPhoneNumberForDisplay(address.phoneNumber)}
                                                                    </span>
                                                                )}
                                                                {address.isDefault && (
                                                                    <span className="text-xs text-brand-red">Varsayılan Adres</span>
                                                                )}
                                                            </Label>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                className="ml-auto text-gray-500 hover:text-brand-red"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    handleEditAddress(address);
                                                                }}
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </RadioGroup>
                                            </div>
                                        ) : (
                                            <div className="text-center py-4 text-gray-500">
                                                Kayıtlı adresiniz bulunmamaktadır.
                                            </div>
                                        )}

                                        {/* Adres Düzenleme Modal */}
                                        <Dialog open={showEditAddressDialog} onOpenChange={setShowEditAddressDialog}>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Adres Düzenle</DialogTitle>
                                                </DialogHeader>
                                                <div className="space-y-4 py-4">
                                                    <div>
                                                        <Label>Adres Başlığı</Label>
                                                        <Input
                                                            value={editingAddress?.title || ''}
                                                            onChange={(e) => setEditingAddress(prev => prev ? {
                                                                ...prev,
                                                                title: e.target.value
                                                            } : null)}
                                                            placeholder="Örn: Ev, İş"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label>Telefon Numarası</Label>
                                                        <Input
                                                            type="tel"
                                                            value={formatPhoneNumberForDisplay(editingAddress?.phoneNumber || '')}
                                                            onChange={handlePhoneNumberChangeInEdit}
                                                            placeholder="5XX XXX XX XX"
                                                            maxLength={12}
                                                            required
                                                        />
                                                        {editingAddress?.phoneNumber && editingAddress.phoneNumber.length > 0 && editingAddress.phoneNumber.length < 10 && (
                                                            <p className="text-sm text-red-500 mt-1">
                                                                Telefon numarası 10 haneli olmalıdır
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <Label>Adres</Label>
                                                        <Textarea
                                                            value={editingAddress?.fullAddress || ''}
                                                            onChange={(e) => setEditingAddress(prev => prev ? {
                                                                ...prev,
                                                                fullAddress: e.target.value
                                                            } : null)}
                                                            placeholder="Tam adres"
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <Label>İl</Label>
                                                            <Input
                                                                value={editingAddress?.city || ''}
                                                                onChange={(e) => setEditingAddress(prev => prev ? {
                                                                    ...prev,
                                                                    city: e.target.value
                                                                } : null)}
                                                                placeholder="İl"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label>İlçe</Label>
                                                            <Input
                                                                value={editingAddress?.district || ''}
                                                                onChange={(e) => setEditingAddress(prev => prev ? {
                                                                    ...prev,
                                                                    district: e.target.value
                                                                } : null)}
                                                                placeholder="İlçe"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <Label>Posta Kodu</Label>
                                                        <Input
                                                            value={editingAddress?.postalCode || ''}
                                                            onChange={(e) => setEditingAddress(prev => prev ? {
                                                                ...prev,
                                                                postalCode: e.target.value
                                                            } : null)}
                                                            placeholder="Posta kodu"
                                                        />
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <input
                                                            type="checkbox"
                                                            id="editIsDefault"
                                                            checked={editingAddress?.isDefault || false}
                                                            onChange={(e) => setEditingAddress(prev => prev ? {
                                                                ...prev,
                                                                isDefault: e.target.checked
                                                            } : null)}
                                                        />
                                                        <Label htmlFor="editIsDefault">Varsayılan adres olarak kaydet</Label>
                                                    </div>
                                                </div>
                                                <div className="flex justify-end space-x-2">
                                                    <Button 
                                                        variant="outline" 
                                                        onClick={() => {
                                                            setShowEditAddressDialog(false);
                                                            setEditingAddress(null);
                                                        }}
                                                    >
                                                        İptal
                                                    </Button>
                                                    <Button onClick={handleUpdateAddress}>
                                                        Güncelle
                                                    </Button>
                                                </div>
                                            </DialogContent>
                                        </Dialog>

                                        {/* Yeni Adres Ekle */}
                                        <Dialog open={showNewAddressDialog} onOpenChange={setShowNewAddressDialog}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" className="w-full">
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Yeni Adres Ekle
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Yeni Adres Ekle</DialogTitle>
                                                </DialogHeader>
                                                <div className="space-y-4 py-4">
                                                    <div>
                                                        <Label>Adres Başlığı</Label>
                                                        <Input
                                                            value={newAddress.title}
                                                            onChange={(e) => setNewAddress({ ...newAddress, title: e.target.value })}
                                                            placeholder="Örn: Ev, İş"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label>Adres</Label>
                                                        <Textarea
                                                            value={newAddress.fullAddress}
                                                            onChange={(e) => setNewAddress({ ...newAddress, fullAddress: e.target.value })}
                                                            placeholder="Tam adres"
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <Label>İl</Label>
                                                            <Input
                                                                value={newAddress.city}
                                                                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                                                placeholder="İl"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label>İlçe</Label>
                                                            <Input
                                                                value={newAddress.district}
                                                                onChange={(e) => setNewAddress({ ...newAddress, district: e.target.value })}
                                                                placeholder="İlçe"
                                                            />
                                                        </div>
                                                    </div>
                                                    
                                                    <div>
                                                        <Label>Posta Kodu</Label>
                                                        <Input
                                                            value={newAddress.postalCode}
                                                            onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                                                            placeholder="Posta kodu"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label>Telefon Numarası</Label>
                                                        <Input
                                                            type="tel"
                                                            value={formatPhoneNumber(newAddress.phoneNumber)}
                                                            onChange={handlePhoneNumberChangeInModal}
                                                            placeholder="5XX XXX XX XX"
                                                            maxLength={12}
                                                            required
                                                        />
                                                        {newAddress.phoneNumber.length > 0 && newAddress.phoneNumber.length < 10 && (
                                                            <p className="text-sm text-red-500 mt-1">
                                                                Telefon numarası 10 haneli olmalıdır
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <input
                                                            type="checkbox"
                                                            id="isDefault"
                                                            checked={newAddress.isDefault}
                                                            onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                                                        />
                                                        <Label htmlFor="isDefault">Varsayılan adres olarak kaydet</Label>
                                                    </div>
                                                </div>
                                                <div className="flex justify-end space-x-2">
                                                    <Button variant="outline" onClick={() => setShowNewAddressDialog(false)}>
                                                        İptal
                                                    </Button>
                                                    <Button onClick={handleAddNewAddress}>
                                                        Kaydet
                                                    </Button>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div>

                                {/* Sipariş Detayları */}
                                <div className="bg-white rounded-lg shadow-sm p-4">
                                    <h3 className="text-xl font-bold mb-4">Sipariş Detayları</h3>

                                    <div className="space-y-4">
                                        {/* Teslimat Zamanı */}
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 mt-1">
                                                <Clock className="h-5 w-5 text-gray-500" />
                                            </div>
                                            <div className="ml-3">
                                                <h4 className="text-sm font-medium">Teslimat Zamanı</h4>
                                                <p className="text-sm text-gray-600">{formatDeliveryTime()}</p>
                                            </div>
                                        </div>

                                        {/* Sipariş Notu */}
                                        {orderDetails?.orderNote && (
                                            <div className="flex items-start">
                                                <div className="flex-shrink-0 mt-1">
                                                    <MessageSquare className="h-5 w-5 text-gray-500" />
                                                </div>
                                                <div className="ml-3">
                                                    <h4 className="text-sm font-medium">Sipariş Notu</h4>
                                                    <p className="text-sm text-gray-600">{orderDetails.orderNote}</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Kupon Kodu */}
                                        {orderDetails?.couponCode && (
                                            <div className="flex items-start">
                                                <div className="flex-shrink-0 mt-1">
                                                    <Tag className="h-5 w-5 text-gray-500" />
                                                </div>
                                                <div className="ml-3">
                                                    <h4 className="text-sm font-medium">Kupon Kodu</h4>
                                                    <p className="text-sm text-gray-600">
                                                        {orderDetails.couponCode} ({formatPrice(orderDetails.couponDiscount)} indirim)
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Ödeme Bilgileri */}
                                <div className="bg-white rounded-lg shadow-sm p-4">
                                    <h3 className="text-xl font-bold mb-4 flex items-center">
                                        <CreditCard className="h-5 w-5 mr-2" />
                                        Ödeme Bilgileri
                                    </h3>

                                    <div className="space-y-6">
                                        <RadioGroup
                                            value={paymentMethod}
                                            onValueChange={setPaymentMethod}
                                            className="space-y-3"
                                        >
                                            <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-gray-50 cursor-pointer">
                                                <RadioGroupItem value="creditCard" id="creditCard" />
                                                <Label htmlFor="creditCard" className="flex items-center cursor-pointer">
                                                    <CreditCardIcon className="h-5 w-5 mr-2 text-blue-600" />
                                                    <div>
                                                        <span className="font-medium">Kredi Kartı</span>
                                                        <p className="text-sm text-gray-500">Tüm kartlarla güvenli ödeme</p>
                                                    </div>
                                                </Label>
                                            </div>

                                            <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-gray-50 cursor-pointer">
                                                <RadioGroupItem value="pos" id="pos" />
                                                <Label htmlFor="pos" className="flex items-center cursor-pointer">
                                                    <Smartphone className="h-5 w-5 mr-2 text-green-600" />
                                                    <div>
                                                        <span className="font-medium">Kapıda POS ile Ödeme</span>
                                                        <p className="text-sm text-gray-500">Teslimat sırasında POS cihazı ile ödeme</p>
                                                    </div>
                                                </Label>
                                            </div>

                                            <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-gray-50 cursor-pointer">
                                                <RadioGroupItem value="cash" id="cash" />
                                                <Label htmlFor="cash" className="flex items-center cursor-pointer">
                                                    <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                                                    <div>
                                                        <span className="font-medium">Kapıda Nakit Ödeme</span>
                                                        <p className="text-sm text-gray-500">Teslimat sırasında nakit ödeme</p>
                                                    </div>
                                                </Label>
                                            </div>
                                        </RadioGroup>

                                        {paymentMethod === 'creditCard' && (
                                            <div className="space-y-4 pt-4 border-t">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Kart Numarası
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={cardNumber}
                                                        onChange={(e) => setCardNumber(e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-red"
                                                        placeholder="1234 5678 9012 3456"
                                                        required={paymentMethod === 'creditCard'}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Kart Üzerindeki İsim
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={cardName}
                                                        onChange={(e) => setCardName(e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-red"
                                                        placeholder="Ad Soyad"
                                                        required={paymentMethod === 'creditCard'}
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Son Kullanma Tarihi
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={expiryDate}
                                                            onChange={(e) => setExpiryDate(e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-red"
                                                            placeholder="MM/YY"
                                                            required={paymentMethod === 'creditCard'}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            CVV
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={cvv}
                                                            onChange={(e) => setCvv(e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-red"
                                                            placeholder="123"
                                                            required={paymentMethod === 'creditCard'}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-brand-red text-white hover:bg-brand-red/90"
                                >
                                    {paymentMethod === 'creditCard' ? 'Ödemeyi Tamamla' : 'Siparişi Tamamla'}
                                    <ChevronRight className="h-5 w-5 ml-1" />
                                </Button>
                            </form>
                        </div>

                        {/* Sipariş Özeti */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-24">
                                <h3 className="text-xl font-bold mb-4">Sipariş Özeti</h3>

                                <div className="max-h-64 overflow-y-auto mb-4">
                                    {cart.map(item => (
                                        <div key={item.id} className="border-b py-2 last:border-b-0">
                                            <div className="flex justify-between">
                                                <div>
                                                    <p className="font-medium">{item.menuItem.name}</p>
                                                    <p className="text-xs text-gray-500">x{item.quantity}</p>
                                                </div>
                                                <p className="font-medium">{formatPrice(item.totalPrice)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Ara Toplam:</span>
                                        <span>{formatPrice(calculateCartTotal())}</span>
                                    </div>
                                    {orderDetails?.couponDiscount ? (
                                        <div className="flex justify-between text-sm text-green-600">
                                            <span>Kupon İndirimi:</span>
                                            <span>-{formatPrice(orderDetails.couponDiscount)}</span>
                                        </div>
                                    ) : null}
                                    <div className="flex justify-between text-sm">
                                        <span>Teslimat Ücreti:</span>
                                        <span>Ücretsiz</span>
                                    </div>
                                    <div className="flex justify-between font-bold mt-2 pt-2 border-t">
                                        <span>Toplam:</span>
                                        <span>{formatPrice(getFinalTotal())}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Checkout; 