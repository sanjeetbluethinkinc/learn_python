import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";   // ✅ ADD THIS
import Slider from "react-slick";
import ProductCard from "../ProductCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

/* ---------- CUSTOM ARROWS ---------- */
function NextArrow({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="absolute right-[-18px] top-1/2 -translate-y-1/2 z-20
                 bg-orange-500 hover:bg-orange-600
                 text-white w-10 h-10 rounded-full
                 flex items-center justify-center shadow-lg"
    >
      ❯
    </button>
  );
}

function PrevArrow({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="absolute left-[-18px] top-1/2 -translate-y-1/2 z-20
                 bg-orange-500 hover:bg-orange-600
                 text-white w-10 h-10 rounded-full
                 flex items-center justify-center shadow-lg"
    >
      ❮
    </button>
  );
}

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();   // ✅ ADD THIS
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

  useEffect(() => {
    fetch(`${BASEURL}/api/products/`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => setProducts(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [BASEURL]);

  if (loading) return <div className="text-center py-20">Loading…</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  const sliderSettings = {
    dots: true,
    infinite: products.length > 4,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="bg-gray-100 py-10 px-4">
      <div className="max-w-7xl mx-auto relative">
        <h1 className="text-3xl font-bold text-center mb-8">
          Our Products
        </h1>

        <Slider {...sliderSettings}>
          {products.map((product) => (
            <div key={product.id} className="px-3">
              <ProductCard product={product} />
            </div>
          ))}
        </Slider>

        {/* ✅ SHOW ALL BUTTON */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate("/all-products")}
            className="bg-orange-500 hover:bg-orange-600 text-white
                       px-6 py-3 rounded-lg font-semibold shadow-md
                       transition duration-300"
          >
            Show All
          </button>
        </div>

      </div>
    </div>
  );
}

export default ProductList;
