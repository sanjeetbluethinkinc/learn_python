import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {

  // LOAD CART FROM LOCALSTORAGE
  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem("cart_items");
    return stored ? JSON.parse(stored) : [];
  });

  // SAVE CART TO LOCALSTORAGE
  useEffect(() => {
    localStorage.setItem("cart_items", JSON.stringify(cartItems));
  }, [cartItems]);

  // ---------------- ADD TO CART ----------------
  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);

      const price = Number(product.price);
      const qty = Math.min(quantity, 5);

      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: Math.min(item.quantity + qty, 5),
                subtotal:
                  Math.min(item.quantity + qty, 5) * item.price,
              }
            : item
        );
      }

      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: price,
          image: product.image,
          quantity: qty,
          subtotal: price * qty,
        },
      ];
    });
  };

  // ---------------- REMOVE FROM CART ----------------
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // ---------------- UPDATE QUANTITY ----------------
  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;

    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const qty = Math.min(Math.max(quantity, 1), 5);
          return {
            ...item,
            quantity: qty,
            subtotal: qty * item.price,
          };
        }
        return item;
      })
    );
  };

  // ---------------- CLEAR CART ----------------
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
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return ctx;
};
