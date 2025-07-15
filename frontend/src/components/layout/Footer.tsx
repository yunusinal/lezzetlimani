import { Link } from "react-router-dom";
import {
  Heart,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Twitter,
  Facebook,
  ChefHat,
} from "lucide-react";
import type { FC } from "react";

type FooterLink = { name: string; href: string };
type FooterLinks = {
  company: FooterLink[];
  support: FooterLink[];
  legal: FooterLink[];
};

type SocialLink = {
  name: string;
  icon: FC<{ size?: number; className?: string }>;
  href: string;
  color: string;
};

const Footer: FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks: FooterLinks = {
    company: [
      { name: "Hakkımızda", href: "/about" },
      { name: "Kariyer", href: "/careers" },
      { name: "Basın", href: "/press" },
      { name: "Haberler", href: "/news" },
    ],
    support: [
      { name: "Yardım Merkezi", href: "/help" },
      { name: "İletişim", href: "/contact" },
      { name: "Güvenlik", href: "/security" },
      { name: "SSS", href: "/faq" },
    ],
    legal: [
      { name: "Gizlilik Politikası", href: "/privacy" },
      { name: "Kullanım Şartları", href: "/terms" },
      { name: "Çerez Politikası", href: "/cookies" },
      { name: "KVKK", href: "/kvkk" },
    ],
  };

  const socialLinks: SocialLink[] = [
    {
      name: "Instagram",
      icon: Instagram,
      href: "#",
      color: "hover:text-pink-500",
    },
    { name: "Twitter", icon: Twitter, href: "#", color: "hover:text-blue-400" },
    {
      name: "Facebook",
      icon: Facebook,
      href: "#",
      color: "hover:text-blue-600",
    },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center text-white shadow-lg">
                <ChefHat size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-primary-gradient">
                  Lezzet Limanı
                </h3>
                <p className="text-sm text-gray-400">Lezzet, kapınızda!</p>
              </div>
            </div>

            <p className="text-gray-300 mb-6 leading-relaxed max-w-md">
              Türkiye'nin en hızlı yemek sipariş platformu. Kaliteli
              restoranlar, taze malzemeler ve güvenilir teslimat ile
              sofralarınızı lezzetlendiriyoruz.
            </p>

            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-center space-x-3 group">
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center group-hover:bg-primary/30 transition-colors duration-200">
                  <Phone size={16} className="text-primary" />
                </div>
                <span>+90 (212) 555 01 23</span>
              </div>
              <div className="flex items-center space-x-3 group">
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center group-hover:bg-primary/30 transition-colors duration-200">
                  <Mail size={16} className="text-primary" />
                </div>
                <span>info@lezzetlimani.com</span>
              </div>
              <div className="flex items-center space-x-3 group">
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center group-hover:bg-primary/30 transition-colors duration-200">
                  <MapPin size={16} className="text-primary" />
                </div>
                <span>İstanbul, Türkiye</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4 mt-8">
              <span className="text-sm text-gray-400">Bizi takip edin:</span>
              <div className="flex space-x-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className={`w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center 
                              hover:bg-gray-700 transition-all duration-200 ${social.color} group`}
                    aria-label={social.name}
                  >
                    <social.icon
                      size={18}
                      className="group-hover:scale-110 transition-transform duration-200"
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-accent flex items-center">
              <span className="w-2 h-6 bg-accent rounded-full mr-3"></span>
              Şirket
            </h3>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-accent text-sm hover:translate-x-1 transform transition duration-200 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-success flex items-center">
              <span className="w-2 h-6 bg-success rounded-full mr-3"></span>
              Destek
            </h3>
            <ul className="space-y-4">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-success text-sm hover:translate-x-1 transform transition duration-200 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-secondary flex items-center">
              <span className="w-2 h-6 bg-secondary rounded-full mr-3"></span>
              Yasal
            </h3>
            <ul className="space-y-4">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-secondary text-sm hover:translate-x-1 transform transition duration-200 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>
                &copy; {currentYear} Lezzet Limanı. Tüm hakları saklıdır.
              </span>
              <Heart size={16} className="text-secondary mx-2 animate-pulse" />
              <span>ile yapıldı.</span>
            </div>

            {/* App Download Badges */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-xs text-gray-400">
                <span>Yakında:</span>
                <div className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-xl transition-colors duration-200 cursor-pointer group">
                  <span className="text-xs font-medium group-hover:text-primary">
                    📱 iOS App
                  </span>
                </div>
                <div className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-xl transition-colors duration-200 cursor-pointer group">
                  <span className="text-xs font-medium group-hover:text-primary">
                    🤖 Android App
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
