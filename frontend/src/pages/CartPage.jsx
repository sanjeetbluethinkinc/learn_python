import { useState } from "react";
import Swal from "sweetalert2";
import { useCart } from "../../context/CartContext";

function CartPage() {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

  const [removingId, setRemovingId] = useState(null);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const shipping_fee = subtotal < 199 && subtotal > 0 ? 99 : 0;
  const total = subtotal + shipping_fee;

  /* ================= REMOVE ITEM ================= */
  const handleRemove = (id, name) => {
    setRemovingId(id);

    setTimeout(() => {
      removeFromCart(id);
      setRemovingId(null);

      Swal.fire({
        icon: "success",
        title: "Removed from Cart",
        text: `${name} removed successfully.`,
        timer: 1400,
        showConfirmButton: false,
      });
    }, 500);
  };

  /* ================= INCREASE QUANTITY (MAX 5) ================= */
  const handleIncrease = (item) => {
    if (item.quantity >= 5) return; // ⛔ hard limit
    updateQuantity(item.id, item.quantity + 1);
  };

  /* ================= DECREASE QUANTITY ================= */
  const handleDecrease = (item) => {
    if (item.quantity === 1) return;
    updateQuantity(item.id, item.quantity - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-10 px-4">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
        Your Cart
      </h1>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          Your cart is empty.
        </p>
      ) : (
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ================= CART ITEMS ================= */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => {
              const imageUrl = item.image
                ? item.image.startsWith("http")
                  ? item.image
                  : `${BASEURL}${item.image}`
                : "https://via.placeholder.com/150";

              const isRemoving = removingId === item.id;

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl shadow-sm border p-5 flex gap-6 items-center
                    transition-all duration-500 ease-in-out
                    ${
                      isRemoving
                        ? "opacity-0 scale-95 -translate-x-4"
                        : "opacity-100 scale-100"
                    }`}
                >
                  {/* IMAGE */}
                  <img
                    src={imageUrl}
                    alt={item.name}
                    className="w-28 h-28 object-cover rounded-xl"
                  />

                  {/* INFO */}
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {item.name}
                    </h2>

                    <p className="text-gray-600 mt-1">
                      ₹{Number(item.price).toFixed(2)}
                    </p>

                    {/* QUANTITY CONTROLS */}
                    <div className="flex items-center gap-3 mt-4">
                      <button
                        disabled={item.quantity === 1 || isRemoving}
                        onClick={() => handleDecrease(item)}
                        className="w-9 h-9 rounded-full border flex items-center justify-center
                                   hover:bg-gray-100 transition disabled:opacity-40"
                      >
                        −
                      </button>

                      <span className="w-8 text-center font-semibold">
                        {item.quantity}
                      </span>

                      <button
                        disabled={isRemoving || item.quantity >= 5}
                        onClick={() => handleIncrease(item)}
                        className="w-9 h-9 rounded-full border flex items-center justify-center
                                   hover:bg-gray-100 transition disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>

                    {/* LIMIT INFO */}
                    <p className="text-xs text-gray-500 mt-2">
                      Max quantity allowed: 5
                    </p>
                  </div>

                  {/* REMOVE BUTTON */}
                  <button
                    disabled={isRemoving}
                    onClick={() => handleRemove(item.id, item.name)}
                    className={`font-medium transition flex items-center gap-2
                      ${
                        isRemoving
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-red-500 hover:text-red-600"
                      }`}
                  >
                    {isRemoving ? (
                      <>
                        <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span>
                        Removing...
                      </>
                    ) : (
                      "Remove"
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* ================= ORDER SUMMARY ================= */}
          <div className="bg-white rounded-2xl shadow-md border p-6 h-fit sticky top-24">
            <h3 className="text-2xl font-semibold mb-6 text-gray-800">
              Order Summary
            </h3>

            <div className="space-y-4 text-gray-700">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {shipping_fee === 0 ? (
                    <span className="text-green-600 font-medium">Free</span>
                  ) : (
                    `₹${shipping_fee}`
                  )}
                </span>
              </div>

              <div className="border-t pt-4 flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => (window.location.href = "/checkout")}
              className="mt-6 w-full bg-orange-500 text-white py-3 rounded-xl
                         text-lg font-semibold hover:bg-orange-600 active:scale-95 transition"
            >
              Buy Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;
