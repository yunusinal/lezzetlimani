import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Package, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface PaymentDetails {
    method: string;
    cardNumber?: string;
    cardName?: string;
    expiryDate?: string;
}

const PaymentSuccess = () => {
    const [paymentMethod, setPaymentMethod] = useState<string>('');

    useEffect(() => {
        // localStorage'dan ödeme verisini al
        const paymentDetailsStr = localStorage.getItem('paymentDetails');
        if (paymentDetailsStr) {
            const paymentDetails: PaymentDetails = JSON.parse(paymentDetailsStr);
            setPaymentMethod(paymentDetails.method);
        }
    }, []);

    const getPaymentMethodText = () => {
        switch (paymentMethod) {
            case 'creditCard':
                return 'Kredi kartı ödemeniz';
            case 'cash':
                return 'Kapıda nakit ödeme siparişiniz';
            case 'pos':
                return 'Kapıda POS ile ödeme siparişiniz';
            default:
                return 'Ödemeniz';
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow bg-gray-50 flex items-center justify-center py-12">
                <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
                    <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>

                    <h1 className="text-2xl font-bold mb-2">Teşekkürler!</h1>
                    <p className="text-lg mb-4">{getPaymentMethodText()} başarıyla tamamlandı</p>

                    <div className="bg-gray-50 p-4 rounded-md mb-6">
                        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                            <Package className="h-4 w-4" />
                            <span>Siparişiniz onay aşamasında</span>
                        </div>
                    </div>

                    {(paymentMethod === 'cash' || paymentMethod === 'pos') && (
                        <div className="mb-6 p-4 bg-blue-50 text-blue-800 rounded-md">
                            <p className="text-sm">
                                {paymentMethod === 'cash'
                                    ? 'Siparişiniz teslimat sırasında nakit ödeme ile tamamlanacaktır.'
                                    : 'Siparişiniz teslimat sırasında POS cihazı ile yapacağınız ödeme sonrası tamamlanacaktır.'}
                            </p>
                            <p className="text-sm mt-2">Lütfen teslimat sırasında ödeme için hazırlıklı olun.</p>
                        </div>
                    )}

                    <div className="space-y-3">
                        <Link to="/orders">
                            <Button variant="outline" className="w-full">
                                Siparişlerim
                                <ChevronRight className="h-4 w-4 ml-2" />
                            </Button>
                        </Link>
                        <Link to="/">
                            <Button className="w-full bg-brand-red hover:bg-brand-red/90">
                                Ana Sayfaya Dön
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default PaymentSuccess; 