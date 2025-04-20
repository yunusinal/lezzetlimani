
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 pt-10 pb-6 border-t border-gray-200">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Hakkımızda */}
          <div>
            <h3 className="text-lg font-bold mb-4">LezzetLimanı</h3>
            <p className="text-gray-600 text-sm">
              LezzetLimanı, Türkiye'nin en büyük yemek sipariş platformlarından biridir.
              En sevdiğiniz restoranlardan en lezzetli yemekleri kapınıza getiriyoruz.
            </p>
          </div>

          {/* Hızlı Bağlantılar */}
          <div>
            <h3 className="text-lg font-bold mb-4">Hızlı Bağlantılar</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-600 text-sm hover:text-brand-red">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link to="/restaurants" className="text-gray-600 text-sm hover:text-brand-red">
                  Restoranlar
                </Link>
              </li>
              <li>
                <Link to="/campaigns" className="text-gray-600 text-sm hover:text-brand-red">
                  Kampanyalar
                </Link>
              </li>

            </ul>
          </div>

          {/* Yardım */}
          <div>
            <h3 className="text-lg font-bold mb-4">Yardım</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-gray-600 text-sm hover:text-brand-red">
                  Sıkça Sorulan Sorular
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 text-sm hover:text-brand-red">
                  İletişim
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 text-sm hover:text-brand-red">
                  Kullanım Şartları
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 text-sm hover:text-brand-red">
                  Gizlilik Politikası
                </Link>
              </li>
            </ul>
          </div>

          {/* Bizi Takip Edin */}
          <div>
            <h3 className="text-lg font-bold mb-4">Bizi Takip Edin</h3>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-gray-600 hover:text-brand-red">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-brand-red">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-brand-red">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-brand-red">
                <Youtube className="h-5 w-5" />
              </a>
            </div>


          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} LezzetLimanı. Tüm Hakları Saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
