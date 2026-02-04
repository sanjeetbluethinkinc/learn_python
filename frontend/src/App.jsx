import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import NavBar from "./components/NavBar";
import ProductList from "./components/pages/ProductList";
import ProductDetails from "./components/pages/ProductDetails";
import CartPage from "./components/pages/CartPage";
import CheckoutPage from "./components/pages/CheckoutPage";
import BannerSlider from "./components/BannerSlider";

function App() {
  return (
    <Router>
      
      <NavBar />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <BannerSlider />
              <ProductList />
            </>
          }
        />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
      </Routes>
    </Router>
  );
}

export default App;
