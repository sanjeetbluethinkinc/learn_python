import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function NavBar() {
  const { cartItems } = useCart();

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

    return (
         <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
    <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

      {/* Brand */}
      <Link
        to="/"
        className="text-2xl font-extrabold text-orange-600 hover:opacity-90 transition"
      >
        Food Market
      </Link>

      {/* Cart */}
      <Link
        to="/cart"
        className="relative group text-gray-700 hover:text-orange-600 transition"
      >
       <svg
  xmlns="http://www.w3.org/2000/svg"
  className="h-7 w-7 transition-transform group-hover:scale-110"
  fill="none"
  viewBox="0 0 24 24"
  stroke="currentColor"
  strokeWidth={1.8}
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M2.25 3h1.386c.51 0 .955.343 1.087.836L5.4 6.75m0 0h13.35c.86 0 1.452.86 1.158 1.67l-1.5 4.5a1.25 1.25 0 0 1-1.187.83H7.1a1.25 1.25 0 0 1-1.187-.83L5.4 6.75Zm1.5 12a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Zm9.75 0a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Z"
  />
</svg>


        {totalItems > 0 && (
          <span
            className="absolute -top-2 -right-2
                       bg-red-600 text-white
                       text-xs font-bold
                       w-5 h-5 rounded-full
                       flex items-center justify-center
                       animate-pulse"
          >
            {totalItems}
          </span>
        )}
      </Link>
    </div>
  </nav>
    );
}

export default NavBar;