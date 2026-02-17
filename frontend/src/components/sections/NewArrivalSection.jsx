import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import ProductCard from "../ProductCard";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Section.css";

const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

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

const NewArrivalSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${BASEURL}/api/products/new-arrival/`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch new arrivals");
        return res.json();
      })
      .then((data) => setProducts(data))
      .catch((err) => console.error("New Arrival error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-16">Loading…</div>;
  if (!products.length) return null;

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
    <section className="bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-6 relative">

        {/* TITLE */}
        <h2 className="text-3xl font-bold text-center mb-8">
          ✨ New Arrivals
        </h2>

        {/* SLIDER */}
        <Slider {...sliderSettings}>
          {products.map((product) => (
            <div key={product.id} className="px-3">
              <ProductCard product={product} />
            </div>
          ))}
        </Slider>

        {/* ✅ CENTERED SEE ALL BUTTON */}
        <div className="flex justify-center mt-10">
          <button
            onClick={() => navigate("/new-arrivals")}
            className="bg-orange-500 hover:bg-orange-600 text-white
                       px-6 py-3 rounded-lg font-semibold shadow-md
                       transition duration-300"
          >
            See All
          </button>
        </div>

      </div>
    </section>
  );
};

export default NewArrivalSection;
