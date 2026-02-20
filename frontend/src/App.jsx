import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import BannerSlider from "./components/BannerSlider";
import ScrollToTop from "./components/ScrollToTop";
// Pages
import BestSellerPage from "./components/pages/BestSellerPage";
import NewArrivalSection from "./components/sections/NewArrivalSection";
import BestSellerSection from "./components/sections/BestSellerSection";
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
import NewArrivalPage from "./components/pages/NewArrivalPage";
import ManageAddress from "./components/pages/ManageAddress";

import NotFound from "./components/pages/NotFound";
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
    <ScrollToTop />
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
              <NewArrivalSection />
              <ReviewsLayout />
              <BestSellerSection />
            </>
          }
        />

        {/* ================= SPECIAL PAGES ================= */}
        <Route path="/best-sellers" element={<BestSellerPage />} />
        <Route path="/new-arrivals" element={<NewArrivalPage />} />

        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactUs />} />

        {/* ================= CATEGORY ROUTES ================= */}
        <Route
          path="/products/category/:slug"
          element={<CategoryProducts />}
        />
        <Route path="/all-products" element={<AllProducts />} />
        <Route path="/categories" element={<CategoriesPage />} />
        

        {/* ================= PRODUCT DETAILS ================= */}
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
        <Route path="/manage-address" element={<ManageAddress />} />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />

        {/* ================= 404 PAGE (ALWAYS LAST) ================= */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
