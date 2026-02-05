import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";

const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

function NavBar() {
  const { cartItems } = useCart();
  const [categories, setCategories] = useState([]);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Fetch categories
  useEffect(() => {
    fetch(`${BASEURL}/api/categories/`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(console.error);
  }, []);

  const visibleCategories = categories.slice(0, 5);
  const moreCategories = categories.slice(5);

  return (
    <nav className="sticky top-0 z-50 bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* LOGO */}
        <Link
          to="/"
          className="text-2xl font-extrabold text-orange-500 hover:text-orange-400 transition"
        >
          Food<span className="text-white">Market</span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-6">
          {visibleCategories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="nav-link hover:text-orange-400 transition font-medium"
            >
              {cat.name}
            </Link>
          ))}

          {/* MORE DROPDOWN */}
          {moreCategories.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                className="nav-link flex items-center gap-1 hover:text-orange-400 transition font-medium"
              >
                More
                <svg
                  className={`w-4 h-4 transition-transform ${
                    isMoreOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </button>
             

              {isMoreOpen && (
                <div className="absolute top-full mt-3 w-48 bg-gray-800 rounded-lg shadow-xl overflow-hidden">
                  {moreCategories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/category/${cat.slug}`}
                      onClick={() => setIsMoreOpen(false)}
                      className="block px-4 py-3 hover:bg-gray-700 hover:text-orange-400 transition"
                    >
                      {cat.name}
                    </Link>
                  ))}
                  
                </div>
                
              )}
              
            </div>
            
          )}
           <Link
  to="/about"
  className="header-catageries"
>
  About Us
</Link>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">

          {/* CART */}
          <Link to="/cart" className="relative">
            <svg
              className="w-7 h-7 hover:scale-110 transition"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path d="M2.25 3h1.386l1.65 8.25h13.35l1.5-4.5H5.4" />
            </svg>

            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-500 text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
          </Link>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden text-2xl"
          >
            ☰
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMobileOpen && (
        <div className="md:hidden bg-gray-800 px-4 py-4 space-y-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              onClick={() => setIsMobileOpen(false)}
              className="block nav-link hover:text-orange-400 transition"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}

export default NavBar;
