import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import { useCart } from "../../context/CartContext";
import ProductCard from "../ProductCard";
import ProductTabs from "../../components/ProductTabs";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL.replace(/\/$/, "");

  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const { addToCart } = useCart();

  /* ================= FETCH PRODUCT ================= */
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const response = await fetch(`${BASEURL}/api/products/${id}/`);
        if (!response.ok) throw new Error("Product not found");

        const data = await response.json();
        setProduct(data);

        const imgs = [];
        if (data.image) imgs.push(`${BASEURL}${data.image}`);
        if (data.images?.length) {
          data.images.forEach(img =>
            imgs.push(`${BASEURL}${img.image}`)
          );
        }

        setImages(imgs.length ? imgs : ["https://via.placeholder.com/800x600"]);
        setCurrentIndex(0);

        if (data.category?.slug) {
          fetchRelatedProducts(data.category.slug, data.id);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  /* ================= FETCH RELATED PRODUCTS ================= */
  const fetchRelatedProducts = async (slug, currentProductId) => {
    try {
      const res = await fetch(
        `${BASEURL}/api/products/?category=${slug}`
      );
      const data = await res.json();
      setRelatedProducts(data.filter(p => p.id !== currentProductId));
    } catch (err) {
      console.error("Error fetching related products", err);
    }
  };

  /* ================= IMAGE CONTROLS ================= */
  const nextImage = () => {
    setCurrentIndex(prev =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentIndex(prev =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  /* ================= ADD TO CART ================= */
  const handleAddToCart = async () => {
    setAdding(true);
    await new Promise(r => setTimeout(r, 400));
    addToCart(product, quantity);
    setAdding(false);
  };

  /* ================= BUY NOW ================= */
  const handleBuyNow = async () => {
    setAdding(true);
    await new Promise(r => setTimeout(r, 400));
    addToCart(product, quantity);
    setAdding(false);
    navigate("/checkout");
  };

  /* ================= RELATED SLIDER ================= */
  const relatedSliderSettings = {
    dots: false,
    infinite: relatedProducts.length > 4,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  /* ================= STATES ================= */
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">

      {/* ================= PRODUCT DETAILS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* IMAGE SECTION */}
        <div className="w-full max-w-xl mx-auto">
          <div className="relative aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden">
            <img
              src={images[currentIndex]}
              alt="product"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2
                             w-11 h-11 bg-white/80 rounded-full shadow"
                >
                  ❮
                </button>

                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2
                             w-11 h-11 bg-white/80 rounded-full shadow"
                >
                  ❯
                </button>
              </>
            )}
          </div>

          <div className="flex gap-3 mt-4 justify-center flex-wrap">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                onClick={() => setCurrentIndex(index)}
                className={`w-20 h-16 object-cover rounded-md cursor-pointer border
                  ${currentIndex === index ? "border-orange-500" : "border-gray-300"}`}
              />
            ))}
          </div>
        </div>

        {/* DETAILS */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

          <p className="text-2xl font-semibold mb-8">
            ₹{Number(product.price).toFixed(2)}
          </p>

          <div className="mb-8">
            <p className="font-medium mb-2">Quantity</p>
            <div className="inline-flex items-center border rounded-full">
              <button
                disabled={quantity === 1}
                onClick={() => setQuantity(q => q - 1)}
                className="w-12 h-12"
              >
                −
              </button>
              <span className="w-14 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="w-12 h-12"
              >
                +
              </button>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={handleAddToCart}
              disabled={adding}
              className="px-10 py-3 rounded-full bg-orange-500 text-white hover:bg-orange-600"
            >
              {adding ? "Adding..." : "Add to Bag"}
            </button>

            <button
              onClick={handleBuyNow}
              disabled={adding}
              className="px-10 py-3 rounded-full bg-black text-white hover:bg-gray-800"
            >
              Buy Now
            </button>
          </div>

          <Link to="/" className="block mt-6 text-orange-500 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>

      {/* ================= PRODUCT TABS ================= */}
      <div className="mt-16">
        <ProductTabs product={product} />
      </div>

      {/* ================= RELATED PRODUCTS ================= */}
      {relatedProducts.length > 0 && (
        <div className="mt-20">
          <h2 className="text-2xl font-bold mb-6 border-l-4 border-orange-500 pl-3">
            Related Products
          </h2>

          <Slider {...relatedSliderSettings}>
            {relatedProducts.map(item => (
              <div key={item.id} className="px-3">
                <ProductCard product={item} />
              </div>
            ))}
          </Slider>
        </div>
      )}
    </div>
  );
}

export default ProductDetails;
