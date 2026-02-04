import { Link } from "react-router-dom";

function ProductCard({ product }) {
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

  const imageUrl = product.image
    ? `${BASEURL}${product.image}`
    : "https://via.placeholder.com/400x300?text=No+Image";

  return (
    <Link to={`/products/${product.id}`} className="block">
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 p-3 cursor-pointer">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-56 object-cover rounded-lg mb-4"
        />

        <h2 className="text-lg font-semibold text-gray-800 truncate">
          {product.name}
        </h2>

        <p className="text-gray-600 font-medium">
          ₹{Number(product.price).toFixed(2)}
        </p>
      </div>
    </Link>
  );
}

export default ProductCard;
