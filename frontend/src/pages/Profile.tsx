import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCircle, MapPin, Package, Bell, LogOut } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from "@/contexts/AuthContext";
import { Link } from 'react-router-dom';

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
                            <UserCircle className="h-5 w-5 mr-3 text-gray-600" />
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

const Profile = () => {
    const { currentUser, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: currentUser?.name || '',
        email: currentUser?.email || '',
        phone: currentUser?.phone || ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateUser(formData);
        setIsEditing(false);
        toast.success('Profil bilgileriniz güncellendi');
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <h1 className="text-2xl font-bold mb-6">Hesabım</h1>

                    <div className="flex flex-col md:flex-row gap-6">
                        <Sidebar activeTab="profile" />

                        <div className="flex-1">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Profilim</CardTitle>
                                    <CardDescription>
                                        Kişisel bilgilerinizi güncelleyin
                                    </CardDescription>
                                </CardHeader>

                                <form onSubmit={handleSubmit}>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Ad Soyad</Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">E-posta</Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Telefon</Label>
                                            <Input
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                    </CardContent>

                                    <CardFooter className="flex justify-between">
                                        {isEditing ? (
                                            <>
                                                <Button
                                                    variant="outline"
                                                    type="button"
                                                    onClick={() => {
                                                        setIsEditing(false);
                                                        setFormData({
                                                            name: currentUser?.name || '',
                                                            email: currentUser?.email || '',
                                                            phone: currentUser?.phone || ''
                                                        });
                                                    }}
                                                >
                                                    İptal
                                                </Button>
                                                <Button type="submit">Kaydet</Button>
                                            </>
                                        ) : (
                                            <Button
                                                type="button"
                                                onClick={() => setIsEditing(true)}
                                            >
                                                Düzenle
                                            </Button>
                                        )}
                                    </CardFooter>
                                </form>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Profile; 