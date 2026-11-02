import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "./context/CartContext.jsx";
import AnnouncementBar from "./components/AnnouncementBar/AnnouncementBar.jsx";
import Header from "./components/Header/Header.jsx";
import CartDrawer from "./components/CartDrawer/CartDrawer.jsx";
import Newsletter from "./components/Newsletter/Newsletter.jsx";
import Footer from "./components/Footer/Footer.jsx";
import HomePage from "./pages/HomePage/HomePage.jsx";
import ProductDetail from "./pages/ProductDetail/ProductDetail.jsx";
import CartPage from "./pages/CartPage/CartPage.jsx";
import CategoryPage from "./pages/CategoryPage/CategoryPage.jsx";
import AdminApp from "./admin/App.jsx";

const ADMIN_PREFIXES = ["/admin", "/login", "/signup", "/products", "/customer", "/order"];

export default function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const location = useLocation();

  const isAdminRoute = ADMIN_PREFIXES.some(
    (prefix) =>
      location.pathname === prefix || location.pathname.startsWith(`${prefix}/`)
  );

  if (isAdminRoute) {
    return <AdminApp />;
  }

  return (
    <CartProvider>
      <AnnouncementBar />
      <Header onCartClick={() => setCartOpen(true)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/category/:style" element={<CategoryPage />} />
        </Routes>
      </main>

      <Newsletter />
      <Footer />
    </CartProvider>
  );
}
