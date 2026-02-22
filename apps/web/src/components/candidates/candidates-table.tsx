"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

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

export function CandidatesTable({
  candidates,
  initialSearch,
}: {
  candidates: Candidate[];
  initialSearch?: string;
}) {
  const [search, setSearch] = useState(initialSearch ?? "");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return candidates;
    return candidates.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.skills.some((s) => s.toLowerCase().includes(q)),
    );
  }, [candidates, search]);

  return (
    <div className="flex flex-1 flex-col">
      {/* Search bar */}
      <div className="border-b px-4 py-2">
        <Input
          placeholder="Search by name, email, or skill…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-mono text-[10px] uppercase tracking-[0.15em]">
              Name
            </TableHead>
            <TableHead className="font-mono text-[10px] uppercase tracking-[0.15em]">
              Email
            </TableHead>
            <TableHead className="font-mono text-[10px] uppercase tracking-[0.15em]">
              Skills
            </TableHead>
            <TableHead className="font-mono text-[10px] uppercase tracking-[0.15em]">
              Exp.
            </TableHead>
            <TableHead className="text-right font-mono text-[10px] uppercase tracking-[0.15em]">
              Applications
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="py-12 text-center font-mono text-muted-foreground text-sm"
              >
                No candidates found.
              </TableCell>
            </TableRow>
          ) : (
            filtered.map((candidate) => (
              <TableRow
                key={candidate.id}
                className="group cursor-pointer hover:bg-muted/20"
              >
                <TableCell>
                  <Link href={`/candidates/${candidate.id}`} className="block">
                    <span className="font-medium font-mono text-sm transition-colors group-hover:text-primary">
                      {candidate.name}
                    </span>
                  </Link>
                </TableCell>
                <TableCell>
                  <Link
                    href={`/candidates/${candidate.id}`}
                    className="block font-sans text-muted-foreground text-sm"
                  >
                    {candidate.email}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/candidates/${candidate.id}`} className="block">
                    <div className="flex flex-wrap gap-1">
                      {candidate.skills.slice(0, 4).map((skill) => (
                        <Badge
                          key={skill}
                          className="rounded-full border border-border bg-transparent px-1.5 py-0 font-mono text-[9px] text-foreground/70"
                        >
                          {skill}
                        </Badge>
                      ))}
                      {candidate.skills.length > 4 && (
                        <Badge className="rounded-full border border-border bg-transparent px-1.5 py-0 font-mono text-[9px] text-muted-foreground">
                          +{candidate.skills.length - 4}
                        </Badge>
                      )}
                    </div>
                  </Link>
                </TableCell>
                <TableCell>
                  <Link
                    href={`/candidates/${candidate.id}`}
                    className="block font-mono text-muted-foreground text-sm tabular-nums"
                  >
                    {candidate.experience}yr
                    {candidate.experience !== 1 ? "s" : ""}
                  </Link>
                </TableCell>
                <TableCell className="text-right">
                  <Link
                    href={`/candidates/${candidate.id}`}
                    className="block font-mono text-muted-foreground text-sm tabular-nums"
                  >
                    {candidate.applicationCount}
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
