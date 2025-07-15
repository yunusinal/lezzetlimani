import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  Server,
  Database,
  Code,
  Book,
  Globe,
  Layers,
  ShoppingCart,
  Users,
  MapPin,
  Utensils,
  Shield,
  Bell,
  Info,
  Copy,
  CheckCircle,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";

interface ApiService {
  name: string;
  description: string;
  icon: React.ReactNode;
  technology: "FastAPI" | "Go";
  status: "active" | "maintenance";
  docsUrl: string;
  redocUrl?: string;
  baseUrl: string;
  port: number;
  color: string;
}

const apiServices: ApiService[] = [
  {
    name: "Cart Service",
    description: "Sepet yönetimi, ürün ekleme/çıkarma, miktar güncelleme",
    icon: <ShoppingCart size={24} />,
    technology: "FastAPI",
    status: "active",
    docsUrl: "https://lezzetlimani.site/carts/docs",
    redocUrl: "https://lezzetlimani.site/carts/redoc",
    baseUrl: "/carts",
    port: 8086,
    color: "from-blue-500 to-purple-600",
  },
  {
    name: "Meal Service",
    description: "Yemek kataloğu, menü yönetimi, fiyatlandırma",
    icon: <Utensils size={24} />,
    technology: "FastAPI",
    status: "active",
    docsUrl: "https://lezzetlimani.site/meals/docs",
    redocUrl: "https://lezzetlimani.site/meals/redoc",
    baseUrl: "/meals",
    port: 8085,
    color: "from-green-500 to-emerald-600",
  },
  {
    name: "User Service",
    description: "Kullanıcı profilleri, hesap yönetimi, tercihler",
    icon: <Users size={24} />,
    technology: "FastAPI",
    status: "active",
    docsUrl: "https://lezzetlimani.site/users/docs",
    redocUrl: "https://lezzetlimani.site/users/redoc",
    baseUrl: "/users",
    port: 8081,
    color: "from-orange-500 to-red-600",
  },
  {
    name: "Address Service",
    description: "Adres yönetimi, konum servisleri, teslimat alanları",
    icon: <MapPin size={24} />,
    technology: "FastAPI",
    status: "active",
    docsUrl: "https://lezzetlimani.site/addresses/docs",
    redocUrl: "https://lezzetlimani.site/addresses/redoc",
    baseUrl: "/addresses",
    port: 8083,
    color: "from-purple-500 to-pink-600",
  },
  {
    name: "Auth Service",
    description: "Kimlik doğrulama, yetkilendirme, token yönetimi",
    icon: <Shield size={24} />,
    technology: "Go",
    status: "active",
    docsUrl: "https://lezzetlimani.site/auth/docs",
    baseUrl: "/auth",
    port: 8080,
    color: "from-yellow-500 to-orange-600",
  },
  {
    name: "Restaurant Service",
    description: "Restoran yönetimi, menü konfigürasyonu, işletme bilgileri",
    icon: <Server size={24} />,
    technology: "Go",
    status: "active",
    docsUrl: "https://lezzetlimani.site/restaurants/docs",
    baseUrl: "/restaurants",
    port: 8084,
    color: "from-cyan-500 to-blue-600",
  },
  {
    name: "Notification Service",
    description: "Bildirim gönderimi, e-posta, push notification",
    icon: <Bell size={24} />,
    technology: "Go",
    status: "active",
    docsUrl: "https://lezzetlimani.site/notification/docs",
    baseUrl: "/notification",
    port: 8082,
    color: "from-pink-500 to-rose-600",
  },
];

