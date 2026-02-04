import { useState } from "react";
import { useCart } from "../../context/CartContext";

function CheckoutPage() {
  const { cartItems } = useCart();

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const shippingFee = subtotal < 199 && subtotal > 0 ? 99 : 0;
  const total = subtotal + shippingFee;

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

  const handlePlaceOrder = () => {
    if (
      !address.fullName ||
      !address.phone ||
      !address.street ||
      !address.city ||
      !address.state ||
      !address.zip
    ) {
      alert("Please fill all address fields");
      return;
    }

    // 🔥 Later send this data to Django API
    const orderData = {
      address,
      cartItems,
      subtotal,
      shippingFee,
      total,
    };

    console.log("ORDER DATA:", orderData);
    alert("Order placed successfully (demo)");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <h1 className="text-4xl font-bold text-center mb-10">
        Checkout
      </h1>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* 📦 ADDRESS FORM */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6">
            Delivery Address
          </h2>

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

        {/* 💳 ORDER SUMMARY */}
        <div className="bg-white rounded-2xl shadow-md p-6 h-fit">
          <h2 className="text-2xl font-semibold mb-6">
            Order Summary
          </h2>

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
          </div>

          <button
            onClick={handlePlaceOrder}
            className="mt-6 w-full bg-orange-500 text-white
                       py-3 rounded-xl text-lg font-semibold
                       hover:bg-orange-600 active:scale-95 transition"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
