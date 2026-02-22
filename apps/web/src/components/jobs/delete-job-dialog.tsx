"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { orpc } from "@/utils/orpc";

type Job = {
  id: string;
  title: string;
};

export function DeleteJobDialog({
  job,
  children,
}: {
  job: Job;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const mutation = useMutation(orpc.jobs.delete.mutationOptions());

  function handleDelete() {
    mutation.mutate(
      { id: job.id },
      {
        onSuccess: () => {
          toast.success("Job archived successfully");
          setOpen(false);
          router.push("/jobs");
        },
        onError: (err) => {
          toast.error(err.message || "Failed to archive job");
        },
      },
    );
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-bold font-mono tracking-tight">
            Archive this job?
          </AlertDialogTitle>
          <AlertDialogDescription>
            <strong>&ldquo;{job.title}&rdquo;</strong> will be archived and
            removed from your active jobs list. Existing applications will be
            preserved. This action can be undone by an administrator.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={mutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {mutation.isPending ? "Archiving…" : "Archive Job"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
