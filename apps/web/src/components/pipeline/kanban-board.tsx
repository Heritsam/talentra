"use client";

import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { toast } from "sonner";

import { orpc } from "@/utils/orpc";
import { KanbanCard } from "./kanban-card";
import { KanbanColumn } from "./kanban-column";

type AppStatus =
  | "APPLIED"
  | "SCREENING"
  | "INTERVIEW"
  | "OFFER"
  | "HIRED"
  | "REJECTED";

export type ApplicationItem = {
  id: string;
  status: AppStatus;
  createdAt: Date;
  updatedAt: Date;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidateExperience: number;
  candidateSkills: string[];
};

const COLUMNS: { id: AppStatus; label: string; color: string }[] = [
  {
    id: "APPLIED",
    label: "Applied",
    color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  },
  {
    id: "SCREENING",
    label: "Screening",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  },
  {
    id: "INTERVIEW",
    label: "Interview",
    color:
      "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  },
  {
    id: "OFFER",
    label: "Offer",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  },
  {
    id: "HIRED",
    label: "Hired",
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  },
  {
    id: "REJECTED",
    label: "Rejected",
    color: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  },
];

export function KanbanBoard({
  jobId,
  initialApplications,
}: {
  jobId: string;
  initialApplications: ApplicationItem[];
}) {
  const [items, setItems] = useState<ApplicationItem[]>(initialApplications);
  const [activeId, setActiveId] = useState<string | null>(null);

  const mutation = useMutation(
    orpc.applications.updateStatus.mutationOptions(),
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const activeItem = activeId
    ? items.find((item) => item.id === activeId)
    : null;

  const getColumnItems = useCallback(
    (status: AppStatus) => items.filter((item) => item.status === status),
    [items],
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeItemId = active.id as string;
    const overId = over.id as string;

    // over.id is either a column id (AppStatus) or a card id
    const targetStatus =
      COLUMNS.find((col) => col.id === overId)?.id ??
      items.find((item) => item.id === overId)?.status;

    if (!targetStatus) return;

    const currentItem = items.find((item) => item.id === activeItemId);
    if (!currentItem || currentItem.status === targetStatus) return;

    // Optimistic update
    setItems((prev) =>
      prev.map((item) =>
        item.id === activeItemId ? { ...item, status: targetStatus } : item,
      ),
    );

    mutation.mutate(
      { id: activeItemId, status: targetStatus },
      {
        onError: (err) => {
          // Revert on error
          setItems((prev) =>
            prev.map((item) =>
              item.id === activeItemId
                ? { ...item, status: currentItem.status }
                : item,
            ),
          );
          toast.error(err.message || "Failed to update status");
        },
      },
    );
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-full w-full divide-x overflow-x-auto">
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col.id}
            id={col.id}
            label={col.label}
            color={col.color}
            items={getColumnItems(col.id)}
          />
        ))}
      </div>

      <DragOverlay>
        {activeItem ? <KanbanCard item={activeItem} isDragging /> : null}
      </DragOverlay>
    </DndContext>
  );
}
