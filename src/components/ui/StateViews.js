import Spinner from "./Spinner";
import Button from "./Button";

export function LoadingState({ label = "Loading…" }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-slate-500">
      <Spinner className="h-8 w-8 text-indigo-600" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function EmptyState({ title = "Nothing found", message, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-20 text-center">
      <p className="text-4xl">🔍</p>
      <h2 className="font-semibold">{title}</h2>
      {message && <p className="max-w-sm text-sm text-slate-500">{message}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export function ErrorState({ message = "Something went wrong.", onRetry }) {
  return (
    <div role="alert" className="flex flex-col items-center justify-center gap-3 py-20 text-center">
      <p className="text-4xl">⚠️</p>
      <h2 className="font-semibold">Could not load data</h2>
      <p className="max-w-sm text-sm text-slate-500">{message}</p>
      {onRetry && <Button onClick={onRetry}>Retry</Button>}
    </div>
  );
}
