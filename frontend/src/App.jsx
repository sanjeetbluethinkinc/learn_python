import { Routes, Route } from "react-router-dom";

import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import BannerSlider from "./components/BannerSlider";

// Pages
import ProductList from "./components/pages/ProductList";
import ProductDetails from "./components/pages/ProductDetails";
import CartPage from "./components/pages/CartPage";
import CheckoutPage from "./components/pages/CheckoutPage";
import AboutPage from "./components/pages/AboutPage";
import HomeSection from "./components/pages/HomeSection";
import ReviewsLayout from "./components/reviews/ReviewsLayout";
import ContactUs from "./pages/ContactUs";
import AllProducts from "./components/pages/AllProducts";
import CategoriesPage from "./components/pages/CategoriesPage";
// Category
import CategoryProducts from "./components/CategoryProducts";
import MyOrders from "./components/pages/MyOrders";
// Auth
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

        {/* ✅ CATEGORY ROUTE (IMPORTANT) */}
        <Route
          path="/products/category/:slug"
          element={<CategoryProducts />}
        />
        <Route path="/all-products" element={<AllProducts />} />
        <Route path="/categories" element={<CategoriesPage />} />

        {/* PRODUCT DETAILS */}
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
        <Route path="/my-orders" element={<MyOrders />} />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </>
  );
}

export default App;