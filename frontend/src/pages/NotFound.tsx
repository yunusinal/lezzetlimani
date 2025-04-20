
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 max-w-md">
          <h1 className="text-6xl font-bold text-brand-red mb-4">404</h1>
          <p className="text-2xl font-semibold mb-4">Sayfa Bulunamadı</p>
          <p className="text-gray-600 mb-8">
            Aradığınız sayfa bulunamadı veya taşınmış olabilir.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link to="/">Ana Sayfaya Dön</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/restaurants">Restoranları Keşfet</Link>
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
