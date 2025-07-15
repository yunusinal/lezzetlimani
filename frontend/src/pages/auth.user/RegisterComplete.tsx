import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Calendar, Phone, Users } from "lucide-react";
import { registerComplete } from "../../api/user/user.api";
import type { RegisterCompleteDTO } from "../../types";
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

const RegisterComplete = () => {
  const [form, setForm] = useState<Omit<RegisterCompleteDTO, "id">>({
    full_name: "",
    born_date: "",
    gender: "",
    phone: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Oturum doğrulaması eksik");

      const response = await registerComplete(form);
      setUser(response.data.user);
      navigate("/dashboard");
    } catch (err: any) {
      const detail =
        err?.response?.data?.detail || err.message || "İşlem başarısız.";
      setError(detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <Link
              to="/"
              className="inline-flex items-center space-x-2 mb-6 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <span className="text-2xl">🍽️</span>
              <span className="text-xl font-bold">Lezzet Limanı</span>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Profilini Tamamla
            </h1>
            <p className="text-gray-600">
              Kişisel bilgilerini ekleyerek hesabını tamamla
            </p>
          </div>

          {/* Form Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-orange-600" />
                Kişisel Bilgiler
              </CardTitle>
              <CardDescription>
                Bu bilgiler siparişlerinizde kullanılacak
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
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
                      type="text"
                      name="full_name"
                      placeholder="Adınız ve soyadınız"
                      value={form.full_name}
                      onChange={handleChange}
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
                      type="tel"
                      name="phone"
                      placeholder="0555 123 45 67"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="flex items-center">
                      <span className="text-red-500 text-sm mr-2">⚠️</span>
                      <p className="text-sm text-red-700 font-medium">
                        {error}
                      </p>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full"
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
                    "Profili Tamamla"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Back to Home */}
          <div className="text-center mt-6">
            <Link
              to="/"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200 flex items-center justify-center space-x-1"
            >
              <span>←</span>
              <span>Ana Sayfaya Dön</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterComplete;
