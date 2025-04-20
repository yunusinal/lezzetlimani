
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import AuthLayout from "@/components/AuthLayout";

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    acceptTerms: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      acceptTerms: checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.passwordConfirm) {
      toast.error("Lütfen tüm alanları doldurun");
      return;
    }

    if (formData.password !== formData.passwordConfirm) {
      toast.error("Şifreler eşleşmiyor");
      return;
    }

    if (!formData.acceptTerms) {
      toast.error("Kullanım şartlarını kabul etmelisiniz");
      return;
    }

    try {
      setIsLoading(true);

      // Apı isteğini simüle ediyoruz.
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Deneme amaçlı sadece toast kayıt başarılı mesajı veriyoruz.
      toast.success("Kayıt başarılı! Giriş yapabilirsiniz.");
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Kayıt işlemi başarısız oldu. Lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Yeni Hesap Oluşturun"
      type="register"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Ad Soyad</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Adınız Soyadınız"
            value={formData.name}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">E-posta</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="ornek@mail.com"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            disabled={isLoading}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Şifre</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
            disabled={isLoading}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="passwordConfirm">Şifre Tekrar</Label>
          <Input
            id="passwordConfirm"
            name="passwordConfirm"
            type="password"
            placeholder="••••••••"
            value={formData.passwordConfirm}
            onChange={handleChange}
            autoComplete="new-password"
            disabled={isLoading}
            required
          />
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox
            id="acceptTerms"
            checked={formData.acceptTerms}
            onCheckedChange={handleCheckboxChange}
            disabled={isLoading}
            className="mt-1"
          />
          <Label htmlFor="acceptTerms" className="text-sm font-normal">
            <span>
              <a href="/terms" className="underline">Kullanım Şartları</a> ve{" "}
              <a href="/privacy" className="underline">Gizlilik Politikası</a>'nı okudum ve kabul ediyorum.
            </span>
          </Label>
        </div>

        <Button
          type="submit"
          className="w-full bg-brand-red hover:bg-brand-red/90"
          disabled={isLoading}
        >
          {isLoading ? "Kayıt Yapılıyor..." : "Kayıt Ol"}
        </Button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-4 text-sm text-gray-500">veya</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          disabled={isLoading}
        >
          <svg
            className="mr-2 h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Google ile Kayıt Ol
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Register;
