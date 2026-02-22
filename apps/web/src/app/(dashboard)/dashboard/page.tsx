import {
  BriefcaseIcon,
  CheckmarkBadgeIcon,
  MessageMultiple02Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { CreateCandidateModal } from "@/components/candidates/create-candidate-modal";
import { ApplicationsTrendChart } from "@/components/dashboard/applications-trend-chart";
import { CreateJobModal } from "@/components/jobs/create-job-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { api } from "@/lib/api";
import { timeAgo } from "@/lib/time";

const STATUS_COLORS: Record<string, string> = {
  APPLIED: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  SCREENING: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  INTERVIEW:
    "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  OFFER: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  HIRED:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  REJECTED: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
};

const STAGE_COLORS: Record<string, string> = {
  appliedCount:
    "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  screeningCount:
    "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  interviewCount:
    "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  offerCount:
    "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
};

const STAGE_LABELS: Record<string, string> = {
  appliedCount: "Applied",
  screeningCount: "Screen",
  interviewCount: "Interv",
  offerCount: "Offer",
};

export default async function DashboardPage() {
  const [stats, trendData, staleApps, pipelineSummary] = await Promise.all([
    api.applications.stats(),
    api.applications.trend(),
    api.applications.stale(),
    api.jobs.pipelineSummary(),
  ]);

  const statCards = [
    {
      label: "Open Jobs",
      value: Number(stats.openJobs),
      delta: Number(stats.openJobsThisWeek),
      icon: BriefcaseIcon,
      href: "/jobs",
    },
    {
      label: "Candidates",
      value: Number(stats.totalCandidates),
      delta: Number(stats.candidatesThisWeek),
      icon: UserGroupIcon,
      href: "/candidates",
    },
    {
      label: "Applications",
      value: Number(stats.totalApplications),
      delta: Number(stats.applicationsThisWeek),
      icon: MessageMultiple02Icon,
      href: "/jobs",
    },
    {
      label: "In Interview",
      value: Number(stats.inInterview),
      delta: Number(stats.inInterviewThisWeek),
      icon: CheckmarkBadgeIcon,
      href: "/jobs",
    },
  ];

  return (
    <>
      {/* Top bar */}
      <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.18em]">
          Dashboard
        </span>
        <div className="ml-auto flex items-center gap-2">
          <CreateCandidateModal>
            <Button
              variant="outline"
              size="sm"
              className="font-mono text-[10px] uppercase tracking-[0.12em]"
            >
              New Candidate
            </Button>
          </CreateCandidateModal>
          <CreateJobModal>
            <Button
              size="sm"
              className="font-mono text-[10px] uppercase tracking-[0.12em]"
            >
              New Job
            </Button>
          </CreateJobModal>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-0">
        {/* Stats row */}
        <div className="grid grid-cols-2 divide-x divide-y border-b md:grid-cols-4 md:divide-y-0">
          {statCards.map((stat) => (
            <Link
              key={stat.label}
              href={stat.href}
              className="group flex flex-col gap-3 p-6 transition-colors hover:bg-muted/30"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.18em]">
                  {stat.label}
                </span>
                <HugeiconsIcon
                  icon={stat.icon}
                  strokeWidth={1.5}
                  className="size-4 text-muted-foreground/50 transition-colors group-hover:text-primary"
                />
              </div>
              <div className="font-bold font-mono text-3xl tabular-nums leading-none">
                {stat.value}
              </div>
              {stat.delta > 0 && (
                <div className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400">
                  +{stat.delta} this week
                </div>
              )}
            </Link>
          ))}
        </div>

        {/* Trend chart */}
        <div className="border-b px-6 py-5">
          <p className="mb-4 font-mono text-[10px] text-muted-foreground uppercase tracking-[0.18em]">
            Applications — last 30 days
          </p>
          <ApplicationsTrendChart data={trendData} />
        </div>

        {/* Bottom two-column section */}
        <div className="grid flex-1 grid-cols-1 divide-y md:grid-cols-2 md:divide-x md:divide-y-0">
          {/* Needs Attention */}
          <div className="flex flex-col">
            <div className="border-b px-6 py-4">
              <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.18em]">
                Needs attention
              </p>
              <h2 className="mt-0.5 font-bold font-mono text-base tracking-tight">
                Stale applications
              </h2>
            </div>
            {staleApps.length === 0 ? (
              <div className="flex flex-1 items-center justify-center py-12 text-muted-foreground">
                <p className="font-mono text-sm">All caught up.</p>
              </div>
            ) : (
              <div className="divide-y">
                {staleApps.map((app) => (
                  <Link
                    key={app.id}
                    href={`/jobs/${app.jobId}/pipeline`}
                    className="flex items-center justify-between px-6 py-3 transition-colors hover:bg-muted/20"
                  >
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <span className="truncate font-medium font-mono text-sm leading-tight">
                        {app.candidateName}
                      </span>
                      <span className="truncate font-sans text-muted-foreground text-xs">
                        {app.jobTitle}
                      </span>
                    </div>
                    <div className="ml-4 flex shrink-0 items-center gap-3">
                      <Badge
                        className={`${STATUS_COLORS[app.status]} rounded-full border-0 px-2 py-0.5 font-medium font-mono text-[10px]`}
                      >
                        {app.status}
                      </Badge>
                      <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
                        {timeAgo(app.updatedAt)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Active Pipeline */}
          <div className="flex flex-col">
            <div className="border-b px-6 py-4">
              <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.18em]">
                Active pipeline
              </p>
              <h2 className="mt-0.5 font-bold font-mono text-base tracking-tight">
                Open jobs
              </h2>
            </div>
            {pipelineSummary.length === 0 ? (
              <div className="flex flex-1 items-center justify-center py-12 text-muted-foreground">
                <p className="font-mono text-sm">No open jobs.</p>
              </div>
            ) : (
              <div className="divide-y">
                {pipelineSummary.map((job) => (
                  <Link
                    key={job.id}
                    href={`/jobs/${job.id}/pipeline`}
                    className="flex items-center justify-between px-6 py-3 transition-colors hover:bg-muted/20"
                  >
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <span className="truncate font-medium font-mono text-sm leading-tight">
                        {job.title}
                      </span>
                      <span className="truncate font-sans text-muted-foreground text-xs">
                        {job.department}
                      </span>
                    </div>
                    <div className="ml-4 flex shrink-0 items-center gap-1">
                      {(
                        [
                          "appliedCount",
                          "screeningCount",
                          "interviewCount",
                          "offerCount",
                        ] as const
                      ).map((key) => {
                        const n = Number(job[key]);
                        return (
                          <span
                            key={key}
                            className={`${STAGE_COLORS[key]} rounded-full border-0 px-1.5 py-0.5 font-medium font-mono text-[10px] tabular-nums`}
                            title={STAGE_LABELS[key]}
                          >
                            {n}
                          </span>
                        );
                      })}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
