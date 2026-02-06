import ReviewForm from "../components/reviews/ReviewForm";
import ReviewsList from "../components/reviews/ReviewsList";

export default function ReviewsPage() {
  return (
    <div className="container mx-auto py-10 space-y-10">
      <ReviewForm />
      <ReviewsList />
    </div>
  );
}