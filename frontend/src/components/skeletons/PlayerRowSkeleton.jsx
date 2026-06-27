/**
 * PlayerRowSkeleton — Loading placeholder cho player table row trong MyTeam.
 */
export default function PlayerRowSkeleton() {
  return (
    <tr>
      <td className="py-5 px-6"><div className="skeleton h-6 w-8 mx-auto rounded-lg" /></td>
      <td className="py-5 px-6">
        <div className="flex items-center gap-4">
          <div className="skeleton w-12 h-12 rounded-full shrink-0" />
          <div className="space-y-2">
            <div className="skeleton h-4 w-32 rounded" />
            <div className="skeleton h-3 w-20 rounded" />
          </div>
        </div>
      </td>
      <td className="py-5 px-6"><div className="skeleton h-7 w-16 rounded-lg mx-auto" /></td>
      <td className="py-5 px-6"><div className="skeleton h-6 w-8 mx-auto rounded-lg" /></td>
      <td className="py-5 px-6">
        <div className="flex justify-end gap-3">
          <div className="skeleton w-10 h-10 rounded-xl" />
          <div className="skeleton w-10 h-10 rounded-xl" />
        </div>
      </td>
    </tr>
  );
}
