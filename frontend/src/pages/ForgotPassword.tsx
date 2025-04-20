
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import AuthLayout from "@/components/AuthLayout";

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Lütfen e-posta adresinizi girin");
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Simulating API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, just show success
      toast.success("Şifre sıfırlama talimatları e-posta adresinize gönderildi");
      setIsSubmitted(true);
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error("İşlem başarısız oldu. Lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AuthLayout 
      title="Şifrenizi Sıfırlayın" 
      subtitle="E-posta adresinizi girin, size şifre sıfırlama talimatlarını gönderelim"
      type="forgot-password"
    >
      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">E-posta</Label>
            <Input
              id="email"
              type="email"
              placeholder="ornek@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              disabled={isLoading}
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-brand-red hover:bg-brand-red/90" 
            disabled={isLoading}
          >
            {isLoading ? "İşleniyor..." : "Şifre Sıfırlama Linki Gönder"}
          </Button>
        </form>
      ) : (
        <div className="text-center py-6">
          <div className="mb-4 bg-green-50 text-green-700 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Şifre Sıfırlama E-postası Gönderildi</h3>
            <p className="text-sm">
              <span className="font-medium">{email}</span> adresine şifre sıfırlama talimatlarını gönderdik.
              Lütfen gelen kutunuzu kontrol edin ve e-postadaki talimatları takip edin.
            </p>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">
            E-postayı alamadınız mı? Spam klasörünü kontrol edin veya tekrar göndermeyi deneyin.
          </p>
          
          <Button 
            onClick={() => setIsSubmitted(false)} 
            variant="outline"
          >
            Farklı Bir E-posta Dene
          </Button>
        </div>
      )}
    </AuthLayout>
  );
};

export default ForgotPassword;
