"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Job = {
  id: string;
  title: string;
  department: string;
  location: string | null;
  status: "OPEN" | "CLOSED" | "DRAFT";
  createdAt: Date;
  applicationCount: number;
};

const STATUS_COLORS: Record<string, string> = {
  OPEN: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  DRAFT: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  CLOSED: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
};

const TABS = ["All", "OPEN", "DRAFT", "CLOSED"] as const;

export function JobsTable({
  jobs,
  activeStatus,
}: {
  jobs: Job[];
  activeStatus?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filtered = activeStatus && activeStatus !== "All"
    ? jobs.filter((j) => j.status === activeStatus)
    : jobs;

  function setFilter(status: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (status === "All") {
      params.delete("status");
    } else {
      params.set("status", status);
    }
    router.push(`/jobs?${params.toString()}`);
  }

  const current = activeStatus ?? "All";

  return (
    <div className="flex flex-1 flex-col">
      {/* Filter tabs */}
      <div className="flex gap-0 border-b">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilter(tab)}
            className={`border-r px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.15em] transition-colors hover:bg-muted/30 ${
              current === tab
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground"
            }`}
          >
            {tab === "All" ? "All" : tab.charAt(0) + tab.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-mono text-[10px] uppercase tracking-[0.15em]">Role</TableHead>
            <TableHead className="font-mono text-[10px] uppercase tracking-[0.15em]">Department</TableHead>
            <TableHead className="font-mono text-[10px] uppercase tracking-[0.15em]">Location</TableHead>
            <TableHead className="font-mono text-[10px] uppercase tracking-[0.15em]">Status</TableHead>
            <TableHead className="text-right font-mono text-[10px] uppercase tracking-[0.15em]">Applicants</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="py-12 text-center font-mono text-sm text-muted-foreground">
                No jobs found.
              </TableCell>
            </TableRow>
          ) : (
            filtered.map((job) => (
              <TableRow key={job.id} className="group cursor-pointer hover:bg-muted/20">
                <TableCell>
                  <Link href={`/jobs/${job.id}`} className="block">
                    <span className="font-mono font-medium text-sm group-hover:text-primary transition-colors">
                      {job.title}
                    </span>
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/jobs/${job.id}`} className="block font-sans text-sm text-muted-foreground">
                    {job.department}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/jobs/${job.id}`} className="block font-sans text-sm text-muted-foreground">
                    {job.location ?? "—"}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/jobs/${job.id}`} className="block">
                    <Badge
                      className={`${STATUS_COLORS[job.status]} rounded-full border-0 px-2 py-0.5 font-mono text-[10px] font-medium`}
                    >
                      {job.status.charAt(0) + job.status.slice(1).toLowerCase()}
                    </Badge>
                  </Link>
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/jobs/${job.id}`} className="block font-mono text-sm tabular-nums text-muted-foreground">
                    {job.applicationCount}
                  </Link>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