export default function ApiDocsPage() {
  const [selectedService, setSelectedService] = useState<ApiService | null>(
    null
  );
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedUrl(text);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (err) {
      // Silent error handling
    }
  };

  const activeFastAPIServices = apiServices.filter(
    (service) => service.technology === "FastAPI" && service.status === "active"
  ).length;

  const activeGoServices = apiServices.filter(
    (service) => service.technology === "Go" && service.status === "active"
  ).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary via-secondary to-accent text-white">
        <div className="section-container py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-2xl">
                <Code size={48} />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              API Documentation
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Lezzet Limanı mikroservis mimarisinin tüm API endpoint'lerine ve
              dokümantasyonlarına buradan erişebilirsiniz.
            </p>
            <div className="flex items-center justify-center space-x-8">
              <div className="text-center">
                <div className="text-3xl font-bold">{apiServices.length}</div>
                <div className="text-white/80">Toplam Servis</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {activeFastAPIServices}
                </div>
                <div className="text-white/80">FastAPI</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{activeGoServices}</div>
                <div className="text-white/80">Go Services</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="section-container py-12">
        {/* Architecture Overview */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Layers className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle className="text-foreground">
                    Mikroservis Mimarisi
                  </CardTitle>
                  <CardDescription>
                    Traefik Gateway ile yönetilen servis altyapısı
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/10 rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <Globe className="h-8 w-8 text-primary mx-auto mb-3" />
                    <h4 className="font-semibold text-foreground mb-2">
                      Domain
                    </h4>
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      lezzetlimani.site
                    </code>
                  </div>
                  <div className="text-center">
                    <Server className="h-8 w-8 text-secondary mx-auto mb-3" />
                    <h4 className="font-semibold text-foreground mb-2">
                      Gateway
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Traefik v2.11
                    </p>
                  </div>
                  <div className="text-center">
                    <Database className="h-8 w-8 text-accent mx-auto mb-3" />
                    <h4 className="font-semibold text-foreground mb-2">
                      Database
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      PostgreSQL 15
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Services Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              API Servisleri
            </h2>
            <p className="text-muted-foreground">
              Her servisin detaylı API dokümantasyonuna erişin
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apiServices.map((service, index) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="group hover:shadow-lg transition-all duration-300 border-border bg-card">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-12 h-12 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center text-white`}
                        >
                          {service.icon}
                        </div>
                        <div>
                          <CardTitle className="text-lg text-foreground">
                            {service.name}
                          </CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge
                              className={
                                service.technology === "FastAPI"
                                  ? "badge-primary"
                                  : "badge-secondary"
                              }
                            >
                              {service.technology}
                            </Badge>
                            <Badge
                              className={
                                service.status === "active"
                                  ? "badge-success"
                                  : "badge-warning"
                              }
                            >
                              {service.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between p-2 bg-muted/10 rounded">
                        <span className="text-muted-foreground">Base URL:</span>
                        <code className="text-primary">{service.baseUrl}</code>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-muted/10 rounded">
                        <span className="text-muted-foreground">Port:</span>
                        <code className="text-foreground">{service.port}</code>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Button
                        onClick={() => window.open(service.docsUrl, "_blank")}
                        className="w-full btn-primary group-hover:scale-105 transition-transform"
                        size="sm"
                      >
                        <Book size={16} className="mr-2" />
                        Swagger UI
                        <ExternalLink size={14} className="ml-2" />
                      </Button>

                      {service.redocUrl && (
                        <Button
                          onClick={() =>
                            window.open(service.redocUrl, "_blank")
                          }
                          variant="outline"
                          className="w-full"
                          size="sm"
                        >
                          <Book size={16} className="mr-2" />
                          ReDoc
                          <ExternalLink size={14} className="ml-2" />
                        </Button>
                      )}

                      <div className="flex space-x-2">
                        <Button
                          onClick={() => copyToClipboard(service.docsUrl)}
                          variant="ghost"
                          size="sm"
                          className="flex-1"
                        >
                          {copiedUrl === service.docsUrl ? (
                            <CheckCircle
                              size={14}
                              className="mr-1 text-success"
                            />
                          ) : (
                            <Copy size={14} className="mr-1" />
                          )}
                          {copiedUrl === service.docsUrl
                            ? "Copied!"
                            : "Copy URL"}
                        </Button>
                        <Button
                          onClick={() => setSelectedService(service)}
                          variant="ghost"
                          size="sm"
                        >
                          <Info size={14} className="mr-1" />
                          Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Quick Access */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16"
        >
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Hızlı Erişim</CardTitle>
              <CardDescription>
                En çok kullanılan API endpoint'leri
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button
                  onClick={() =>
                    window.open(
                      "https://lezzetlimani.site/carts/docs",
                      "_blank"
                    )
                  }
                  variant="outline"
                  className="h-auto flex-col py-4 space-y-2"
                >
                  <ShoppingCart size={20} className="text-primary" />
                  <span className="text-sm">Cart API</span>
                </Button>
                <Button
                  onClick={() =>
                    window.open(
                      "https://lezzetlimani.site/meals/docs",
                      "_blank"
                    )
                  }
                  variant="outline"
                  className="h-auto flex-col py-4 space-y-2"
                >
                  <Utensils size={20} className="text-success" />
                  <span className="text-sm">Meals API</span>
                </Button>
                <Button
                  onClick={() =>
                    window.open(
                      "https://lezzetlimani.site/users/docs",
                      "_blank"
                    )
                  }
                  variant="outline"
                  className="h-auto flex-col py-4 space-y-2"
                >
                  <Users size={20} className="text-secondary" />
                  <span className="text-sm">Users API</span>
                </Button>
                <Button
                  onClick={() =>
                    window.open("https://lezzetlimani.site/auth/docs", "_blank")
                  }
                  variant="outline"
                  className="h-auto flex-col py-4 space-y-2"
                >
                  <Shield size={20} className="text-accent" />
                  <span className="text-sm">Auth API</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </div>

      {/* Service Detail Modal */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedService(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border rounded-2xl p-6 max-w-md w-full"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${selectedService.color} rounded-xl flex items-center justify-center text-white`}
                >
                  {selectedService.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">
                    {selectedService.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedService.technology} Service
                  </p>
                </div>
              </div>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                {selectedService.description}
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between p-3 bg-muted/10 rounded-lg">
                  <span className="text-muted-foreground">Documentation:</span>
                  <a
                    href={selectedService.docsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Swagger UI
                  </a>
                </div>
                <div className="flex justify-between p-3 bg-muted/10 rounded-lg">
                  <span className="text-muted-foreground">Base URL:</span>
                  <code className="text-primary">
                    {selectedService.baseUrl}
                  </code>
                </div>
                <div className="flex justify-between p-3 bg-muted/10 rounded-lg">
                  <span className="text-muted-foreground">Port:</span>
                  <code className="text-foreground">
                    {selectedService.port}
                  </code>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={() => window.open(selectedService.docsUrl, "_blank")}
                  className="flex-1 btn-primary"
                >
                  <ExternalLink size={16} className="mr-2" />
                  Open Docs
                </Button>
                <Button
                  onClick={() => setSelectedService(null)}
                  variant="outline"
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
