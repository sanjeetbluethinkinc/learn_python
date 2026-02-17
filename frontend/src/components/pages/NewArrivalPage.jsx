import { useEffect, useState } from "react";
import ProductCard from "../ProductCard";
import HomeSection from "./HomeSection";   // ✅ IMPORT THIS

const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

function NewArrivalPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASEURL}/api/products/new-arrival/`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch new arrivals");
        return res.json();
      })
      .then((data) => setProducts(data))
      .catch((err) => console.error("New Arrival Page error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center py-20">Loading…</div>;
  }

  return (
    <>
      {/* NEW ARRIVAL SECTION */}
      <section className="bg-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h1 className="text-3xl font-bold mb-10 flex items-center gap-3">
            ✨ New Arrivals
          </h1>

          {products.length === 0 ? (
            <div className="text-gray-500">
              No new arrivals available.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ✅ HOME SECTION ADDED BELOW */}
      <HomeSection />
    </>
  );
}

export default NewArrivalPage;
