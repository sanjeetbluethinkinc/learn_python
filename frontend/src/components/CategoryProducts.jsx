import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ProductCard from "./ProductCard";

const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL.replace(/\/$/, "");

function CategoryProducts() {
  const { slug } = useParams(); // category slug from URL

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;

    setLoading(true);
    setError(false);

    fetch(`${BASEURL}/api/products/?category=${slug}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }
        return res.json();
      })
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Category fetch error:", err);
        setError(true);
        setLoading(false);
      });
  }, [slug]);

  /* ⏳ LOADING */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Loading products...
      </div>
    );
  }

  /* ❌ ERROR */
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Unable to load products. Please try again.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold capitalize">
            {slug.replace(/-/g, " ")}
          </h1>

          <Link
            to="/"
            className="text-sm text-orange-500 hover:underline"
          >
            ← Back to Home
          </Link>
        </div>

        {/* EMPTY STATE */}
        {products.length === 0 ? (
          <p className="text-gray-600 text-center">
            No products found in this category.
          </p>
        ) : (
          /* PRODUCTS GRID */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryProducts;
