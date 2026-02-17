import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

// 🔴 Replace with your WhatsApp support number
const WHATSAPP_NUMBER = "919876543210";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access");

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch(`${BASEURL}/api/orders/my/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch orders");
        }

        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  /* ---------------- STATES ---------------- */

  if (loading) {
    return (
      <div className="p-6 text-center text-lg">
        Loading your orders...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        {error}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="p-6 text-center text-gray-600">
        You have no orders yet.
      </div>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">
        My Orders
      </h1>

      <div className="grid gap-6">
        {orders.map((order) => (
          <div
            key={order.id}
            onClick={() => setSelectedOrder(order)}
            className="cursor-pointer bg-white rounded-2xl border p-6 shadow-md hover:shadow-xl transition-all hover:scale-[1.02]"
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-semibold">
                Order #{order.id}
              </h2>

              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  order.status === "CONFIRMED"
                    ? "bg-green-100 text-green-600"
                    : "bg-orange-100 text-orange-600"
                }`}
              >
                {order.status}
              </span>
            </div>

            <div className="flex justify-between text-sm text-gray-600">
              <span>
                {new Date(order.created_at).toLocaleString()}
              </span>
              <span className="font-bold text-black">
                ₹{order.total_amount}
              </span>
            </div>

            {/* GET HELP */}
            <div className="mt-4 flex justify-end">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                  `Hello, I need help with Order #${order.id}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500 text-white text-sm font-semibold hover:bg-green-600"
              >
                💬 Get Help
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* ================= POPUP ================= */}

      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
          <div className="bg-white w-full max-w-3xl rounded-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-xl text-gray-500 hover:text-black"
            >
              ✖
            </button>

            <h2 className="text-2xl font-bold mb-2">
              Order #{selectedOrder.id}
            </h2>

            <p className="text-sm text-gray-500 mb-4">
              {new Date(selectedOrder.created_at).toLocaleString()}
            </p>

            {/* DETAILS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-6">
              <p><strong>Subtotal:</strong> ₹{selectedOrder.subtotal}</p>
              <p><strong>Shipping:</strong> ₹{selectedOrder.shipping_fee}</p>
              <p className="font-semibold">
                Total: ₹{selectedOrder.total_amount}
              </p>
              <p><strong>Status:</strong> {selectedOrder.status}</p>
              <p><strong>Payment:</strong> {selectedOrder.payment_status}</p>
              <p>
                <strong>Paid:</strong>{" "}
                {selectedOrder.is_paid ? "✅ Yes" : "❌ No"}
              </p>
            </div>

            {/* ITEMS + SKU */}
            {selectedOrder.items?.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3">
                  Items
                </h3>

                <ul className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <li
                      key={item.id}
                      className="border rounded-lg p-3 bg-gray-50 text-sm"
                    >
                      <div className="flex justify-between">
                        <span className="font-medium">
                          {item.product_name} × {item.quantity}
                        </span>
                        <span className="font-semibold">
                          ₹{item.price}
                        </span>
                      </div>

                      {/* ✅ SKU FROM PRODUCT MODEL */}
                      {item.product?.sku && (
                        <p className="mt-1 text-xs text-gray-600">
                          <strong>SKU:</strong> {item.product.sku}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ADDRESS */}
            {selectedOrder.address && (
              <div className="mb-6 bg-gray-50 p-4 rounded-xl text-sm">
                <h3 className="font-semibold mb-2">
                  Delivery Address
                </h3>
                <p>{selectedOrder.address.full_name}</p>
                <p>
                  {selectedOrder.address.street},{" "}
                  {selectedOrder.address.city},{" "}
                  {selectedOrder.address.state} -{" "}
                  {selectedOrder.address.zip_code}
                </p>
                <p>📞 {selectedOrder.address.phone}</p>
              </div>
            )}

            {/* HELP */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-2">
                Need Help?
              </h3>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                  `Hello, I need help with Order #${selectedOrder.id}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600"
              >
                💬 Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyOrders;
