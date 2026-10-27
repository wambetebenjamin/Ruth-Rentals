export default function Loading() {
  return (
    <div className="wrap py-16" role="status" aria-live="polite">
      <p className="font-display text-[13px] uppercase tracking-[0.16em] text-copy">Loading</p>
      <div className="mt-4 max-w-md space-y-3">
        <div className="h-7 w-2/3 bg-wash" />
        <div className="h-4 w-full bg-wash" />
        <div className="h-4 w-5/6 bg-wash" />
      </div>
      <p className="mt-6 text-[14px] text-copy">Fetching gear and dates. One moment.</p>
    </div>
  );
}
