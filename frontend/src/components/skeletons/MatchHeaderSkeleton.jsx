/**
 * MatchHeaderSkeleton — Loading placeholder cho match detail header.
 */
export default function MatchHeaderSkeleton() {
  return (
    <div className="flex justify-center items-center gap-8">
      {[0, 1].map(i => (
        <div key={i} className="flex flex-col items-center gap-4">
          <div className="skeleton w-28 h-28 rounded-full" />
          <div className="skeleton h-5 w-20 rounded" />
        </div>
      ))}
      <div className="flex flex-col items-center gap-3">
        <div className="skeleton h-20 w-44 rounded-3xl" />
        <div className="skeleton h-6 w-24 rounded-full" />
      </div>
    </div>
  );
}
