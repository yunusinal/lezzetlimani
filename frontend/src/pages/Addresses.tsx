import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Home, MapPin, Package, LogOut, Edit, Trash, CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from "@/contexts/AuthContext";
import { Link } from 'react-router-dom';
import { Address } from '@/types';

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

// AddressForm bileşeni
const AddressForm = ({
    onSubmit,
    initialData = {
        id: '',
        title: '',
        fullAddress: '',
        city: '',
        district: '',
        postalCode: '',
        isDefault: false,
        phoneNumber: ''
    },
    buttonText = 'Ekle'
}: {
    onSubmit: (data: Address) => void;
    initialData?: Address;
    buttonText?: string;
}) => {
    const [formData, setFormData] = useState<Address>(initialData);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'phoneNumber') {
            // Sadece rakamları al ve 10 karakterle sınırla
            const numericValue = value.replace(/\D/g, '');
            if (numericValue.length <= 10) {
                setFormData(prev => ({
                    ...prev,
                    [name]: numericValue
                }));
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const formatPhoneNumber = (phone: string | undefined) => {
        if (!phone) return '';
        if (phone.length === 0) return '';
        if (phone.length <= 3) return phone;
        if (phone.length <= 6) return `${phone.slice(0, 3)} ${phone.slice(3)}`;
        return `${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6)}`;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.phoneNumber && formData.phoneNumber.length !== 10) {
            toast.error('Telefon numarası 10 haneli olmalıdır');
            return;
        }
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="title">Adres Başlığı</Label>
                <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Örn: Ev, İş"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="phoneNumber">Telefon Numarası</Label>
                <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    value={formatPhoneNumber(formData.phoneNumber || '')}
                    onChange={handleChange}
                    placeholder="5XX XXX XX XX"
                    maxLength={12}
                    required
                />
                {formData.phoneNumber && formData.phoneNumber.length > 0 && formData.phoneNumber.length < 10 && (
                    <p className="text-sm text-red-500">
                        Telefon numarası 10 haneli olmalıdır
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="fullAddress">Adres</Label>
                <Input
                    id="fullAddress"
                    name="fullAddress"
                    value={formData.fullAddress}
                    onChange={handleChange}
                    placeholder="Sokak, Mahalle, Bina No, Kat, Daire"
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="city">Şehir</Label>
                    <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="İstanbul"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="district">İlçe</Label>
                    <Input
                        id="district"
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        placeholder="Kadıköy"
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="postalCode">Posta Kodu</Label>
                <Input
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="34000"
                />
            </div>

            <Button type="submit">{buttonText}</Button>
        </form>
    );
};

const Addresses = () => {
    const { currentUser, addAddress, updateAddress, removeAddress, setDefaultAddress } = useAuth();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const formatPhoneNumber = (phone: string | undefined) => {
        if (!phone) return '';
        if (phone.length === 0) return '';
        if (phone.length <= 3) return phone;
        if (phone.length <= 6) return `${phone.slice(0, 3)} ${phone.slice(3)}`;
        return `${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6)}`;
    };

    const handleAddAddress = (address: Address) => {
        addAddress({
            title: address.title,
            fullAddress: address.fullAddress,
            city: address.city,
            district: address.district,
            postalCode: address.postalCode,
            isDefault: address.isDefault,
            phoneNumber: address.phoneNumber
        });
        setIsAddDialogOpen(false);
        toast.success('Adres başarıyla eklendi', { duration: 1000 });
    };

    const handleUpdateAddress = (address: Address) => {
        updateAddress(address);
        setEditingAddress(null);
        setIsEditDialogOpen(false);
    };

    const handleDeleteAddress = (addressId: string) => {
        if (confirm('Bu adresi silmek istediğinizden emin misiniz?')) {
            removeAddress(addressId);
            toast.success('Adres başarıyla silindi', { duration: 1000 });
        }
    };

    const handleSetDefaultAddress = (addressId: string) => {
        setDefaultAddress(addressId);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <h1 className="text-2xl font-bold mb-6">Hesabım</h1>

                    <div className="flex flex-col md:flex-row gap-6">
                        <Sidebar activeTab="addresses" />

                        <div className="flex-1">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle>Adreslerim</CardTitle>
                                        <CardDescription>
                                            Kayıtlı adreslerinizi yönetin
                                        </CardDescription>
                                    </div>

                                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button size="sm" className="flex items-center gap-1">
                                                <PlusCircle className="h-4 w-4" />
                                                <span>Adres Ekle</span>
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Yeni Adres Ekle</DialogTitle>
                                                <DialogDescription>
                                                    Teslimat için kullanılacak yeni bir adres ekleyin
                                                </DialogDescription>
                                            </DialogHeader>
                                            <AddressForm onSubmit={handleAddAddress} />
                                        </DialogContent>
                                    </Dialog>
                                </CardHeader>

                                <CardContent>
                                    {currentUser?.addresses && currentUser.addresses.length > 0 ? (
                                        <div className="space-y-4">
                                            {currentUser.addresses.map(address => (
                                                <div
                                                    key={address.id}
                                                    className={`p-4 rounded-lg border ${address.isDefault
                                                        ? 'border-green-200 bg-green-50'
                                                        : 'border-gray-200 bg-white'
                                                        }`}
                                                >
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div className="flex items-center">
                                                            <h3 className="font-medium text-lg">{address.title}</h3>
                                                            {address.isDefault && (
                                                                <span className="ml-2 text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full flex items-center">
                                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                                    Varsayılan
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex space-x-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => {
                                                                    setEditingAddress(address);
                                                                    setIsEditDialogOpen(true);
                                                                }}
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>

                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleDeleteAddress(address.id)}
                                                            >
                                                                <Trash className="h-4 w-4 text-red-500" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-700 mb-1">{address.fullAddress}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {address.district}, {address.city}, {address.postalCode}
                                                    </p>
                                                    {address.phoneNumber && (
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            Tel: {formatPhoneNumber(address.phoneNumber)}
                                                        </p>
                                                    )}

                                                    {!address.isDefault && (
                                                        <Button
                                                            variant="link"
                                                            className="mt-2 h-8 p-0 text-sm"
                                                            onClick={() => handleSetDefaultAddress(address.id)}
                                                        >
                                                            Varsayılan yap
                                                        </Button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <MapPin className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900 mb-1">
                                                Henüz adres eklemediniz
                                            </h3>
                                            <p className="text-gray-500 mb-4">
                                                Yeni adres ekleyerek teslimat adreslerinizi yönetebilirsiniz
                                            </p>
                                            <Button onClick={() => setIsAddDialogOpen(true)}>
                                                İlk Adresimi Ekle
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>

            {/* Düzenleme Dialog'u */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Adresi Düzenle</DialogTitle>
                        <DialogDescription>
                            Adres bilgilerini güncelleyin
                        </DialogDescription>
                    </DialogHeader>
                    {editingAddress && (
                        <AddressForm
                            initialData={editingAddress}
                            onSubmit={handleUpdateAddress}
                            buttonText="Güncelle"
                        />
                    )}
                </DialogContent>
            </Dialog>

            <Footer />
        </div>
    );
};

export default Addresses; 