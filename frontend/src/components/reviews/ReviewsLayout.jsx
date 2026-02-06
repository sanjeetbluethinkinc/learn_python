import ReviewForm from "./ReviewForm";
import ReviewsList from "./ReviewsList";

export default function ReviewsLayout() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        
        {/* LEFT SECTION – Review Form */}
        <div className="w-full">
          <ReviewForm />
        </div>

        {/* RIGHT SECTION – Reviews List */}
        <div className="w-full">
          <h3 className="text-xl font-semibold mb-4">
            Customer Reviews
          </h3>
          <ReviewsList />
        </div>

      </div>
    </div>
  );
}
