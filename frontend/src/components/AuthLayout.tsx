
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  type: 'login' | 'register' | 'forgot-password';
}

const AuthLayout = ({ children, title, type }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Branding */}
      <div className="bg-brand-red md:w-1/2 text-white flex flex-col justify-center p-8 md:p-16">
        <div className="max-w-md mx-auto">
          <Link to="/" className="text-3xl font-bold mb-8 block">
            LezzetLimanı
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {type === 'login' && 'Tekrar Hoşgeldiniz!'}
            {type === 'register' && 'Aramıza Katılın!'}
            {type === 'forgot-password' && 'Şifrenizi Sıfırlayın!'}
          </h1>

          <p className="text-xl opacity-90 mb-8">
            {type === 'login' && 'Favorilerinize, adreslerinize ve önceki siparişlerinize erişmek için giriş yapın.'}
            {type === 'register' && 'Lezzetli yemekleri keşfetmek ve özel fırsatlardan yararlanmak için hemen kaydolun.'}
            {type === 'forgot-password' && 'Endişelenmeyin, şifrenizi sıfırlamanız için size yardımcı olacağız.'}
          </p>

          <div className="hidden md:block">
            <div className="flex space-x-4 mb-8">
              <div className="bg-white/10 p-4 rounded-lg flex-1">
                <h3 className="font-bold mb-2">Hızlı Teslimat</h3>
                <p className="text-sm opacity-90">Siparişleriniz dakikalar içinde kapınızda.</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg flex-1">
                <h3 className="font-bold mb-2">Özel Fırsatlar</h3>
                <p className="text-sm opacity-90">Üyelere özel indirim ve kampanyalardan yararlanın.</p>
              </div>
            </div>


          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="md:w-1/2 bg-white flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">{title}</h2>

          </div>

          {children}

          <div className="mt-8 text-center text-sm text-gray-500">
            {type === 'login' && (
              <>
                Hesabınız yok mu?
                <Button variant="link" asChild className="px-1">
                  <Link to="/register">Kayıt Olun</Link>
                </Button>
              </>
            )}

            {type === 'register' && (
              <>
                Zaten bir hesabınız var mı?
                <Button variant="link" asChild className="px-1">
                  <Link to="/login">Giriş Yapın</Link>
                </Button>
              </>
            )}

            {type === 'forgot-password' && (
              <>
                Şifrenizi hatırladınız mı?
                <Button variant="link" asChild className="px-1">
                  <Link to="/login">Giriş Yapın</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
