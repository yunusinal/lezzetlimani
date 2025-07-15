import { useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Plus, Edit, Eye, Trash2, Home } from "lucide-react";
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

const AddressList = () => {
  const { addresses, refreshAddresses, addressLoading, isAuthenticated } =
    useAuth();
  const navigate = useNavigate();

  const loadAddresses = useCallback(async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    await refreshAddresses();
  }, [isAuthenticated, navigate, refreshAddresses]);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  if (addressLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <Skeleton className="h-10 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
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
              Kayıtlı Adreslerim
            </h1>
            <p className="text-gray-600 mt-2">Teslimat adreslerinizi yönetin</p>
          </div>
          <Link to="/addresses/new">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Yeni Adres Ekle
            </Button>
          </Link>
        </div>

        {/* Address Grid */}
        {addresses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="text-center py-12">
              <CardContent>
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <MapPin className="h-8 w-8 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Henüz kayıtlı adres yok
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Hızlı sipariş verebilmek için adres ekleyin
                    </p>
                  </div>
                  <Link to="/addresses/new">
                    <Button size="lg" className="flex items-center gap-2">
                      <Plus className="h-5 w-5" />
                      İlk Adresimi Ekle
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map((address, index) => (
              <motion.div
                key={address.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300 group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Home className="h-5 w-5 text-orange-600" />
                        <CardTitle className="text-lg font-semibold">
                          {address.title}
                        </CardTitle>
                      </div>
                      {address.is_default && (
                        <Badge variant="success" className="text-xs">
                          Varsayılan
                        </Badge>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Address Text */}
                    <CardDescription className="text-sm leading-relaxed line-clamp-3">
                      {address.full_address}
                    </CardDescription>

                    {/* Address Details */}
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                      {address.district && (
                        <div>
                          <span className="font-medium">İlçe:</span>{" "}
                          {address.district}
                        </div>
                      )}
                      {address.city && (
                        <div>
                          <span className="font-medium">Şehir:</span>{" "}
                          {address.city}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-2">
                      <Link to={`/addresses/${address.id}`} className="flex-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full flex items-center gap-1.5 text-xs"
                        >
                          <Eye className="h-3 w-3" />
                          Görüntüle
                        </Button>
                      </Link>

                      <Link
                        to={`/addresses/${address.id}/edit`}
                        className="flex-1"
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full flex items-center gap-1.5 text-xs hover:bg-orange-50 hover:text-orange-700"
                        >
                          <Edit className="h-3 w-3" />
                          Düzenle
                        </Button>
                      </Link>

                      <Link to={`/addresses/${address.id}/delete`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-1.5 text-xs hover:bg-red-50 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Quick Tips */}
        {addresses.length > 0 && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <span className="text-blue-500 text-lg">💡</span>
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">İpucu:</p>
                  <p>
                    Varsayılan adres, siparişlerinizde otomatik olarak
                    seçilecektir. Sık kullandığınız adresi varsayılan yaparak
                    zaman kazanın.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
};

export default AddressList;
