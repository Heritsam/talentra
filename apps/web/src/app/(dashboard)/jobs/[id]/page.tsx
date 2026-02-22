import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DeleteJobDialog } from "@/components/jobs/delete-job-dialog";
import { EditJobModal } from "@/components/jobs/edit-job-modal";
import { JobDetailTabs } from "@/components/jobs/job-detail-tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/lib/api";
import { timeAgo } from "@/lib/time";

const JOB_STATUS_COLORS: Record<string, string> = {
  OPEN: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  DRAFT: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  CLOSED: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
};

const APP_STATUS_COLORS: Record<string, string> = {
  APPLIED: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  SCREENING: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  INTERVIEW:
    "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  OFFER: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  HIRED:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  REJECTED: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
};

const PIPELINE_STAGES = [
  "APPLIED",
  "SCREENING",
  "INTERVIEW",
  "OFFER",
  "HIRED",
  "REJECTED",
] as const;

export default async function JobDetailPage({
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

  const { applications: applicants, ...job } = jobData;

  const stageCounts = PIPELINE_STAGES.reduce(
    (acc, stage) => {
      acc[stage] = applicants.filter((a) => a.status === stage).length;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <>
      <header className="flex h-12 shrink-0 items-center justify-between gap-2 border-b px-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Link
            href="/jobs"
            className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground uppercase tracking-[0.15em] transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3" />
            Jobs
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <EditJobModal job={job}>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </EditJobModal>
          <DeleteJobDialog job={job}>
            <Button variant="destructive" size="sm">
              Delete
            </Button>
          </DeleteJobDialog>
        </div>
      </header>

      <JobDetailTabs jobId={id} active="overview" />

      <div className="flex flex-1 flex-col gap-0">
        {/* Job info */}
        <div className="border-b px-6 py-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <Badge
                  className={`${JOB_STATUS_COLORS[job.status]} rounded-full border-0 px-2 py-0.5 font-medium font-mono text-[10px]`}
                >
                  {job.status.charAt(0) + job.status.slice(1).toLowerCase()}
                </Badge>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {job.department}
                </span>
                {job.location && (
                  <>
                    <span className="text-muted-foreground/40">·</span>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {job.location}
                    </span>
                  </>
                )}
              </div>
              <h1 className="font-bold font-mono text-2xl tracking-tight">
                {job.title}
              </h1>
            </div>
          </div>

          {/* Stage breakdown */}
          <div className="mt-6 grid grid-cols-3 gap-3 md:grid-cols-6">
            {PIPELINE_STAGES.map((stage) => (
              <div key={stage} className="flex flex-col gap-1 border p-3">
                <span
                  className={`${APP_STATUS_COLORS[stage]} w-fit rounded-full border-0 px-1.5 py-0.5 font-medium font-mono text-[9px]`}
                >
                  {stage.charAt(0) + stage.slice(1).toLowerCase()}
                </span>
                <span className="font-bold font-mono text-2xl tabular-nums leading-none">
                  {stageCounts[stage]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Applicants table */}
        <div>
          <div className="border-b px-6 py-3">
            <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.18em]">
              {applicants.length} applicant{applicants.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-mono text-[10px] uppercase tracking-[0.15em]">
                  Candidate
                </TableHead>
                <TableHead className="font-mono text-[10px] uppercase tracking-[0.15em]">
                  Email
                </TableHead>
                <TableHead className="font-mono text-[10px] uppercase tracking-[0.15em]">
                  Stage
                </TableHead>
                <TableHead className="text-right font-mono text-[10px] uppercase tracking-[0.15em]">
                  Applied
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applicants.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="py-12 text-center font-mono text-muted-foreground text-sm"
                  >
                    No applicants yet.
                  </TableCell>
                </TableRow>
              ) : (
                applicants.map((app) => (
                  <TableRow key={app.id} className="hover:bg-muted/20">
                    <TableCell>
                      <Link
                        href={`/candidates/${app.candidate.id}`}
                        className="font-medium font-mono text-sm transition-colors hover:text-primary"
                      >
                        {app.candidate.name}
                      </Link>
                    </TableCell>
                    <TableCell className="font-sans text-muted-foreground text-sm">
                      {app.candidate.email}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${APP_STATUS_COLORS[app.status]} rounded-full border-0 px-2 py-0.5 font-medium font-mono text-[10px]`}
                      >
                        {app.status.charAt(0) +
                          app.status.slice(1).toLowerCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono text-[10px] text-muted-foreground tabular-nums">
                      {timeAgo(app.createdAt)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
