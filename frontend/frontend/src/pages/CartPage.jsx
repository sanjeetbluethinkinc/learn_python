import { useCart } from "../context/CartContext";

function CartPage() {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-orange-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Shopping Cart
      </h1>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
          {cartItems.map((item) => {
            const imageUrl = item.image
              ? item.image.startsWith("http")
                ? item.image
                : `${BASEURL}${item.image}`
              : "https://via.placeholder.com/100x100?text=No+Image";

            return (
              <div
                key={item.id}
                className="flex items-center justify-between border-b py-4 gap-4"
              >
                {/* 🖼 Product Image */}
                <img
                  src={imageUrl}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg border"
                />

                {/* 📦 Product Info */}
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {item.name}
                  </h2>
                  <p className="text-gray-600">
                    ₹{Number(item.price).toFixed(2)}
                  </p>
                </div>

                {/* 🔢 Quantity + Remove */}
             <div className="flex items-center gap-3">
  {/* ➖ Minus */}
  <button
    onClick={() =>
      updateQuantity(item.id, Math.max(1, item.quantity - 1))
    }
    className="w-9 h-9 flex items-center justify-center
               rounded-full border border-gray-300
               text-xl font-bold text-gray-700
               hover:bg-gray-100 active:scale-95 transition"
  >
    −
  </button>

  {/* 🔢 Quantity */}
  <span className="min-w-[32px] text-center text-lg font-semibold">
    {item.quantity}
  </span>

  {/* ➕ Plus */}
  <button
    onClick={() =>
      updateQuantity(item.id, item.quantity + 1)
    }
    className="w-9 h-9 flex items-center justify-center
               rounded-full border border-gray-300
               text-xl font-bold text-gray-700
               hover:bg-gray-100 active:scale-95 transition"
  >
    +
  </button>

  {/* ❌ Remove */}
  <button
    onClick={() => removeFromCart(item.id)}
    className="ml-4 bg-red-500 text-white px-4 py-2 rounded-lg
               hover:bg-red-600 active:scale-95 transition"
  >
    Remove
  </button>
</div>

              </div>
            );
          })}

          {/* 💰 Total */}
          <div className="text-right mt-6">
            <h3 className="text-2xl font-bold text-gray-800">
              Total: ${total.toFixed(2)}
            </h3>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;
