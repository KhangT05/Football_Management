/**
 * TeamCardSkeleton — Loading placeholder cho team card trong LeaderboardTeams.
 */
export default function TeamCardSkeleton() {
  return (
    <div className="bg-navy/50 border border-navy-light rounded-3xl p-6 shadow-xl">
      <div className="flex items-start gap-4 mb-6">
        <div className="skeleton w-16 h-16 rounded-2xl shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="skeleton h-5 w-32 rounded-lg" />
          <div className="skeleton h-4 w-20 rounded-lg" />
          <div className="skeleton h-4 w-24 rounded-lg" />
        </div>
      </div>
      <div className="skeleton h-12 w-full rounded-xl" />
    </div>
  );
}
