export default function Rating({ value = 0 }) {
  const rating = Number(value) || 0;
  return (
    <span className="inline-flex items-center gap-1 text-sm" aria-label={`Rating ${rating.toFixed(1)} out of 5`}>
      <span className="text-amber-500">★</span>
      {rating.toFixed(1)}
    </span>
  );
}
