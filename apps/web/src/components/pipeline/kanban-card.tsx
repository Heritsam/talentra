"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import type { ApplicationItem } from "./kanban-board";

export function KanbanCard({
  item,
  isDragging,
}: {
  item: ApplicationItem;
  isDragging?: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`cursor-grab select-none rounded-none border bg-card p-2.5 shadow-sm transition-shadow active:cursor-grabbing ${
        isDragging ? "rotate-1 shadow-md" : "hover:shadow-sm"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <Link
            href={`/candidates/${item.candidateId}`}
            onClick={(e) => e.stopPropagation()}
            className="block font-mono font-medium text-[11px] leading-tight hover:text-primary transition-colors"
          >
            {item.candidateName}
          </Link>
          <p className="mt-0.5 font-sans text-[10px] text-muted-foreground">
            {item.candidateExperience}yr{item.candidateExperience !== 1 ? "s" : ""} exp.
          </p>
        </div>
      </div>

      {item.candidateSkills.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {item.candidateSkills.slice(0, 3).map((skill) => (
            <Badge
              key={skill}
              className="rounded-full border border-border bg-transparent px-1.5 py-0 font-mono text-[9px] text-foreground/60"
            >
              {skill}
            </Badge>
          ))}
          {item.candidateSkills.length > 3 && (
            <Badge className="rounded-full border border-border bg-transparent px-1.5 py-0 font-mono text-[9px] text-muted-foreground">
              +{item.candidateSkills.length - 3}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
