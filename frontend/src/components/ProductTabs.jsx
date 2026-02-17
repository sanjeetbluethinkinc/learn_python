import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function ProductTabs({ product }) {
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL.replace(/\/$/, "");

  const [tab, setTab] = useState("details");
  const [isTabLoading, setIsTabLoading] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [questions, setQuestions] = useState([]);

  const [reviewForm, setReviewForm] = useState({
    name: "",
    rating: 0,
    review: "",
  });

  const [hoverRating, setHoverRating] = useState(0);

  const [questionForm, setQuestionForm] = useState({
    name: "",
    question: "",
  });

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    fetch(`${BASEURL}/api/products/${product.id}/reviews/`)
      .then(res => res.json())
      .then(setReviews)
      .catch(() => {});

    fetch(`${BASEURL}/api/products/${product.id}/questions/`)
      .then(res => res.json())
      .then(setQuestions)
      .catch(() => {});
  }, [product.id, BASEURL]);

  /* ================= TAB SWITCH WITH LOADER ================= */
  const handleTabChange = (t) => {
    if (tab === t) return;
    setIsTabLoading(true);
    setTab(t);
    setTimeout(() => setIsTabLoading(false), 400);
  };

  /* ================= SUBMIT REVIEW ================= */
  const submitReview = async (e) => {
    e.preventDefault();

    if (!reviewForm.name || !reviewForm.review || reviewForm.rating === 0) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Review",
        text: "Please provide name, rating and review.",
      });
      return;
    }

    try {
      await fetch(`${BASEURL}/api/reviews/submit/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...reviewForm, product: product.id }),
      });

      Swal.fire({
        icon: "success",
        title: "Thank you!",
        text: "Your review has been submitted for admin approval.",
        confirmButtonColor: "#f97316",
      });

      setReviewForm({ name: "", rating: 0, review: "" });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Unable to submit review. Try again later.",
      });
    }
  };

  /* ================= SUBMIT QUESTION ================= */
  const submitQuestion = async (e) => {
    e.preventDefault();

    if (!questionForm.name || !questionForm.question) {
      Swal.fire({
        icon: "warning",
        title: "Missing fields",
        text: "Please enter your name and question.",
      });
      return;
    }

    try {
      await fetch(`${BASEURL}/api/questions/submit/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...questionForm, product: product.id }),
      });

      Swal.fire({
        icon: "success",
        title: "Question Sent",
        text: "Admin will answer your question soon.",
        confirmButtonColor: "#f97316",
      });

      setQuestionForm({ name: "", question: "" });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Unable to submit question.",
      });
    }
  };

  /* ================= LOADER ================= */
  const TabLoader = () => (
    <div className="flex justify-center py-14">
      <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="bg-gray-100 rounded-xl shadow-sm p-6">

      {/* ================= TABS ================= */}
      <div className="relative mb-8">
        <div className="flex gap-10">
          {["details", "reviews", "discussion"].map(t => (
            <button
              key={t}
              onClick={() => handleTabChange(t)}
              className={`relative inline-block py-2 transition-colors duration-300 hover:text-orange-400
               after:absolute after:left-0 after:bottom-0
               after:h-[2px] after:w-0 after:bg-orange-400
               after:transition-all after:duration-300
               hover:after:w-full
                ${
                  tab === t
                    ? "text-orange-600 "
                    : "text-gray-500 hover:text-orange-400 cursor-pointer"
                }
              `}
            >
              {t === "details" && "The Details"}
              {t === "reviews" && "Ratings & Reviews"}
              {t === "discussion" && "Questions & Answers"}

              {tab === t && (
                <span className="absolute left-0 -bottom-[1px] h-[3px] w-full bg-orange-500 rounded-full transition-all" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ================= TAB CONTENT ================= */}
      {isTabLoading ? (
        <TabLoader />
      ) : (
        <>
          {/* ================= DETAILS ================= */}
         {tab === "details" && (
  <div className="bg-gray-50 p-6">

    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
      <span className="w-2 h-2 bg-orange-500 rounded-full" />
      Product Description
    </h3>

    <div className="text-gray-700 leading-7 text-sm whitespace-pre-line">
      {product.description || (
        <span className="italic text-gray-400">
          No description available for this product.
        </span>
      )}
    </div>

  </div>
)}

          {/* ================= REVIEWS ================= */}
          {tab === "reviews" && (
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Customer Reviews
                </h3>

                {reviews.length === 0 && (
                  <p className="text-gray-500 text-sm">
                    No reviews yet.
                  </p>
                )}

                {reviews.map(r => (
                  <div key={r.id} className="border rounded-lg p-4 mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">{r.name}</span>
                      <span className="text-yellow-400">
                        {"★".repeat(r.rating)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{r.review}</p>
                  </div>
                ))}
              </div>

              {/* REVIEW FORM */}
              <form onSubmit={submitReview} className="bg-gray-50 rounded-lg p-5">
                <h4 className="font-semibold mb-4">Write a Review</h4>

                {/* ⭐ STAR RATING */}
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      type="button"
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() =>
                        setReviewForm({ ...reviewForm, rating: star })
                      }
                      className={`text-3xl ${
                        (hoverRating || reviewForm.rating) >= star
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>

                <input
                  placeholder="Your name"
                  value={reviewForm.name}
                  onChange={e =>
                    setReviewForm({ ...reviewForm, name: e.target.value })
                  }
                  className="w-full border rounded-md px-3 py-2 mb-3"
                  required
                />

                <textarea
                  placeholder="Share your experience…"
                  value={reviewForm.review}
                  onChange={e =>
                    setReviewForm({ ...reviewForm, review: e.target.value })
                  }
                  rows={4}
                  className="w-full border rounded-md px-3 py-2 mb-4 resize-none"
                  required
                />

                <button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md font-medium"
                >
                  Submit Review
                </button>
              </form>
            </div>
          )}

          {/* ================= QUESTIONS ================= */}
          {tab === "discussion" && (
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Questions & Answers
                </h3>

                {questions.map(q => (
                  <div key={q.id} className="border rounded-lg p-4 mb-4">
                    <p className="font-medium">Q: {q.question}</p>
                    <p className="text-sm text-gray-600 mt-2">
                      <strong>A:</strong> {q.answer}
                    </p>
                  </div>
                ))}
              </div>

              <form onSubmit={submitQuestion} className="bg-gray-50 rounded-lg p-5">
                <h4 className="font-semibold mb-4">Ask a Question</h4>

                <input
                  placeholder="Your name"
                  value={questionForm.name}
                  onChange={e =>
                    setQuestionForm({ ...questionForm, name: e.target.value })
                  }
                  className="w-full border rounded-md px-3 py-2 mb-3"
                  required
                />

                <textarea
                  placeholder="Type your question here…"
                  value={questionForm.question}
                  onChange={e =>
                    setQuestionForm({ ...questionForm, question: e.target.value })
                  }
                  rows={4}
                  className="w-full border rounded-md px-3 py-2 mb-4 resize-none"
                  required
                />

                <button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md font-medium"
                >
                  Submit Question
                </button>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
}
