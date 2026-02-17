import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";

function productDetails() {
  const { id } = useParams();
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL.replace(/\/$/, "");

  const [product, setproduct] = useState(null);
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const { addToCart } = useCart();

  useEffect(() => {
    if (!id) return;

    const fetchproduct = async () => {
      try {
        const response = await fetch(`${BASEURL}/api/products/${id}/`);
        if (!response.ok) throw new Error("product not found");

        const data = await response.json();
        setproduct(data);

        // Build image list
        const imgs = [];
        if (data.image) imgs.push(`${BASEURL}${data.image}`);
        if (data.images?.length) {
          data.images.forEach((img) =>
            imgs.push(`${BASEURL}${img.image}`)
          );
        }

        setImages(imgs);
        setCurrentIndex(0);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchproduct();
  }, [id, BASEURL]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return <div className="text-center mt-10">{error}</div>;
  }

  if (!product) {
    return <div>No product found</div>;
  }

  /* ---------------- STOCK LOGIC ---------------- */
  const availableStock = Number(product.quantity ?? 0);
  const outOfStock = availableStock <= 0;

  /* ---------------- SLIDER CONTROLS ---------------- */
  const nextImage = () => {
    setCurrentIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  /* ---------------- ADD TO CART ---------------- */
  const handleAddToCart = async () => {
    if (outOfStock) return;

    setAdding(true);
    await new Promise((r) => setTimeout(r, 500));

    addToCart(product, quantity);
    setAdding(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* LEFT: IMAGE */}
        <div className="w-full max-w-xl mx-auto">
          <div className="relative aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden">
            <img
              src={images[currentIndex] || "https://via.placeholder.com/800x600"}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {images.length > 1 && (
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2
                w-11 h-11 flex items-center justify-center
                bg-white/80 rounded-full shadow-lg"
              >
                →
              </button>
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 mt-4 justify-center flex-wrap">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`thumb-${index}`}
                onClick={() => setCurrentIndex(index)}
                className={`w-20 h-16 object-cover rounded-md border cursor-pointer
                  ${
                    currentIndex === index
                      ? "border-orange-500 ring-2 ring-orange-200"
                      : "border-gray-300"
                  }`}
              />
            ))}
          </div>
        </div>

        {/* RIGHT: DETAILS */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

          <p className="text-gray-600 mb-6">
            {product.description || "No description available"}
          </p>

          <p className="text-2xl font-semibold mb-2">
            ₹{Number(product.price).toFixed(2)}
          </p>

          {/* SKU + STOCK */}
          <div className="mb-6">
            
             <p className="text-xs text-gray-500 mt-1">
            SKU: <span className="font-medium">{product.sku}</span>
          </p>

            {outOfStock ? (
              <span className="inline-block mt-2 text-sm font-semibold text-red-600">
                Out of Stock
              </span>
            ) : (
              <span className="inline-block mt-2 text-sm text-green-600">
                In Stock ({availableStock} available)
              </span>
            )}
          </div>

          {/* Quantity */}
          {!outOfStock && (
            <div className="mb-8">
              <p className="font-medium mb-2">Quantity</p>
              <div className="inline-flex items-center border rounded-full">
                <button
                  disabled={quantity === 1}
                  onClick={() => setQuantity((q) => q - 1)}
                  className="w-12 h-12 disabled:opacity-40"
                >
                  −
                </button>

                <span className="w-14 text-center font-semibold">
                  {quantity}
                </span>

                <button
                  disabled={quantity >= availableStock}
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-12 h-12 disabled:opacity-40"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={adding || outOfStock}
            className={`px-10 py-3 rounded-full font-semibold
              ${
                outOfStock
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : adding
                  ? "bg-orange-300 text-white"
                  : "bg-orange-400 hover:bg-orange-500 text-white"
              }`}
          >
            {outOfStock ? "Out of Stock" : adding ? "Adding..." : "Add to Bag"}
          </button>

          <Link to="/" className="block mt-6 text-orange-500 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default productDetails;
