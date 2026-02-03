import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard.jsx";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BASEURL}/api/products/`);

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        if (isMounted) {
          setProducts(data);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [BASEURL]);

  // ⏳ Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-orange-50">
        <div className="w-20 h-20 rounded-full border-4 border-orange-400 border-t-transparent animate-spin"></div>
        <p className="mt-4 text-orange-600 font-semibold text-lg">
          Loading, please wait...
        </p>
      </div>
    );
  }

  // ❌ Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl text-center p-4 shadow-md font-bold mb-6">
          Product List
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No products available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductList;
