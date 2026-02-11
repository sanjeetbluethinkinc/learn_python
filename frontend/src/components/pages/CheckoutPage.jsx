import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // ADDRESS STATE (FRONTEND FRIENDLY)
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
  });

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  // TOTAL CALCULATIONS
  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const shipping_fee = subtotal > 0 && subtotal < 199 ? 99 : 0;
  const total_amount = subtotal + shipping_fee;

  const handlePlaceOrder = async () => {
    // EMPTY CART CHECK
    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }

    // ADDRESS VALIDATION
    for (let key in address) {
      if (!address[key]) {
        alert("Please fill all address fields");
        return;
      }
    }

    // AUTH TOKEN
    const token = localStorage.getItem("access");
    if (!token) {
      alert("Please login to place an order");
      navigate("/login");
      return;
    }

    // FINAL PAYLOAD (MATCHES DJANGO EXACTLY)
    const payload = {
      subtotal,
      shipping_fee,
      total_amount,
      address: {
        full_name: address.fullName,
        phone: address.phone,
        street: address.street,
        city: address.city,
        state: address.state,
        zip_code: address.zip,
      },
      items: cartItems.map((item) => ({
        // 🔑 THIS FIXES KeyError: 'product'
        product: item.product || item.product_id || item.id,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    try {
      setLoading(true);

      const response = await fetch(`${BASEURL}/api/orders/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      // ⚠️ DO NOT PARSE JSON IF SERVER CRASHES
      if (!response.ok) {
        const text = await response.text();
        console.error("SERVER ERROR:", text);
        alert("Order failed. Check backend console.");
        return;
      }

      const data = await response.json();

      alert("Order placed successfully 🎉");
      clearCart();
      navigate("/");

    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <h1 className="text-4xl font-bold text-center mb-10">Checkout</h1>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ADDRESS SECTION */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6">Delivery Address</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={address.fullName}
              onChange={handleChange}
              className="border rounded-lg p-3"
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={address.phone}
              onChange={handleChange}
              className="border rounded-lg p-3"
            />

            <input
              type="text"
              name="street"
              placeholder="Street Address"
              value={address.street}
              onChange={handleChange}
              className="border rounded-lg p-3 md:col-span-2"
            />

            <input
              type="text"
              name="city"
              placeholder="City"
              value={address.city}
              onChange={handleChange}
              className="border rounded-lg p-3"
            />

            <input
              type="text"
              name="state"
              placeholder="State"
              value={address.state}
              onChange={handleChange}
              className="border rounded-lg p-3"
            />

            <input
              type="text"
              name="zip"
              placeholder="PIN Code"
              value={address.zip}
              onChange={handleChange}
              className="border rounded-lg p-3"
            />
          </div>
        </div>

        {/* ORDER SUMMARY */}
        <div className="bg-white rounded-2xl shadow-md p-6 h-fit">
          <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>

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
              <span>₹{total_amount.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className={`mt-6 w-full py-3 rounded-xl text-lg font-semibold
              ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600 active:scale-95"
              }
              text-white transition`}
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
