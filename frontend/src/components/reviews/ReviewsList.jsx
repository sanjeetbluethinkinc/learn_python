import { useEffect, useState } from "react";
import axios from "axios";

const BASEURL =
  import.meta.env.VITE_DJANGO_BASE_URL || "http://127.0.0.1:8000";


const INITIAL_LIMIT = 6;

export default function ReviewsList() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(
          `${BASEURL}/api/reviews/approved/`
        );

        if (Array.isArray(res.data)) {
          // ⭐ Higher rating first
          const sorted = [...res.data].sort(
            (a, b) => Number(b.rating) - Number(a.rating)
          );
          setReviews(sorted);
        } else {
          setReviews([]);
        }
      } catch (err) {
        console.error("Failed to load reviews:", err);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const toggleExpand = (id) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderReviewCard = (r) => {
    const rating = Math.min(
      5,
      Math.max(0, Number(r.rating) || 0)
    );
    const isExpanded = expanded[r.id];
    const isLong = r.review.length > 120;

    return (
      <div
        key={r.id}
        className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition"
      >
        <h4 className="font-semibold text-lg text-gray-800">
          {r.name}
        </h4>

        <div className="flex items-center mt-1 text-orange-500 text-lg">
          {"★".repeat(rating)}
          <span className="text-gray-300">
            {"★".repeat(5 - rating)}
          </span>
        </div>

        <p
          className={`text-gray-600 mt-3 overflow-hidden transition-all ${
            isExpanded ? "max-h-[1000px]" : "max-h-[3em]"
          }`}
          style={{ lineHeight: "1.5em" }}
        >
          {r.review}
        </p>

        {isLong && (
          <button
            onClick={() => toggleExpand(r.id)}
            className="mt-2 text-sm text-blue-600 hover:underline"
          >
            {isExpanded ? "View less" : "View more"}
          </button>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <p className="text-gray-500 text-center">
        Loading reviews...
      </p>
    );
  }

  if (reviews.length === 0) {
    return (
      <p className="text-gray-500 text-center">
        No reviews available.
      </p>
    );
  }

  return (
    <>
      {/* 🔹 MAIN LIST (ONLY 6) */}
      <div className="grid md:grid-cols-2 gap-6">
        {reviews.slice(0, INITIAL_LIMIT).map(renderReviewCard)}
      </div>

      {/* 🔹 SEE MORE BUTTON */}
      {reviews.length > INITIAL_LIMIT && (
        <div className="text-center mt-6">
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            See more reviews
          </button>
        </div>
      )}

      {/* 🔹 MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white w-full max-w-4xl max-h-[80vh] rounded-xl p-6 relative overflow-hidden">

            {/* Close */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl"
            >
              ✕
            </button>

            <h3 className="text-xl font-semibold mb-4">
              All Reviews
            </h3>

            {/* Scrollable list */}
            <div className="overflow-y-auto max-h-[65vh] grid md:grid-cols-2 gap-6 pr-2">
              {reviews.map(renderReviewCard)}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
