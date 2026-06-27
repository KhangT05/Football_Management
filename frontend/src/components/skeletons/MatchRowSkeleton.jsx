/**
 * MatchRowSkeleton — Loading placeholder cho match card trong ScheduleResults.
 */
export default function MatchRowSkeleton() {
  return (
    <div className="bg-navy/60 backdrop-blur-md border border-navy-light rounded-4xl p-6 shadow-xl shadow-black/20">
      <div className="flex items-center justify-between mb-5">
        <div className="skeleton h-4 w-32 rounded-lg" />
        <div className="skeleton h-6 w-24 rounded-full" />
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col items-center gap-3 flex-1">
          <div className="skeleton w-16 h-16 rounded-2xl" />
          <div className="skeleton h-4 w-24 rounded" />
        </div>
        <div className="skeleton h-12 w-24 rounded-xl" />
        <div className="flex flex-col items-center gap-3 flex-1">
          <div className="skeleton w-16 h-16 rounded-2xl" />
          <div className="skeleton h-4 w-24 rounded" />
        </div>
      </div>
    </div>
  );
}
