import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Trash2,
  ArrowLeft,
  AlertTriangle,
  Home,
  Building,
  MapPin,
} from "lucide-react";
import { getAddressById, deleteAddress } from "../../api/address/address";
import type { AddressResponseDTO } from "../../types";
import { useAuth } from "../../context/AuthContext";
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

const AddressDelete = () => {
  const { addressId } = useParams<{ addressId: string }>();
  const [address, setAddress] = useState<AddressResponseDTO | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();
  const { refreshAddresses } = useAuth();

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

  const handleDelete = async () => {
    if (!addressId || !address) return;

    setDeleting(true);
    try {
      await deleteAddress(addressId);
      await refreshAddresses();
      navigate("/addresses");
    } catch {
      setError("Adres silinemedi. Lütfen tekrar deneyin.");
      setDeleting(false);
    }
  };

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
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error && !address) {
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
              <Trash2 className="h-8 w-8 text-red-600" />
              Adres Sil
            </h1>
            <p className="text-gray-600 mt-2">Bu işlem geri alınamaz</p>
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

        {/* Warning Card */}
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-red-900 mb-2">
                  Dikkat: Bu işlem geri alınamaz!
                </h3>
                <p className="text-red-700 mb-4">
                  Bu adresi silmek üzeresiniz. Silinen adres bilgileri geri
                  getirilemez.
                </p>
                <ul className="text-sm text-red-600 space-y-1 list-disc list-inside">
                  <li>Bu adrese daha önce verilen siparişler etkilenmez</li>
                  <li>
                    Eğer bu varsayılan adresinizse, başka bir adres varsayılan
                    yapmalısınız
                  </li>
                  <li>Yeni siparişlerde bu adres seçeneği görünmeyecek</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address to Delete */}
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
            <CardDescription>Silinecek adres bilgileri</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Building className="h-4 w-4 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">Şehir/İlçe</div>
                  <div className="font-medium">
                    {address.city}, {address.district}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">Posta Kodu</div>
                  <div className="font-medium">{address.zip_code}</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-sm font-medium text-gray-900 mb-1">
                Tam Adres
              </div>
              <div className="text-gray-700">{address.full_address}</div>
            </div>

            {/* Error Message */}
            {error && address && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-xl p-4"
              >
                <div className="flex items-center">
                  <span className="text-red-500 text-sm mr-2">⚠️</span>
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <Button
                onClick={handleDelete}
                disabled={deleting}
                variant="destructive"
                className="flex-1"
                size="lg"
              >
                {deleting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Siliniyor...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Evet, Adresi Sil
                  </>
                )}
              </Button>

              <Link to="/addresses" className="flex-1">
                <Button
                  variant="outline"
                  className="w-full"
                  size="lg"
                  disabled={deleting}
                >
                  İptal Et
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AddressDelete;
