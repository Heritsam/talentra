"use client";

import {
  type ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import Link from "next/link";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Candidate = {
  id: string;
  name: string;
  email: string;
  skills: string[];
  experience: number;
  createdAt: Date;
  applicationCount: number;
};

function globalFilterFn(
  row: { original: Candidate },
  _: string,
  filterValue: string,
) {
  const q = filterValue.toLowerCase();
  if (!q) return true;
  const c = row.original;
  return (
    c.name.toLowerCase().includes(q) ||
    c.email.toLowerCase().includes(q) ||
    c.skills.some((s) => s.toLowerCase().includes(q))
  );
}

const columns: ColumnDef<Candidate>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <Link href={`/candidates/${row.original.id}`} className="block">
        <span className="font-medium font-mono text-sm transition-colors group-hover:text-primary">
          {row.original.name}
        </span>
      </Link>
    ),
  },
  {
    id: "email",
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <Link
        href={`/candidates/${row.original.id}`}
        className="block font-sans text-muted-foreground text-sm"
      >
        {row.original.email}
      </Link>
    ),
  },
  {
    id: "skills",
    accessorKey: "skills",
    header: "Skills",
    cell: ({ row }) => (
      <Link href={`/candidates/${row.original.id}`} className="block">
        <div className="flex flex-wrap gap-1">
          {row.original.skills.slice(0, 4).map((skill) => (
            <Badge
              key={skill}
              className="rounded-full border border-border bg-transparent px-1.5 py-0 font-mono text-[9px] text-foreground/70"
            >
              {skill}
            </Badge>
          ))}
          {row.original.skills.length > 4 && (
            <Badge className="rounded-full border border-border bg-transparent px-1.5 py-0 font-mono text-[9px] text-muted-foreground">
              +{row.original.skills.length - 4}
            </Badge>
          )}
        </div>
      </Link>
    ),
  },
  {
    id: "experience",
    accessorKey: "experience",
    header: "Exp.",
    cell: ({ row }) => (
      <Link
        href={`/candidates/${row.original.id}`}
        className="block font-mono text-muted-foreground text-sm tabular-nums"
      >
        {row.original.experience}yr{row.original.experience !== 1 ? "s" : ""}
      </Link>
    ),
  },
  {
    id: "applicationCount",
    accessorKey: "applicationCount",
    header: "Applications",
    cell: ({ row }) => (
      <Link
        href={`/candidates/${row.original.id}`}
        className="block font-mono text-muted-foreground text-sm tabular-nums text-right"
      >
        {row.original.applicationCount}
      </Link>
    ),
  },
];

export function CandidatesTable({
  candidates,
  initialSearch,
}: {
  candidates: Candidate[];
  initialSearch?: string;
}) {
  const [globalFilter, setGlobalFilter] = useState(initialSearch ?? "");

  const table = useReactTable({
    data: candidates,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn,
  });

  return (
    <div className="flex flex-1 flex-col">
      {/* Search bar */}
      <div className="border-b px-4 py-2">
        <Input
          placeholder="Search by name, email, or skill…"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={`font-mono text-[10px] uppercase tracking-[0.15em]${header.id === "applicationCount" ? " text-right" : ""}`}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
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
                No candidates found.
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
