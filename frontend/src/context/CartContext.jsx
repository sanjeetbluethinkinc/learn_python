import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {

  // ✅ LOAD CART FROM LOCALSTORAGE
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem("cart_items");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  // ✅ SAVE CART TO LOCALSTORAGE ON EVERY CHANGE
  useEffect(() => {
    localStorage.setItem("cart_items", JSON.stringify(cartItems));
  }, [cartItems]);

  // ---------------- ADD TO CART ----------------
  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prevItems, { ...product, quantity }];
    });
  };

  // ---------------- REMOVE FROM CART ----------------
  const removeFromCart = (id) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== id)
    );
  };

  // ---------------- UPDATE QUANTITY ----------------
  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  // ---------------- CLEAR CART (OPTIONAL) ----------------
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart_items");
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
};
