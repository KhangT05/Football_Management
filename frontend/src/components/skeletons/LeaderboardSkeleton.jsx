/**
 * LeaderboardSkeleton — Loading placeholder cho bảng xếp hạng.
 */
export default function LeaderboardSkeleton() {
  return (
    <>
      {[1, 2, 3, 4, 5, 6].map(i => (
        <tr key={i} className="border-b border-navy-light/50">
          <td className="py-5 px-6"><div className="skeleton h-6 w-8 mx-auto rounded-lg" /></td>
          <td className="py-5 px-6">
            <div className="flex items-center gap-4">
              <div className="skeleton w-10 h-10 rounded-xl shrink-0" />
              <div className="skeleton h-5 w-32 rounded-lg" />
            </div>
          </td>
          {[1,2,3,4,5,6,7,8].map(j => (
            <td key={j} className="py-5 px-4"><div className="skeleton h-5 w-8 mx-auto rounded-lg" /></td>
          ))}
        </tr>
      ))}
    </>
  );
}
