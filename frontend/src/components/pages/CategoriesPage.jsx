import { useEffect, useState } from "react";
import Slider from "react-slick";
import ProductCard from "../ProductCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

/* ---------- SLIDER ARROWS ---------- */
function Arrow({ onClick, direction }) {
  return (
    <button
      onClick={onClick}
      className={`absolute top-1/2 -translate-y-1/2 z-10
        ${direction === "right" ? "right-[-15px]" : "left-[-15px]"}
        bg-orange-500 hover:bg-orange-600
        text-white w-9 h-9 rounded-full
        flex items-center justify-center shadow`}
    >
      {direction === "right" ? "❯" : "❮"}
    </button>
  );
}

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [productsByCategory, setProductsByCategory] = useState({});
  const [loading, setLoading] = useState(true);

  /* STEP 1: Fetch categories */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${BASEURL}/api/categories/`);
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  /* STEP 2: Fetch products category-wise */
  useEffect(() => {
    if (!categories.length) return;

    const fetchProductsByCategory = async () => {
      try {
        const result = {};

        await Promise.all(
          categories.map(async (cat) => {
            const res = await fetch(
              `${BASEURL}/api/products/?category=${cat.slug}`
            );
            const data = await res.json();
            result[cat.slug] = data;
          })
        );

        setProductsByCategory(result);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProductsByCategory();
  }, [categories]);

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <Arrow direction="right" />,
    prevArrow: <Arrow direction="left" />,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  if (loading) {
    return <div className="text-center py-20">Loading categories...</div>;
  }

  return (
    <div className="bg-gray-100 py-10 px-4">
      <div className="max-w-7xl mx-auto space-y-14">

        {categories.map((cat) => {
          const categoryProducts = productsByCategory[cat.slug] || [];

          return (
            <div key={cat.id}>
              {/* CATEGORY NAME */}
              <h2 className="text-2xl font-bold mb-6 text-gray-800 border-l-4 border-orange-500 pl-3">
                {cat.name}
              </h2>

              {/* CATEGORY PRODUCTS ONLY */}
              {categoryProducts.length > 0 ? (
                <Slider {...sliderSettings}>
                  {categoryProducts.map((product) => (
                    <div key={product.id} className="px-3">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </Slider>
              ) : (
                <p className="text-gray-500 px-2">
                  No products available in this category.
                </p>
              )}
            </div>
          );
        })}

      </div>
    </div>
  );
}

export default CategoriesPage;
