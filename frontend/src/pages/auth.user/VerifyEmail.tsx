import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, AlertCircle, Mail } from "lucide-react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";

const VerifyEmail = () => {
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUserFromToken } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      return;
    }

    const verify = async () => {
      try {
        const response = await api.post("/auth/verify-email", { token });
        const { access_token, refresh_token } = response.data;

        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);

        setUserFromToken(access_token);
        setStatus("success");

        setTimeout(() => {
          navigate("/users/register/complete");
        }, 2000);
      } catch (err) {
        setStatus("error");
      }
    };

    verify();
  }, [searchParams, navigate, setUserFromToken]);

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
          </div>

          {/* Status Card */}
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Mail className="h-5 w-5 text-orange-600" />
                E-posta Doğrulama
              </CardTitle>
            </CardHeader>

            <CardContent className="text-center">
              {status === "verifying" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="flex justify-center">
                    <svg
                      className="animate-spin h-12 w-12 text-orange-600"
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
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      E-postanız Doğrulanıyor...
                    </h3>
                    <p className="text-gray-600">
                      Lütfen bekleyin, e-posta adresinizi doğruluyoruz.
                    </p>
                  </div>
                </motion.div>
              )}

              {status === "success" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-4"
                >
                  <div className="flex justify-center">
                    <CheckCircle className="h-16 w-16 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      E-posta Doğrulandı! ✅
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Hesabınız başarıyla doğrulandı. Profil bilgilerinizi
                      tamamlamak için yönlendiriliyorsunuz...
                    </p>
                    <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                      <p className="text-sm text-green-700">
                        Birkaç saniye içinde otomatik olarak
                        yönlendirileceksiniz.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-4"
                >
                  <div className="flex justify-center">
                    <AlertCircle className="h-16 w-16 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Doğrulama Başarısız ❌
                    </h3>
                    <p className="text-gray-600 mb-6">
                      E-posta doğrulama işlemi başarısız oldu. Link geçersiz
                      olabilir veya süresi dolmuş olabilir.
                    </p>

                    <div className="space-y-4">
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <div className="text-sm text-red-700 space-y-2">
                          <p className="font-medium">Yapabilecekleriniz:</p>
                          <ul className="list-disc list-inside space-y-1">
                            <li>Yeni bir doğrulama e-postası talep edin</li>
                            <li>E-posta adresinizi kontrol edin</li>
                            <li>Spam/junk klasörünü kontrol edin</li>
                          </ul>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <Link to="/register">
                          <Button className="w-full">Yeniden Kayıt Ol</Button>
                        </Link>
                        <Link to="/login">
                          <Button variant="outline" className="w-full">
                            Giriş Sayfasına Dön
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>

          {/* Help Text */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
              Sorun yaşıyorsanız{" "}
              <a
                href="mailto:destek@lezzetlimani.com"
                className="text-orange-600 hover:text-orange-500 font-medium"
              >
                destek@lezzetlimani.com
              </a>{" "}
              adresinden bize ulaşın.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VerifyEmail;
