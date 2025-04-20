import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { MenuItem, CartItem } from '@/types';
import { restaurants } from '@/data/mockData';
import RestaurantHeader from '@/components/restaurant/RestaurantHeader';
import RestaurantTabs from '@/components/restaurant/RestaurantTabs';
import Cart from '@/components/restaurant/CartInRestaurant';
import RestaurantNotFound from '@/components/restaurant/RestaurantNotFound';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const RestaurantDetail = () => {
  const { id } = useParams<{ id: string }>();
  const restaurant = restaurants.find(r => r.id === id);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showClearCartDialog, setShowClearCartDialog] = useState(false);
  const [pendingItem, setPendingItem] = useState<{item: MenuItem, quantity: number} | null>(null);

  useEffect(() => {
    // localStorage'dan sepet verilerini yükle
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const addToCart = (item: MenuItem, quantity: number = 1) => {
    // Sepet boşsa direkt ekle
    if (cart.length === 0) {
      const newItem = {
        id: Date.now().toString(),
        menuItem: item,
        quantity,
        totalPrice: quantity * (item.discountedPrice || item.price),
        restaurantId: id, // Restoran ID'sini ekle
        restaurantName: restaurant?.name || '' // Restoran adını ekle
      };
      
      const newCart = [newItem];
      setCart(newCart);
      localStorage.setItem('cart', JSON.stringify(newCart));
      toast.success(`${item.name} sepete eklendi`);
      return;
    }

    // Sepette farklı bir restorandan ürün var mı kontrol et
    if (cart[0].restaurantId !== id) {
      setPendingItem({ item, quantity });
      setShowClearCartDialog(true);
      return;
    }

    // Aynı restorandan ürün ekleniyor, normal işleme devam et
    const existingItemIndex = cart.findIndex(
      cartItem => cartItem.menuItem.id === item.id
    );

    let updatedCart: CartItem[];

    if (existingItemIndex >= 0) {
      updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += quantity;
      updatedCart[existingItemIndex].totalPrice =
        updatedCart[existingItemIndex].quantity *
        (item.discountedPrice || item.price);
    } else {
      updatedCart = [
        ...cart,
        {
          id: Date.now().toString(),
          menuItem: item,
          quantity,
          totalPrice: quantity * (item.discountedPrice || item.price),
          restaurantId: id,
          restaurantName: restaurant?.name || ''
        }
      ];
    }

    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    toast.success(`${item.name} sepete eklendi`);
  };

  const handleClearCartAndAdd = () => {
    if (pendingItem) {
      // Sepeti temizle ve yeni ürünü ekle
      const newItem = {
        id: Date.now().toString(),
        menuItem: pendingItem.item,
        quantity: pendingItem.quantity,
        totalPrice: pendingItem.quantity * (pendingItem.item.discountedPrice || pendingItem.item.price),
        restaurantId: id,
        restaurantName: restaurant?.name || ''
      };
      
      setCart([newItem]);
      localStorage.setItem('cart', JSON.stringify([newItem]));
      toast.success(`${pendingItem.item.name} sepete eklendi`);
      setPendingItem(null);
    }
    setShowClearCartDialog(false);
  };

  const removeFromCart = (itemId: string) => {
    const updatedCart = cart.filter(item => item.id !== itemId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    toast.success(`Ürün sepetten çıkarıldı`);
  };

  const updateCartItemQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) return;

    const updatedCart = cart.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          quantity,
          totalPrice: quantity * (item.menuItem.discountedPrice || item.menuItem.price)
        };
      }
      return item;
    });

    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const calculateCartTotal = () => {
    return cart.reduce((total, item) => total + item.totalPrice, 0);
  };

  const clearCart = () => {
    setCart([]);
    localStorage.setItem('cart', JSON.stringify([]));
  };

  if (!restaurant) {
    return <RestaurantNotFound />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        <RestaurantHeader restaurant={restaurant} />

        <div className="container mx-auto px-4 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-2/3">
              <RestaurantTabs
                restaurant={restaurant}
                onAddToCart={addToCart}
              />
            </div>

            <div className="lg:w-1/3">
              <Cart
                cart={cart}
                restaurant={restaurant}
                onUpdateQuantity={updateCartItemQuantity}
                onRemove={removeFromCart}
                calculateCartTotal={calculateCartTotal}
                onClearCart={clearCart}
              />
            </div>
          </div>
        </div>
      </main>

      <AlertDialog open={showClearCartDialog} onOpenChange={setShowClearCartDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sepetinizi Temizlemek İstiyor musunuz?</AlertDialogTitle>
            <AlertDialogDescription>
              Sepetinizde {cart[0]?.restaurantName} restoranından ürünler bulunuyor. 
              Yeni bir restorandan ürün eklemek için mevcut sepetiniz temizlenecektir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowClearCartDialog(false);
              setPendingItem(null);
            }}>
              İptal
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleClearCartAndAdd}>
              Sepeti Temizle ve Ekle
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
};

export default RestaurantDetail;
