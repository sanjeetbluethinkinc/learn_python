import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

function ProductDetails() {
  const { id } = useParams();
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL.replace(/\/$/, "");

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const response = await fetch(`${BASEURL}/api/products/${id}/`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Product not found");
          }
          throw new Error("Failed to fetch product");
        }

        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  /* ---------------- LOADER ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-orange-50">
        <div className="w-16 h-16 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-orange-600 font-semibold">
          Loading product...
        </p>
      </div>
    );
  }

  /* ---------------- ERROR PAGE ---------------- */
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        No product found
      </div>
    );
  }

  /* ---------------- PRODUCT DETAILS ---------------- */
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="bg-white rounded-xl shadow-md p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Image */}
        <div className="flex justify-center">
          <img
            src={
              product.image
                ? `${BASEURL}${product.image}`
                : "https://via.placeholder.com/500x400?text=No+Image"
            }
            alt={product.name}
            className="w-full max-w-md h-80 object-cover rounded-lg"
          />
        </div>

        {/* Details */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

          <p className="text-gray-600 mb-6">
            {product.description}
          </p>

          <p className="text-2xl font-semibold text-orange-600">
            ₹{Number(product.price).toFixed(2)}
          </p>
          <p className="text-sm text-gray-400 mb-6">
            SKU: {product.id}
          </p>

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <span className="font-medium">Quantity:</span>
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-4 py-2 cursor-pointer"
              >
                −
              </button>
              <span className="px-4">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-4 py-2 cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={() =>
              addToCart({ ...product })
            }
            className="w-full md:w-auto bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
          >
            Add to Cart
          </button>
          {/* home button  */}
          <a href="/" className="block mt-4 text-orange-500 hover:underline">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
