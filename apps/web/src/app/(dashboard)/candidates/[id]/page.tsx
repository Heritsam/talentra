import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
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

const APP_STATUS_COLORS: Record<string, string> = {
  APPLIED: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  SCREENING: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  INTERVIEW: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  OFFER: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  HIRED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  REJECTED: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
};

function timeAgo(date: Date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default async function CandidateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let candidate: Awaited<ReturnType<typeof api.candidates.getById>>;
  try {
    candidate = await api.candidates.getById({ id });
  } catch {
    notFound();
  }

  const { applications: history, ...profile } = candidate;

  return (
    <>
      <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Link
          href="/candidates"
          className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3" />
          Candidates
        </Link>
      </header>

      <div className="flex flex-1 flex-col gap-0">
        {/* Profile header */}
        <div className="border-b px-6 py-6">
          <h1 className="font-mono font-bold text-2xl tracking-tight">{profile.name}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="font-sans text-sm text-muted-foreground">{profile.email}</span>
            {profile.phone && (
              <span className="font-sans text-sm text-muted-foreground">{profile.phone}</span>
            )}
            <span className="font-mono text-sm text-muted-foreground">
              {profile.experience}yr{profile.experience !== 1 ? "s" : ""} experience
            </span>
          </div>

          {profile.skills.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {profile.skills.map((skill) => (
                <Badge
                  key={skill}
                  className="rounded-full border border-border bg-transparent px-2 py-0.5 font-mono text-[10px] text-foreground/70"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          )}

          {profile.notes && (
            <p className="mt-4 font-sans text-sm text-muted-foreground max-w-prose">
              {profile.notes}
            </p>
          )}
        </div>

        {/* Application history */}
        <div>
          <div className="border-b px-6 py-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Application history — {history.length} job{history.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-mono text-[10px] uppercase tracking-[0.15em]">Job</TableHead>
                <TableHead className="font-mono text-[10px] uppercase tracking-[0.15em]">Department</TableHead>
                <TableHead className="font-mono text-[10px] uppercase tracking-[0.15em]">Stage</TableHead>
                <TableHead className="text-right font-mono text-[10px] uppercase tracking-[0.15em]">Last updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-12 text-center font-mono text-sm text-muted-foreground">
                    No applications yet.
                  </TableCell>
                </TableRow>
              ) : (
                history.map((app) => (
                  <TableRow key={app.id} className="hover:bg-muted/20">
                    <TableCell>
                      <Link href={`/jobs/${app.jobId}`} className="font-mono font-medium text-sm hover:text-primary transition-colors">
                        {app.jobTitle}
                      </Link>
                    </TableCell>
                    <TableCell className="font-sans text-sm text-muted-foreground">
                      {app.jobDepartment}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${APP_STATUS_COLORS[app.status]} rounded-full border-0 px-2 py-0.5 font-mono text-[10px] font-medium`}
                      >
                        {app.status.charAt(0) + app.status.slice(1).toLowerCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono text-[10px] tabular-nums text-muted-foreground">
                      {timeAgo(app.updatedAt)}
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
