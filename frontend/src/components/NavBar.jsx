import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
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

  const hideAuthUI =
    location.pathname === "/login" ||
    location.pathname === "/register";

  const totalItems = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  // ACTIVE CHECK
  const isActive = (path) => location.pathname === path;
  const isCategoryActive = (slug) =>
    location.pathname === `/products/category/${slug}`;

  useEffect(() => {
    fetch(`${BASEURL}/api/categories/`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (loggingOut) setLoggingOut(false);
  }, [location.pathname]);

  const visibleCategories = categories.slice(0, 5);
  const moreCategories = categories.slice(5);

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
      {loggingOut && (
        <div className="fixed inset-0 z-[999] bg-black/70 flex items-center justify-center">
          <div className="bg-gray-900 px-6 py-4 rounded-xl flex items-center gap-3 text-white">
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
            className={`text-2xl font-extrabold transition ${isActive("/") ? "text-orange-400" : "text-orange-500"
              }`}
          >
            Food<span className="text-white">Market</span>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-8 font-inter text-sm font-medium tracking-wide">

            {visibleCategories.map((cat) => (
              <Link
                key={cat.id}
                to={`/products/category/${cat.slug}`}
                className={`relative inline-block py-2 transition-colors duration-300
                  ${isCategoryActive(cat.slug)
                    ? "text-orange-400"
                    : "hover:text-orange-400"
                  }
                  after:absolute after:left-0 after:bottom-0
                  after:h-[2px] after:bg-orange-400
                  after:transition-all after:duration-300
                  ${isCategoryActive(cat.slug)
                    ? "after:w-full"
                    : "after:w-0 hover:after:w-full"
                  }`}
              >
                {cat.name}
              </Link>
            ))}

            {moreCategories.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setIsMoreOpen(!isMoreOpen)}
                  className="relative inline-block py-2 hover:text-orange-400"
                >
                  More ▾
                </button>

                {isMoreOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-gray-900 border border-gray-700 
                        rounded-lg shadow-xl overflow-hidden z-50">

                    {moreCategories.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/products/category/${cat.slug}`}
                        onClick={() => setIsMoreOpen(false)}
                        className={`block px-4 py-3 text-sm font-medium tracking-wide
                          ${isCategoryActive(cat.slug)
                            ? "text-orange-400 bg-gray-800"
                            : "hover:bg-gray-800 hover:text-orange-400"
                          }`}
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
              className={`relative inline-block py-2 transition-colors duration-300
                ${isActive("/about")
                  ? "text-orange-400 after:w-full"
                  : "hover:text-orange-400 after:w-0 hover:after:w-full"
                }
                after:absolute after:left-0 after:bottom-0
                after:h-[2px] after:bg-orange-400
                after:transition-all after:duration-300`}
            >
              About Us
            </Link>

            <Link
              to="/contact"
              className={`relative inline-block py-2 transition-colors duration-300
                ${isActive("/contact")
                  ? "text-orange-400 after:w-full"
                  : "hover:text-orange-400 after:w-0 hover:after:w-full"
                }
                after:absolute after:left-0 after:bottom-0
                after:h-[2px] after:bg-orange-400
                after:transition-all after:duration-300`}
            >
              Contact Us
            </Link>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-4">

            <Link to="/cart" className="relative">
              🛒
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>

            {!hideAuthUI && (
              <div className="relative">
                <button
                  onClick={() => {
                    if (!user) navigate("/login");
                    else setIsProfileOpen(!isProfileOpen);
                  }}
                  className="w-9 h-9 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center"
                >
                  👤
                </button>

                {user && isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded shadow-lg overflow-hidden">
                    <div className="px-4 py-2 text-sm text-gray-400 border-b border-gray-700">
                      {user.email}
                    </div>

                    <Link
                      to="/my-orders"
                      onClick={() => setIsProfileOpen(false)}
                      className="block px-4 py-2 text-sm hover:bg-gray-700"
                    >
                      My Orders
                    </Link>
                    <Link
                      to="/manage-address"
                      onClick={() => setIsProfileOpen(false)}
                      className="block px-4 py-2 text-sm hover:bg-gray-700"
                    >
                      Manage Address
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-red-600"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="md:hidden text-2xl"
            >
              ☰
            </button>
          </div>
        </div>

        {isMobileOpen && (
          <div className="md:hidden bg-gray-800 p-4 space-y-2">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/products/category/${cat.slug}`}
                onClick={() => setIsMobileOpen(false)}
                className={`block ${isCategoryActive(cat.slug)
                    ? "text-orange-400"
                    : "hover:text-orange-400"
                  }`}
              >
                {cat.name}
              </Link>
            ))}

            <Link
              to="/about"
              className={`block ${isActive("/about")
                  ? "text-orange-400"
                  : "hover:text-orange-400"
                }`}
            >
              About Us
            </Link>

            <Link
              to="/contact"
              className={`block ${isActive("/contact")
                  ? "text-orange-400"
                  : "hover:text-orange-400"
                }`}
            >
              Contact Us
            </Link>
          </div>
        )}
      </nav>
    </>
  );
}

export default NavBar;
