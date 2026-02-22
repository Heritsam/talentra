import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function DashboardLoading() {
  return (
    <>
      <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Skeleton className="h-3 w-20" />
        <div className="ml-auto flex items-center gap-2">
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-8 w-20" />
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-0">
        {/* Stat cards */}
        <div className="grid grid-cols-2 divide-x divide-y border-b md:grid-cols-4 md:divide-y-0">
          {Array.from({ length: 4 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
            <div key={i} className="flex flex-col gap-3 p-6">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-8 w-12" />
              <Skeleton className="h-2.5 w-20" />
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="border-b px-6 py-5">
          <Skeleton className="mb-4 h-3 w-40" />
          <Skeleton className="h-40 w-full" />
        </div>

        {/* Bottom two columns */}
        <div className="grid flex-1 grid-cols-1 divide-y md:grid-cols-2 md:divide-x md:divide-y-0">
          {Array.from({ length: 2 }).map((_, col) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
            <div key={col} className="flex flex-col">
              <div className="border-b px-6 py-4">
                <Skeleton className="h-2.5 w-28" />
                <Skeleton className="mt-1.5 h-4 w-36" />
              </div>
              <div className="divide-y">
                {Array.from({ length: 5 }).map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
                  <div key={i} className="flex items-center justify-between px-6 py-3">
                    <div className="flex flex-col gap-1.5">
                      <Skeleton className="h-3 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-5 w-16 rounded-full" />
                      <Skeleton className="h-3 w-10" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
