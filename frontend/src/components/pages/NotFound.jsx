import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="text-center">

        {/* 404 BIG TEXT */}
        <h1 className="text-8xl font-extrabold text-orange-500">
          404
        </h1>

        <h2 className="text-2xl font-semibold mt-4 text-gray-800">
          Page Not Found
        </h2>

        <p className="text-gray-500 mt-3">
          The page you are looking for does not exist.
        </p>

        {/* BUTTON */}
        <Link
          to="/"
          className="inline-block mt-6 bg-orange-500 hover:bg-orange-600
                     text-white px-6 py-3 rounded-lg font-semibold
                     transition duration-300"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
