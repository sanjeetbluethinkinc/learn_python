import { useEffect, useState } from "react";
import Slider from "react-slick";
import ProductCard from "../ProductCard.jsx";
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

  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

  useEffect(() => {
    fetch(`${BASEURL}/api/products/`)
      .then((res) => res.json())
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [BASEURL]);

  if (loading) {
    return <div className="text-center py-20">Loading…</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

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
      </div>
    </div>
  );
}

export default ProductList;
