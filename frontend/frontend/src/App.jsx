import{BrowserRouter as Router, Route, Routes}from"react-router-dom";import React from"react";
import ProductList from "./pages/ProductList";
import ProductDetails from "./pages/ProductDetails";
import NavBar from "./components/NavBar";
import CartPage from "./pages/CartPage";

function App() {
  return (
    <Router>
      <NavBar />      
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </Router>
  );
}

export default App;