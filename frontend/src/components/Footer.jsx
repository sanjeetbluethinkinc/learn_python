import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10">

        {/* BRAND */}
        <div>
          <h2 className="text-2xl font-extrabold text-orange-500">
            Food<span className="text-white">Market</span>
          </h2>
          <p className="text-sm text-gray-400 mt-3 leading-relaxed">
            Fresh food, quality products & fast delivery.
            Your trusted online food shopping destination.
          </p>
        </div>

        {/* SHOP */}
        <div>
          <h3 className="text-white font-semibold mb-3">Shop</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/all-products" className="relative inline-block py-2 transition-colors duration-300 hover:text-orange-400
               after:absolute after:left-0 after:bottom-0
               after:h-[2px] after:w-0 after:bg-orange-400
               after:transition-all after:duration-300
               hover:after:w-full">All Products</Link></li>
            <li><Link to="/categories" className="relative inline-block py-2 transition-colors duration-300 hover:text-orange-400
               after:absolute after:left-0 after:bottom-0
               after:h-[2px] after:w-0 after:bg-orange-400
               after:transition-all after:duration-300
               hover:after:w-full">Categories</Link></li>
            <li><Link to="/best-sellers" className="relative inline-block py-2 transition-colors duration-300 hover:text-orange-400
               after:absolute after:left-0 after:bottom-0
               after:h-[2px] after:w-0 after:bg-orange-400
               after:transition-all after:duration-300
               hover:after:w-full">Best Sellers</Link></li>
            <li><Link to="/new-arrivals" className="relative inline-block py-2 transition-colors duration-300 hover:text-orange-400
               after:absolute after:left-0 after:bottom-0
               after:h-[2px] after:w-0 after:bg-orange-400
               after:transition-all after:duration-300
               hover:after:w-full">New Arrivals</Link></li>
          </ul>
        </div>

        {/* HELP */}
        <div>
          <h3 className="text-white font-semibold mb-3">Help</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/my-orders" className="hover:text-orange-400">My Orders</Link></li>
            <li><Link to="/contact" className="relative inline-block py-2 transition-colors duration-300 hover:text-orange-400
               after:absolute after:left-0 after:bottom-0
               after:h-[2px] after:w-0 after:bg-orange-400
               after:transition-all after:duration-300
               hover:after:w-full">Contact Us</Link></li>
            <li><Link to="/faq" className="relative inline-block py-2 transition-colors duration-300 hover:text-orange-400
               after:absolute after:left-0 after:bottom-0
               after:h-[2px] after:w-0 after:bg-orange-400
               after:transition-all after:duration-300
               hover:after:w-full">FAQs</Link></li>
            <li><Link to="/shipping" className="relative inline-block py-2 transition-colors duration-300 hover:text-orange-400
               after:absolute after:left-0 after:bottom-0
               after:h-[2px] after:w-0 after:bg-orange-400
               after:transition-all after:duration-300
               hover:after:w-full">Shipping & Delivery</Link></li>
          </ul>
        </div>

        {/* COMPANY */}
        <div>
          <h3 className="text-white font-semibold mb-3">Company</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="relative inline-block py-2 transition-colors duration-300 hover:text-orange-400
               after:absolute after:left-0 after:bottom-0
               after:h-[2px] after:w-0 after:bg-orange-400
               after:transition-all after:duration-300
               hover:after:w-full">About Us</Link></li>
            <li><Link to="/careers" className="relative inline-block py-2 transition-colors duration-300 hover:text-orange-400
               after:absolute after:left-0 after:bottom-0
               after:h-[2px] after:w-0 after:bg-orange-400
               after:transition-all after:duration-300
               hover:after:w-full">Careers</Link></li>
            <li><Link to="/" className="relative inline-block py-2 transition-colors duration-300 hover:text-orange-400
               after:absolute after:left-0 after:bottom-0
               after:h-[2px] after:w-0 after:bg-orange-400
               after:transition-all after:duration-300
               hover:after:w-full">Customer Reviews</Link></li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div>
          <h3 className="text-white font-semibold mb-3">Support</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <a
                href="https://wa.me/919931583947"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 relative inline-block py-2 transition-colors duration-300 hover:text-orange-400
               after:absolute after:left-0 after:bottom-0
               after:h-[2px] after:w-0 after:bg-orange-400
               after:transition-all after:duration-300
               hover:after:w-full"
              >
                💬 WhatsApp Support
              </a>
            </li>
            <li className="relative inline-block py-2 transition-colors duration-300 hover:text-orange-400
               after:absolute after:left-0 after:bottom-0
               after:h-[2px] after:w-0 after:bg-orange-400
               after:transition-all after:duration-300
               hover:after:w-full">
              <a href="tel:+9199931583947" className="flex items-center gap-1">
                📞 +91 99931583947
              </a>
            </li>

            <li className="relative inline-block py-2 transition-colors duration-300 hover:text-orange-400
               after:absolute after:left-0 after:bottom-0
               after:h-[2px] after:w-0 after:bg-orange-400
               after:transition-all after:duration-300
               hover:after:w-full">
              <a href="mailto:support@foodmarket.com" className="flex items-center gap-1">
                📧 support@foodmarket.com
              </a>
            </li>

          </ul>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-gray-800 py-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} FoodMarket. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
