import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { Layout } from "./components/layout";
import { NotificationContainer } from "./components/ui/notification-container";

import Home from "./pages/auth.user/Home";
import Register from "./pages/auth.user/Register";
import RegisterComplete from "./pages/auth.user/RegisterComplete";
import Login from "./pages/auth.user/Login";
import Dashboard from "./pages/auth.user/Dashboard";
import VerifyEmail from "./pages/auth.user/VerifyEmail";
import UpdateProfile from "./pages/auth.user/UpdateProfile";
import AddressList from "./pages/address/AddressList";
import AddressCreate from "./pages/address/AddressCreate";
import AddressUpdate from "./pages/address/AddressUpdate";
import AddressDetail from "./pages/address/AddressDetail";
import AddressDelete from "./pages/address/AddressDelete";
import RestaurantMealsPage from "./pages/restaurants/RestorantMeal";
import CartPage from "./pages/cart/Cart";
import ApiDocsPage from "./pages/ApiDocs";
import RestaurantsPage from "./pages/Restaurants";
import ForgotPassword from "./pages/auth.user/ForgotPassword";
import ResetPassword from "./pages/auth.user/ResetPassword";
import CampaignsPage from "./pages/Campaigns";
import OrderHistory from "./pages/cart/OrderHistory";

const ProtectedRoute = ({
  children,
  requireProfileComplete = true,
}: {
  children: React.ReactNode;
  requireProfileComplete?: boolean;
}) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireProfileComplete && !user?.full_name) {
    return <Navigate to="/users/register/complete" replace />;
  }

  if (!requireProfileComplete && user?.full_name) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const PublicOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <AnimatePresence mode="wait">
            <Routes>
              {/* Auth Pages without Layout */}
              <Route
                path="/login"
                element={
                  <PublicOnlyRoute>
                    <Login />
                  </PublicOnlyRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicOnlyRoute>
                    <Register />
                  </PublicOnlyRoute>
                }
              />
              <Route
                path="/auth/verify-email"
                element={
                  <PublicOnlyRoute>
                    <VerifyEmail />
                  </PublicOnlyRoute>
                }
              />
              <Route
                path="/forgot-password"
                element={
                  <PublicOnlyRoute>
                    <ForgotPassword />
                  </PublicOnlyRoute>
                }
              />
              <Route
                path="/reset-password"
                element={
                  <PublicOnlyRoute>
                    <ResetPassword />
                  </PublicOnlyRoute>
                }
              />

              {/* Pages with Layout */}
              <Route
                path="/"
                element={
                  <Layout>
                    <Home />
                  </Layout>
                }
              />
              <Route
                path="/users/register/complete"
                element={
                  <Layout>
                    <ProtectedRoute requireProfileComplete={false}>
                      <RegisterComplete />
                    </ProtectedRoute>
                  </Layout>
                }
              />
              <Route
                path="/profile"
                element={
                  <Layout>
                    <ProtectedRoute>
                      <UpdateProfile />
                    </ProtectedRoute>
                  </Layout>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <Layout>
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  </Layout>
                }
              />

              {/* Address Routes */}
              <Route
                path="/addresses"
                element={
                  <Layout>
                    <ProtectedRoute>
                      <AddressList />
                    </ProtectedRoute>
                  </Layout>
                }
              />
              <Route
                path="/addresses/new"
                element={
                  <Layout>
                    <ProtectedRoute>
                      <AddressCreate />
                    </ProtectedRoute>
                  </Layout>
                }
              />
              <Route
                path="/addresses/:addressId/edit"
                element={
                  <Layout>
                    <ProtectedRoute>
                      <AddressUpdate />
                    </ProtectedRoute>
                  </Layout>
                }
              />
              <Route
                path="/addresses/:addressId"
                element={
                  <Layout>
                    <ProtectedRoute>
                      <AddressDetail />
                    </ProtectedRoute>
                  </Layout>
                }
              />
              <Route
                path="/addresses/:addressId/delete"
                element={
                  <Layout>
                    <ProtectedRoute>
                      <AddressDelete />
                    </ProtectedRoute>
                  </Layout>
                }
              />

              {/* Restaurant and Cart Routes */}
              <Route
                path="/restaurants/:id"
                element={
                  <Layout>
                    <RestaurantMealsPage />
                  </Layout>
                }
              />
              <Route
                path="/restaurants/:id/order"
                element={
                  <Layout>
                    <ProtectedRoute>
                      <CartPage />
                    </ProtectedRoute>
                  </Layout>
                }
              />
              <Route
                path="/cart"
                element={
                  <Layout>
                    <ProtectedRoute>
                      <CartPage />
                    </ProtectedRoute>
                  </Layout>
                }
              />

              {/* API Docs Route */}
              <Route
                path="/api-docs"
                element={
                  <Layout>
                    <ApiDocsPage />
                  </Layout>
                }
              />

              {/* Restaurants Page Route */}
              <Route
                path="/restaurants"
                element={
                  <Layout>
                    <RestaurantsPage />
                  </Layout>
                }
              />

              {/* Campaigns Page Route */}
              <Route
                path="/campaigns"
                element={
                  <Layout>
                    <CampaignsPage />
                  </Layout>
                }
              />

              {/* Order History Route */}
              <Route
                path="/orders"
                element={
                  <Layout>
                    <ProtectedRoute>
                      <OrderHistory />
                    </ProtectedRoute>
                  </Layout>
                }
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </Router>
        <Toaster position="top-right" />
        <NotificationContainer position="top-left" />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
