import { useCart } from "../../context/CartContext";

function CartPage() {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const shippingFee = subtotal < 199 && subtotal > 0 ? 99 : 0;
  const total = subtotal + shippingFee;

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

          {/* 🛒 CART ITEMS */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => {
              const imageUrl = item.image
                ? item.image.startsWith("http")
                  ? item.image
                  : `${BASEURL}${item.image}`
                : "https://via.placeholder.com/150";

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-sm border p-5 flex gap-6 items-center"
                >
                  {/* Image */}
                  <img
                    src={imageUrl}
                    alt={item.name}
                    className="w-28 h-28 object-cover rounded-xl border"
                  />

                  {/* Info */}
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {item.name}
                    </h2>
                    <p className="text-gray-500 mt-1">
                      ₹{Number(item.price).toFixed(2)}
                    </p>

                    {/* Quantity */}
                    <div className="flex items-center gap-3 mt-4">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, Math.max(1, item.quantity - 1))
                        }
                        className="w-9 h-9 rounded-full border
                                   flex items-center justify-center
                                   hover:bg-gray-100 transition"
                      >
                        −
                      </button>

                      <span className="w-8 text-center font-semibold">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-9 h-9 rounded-full border
                                   flex items-center justify-center
                                   hover:bg-gray-100 transition"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-600
                               font-medium transition"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>

          {/* 💳 ORDER SUMMARY */}
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
                  {shippingFee === 0 ? (
                    <span className="text-green-600 font-medium">
                      Free
                    </span>
                  ) : (
                    `₹${shippingFee}`
                  )}
                </span>
              </div>

              <div className="border-t pt-4 flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>

              {shippingFee > 0 && (
                <p className="text-sm text-gray-500">
                  Add ₹{(199 - subtotal).toFixed(2)} more for free shipping.
                </p>
              )}
            </div>

            {/* Checkout */}
            <button
              onClick={() => (window.location.href = "/checkout")}
              className="mt-6 w-full bg-orange-500 text-white
                         py-3 rounded-xl text-lg font-semibold
                         hover:bg-orange-600 active:scale-95 transition"
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
