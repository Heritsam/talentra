import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { CreateJobModal } from "@/components/jobs/create-job-modal";
import { JobsTable } from "@/components/jobs/jobs-table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { api } from "@/lib/api";

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string }>;
}) {
  const { status, search } = await searchParams;
  const jobs = await api.jobs.list();

  return (
    <>
      <header className="flex h-12 shrink-0 items-center justify-between gap-2 border-b px-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.18em]">
            Jobs
          </span>
        </div>
        <CreateJobModal>
          <Button size="sm" className="gap-1.5">
            <HugeiconsIcon
              icon={PlusSignIcon}
              strokeWidth={2}
              className="size-3.5"
            />
            New Job
          </Button>
        </CreateJobModal>
      </header>

      <div className="flex flex-1 flex-col">
        <JobsTable jobs={jobs} activeStatus={status} initialSearch={search} />
      </div>
    </>
  );
}
