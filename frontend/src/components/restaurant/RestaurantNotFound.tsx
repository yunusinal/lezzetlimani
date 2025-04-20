
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const RestaurantNotFound = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold mb-4">Restaurant Bulunamadı</h2>
          <p className="mb-8">Aradığınız restaurant bulunamadı veya artık hizmet vermiyor olabilir.</p>
          <Link to="/restaurants">
            <Button>Tüm Restoranları Görüntüle</Button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RestaurantNotFound;
