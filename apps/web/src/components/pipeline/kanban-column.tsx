"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

import { Badge } from "@/components/ui/badge";
import { KanbanCard } from "./kanban-card";
import type { ApplicationItem } from "./kanban-board";

export function KanbanColumn({
  id,
  label,
  color,
  items,
}: {
  id: string;
  label: string;
  color: string;
  items: ApplicationItem[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      className={`flex min-w-[200px] flex-1 flex-col transition-colors ${
        isOver ? "bg-muted/40" : "bg-background"
      }`}
    >
      {/* Column header */}
      <div className="flex items-center justify-between border-b bg-muted/20 px-3 py-2.5">
        <Badge className={`${color} rounded-full border-0 px-2 py-0.5 font-mono text-[10px] font-medium`}>
          {label}
        </Badge>
        <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
          {items.length}
        </span>
      </div>

      {/* Droppable cards area */}
      <div
        ref={setNodeRef}
        className="flex flex-1 flex-col gap-1.5 overflow-y-auto p-2"
        style={{ minHeight: "4rem" }}
      >
        <SortableContext
          id={id}
          items={items.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          {items.map((item) => (
            <KanbanCard key={item.id} item={item} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
