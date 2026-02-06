import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

function NavBar() {
  const { cartItems } = useCart();
  const { user, logout } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [categories, setCategories] = useState([]);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // 🔹 Hide login/profile on auth pages
  const hideAuthUI =
    location.pathname === "/login" ||
    location.pathname === "/register";

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // 🔹 Fetch categories
  useEffect(() => {
    fetch(`${BASEURL}/api/categories/`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(console.error);
  }, []);

  // 🔹 Stop logout loader after redirect (VERY IMPORTANT)
  useEffect(() => {
    if (loggingOut) {
      setLoggingOut(false);
    }
  }, [location.pathname]);

  const visibleCategories = categories.slice(0, 5);
  const moreCategories = categories.slice(5);

  // 🔹 Logout handler
  const handleLogout = () => {
    setLoggingOut(true);
    setIsProfileOpen(false);

    setTimeout(() => {
      logout();
      navigate("/login");
    }, 800);
  };

  return (
    <>
      {/* 🔥 LOGOUT LOADER OVERLAY */}
      {loggingOut && (
        <div className="fixed inset-0 z-[999] bg-black/70 flex items-center justify-center">
          <div className="bg-gray-900 px-6 py-4 rounded-xl flex items-center gap-3 text-white shadow-xl">
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            Logging out...
          </div>
        </div>
      )}

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
                className="hover:text-orange-400 transition font-medium"
              >
                {cat.name}
              </Link>
            ))}

            {moreCategories.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setIsMoreOpen(!isMoreOpen)}
                  className="flex items-center gap-1 hover:text-orange-400 font-medium"
                >
                  More
                  <svg
                    className={`w-4 h-4 transition-transform ${isMoreOpen ? "rotate-180" : ""
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
                        className="block px-4 py-3 hover:bg-gray-700 hover:text-orange-400"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            <Link to="/about" className="hover:text-orange-400 font-medium">
              About Us
            </Link>
            <Link to="/contact" className="hover:text-orange-400 font-medium">
              Contact Us
            </Link>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-4">

            {/* CART */}
            <Link to="/cart" className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5" />
              </svg>

              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* PROFILE (HIDDEN ON LOGIN / REGISTER) */}
            {!hideAuthUI && (
              <div className="relative">
                <button
                  onClick={() => {
                    if (!user) {
                      navigate("/login"); // 🚀 redirect if not logged in
                    } else {
                      setIsProfileOpen(!isProfileOpen); // toggle dropdown if logged in
                    }
                  }}
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-700 hover:bg-gray-600 transition"
                >
                  👤
                </button>

                {user && isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-44 bg-gray-800 rounded-lg shadow-xl overflow-hidden">

                    {/* USER EMAIL */}
                    <div className="px-4 py-3 text-sm text-gray-400 border-b border-gray-700">
                      {user.email}
                    </div>

                    {/* LOGOUT */}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 hover:bg-red-600 hover:text-white transition"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>

            )}

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
                className="block hover:text-orange-400"
              >
                {cat.name}
              </Link>
            ))}

            <div className="border-t border-gray-700 my-2"></div>

            <Link to="/about" className="block hover:text-orange-400 font-medium">
              About Us
            </Link>

            <Link to="/contact" className="block hover:text-orange-400 font-medium">
              Contact Us
            </Link>
          </div>
        )}
      </nav>
    </>
  );
}

export default NavBar;
