import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag, User, Heart, Search, Menu, MapPin, ChevronDown, X, Home, Utensils, Gift,
  LogOut, UserCircle, MapPinned, Package
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { CartItem } from '@/types';
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const { isLoggedIn, currentUser, logout } = useAuth();
  const [location, setLocation] = useState('Sanayi Mah, Isparta, Türkiye');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // localStorage'dan sepet verilerini yükle
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }

    // localStorage değişikliklerini dinle
    const handleStorageChange = () => {
      const updatedCart = localStorage.getItem('cart');
      if (updatedCart) {
        setCartItems(JSON.parse(updatedCart));
      } else {
        setCartItems([]);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Sepetteki toplam ürün sayısını hesapla
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Kullanıcı avatar fallback (baş harfler)
  const getAvatarFallback = () => {
    if (!currentUser || !currentUser.name) return 'U';

    const nameParts = currentUser.name.split(' ');
    if (nameParts.length === 1) return nameParts[0][0].toUpperCase();

    return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
  };

  const handleRestaurantsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // URL parametrelerini temizleyerek /restaurants sayfasına yönlendir
    navigate('/restaurants', { replace: true });
    // Sayfayı tam olarak yenilemek için
    window.location.href = '/restaurants';
  };

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    // Önce context'teki logout fonksiyonunu çağır
    logout();
    // Sonra ana sayfaya yönlendir ve sayfayı yenile
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-xl font-bold text-brand-red">LezzetLimanı</h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      <Home className="h-4 w-4 mr-2" />
                      Ana Sayfa
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/restaurants" onClick={handleRestaurantsClick}>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      <Utensils className="h-4 w-4 mr-2" />
                      Restoranlar
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/favorites">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      <Heart className="h-4 w-4 mr-2" />
                      Favoriler
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/campaigns">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      <Gift className="h-4 w-4 mr-2" />
                      Kampanyalar
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-2">
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="py-4">
                  <div className="flex items-center mb-6">
                    <MapPin className="h-4 w-4 mr-2 text-brand-red" />
                    <span className="text-sm truncate">{location}</span>
                  </div>

                  <nav className="space-y-4">
                    <Link to="/" className="flex items-center py-2 text-brand-dark hover:text-brand-red">
                      <Home className="h-4 w-4 mr-2" />
                      Ana Sayfa
                    </Link>
                    <Link to="/restaurants" onClick={handleRestaurantsClick} className="flex items-center py-2 text-brand-dark hover:text-brand-red">
                      <Utensils className="h-4 w-4 mr-2" />
                      Restoranlar
                    </Link>
                    <Link to="/favorites" className="flex items-center py-2 text-brand-dark hover:text-brand-red">
                      <Heart className="h-4 w-4 mr-2" />
                      Favoriler
                    </Link>
                    <Link to="/campaigns" className="flex items-center py-2 text-brand-dark hover:text-brand-red">
                      <Gift className="h-4 w-4 mr-2" />
                      Kampanyalar
                    </Link>

                    {isLoggedIn && (
                      <>
                        <div className="border-t border-gray-200 my-2"></div>
                        <Link to="/profile" className="flex items-center py-2 text-brand-dark hover:text-brand-red">
                          <UserCircle className="h-4 w-4 mr-2" />
                          Profilim
                        </Link>
                        <Link to="/addresses" className="flex items-center py-2 text-brand-dark hover:text-brand-red">
                          <MapPinned className="h-4 w-4 mr-2" />
                          Adreslerim
                        </Link>
                        <Link to="/orders" className="flex items-center py-2 text-brand-dark hover:text-brand-red">
                          <Package className="h-4 w-4 mr-2" />
                          Siparişlerim
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center py-2 text-brand-dark hover:text-brand-red w-full text-left"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Çıkış Yap
                        </button>
                      </>
                    )}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>

            <div className="hidden md:flex items-center space-x-2">
              <Link to="/search">
                <Button variant="ghost" size="icon">
                  <Search className="h-5 w-5" />
                </Button>
              </Link>

              <Link to="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingBag className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-brand-red text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Button>
              </Link>
            </div>

            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" alt={currentUser?.name} />
                      <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>
                    <div className="font-normal text-xs text-gray-500">Hoş geldin,</div>
                    <div>{currentUser?.name}</div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link to="/profile" className="w-full flex items-center">
                      <UserCircle className="h-4 w-4 mr-2" />
                      Profilim
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/addresses" className="w-full flex items-center">
                      <MapPinned className="h-4 w-4 mr-2" />
                      Adreslerim
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/orders" className="w-full flex items-center">
                      <Package className="h-4 w-4 mr-2" />
                      Siparişlerim
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 hover:text-red-700 cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" />
                    Çıkış Yap
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button variant="ghost" className="hidden md:flex">
                  <User className="h-5 w-5 mr-2" />
                  Giriş Yap
                </Button>
              </Link>
            )}
            
            {/* Mobile Login Button */}
            {!isLoggedIn && (
              <Link to="/login" className="md:hidden">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
