import { Routes, Route } from "react-router-dom";

import NavBar from "./components/NavBar";
import BannerSlider from "./components/BannerSlider";

import ProductList from "./components/pages/ProductList";
import ProductDetails from "./components/pages/ProductDetails";
import CartPage from "./components/pages/CartPage";
import CheckoutPage from "./components/pages/CheckoutPage";
import AboutPage from "./components/pages/AboutPage";
import CategoryProducts from "./components/CategoryProducts";
import HomeSection from "./components/pages/HomeSection";
import ReviewsLayout from "./components/reviews/ReviewsLayout";
import ContactUs from "./pages/ContactUs";

// 🔐 AUTH
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <NavBar />

      <Routes>
        {/* ================= HOME ================= */}
        <Route
          path="/"
          element={
            <>
              <BannerSlider />
              <ProductList />
              <HomeSection />
              <ReviewsLayout />
            </>
          }
        />

        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/category/:slug" element={<CategoryProducts />} />
        <Route path="/products/:id" element={<ProductDetails />} />

        {/* ================= PROTECTED ROUTES ================= */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
