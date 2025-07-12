import { Skeleton } from "@/components/global/skeleton";

export default function LoadingRestaurantsPage() {
  return (
    <div>
      <Skeleton className="h-8 w-1/3" /> {/* fake page title */}
      <div className="border rounded-lg overflow-x-auto mt-2">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Owner Email</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, idx) => (
              <tr key={idx} className="hover:bg-accent">
                <td className="p-3">
                  <Skeleton className="h-4 w-32 rounded" />
                </td>
                <td className="p-3">
                  <Skeleton className="h-4 w-48 rounded" />
                </td>
                <td className="p-3">
                  <Skeleton className="h-4 w-24 rounded" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
