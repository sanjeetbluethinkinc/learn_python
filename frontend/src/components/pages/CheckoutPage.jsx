import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axiosInstance from "../../api/axiosInstance";

/* ---------------- Razorpay Loader ---------------- */
const loadRazorpay = () =>
  new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
  });

  const handleChange = (e) =>
    setAddress({ ...address, [e.target.name]: e.target.value });

  /* ---------------- Totals ---------------- */
  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const shipping_fee = subtotal > 0 && subtotal < 199 ? 99 : 0;
  const total_amount = subtotal + shipping_fee;

  /* ---------------- Place Order ---------------- */
  const handlePlaceOrder = async () => {
    if (!cartItems.length) {
      Swal.fire("Empty Cart", "Your cart is empty", "warning");
      return;
    }

    for (let key in address) {
      if (!address[key]) {
        Swal.fire("Missing Info", "Fill all address fields", "warning");
        return;
      }
    }

    if (!localStorage.getItem("access")) {
      Swal.fire("Login Required", "Please login first", "info");
      navigate("/login");
      return;
    }

    const payload = {
      subtotal,
      shipping_fee,
      total_amount,
      payment_method: paymentMethod,
      address: {
        full_name: address.fullName,
        phone: address.phone,
        street: address.street,
        city: address.city,
        state: address.state,
        zip_code: address.zip,
      },
      items: cartItems.map((item) => ({
        product:
          typeof item.product === "object"
            ? item.product.id
            : item.product,
        quantity: Number(item.quantity),
        price: Number(item.price),
      })),
    };

    try {
      setLoading(true);

      /* ✅ CREATE ORDER */
      const orderRes = await axiosInstance.post(
        "/api/orders/create/",
        payload
      );

      if (!orderRes.data || !orderRes.data.order_id) {
        throw new Error("Order creation failed");
      }

      const orderId = orderRes.data.order_id;

      /* ✅ COD FLOW */
      if (paymentMethod === "COD") {
        Swal.fire("Success", "Order placed successfully", "success");
        clearCart();
        navigate("/my-orders");
        return;
      }

      /* ✅ ONLINE PAYMENT */
      const razorpayLoaded = await loadRazorpay();
      if (!razorpayLoaded) {
        Swal.fire("Error", "Razorpay SDK failed to load", "error");
        return;
      }

      const paymentRes = await axiosInstance.post(
        "/api/payment/create/",
        { order_id: orderId }
      );

      const options = {
        key: paymentRes.data.razorpay_key,
        amount: paymentRes.data.amount,
        currency: "INR",
        order_id: paymentRes.data.razorpay_order_id,
        name: "FoodMarket",
        description: "Order Payment",

        handler: async function (response) {
          try {
            await axiosInstance.post("/api/payment/verify/", {
              order_id: orderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            Swal.fire("Success", "Payment successful", "success");
            clearCart();
            navigate("/my-orders");
          } catch (err) {
            Swal.fire(
              "Error",
              err.response?.data?.error || "Payment verification failed",
              "error"
            );
          }
        },

        theme: { color: "#f97316" },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error("ORDER ERROR:", err.response?.data || err.message);

      Swal.fire(
        "Error",
        err.response?.data?.error ||
          err.response?.data?.detail ||
          err.message ||
          "Order failed",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <h1 className="text-4xl font-bold text-center mb-10">
        Checkout
      </h1>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ADDRESS */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6">
            Delivery Address
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["fullName", "phone", "street", "city", "state", "zip"].map(
              (field) => (
                <input
                  key={field}
                  name={field}
                  placeholder={field}
                  value={address[field]}
                  onChange={handleChange}
                  className="border p-3 rounded-lg"
                />
              )
            )}
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">
              Payment Method
            </h3>
            <select
              value={paymentMethod}
              onChange={(e) =>
                setPaymentMethod(e.target.value)
              }
              className="border p-3 rounded-lg w-full"
            >
              <option value="COD">
                Cash On Delivery
              </option>
              <option value="ONLINE">
                Pay Online (Razorpay)
              </option>
            </select>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="bg-white rounded-2xl shadow-md p-6 h-fit">
          <h2 className="text-2xl font-semibold mb-6">
            Order Summary
          </h2>

          <p>Subtotal: ₹{subtotal}</p>
          <p>Shipping: ₹{shipping_fee}</p>
          <h3 className="text-xl font-bold mt-2">
            Total: ₹{total_amount}
          </h3>

          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className={`mt-6 w-full py-3 rounded-xl text-lg font-semibold text-white
              ${
                loading
                  ? "bg-gray-400"
                  : "bg-orange-500 hover:bg-orange-600"
              }`}
          >
            {loading ? "Processing..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
