import { Link } from "react-router-dom";
import { useState } from "react";
import Swal from "sweetalert2";
import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
  const { addToCart, cartItems } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

  if (!product) return null;

  // IMAGE HANDLING
  const imageUrl = product.image
    ? product.image.startsWith("http")
      ? product.image
      : `${BASEURL}${product.image}`
    : "https://via.placeholder.com/400x300?text=No+Image";

  // STOCK LOGIC
  const outOfStock = Number(product.quantity) <= 0;

  // CHECK IF PRODUCT ALREADY IN CART
  const alreadyInCart = cartItems.some(
    (item) => item.id === product.id
  );

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (outOfStock) return;

    // 🔔 Already in cart alert
    if (alreadyInCart) {
      Swal.fire({
        icon: "info",
        title: "Already in Cart",
        text: "This product is already added to your cart.",
        timer: 1800,
        showConfirmButton: false,
      });
      return;
    }

    setIsAdding(true);

    // animation delay
    await new Promise((r) => setTimeout(r, 700));

    addToCart({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.image,
      quantity: 1,
    });

    setIsAdding(false);

    // ✅ Added success alert
    Swal.fire({
      icon: "success",
      title: "Added to Cart",
      text: `${product.name} has been added to your cart.`,
      timer: 1600,
      showConfirmButton: false,
    });
  };

  return (
    <div className="relative bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 p-3">

      {/* OUT OF STOCK BADGE */}
      {outOfStock && (
        <span className="absolute top-3 right-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full z-10">
          Out of Stock
        </span>
      )}

      {/* PRODUCT LINK */}
      <Link to={`/products/${product.id}`} className="block">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-56 object-cover rounded-lg mb-4"
        />

        <h2 className="text-lg font-semibold text-gray-800 truncate">
          {product.name}
        </h2>

        {product.sku && (
          <p className="text-xs text-gray-500 mt-1">
            SKU: <span className="font-medium">{product.sku}</span>
          </p>
        )}

        <p className="text-gray-700 font-semibold mt-1">
          ₹{Number(product.price).toFixed(2)}
        </p>
      </Link>

      {/* ADD TO CART BUTTON */}
      <button
        type="button"
        tabIndex={-1}
        onClick={handleAddToCart}
        disabled={outOfStock || alreadyInCart || isAdding}
        className={`mt-4 w-full py-2 rounded-lg font-semibold
          flex items-center justify-center gap-2
          transition-all duration-300
          ${
            outOfStock
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : alreadyInCart
              ? "bg-green-500 text-white cursor-default"
              : isAdding
              ? "bg-orange-400 scale-95"
              : "bg-orange-500 text-white hover:bg-orange-600 active:scale-95"
          }`}
      >
        {isAdding ? (
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Adding...
          </>
        ) : outOfStock ? (
          "Out of Stock"
        ) : alreadyInCart ? (
          "Already in Cart"
        ) : (
          "Add to Cart"
        )}
      </button>
    </div>
  );
}

export default ProductCard;
