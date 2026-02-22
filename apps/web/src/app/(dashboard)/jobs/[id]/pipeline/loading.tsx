import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function PipelineLoading() {
  return (
    <>
      <header className="flex h-12 shrink-0 items-center justify-between gap-2 border-b px-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Skeleton className="h-3 w-32" />
        </div>
        <Skeleton className="h-3 w-20" />
      </header>
      <div className="flex flex-1 overflow-hidden divide-x">
        {Array.from({ length: 6 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
          <div key={i} className="flex min-w-[180px] flex-1 flex-col">
            <div className="flex items-center justify-between border-b bg-muted/20 px-3 py-2.5">
              <Skeleton className="h-4 w-16 rounded-full" />
              <Skeleton className="h-3 w-4" />
            </div>
            <div className="flex flex-col gap-1.5 p-2">
              {Array.from({ length: i < 2 ? 3 : i < 4 ? 2 : 1 }).map((_, j) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
                <div key={j} className="border bg-card p-2.5">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="mt-1 h-2.5 w-16" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
