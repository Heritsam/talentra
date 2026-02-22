"use client";

import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { DeleteJobDialog } from "@/components/jobs/delete-job-dialog";
import { EditJobModal } from "@/components/jobs/edit-job-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createUrlQuery, removeKeysFromUrlQuery } from "@/lib/urls";

type Job = {
  id: string;
  title: string;
  department: string;
  location: string | null;
  description: string | null;
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

function globalFilterFn(
  row: { original: Job },
  _: string,
  filterValue: string,
) {
  const q = filterValue.toLowerCase();
  if (!q) return true;
  const job = row.original;
  return (
    job.title.toLowerCase().includes(q) ||
    job.department.toLowerCase().includes(q) ||
    (job.location?.toLowerCase().includes(q) ?? false)
  );
}

export function JobsTable({
  jobs,
  activeStatus,
  initialSearch,
}: {
  jobs: Job[];
  activeStatus?: string;
  initialSearch?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [globalFilter, setGlobalFilter] = useState(initialSearch ?? "");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    activeStatus && activeStatus !== "All"
      ? [{ id: "status", value: activeStatus }]
      : [],
  );

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pushParams = useCallback(
    (search: string, status: string) => {
      // Clear both managed params, then re-add only what's needed
      let url = removeKeysFromUrlQuery({
        params: searchParams.toString(),
        keysToRemove: ["search", "status"],
        path: "/jobs",
      });
      if (search) {
        url = createUrlQuery({
          params: url.split("?")[1] ?? "",
          key: "search",
          value: search,
          path: "/jobs",
        });
      }
      if (status && status !== "All") {
        url = createUrlQuery({
          params: url.split("?")[1] ?? "",
          key: "status",
          value: status,
          path: "/jobs",
        });
      }
      router.push(url);
    },
    [router, searchParams],
  );

  function handleSearchChange(value: string) {
    setGlobalFilter(value);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      const currentStatus =
        (columnFilters.find((f) => f.id === "status")?.value as string) ??
        "All";
      pushParams(value, currentStatus);
    }, 300);
  }

  function setFilter(status: string) {
    if (status === "All") {
      setColumnFilters([]);
    } else {
      setColumnFilters([{ id: "status", value: status }]);
    }
    pushParams(globalFilter, status);
  }

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  const columns: ColumnDef<Job>[] = [
    {
      id: "title",
      accessorKey: "title",
      header: "Role",
      cell: ({ row }) => (
        <Link href={`/jobs/${row.original.id}`} className="block">
          <span className="font-medium font-mono text-sm transition-colors group-hover:text-primary">
            {row.original.title}
          </span>
        </Link>
      ),
    },
    {
      id: "department",
      accessorKey: "department",
      header: "Department",
      cell: ({ row }) => (
        <Link
          href={`/jobs/${row.original.id}`}
          className="block font-sans text-muted-foreground text-sm"
        >
          {row.original.department}
        </Link>
      ),
    },
    {
      id: "location",
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => (
        <Link
          href={`/jobs/${row.original.id}`}
          className="block font-sans text-muted-foreground text-sm"
        >
          {row.original.location ?? "—"}
        </Link>
      ),
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Status",
      filterFn: (row, _, value) => !value || row.getValue("status") === value,
      cell: ({ row }) => (
        <Link href={`/jobs/${row.original.id}`} className="block">
          <Badge
            className={`${STATUS_COLORS[row.original.status]} rounded-full border-0 px-2 py-0.5 font-medium font-mono text-[10px]`}
          >
            {row.original.status.charAt(0) +
              row.original.status.slice(1).toLowerCase()}
          </Badge>
        </Link>
      ),
    },
    {
      id: "applicationCount",
      accessorKey: "applicationCount",
      header: "Applicants",
      cell: ({ row }) => (
        <Link
          href={`/jobs/${row.original.id}`}
          className="block text-right font-mono text-muted-foreground text-sm tabular-nums"
        >
          {row.original.applicationCount}
        </Link>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                aria-label="Row actions"
              >
                <MoreHorizontal className="size-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <EditJobModal job={row.original}>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  Edit
                </DropdownMenuItem>
              </EditJobModal>
              <DeleteJobDialog job={row.original}>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="text-destructive focus:text-destructive"
                >
                  Delete
                </DropdownMenuItem>
              </DeleteJobDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: jobs,
    columns,
    state: {
      globalFilter,
      columnFilters,
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn,
  });

  const current =
    (columnFilters.find((f) => f.id === "status")?.value as string) ?? "All";

  return (
    <div className="flex flex-1 flex-col">
      {/* Filter tabs + search */}
      <div className="flex items-center justify-between border-b">
        <div className="flex gap-0">
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
              {tab === "All"
                ? "All"
                : tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        <div className="px-4">
          <Input
            placeholder="Search jobs…"
            value={globalFilter}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="max-w-xs"
          />
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={`font-mono text-[10px] uppercase tracking-[0.15em]${header.id === "applicationCount" ? "text-right" : ""}${header.id === "actions" ? "w-10" : ""}`}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="py-12 text-center font-mono text-muted-foreground text-sm"
              >
                No jobs found.
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="group cursor-pointer hover:bg-muted/20"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
