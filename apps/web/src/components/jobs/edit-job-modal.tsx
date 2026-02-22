/** biome-ignore-all lint/correctness/noChildrenProp: tanstack form */
"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { orpc } from "@/utils/orpc";

type Job = {
  id: string;
  title: string;
  department: string;
  description: string | null;
  location: string | null;
  status: "OPEN" | "CLOSED" | "DRAFT";
};

export function EditJobModal({
  job,
  children,
}: {
  job: Job;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const mutation = useMutation(orpc.jobs.update.mutationOptions());

  const form = useForm({
    defaultValues: {
      title: job.title,
      department: job.department,
      description: job.description ?? "",
      location: job.location ?? "",
      status: job.status,
    },
    validators: {
      onSubmit: z.object({
        title: z.string().min(1, "Title is required"),
        department: z.string().min(1, "Department is required"),
        description: z.string(),
        location: z.string(),
        status: z.enum(["OPEN", "CLOSED", "DRAFT"]),
      }),
    },
    onSubmit: async ({ value }) => {
      mutation.mutate(
        {
          id: job.id,
          title: value.title,
          department: value.department,
          description: value.description || undefined,
          location: value.location || undefined,
          status: value.status,
        },
        {
          onSuccess: () => {
            toast.success("Job updated successfully");
            setOpen(false);
            router.refresh();
          },
          onError: (err) => {
            toast.error(err.message || "Failed to update job");
          },
        },
      );
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-bold font-mono tracking-tight">
            Edit Job
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex flex-col gap-4 pt-2"
        >
          <form.Field
            name="title"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <div className="flex flex-col gap-1.5">
                  <Label className="font-mono text-[10px] uppercase tracking-[0.15em]">
                    Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    placeholder="e.g. Senior Frontend Engineer"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    required
                  />
                  {isInvalid && (
                    <FieldError
                      className="text-xs"
                      errors={field.state.meta.errors}
                    />
                  )}
                </div>
              );
            }}
          />

          <form.Field
            name="department"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <div className="flex flex-col gap-1.5">
                  <Label className="font-mono text-[10px] uppercase tracking-[0.15em]">
                    Department <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    placeholder="e.g. Engineering"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    required
                  />
                  {isInvalid && (
                    <FieldError
                      className="text-xs"
                      errors={field.state.meta.errors}
                    />
                  )}
                </div>
              );
            }}
          />

          <form.Field
            name="location"
            children={(field) => (
              <div className="flex flex-col gap-1.5">
                <Label className="font-mono text-[10px] uppercase tracking-[0.15em]">
                  Location
                </Label>
                <Input
                  placeholder="e.g. Remote, New York"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          />

          <form.Field
            name="description"
            children={(field) => (
              <div className="flex flex-col gap-1.5">
                <Label className="font-mono text-[10px] uppercase tracking-[0.15em]">
                  Description
                </Label>
                <Textarea
                  placeholder="Job description…"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  rows={3}
                />
              </div>
            )}
          />

          <form.Field
            name="status"
            children={(field) => (
              <div className="flex flex-col gap-1.5">
                <Label className="font-mono text-[10px] uppercase tracking-[0.15em]">
                  Status
                </Label>
                <Select
                  value={field.state.value}
                  onValueChange={(v) =>
                    field.handleChange(v as "OPEN" | "CLOSED" | "DRAFT")
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="OPEN">Open</SelectItem>
                    <SelectItem value="CLOSED">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          />

          <div className="flex justify-end gap-2 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <form.Subscribe
              selector={(state) => [state.isSubmitting, state.canSubmit]}
              children={([isSubmitting, canSubmit]) => (
                <Button type="submit" disabled={!canSubmit || isSubmitting}>
                  {isSubmitting ? "Saving…" : "Save Changes"}
                </Button>
              )}
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
