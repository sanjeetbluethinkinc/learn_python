import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const BASEURL =
  import.meta.env.VITE_DJANGO_BASE_URL || "http://127.0.0.1:8000";


export default function ReviewForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    rating: 0,
    review: "",
  });

  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const setRating = (value) => {
    setForm({ ...form, rating: value });
  };

  const submitReview = async (e) => {
    e.preventDefault();

    if (form.rating === 0) {
      Swal.fire({
        icon: "warning",
        title: "Rating required",
        text: "Please select a rating before submitting.",
      });
      return;
    }

    try {
      setSubmitting(true);

      const res = await axios.post(
        `${BASEURL}/api/reviews/submit/`,
        {
          name: form.name,
          rating: form.rating,
          review: form.review,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      Swal.fire({
        icon: "success",
        title: "Thank you!",
        text: res.data.message || "Your review has been submitted.",
        confirmButtonColor: "#2563eb",
      });

      setForm({ name: "", email: "", rating: 0, review: "" });
    } catch (err) {
      console.error("Review submit error:", err.response?.data || err);

      Swal.fire({
        icon: "error",
        title: "Submission failed",
        text: "Something went wrong. Please try again later.",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-6">
      <h2 className="text-xl font-semibold text-center mb-1">
        Leave a review
      </h2>
      <p className="text-sm text-gray-500 text-center mb-4">
        How would you rate your experience?
      </p>

      {/* ⭐ STAR RATING (HOVER + POINTER) */}
      <div className="flex justify-center mb-4">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled =
            hoverRating >= star || form.rating >= star;

          return (
            <button
              key={star}
              type="button"
              className="text-3xl cursor-pointer focus:outline-none"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
            >
              <span
                className={
                  isFilled ? "text-yellow-400" : "text-gray-300"
                }
              >
                ★
              </span>
            </button>
          );
        })}
      </div>

      <form onSubmit={submitReview} className="space-y-4">
        {/* Name */}
        <div>
          <label className="text-sm font-medium">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your full name..."
            className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-orange-400 outline-none"
            required
            disabled={submitting}
          />
        </div>

        {/* Review */}
        <div>
          <label className="text-sm font-medium">
            Review <span className="text-red-500">*</span>
          </label>
          <textarea
            name="review"
            value={form.review}
            onChange={handleChange}
            placeholder="ex. You guys are awesome."
            className="w-full border rounded-lg px-3 py-2 mt-1 resize-none focus:ring-2 focus:ring-orange-400 outline-none"
            rows={4}
            required
            disabled={submitting}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className={`w-full py-2 rounded-lg font-medium transition text-white ${
            submitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </button>

        <p className="text-xs text-gray-400 text-center">
          * Required fields
        </p>
      </form>
    </div>
  );
}
