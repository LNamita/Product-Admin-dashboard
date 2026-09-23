import { formatDate } from "@/lib/format";
import Rating from "./Rating";

export default function ReviewList({ reviews = [] }) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold">Reviews ({reviews.length})</h2>
      {reviews.length === 0 ? (
        <p className="text-sm text-slate-500">No reviews yet.</p>
      ) : (
        <ul className="space-y-3">
          {reviews.map((review, i) => (
            <li key={`${review.reviewerEmail}-${i}`} className="rounded-xl bg-white p-4 ring-1 ring-slate-200">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium">{review.reviewerName}</p>
                <Rating value={review.rating} />
              </div>
              <p className="mt-1 text-sm text-slate-700">{review.comment}</p>
              <p className="mt-1 text-xs text-slate-400">{formatDate(review.date)}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
