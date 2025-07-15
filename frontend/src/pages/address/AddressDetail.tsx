import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin,
  Edit,
  ArrowLeft,
  Home,
  Building,
  MapIcon,
  Mail,
} from "lucide-react";
import { getAddressById } from "../../api/address/address";
import type { AddressResponseDTO } from "../../types";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";

const AddressDetail = () => {
  const { addressId } = useParams<{ addressId: string }>();
  const [address, setAddress] = useState<AddressResponseDTO | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (addressId) {
      getAddressById(addressId)
        .then((res) => {
          setAddress(res.data);
          setLoading(false);
        })
        .catch(() => {
          setError("Adres detayları yüklenemedi.");
          setLoading(false);
        });
    }
  }, [addressId]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <Skeleton className="h-10 w-64" />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-red-600 font-medium mb-4">{error}</p>
            <Link to="/addresses">
              <Button variant="outline">Adres Listesine Dön</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!address) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <MapPin className="h-8 w-8 text-orange-600" />
              Adres Detayı
            </h1>
            <p className="text-gray-600 mt-2">
              Adres bilgilerinizi görüntüleyin
            </p>
          </div>
          <Link to="/addresses">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Adres Listesi
            </Button>
          </Link>
        </div>

        {/* Address Details Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Home className="h-5 w-5 text-orange-600" />
                <CardTitle className="text-xl">{address.title}</CardTitle>
              </div>
              {address.is_default && (
                <Badge variant="success">Varsayılan Adres</Badge>
              )}
            </div>
            <CardDescription>Kayıtlı adres bilgileriniz</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Address Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Building className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Şehir
                    </div>
                    <div className="text-gray-600">{address.city}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      İlçe
                    </div>
                    <div className="text-gray-600">{address.district}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Posta Kodu
                    </div>
                    <div className="text-gray-600">{address.zip_code}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Mahalle/Sokak
                    </div>
                    <div className="text-gray-600">{address.address}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Full Address */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-sm font-medium text-gray-900 mb-2">
                Detaylı Adres
              </div>
              <div className="text-gray-700 leading-relaxed">
                {address.full_address}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
              <Link to={`/addresses/${address.id}/edit`} className="flex-1">
                <Button className="w-full flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Adresi Düzenle
                </Button>
              </Link>

              <Link to="/addresses" className="flex-1">
                <Button variant="outline" className="w-full">
                  Geri Dön
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <span className="text-blue-500 text-lg">💡</span>
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">Adres İpuçları:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>
                    Varsayılan adres siparişlerinizde otomatik olarak seçilir
                  </li>
                  <li>Adres bilgilerinizi güncel tutmayı unutmayın</li>
                  <li>Detaylı adres bilgisi kurye için önemlidir</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AddressDetail;
