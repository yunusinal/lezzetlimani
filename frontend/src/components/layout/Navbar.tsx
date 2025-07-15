import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  ShoppingCart,
  Menu,
  X,
  Home,
  ChefHat,
  MapPin,
  LogOut,
  Code,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { items } = useCart();

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navigation = [
    { name: "Ana Sayfa", href: "/", icon: Home },
    { name: "Restoranlar", href: "/restaurants", icon: ChefHat },
    { name: "API Docs", href: "/api-docs", icon: Code },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 bg-surface/95 backdrop-blur-lg border-b border-border shadow-sm"
    >
      <div className="section-container">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-md"
            >
              🍽️
            </motion.div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-primary-gradient">
                Lezzet Limanı
              </h1>
              <p className="text-xs text-muted-foreground -mt-1">
                Lezzet, kapınızda!
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="nav-link flex items-center space-x-2 font-medium group"
              >
                <item.icon
                  size={18}
                  className="group-hover:scale-110 transition-transform duration-200"
                />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Location Indicator */}
            {isAuthenticated && (
              <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 bg-success/10 text-success rounded-lg text-sm font-medium">
                <MapPin size={14} />
                <span>İstanbul</span>
              </div>
            )}

            {/* Cart */}
            {isAuthenticated && (
              <Link
                to="/cart"
                className="relative p-2.5 text-muted-foreground hover:text-primary hover:bg-primary/5 
                          rounded-lg transition-all duration-200 group"
              >
                <ShoppingCart
                  size={20}
                  className="group-hover:scale-110 transition-transform duration-200"
                />
                {cartItemCount > 0 && (
                  <Badge
                    className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center
                              bg-secondary text-white border-0 animate-pulse"
                  >
                    {cartItemCount}
                  </Badge>
                )}
              </Link>
            )}

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-2">
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 px-3 py-2 text-foreground hover:text-primary
                            hover:bg-primary/5 rounded-lg transition-all duration-200 group font-medium"
                >
                  <User
                    size={16}
                    className="group-hover:scale-110 transition-transform duration-200"
                  />
                  <span>{user?.full_name || "Kullanıcı"}</span>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-muted-foreground hover:text-secondary hover:bg-secondary/5 p-2"
                >
                  <LogOut size={16} />
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link to="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-foreground hover:text-primary hover:bg-primary/5"
                  >
                    Giriş Yap
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="btn-primary shadow-sm">Kayıt Ol</Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              className="md:hidden text-muted-foreground hover:text-primary hover:bg-primary/5"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-surface/95 backdrop-blur-lg border-t border-border"
          >
            <div className="section-container py-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={toggleMenu}
                  className="flex items-center space-x-3 px-4 py-3 text-foreground hover:text-primary 
                            hover:bg-primary/5 rounded-lg transition-all duration-200 font-medium"
                >
                  <item.icon size={18} />
                  <span>{item.name}</span>
                </Link>
              ))}

              <div className="border-t border-border pt-4 mt-4">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <Link
                      to="/dashboard"
                      onClick={toggleMenu}
                      className="flex items-center space-x-3 px-4 py-3 text-foreground hover:text-primary 
                                hover:bg-primary/5 rounded-lg transition-all duration-200 font-medium"
                    >
                      <User size={18} />
                      <span>{user?.full_name || "Kullanıcı"}</span>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        logout();
                        toggleMenu();
                      }}
                      className="w-full justify-start text-secondary hover:text-secondary hover:bg-secondary/10"
                    >
                      <LogOut size={16} className="mr-2" />
                      Çıkış Yap
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link to="/login" onClick={toggleMenu}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-foreground hover:text-primary hover:bg-primary/5"
                      >
                        Giriş Yap
                      </Button>
                    </Link>
                    <Link to="/register" onClick={toggleMenu}>
                      <Button className="w-full btn-primary">Kayıt Ol</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
