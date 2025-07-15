import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Save, ArrowLeft, Home, MapIcon, Building } from "lucide-react";
import type { AddressCreateDTO } from "../../types";
import { createAddress } from "../../api/address/address";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

const AddressCreate = () => {
  const [form, setForm] = useState<AddressCreateDTO>({
    title: "",
    address: "",
    city: "",
    district: "",
    full_address: "",
    zip_code: "",
    is_default: false,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { refreshAddresses } = useAuth();
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    const val = type === "checkbox" ? checked : value;
    setForm((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await createAddress(form);
      await refreshAddresses();
      navigate("/addresses");
    } catch (err) {
      setError("Adres eklenemedi. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

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
              Yeni Adres Ekle
            </h1>
            <p className="text-gray-600 mt-2">Yeni teslimat adresi oluşturun</p>
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

        {/* Address Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-orange-600" />
              Adres Bilgileri
            </CardTitle>
            <CardDescription>
              Tüm alanları doldurarak yeni adres bilgilerinizi ekleyin
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Address Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Adres Başlığı *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Home className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    id="title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Ev, İş, Diğer..."
                    required
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* City */}
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Şehir *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      id="city"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="İstanbul"
                      required
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* District */}
                <div>
                  <label
                    htmlFor="district"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    İlçe *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapIcon className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      id="district"
                      name="district"
                      value={form.district}
                      onChange={handleChange}
                      placeholder="Kadıköy"
                      required
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Mahalle/Sokak *
                </label>
                <Input
                  id="address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Mahalle adı, sokak adı, apartman adı"
                  required
                />
              </div>

              {/* Full Address */}
              <div>
                <label
                  htmlFor="full_address"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Detaylı Adres *
                </label>
                <textarea
                  id="full_address"
                  name="full_address"
                  value={form.full_address}
                  onChange={handleChange}
                  placeholder="Tam adres açıklaması, kapı no, kat no, daire no..."
                  required
                  rows={3}
                  className="flex w-full rounded-xl border border-gray-300 bg-white/90 px-3 py-2 text-sm ring-offset-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 shadow-sm hover:shadow-md resize-none"
                />
              </div>

              {/* Zip Code */}
              <div>
                <label
                  htmlFor="zip_code"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Posta Kodu *
                </label>
                <Input
                  id="zip_code"
                  name="zip_code"
                  value={form.zip_code}
                  onChange={handleChange}
                  placeholder="34000"
                  required
                  maxLength={5}
                />
              </div>

              {/* Default Address Checkbox */}
              <div className="bg-gray-50 rounded-xl p-4">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="is_default"
                      checked={form.is_default}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded-md border-2 transition-all duration-200 ${
                        form.is_default
                          ? "bg-orange-600 border-orange-600"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {form.is_default && (
                        <svg
                          className="w-3 h-3 text-white absolute top-0.5 left-0.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Varsayılan adres yap
                    </div>
                    <div className="text-xs text-gray-500">
                      Bu adres siparişlerinizde otomatik olarak seçilecek
                    </div>
                  </div>
                </label>
              </div>

              {/* Error Message */}
              {error && (
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
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1"
                  size="lg"
                >
                  {loading ? (
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
                      Kaydediliyor...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Adresi Kaydet
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/addresses")}
                  disabled={loading}
                  size="lg"
                >
                  İptal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <span className="text-blue-500 text-lg">💡</span>
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">İpuçları:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Mümkün olduğunca detaylı adres bilgisi verin</li>
                  <li>Apartman girişi, kat ve daire numarasını belirtin</li>
                  <li>Kurye için kolay bulunabilir tarif verin</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AddressCreate;
