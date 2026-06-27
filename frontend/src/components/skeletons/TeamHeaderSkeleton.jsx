/**
 * TeamHeaderSkeleton — Loading placeholder cho team detail header.
 */
export default function TeamHeaderSkeleton() {
  return (
    <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
      <div className="skeleton w-32 h-32 md:w-48 md:h-48 rounded-full shrink-0" />
      <div className="space-y-4 w-full max-w-lg">
        <div className="skeleton h-6 w-24 rounded-full" />
        <div className="skeleton h-12 w-64 rounded" />
        <div className="skeleton h-4 w-full max-w-md rounded" />
      </div>
    </div>
  );
}
