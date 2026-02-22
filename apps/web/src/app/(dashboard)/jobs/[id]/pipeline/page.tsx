import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JobDetailTabs } from "@/components/jobs/job-detail-tabs";
import { KanbanBoard } from "@/components/pipeline/kanban-board";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { api } from "@/lib/api";

export default async function PipelinePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let jobData: Awaited<ReturnType<typeof api.jobs.getById>>;
  try {
    jobData = await api.jobs.getById({ id });
  } catch {
    notFound();
  }

  const applicants = await api.applications.listByJob({ jobId: id });
  const { applications: _, ...job } = jobData;

  return (
    <>
      <header className="flex h-12 shrink-0 items-center justify-between gap-2 border-b px-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Link
            href={`/jobs/${id}`}
            className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground uppercase tracking-[0.15em] transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3" />
            {job.title}
          </Link>
          <span className="font-mono text-[10px] text-muted-foreground/40">
            /
          </span>
          <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.15em]">
            Pipeline
          </span>
        </div>
        <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
          {applicants.length} applicant{applicants.length !== 1 ? "s" : ""}
        </span>
      </header>

      <JobDetailTabs jobId={id} active="pipeline" />

      <div className="flex flex-1 overflow-hidden">
        <KanbanBoard jobId={id} initialApplications={applicants} />
      </div>
    </>
  );
}
