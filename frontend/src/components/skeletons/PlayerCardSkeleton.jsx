/**
 * PlayerCardSkeleton — Loading placeholder cho player card trong TeamDetail.
 */
export default function PlayerCardSkeleton() {
  return (
    <div className="bg-navy border border-navy-light rounded-xl p-4 shadow-lg shadow-black/20">
      <div className="flex items-center gap-3">
        <div className="skeleton w-12 h-12 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-28 rounded" />
          <div className="skeleton h-3 w-16 rounded" />
        </div>
        <div className="skeleton h-6 w-8 rounded" />
      </div>
    </div>
  );
}
