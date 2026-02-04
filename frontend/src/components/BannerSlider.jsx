import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

function BannerSlider() {
  const [banners, setBanners] = useState([]);
  const [current, setCurrent] = useState(0);
  const startX = useRef(0);
  const dragging = useRef(false);

  // Fetch banners
  useEffect(() => {
    fetch(`${BASEURL}/api/banners/`)
      .then((res) => res.json())
      .then((data) =>
        setBanners(
          [...data].sort((a, b) => a.order - b.order)
        )
      )
      .catch(console.error);
  }, []);

  // Auto slide
  useEffect(() => {
    if (banners.length === 0) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [current, banners]);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? banners.length - 1 : prev - 1
    );
  };

  // Swipe handlers
  const startDrag = (x) => {
    startX.current = x;
    dragging.current = true;
  };

  const endDrag = (x) => {
    if (!dragging.current) return;

    const diff = startX.current - x;
    if (diff > 50) nextSlide();
    if (diff < -50) prevSlide();

    dragging.current = false;
  };

  if (banners.length === 0) return null;

  return (
    <section
      className="relative w-full h-[420px] overflow-hidden"
      onMouseDown={(e) => startDrag(e.clientX)}
      onMouseUp={(e) => endDrag(e.clientX)}
      onTouchStart={(e) => startDrag(e.touches[0].clientX)}
      onTouchEnd={(e) => endDrag(e.changedTouches[0].clientX)}
    >
      {/* SLIDES */}
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {banners.map((banner) => {
          const link =
            banner.button_link ||
            (banner.product
              ? `/products/${banner.product}`
              : "#");

          return (
            <div
              key={banner.id}
              className="min-w-full relative h-full"
            >
              <img
                src={`${BASEURL}${banner.image}`}
                alt={banner.title}
                className="absolute inset-0 w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-black/50"></div>

              <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex items-center">
                <div className="text-white max-w-xl">
                  <h1 className="text-4xl font-extrabold mb-3">
                    {banner.title}
                  </h1>

                  <p className="text-lg mb-6 text-gray-200">
                    {banner.subtitle}
                  </p>

                  {banner.button_text && (
                    <Link
                      to={link}
                      className="inline-block bg-orange-600 hover:bg-orange-700
                                 px-6 py-3 rounded-lg font-semibold"
                    >
                      {banner.button_text}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ARROWS */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2
                   bg-black/40 hover:bg-black/70
                   text-white w-10 h-10 rounded-full"
      >
        ‹
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2
                   bg-black/40 hover:bg-black/70
                   text-white w-10 h-10 rounded-full"
      >
        ›
      </button>

      {/* DOTS */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full ${
              i === current ? "bg-orange-500" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

export default BannerSlider;
