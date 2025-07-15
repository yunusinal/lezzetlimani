import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Calendar, Phone, Users, Save, ArrowLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { updateCurrentUser } from "../../api/user/user.api";
import type { UserUpdateSchema } from "../../types";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

const UpdateProfile = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<UserUpdateSchema>({
    full_name: user?.full_name || "",
    born_date: user?.born_date || "",
    gender: user?.gender || "",
    phone: user?.phone || "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await updateCurrentUser(form);
      setUser(res.data);
      setMessage("Profil güncellendi.");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      setMessage("Güncelleme başarısız.");
    } finally {
      setLoading(false);
    }
  };

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
            <h1 className="text-3xl font-bold text-gray-900">Profil Düzenle</h1>
            <p className="text-gray-600 mt-2">
              Kişisel bilgilerinizi güncelleyin
            </p>
          </div>
          <Link to="/dashboard">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Dashboard'a Dön
            </Button>
          </Link>
        </div>

        {/* Profile Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-orange-600" />
              Kişisel Bilgiler
            </CardTitle>
            <CardDescription>
              Bu bilgiler siparişlerinizde ve hesap bilgilerinizde
              görüntülenecek
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="full_name"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Ad Soyad *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      id="full_name"
                      name="full_name"
                      value={form.full_name}
                      onChange={handleChange}
                      placeholder="Adınız ve soyadınız"
                      required
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Telefon Numarası *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      id="phone"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="0555 123 45 67"
                      required
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Birth Date */}
                <div>
                  <label
                    htmlFor="born_date"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Doğum Tarihi *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      id="born_date"
                      type="date"
                      name="born_date"
                      value={form.born_date}
                      onChange={handleChange}
                      required
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label
                    htmlFor="gender"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Cinsiyet *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Users className="h-4 w-4 text-gray-400" />
                    </div>
                    <select
                      id="gender"
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                      required
                      className="flex h-11 w-full rounded-xl border border-gray-300 bg-white/90 px-3 py-2 pl-10 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <option value="">Cinsiyet seçin</option>
                      <option value="male">Erkek</option>
                      <option value="female">Kadın</option>
                      <option value="other">Diğer</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Success/Error Message */}
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-xl ${
                    message.includes("güncellendi")
                      ? "bg-green-50 border border-green-200"
                      : "bg-red-50 border border-red-200"
                  }`}
                >
                  <div className="flex items-center">
                    <span
                      className={`text-sm mr-2 ${
                        message.includes("güncellendi")
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {message.includes("güncellendi") ? "✅" : "⚠️"}
                    </span>
                    <p
                      className={`text-sm font-medium ${
                        message.includes("güncellendi")
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      {message}
                    </p>
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
                      Güncelleniyor...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Değişiklikleri Kaydet
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                  disabled={loading}
                  size="lg"
                >
                  İptal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Hesap Güvenliği</CardTitle>
            <CardDescription>
              E-posta adresi ve şifre değişiklikleri için güvenlik işlemleri
              gereklidir
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start">
                <span className="text-blue-500 text-sm mr-2 mt-0.5">ℹ️</span>
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">
                    Hesap bilgileriniz güvendedir
                  </p>
                  <p>
                    E-posta veya şifre değişikliği için müşteri hizmetleri ile
                    iletişime geçin.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default UpdateProfile;
