import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowLeft, ChefHat, Loader2, Info } from "lucide-react";
import { register } from "../../api/auth/auth.api";
import type { RegisterDTO } from "../../types";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

const Register = () => {
  const [form, setForm] = useState<RegisterDTO>({
    email: "",
    password: "",
  });

  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(form);
      navigate("/");
    } catch (err: any) {
      const detail =
        err?.response?.data?.detail ||
        "Kayıt başarısız. Lütfen tekrar deneyin.";
      setError(detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center space-x-3 mb-8 text-muted-foreground hover:text-primary transition-colors duration-200 group"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center text-white shadow-md group-hover:shadow-lg transition-shadow">
              <ChefHat size={20} />
            </div>
            <span className="text-xl font-bold text-primary-gradient">
              Lezzet Limanı
            </span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Hesap Oluşturun
            </h2>
            <p className="text-muted-foreground">
              Birkaç dakika içinde ücretsiz hesap oluşturun ve lezzetli dünyaya
              katılın
            </p>
          </motion.div>
        </div>

        {/* Register Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="shadow-lg border-border bg-card">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl text-center text-foreground">
                Ücretsiz Kayıt
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-foreground"
                  >
                    E-posta Adresi
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="ornek@email.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="pl-10 input-modern"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    E-posta adresinizi doğrulamak için bir link göndereceğiz
                  </p>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-foreground"
                  >
                    Şifre
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      name="password"
                      placeholder="Güçlü bir şifre oluşturun"
                      value={form.password}
                      onChange={handleChange}
                      required
                      className="pl-10 input-modern"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    En az 6 karakter uzunluğunda olmalıdır
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="bg-destructive/10 border border-destructive/20 rounded-lg p-4"
                  >
                    <p className="text-sm text-destructive font-medium">
                      {error}
                    </p>
                  </motion.div>
                )}

                {/* Terms Notice */}
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Info className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-foreground">
                      Hesap oluşturarak{" "}
                      <span className="font-medium text-primary">
                        Kullanım Şartları
                      </span>{" "}
                      ve{" "}
                      <span className="font-medium text-primary">
                        Gizlilik Politikası
                      </span>
                      'nı kabul etmiş olursunuz.
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary text-base py-3 shadow-lg hover:shadow-primary-glow"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Hesap Oluşturuluyor...
                    </>
                  ) : (
                    "Ücretsiz Hesap Oluştur"
                  )}
                </Button>
              </form>

              {/* Footer Links */}
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Zaten hesabınız var mı?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-primary hover:text-primary/80 transition-colors duration-200"
                  >
                    Giriş Yapın
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-6"
        >
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center justify-center space-x-2 group"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span>Ana Sayfaya Dön</span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;
