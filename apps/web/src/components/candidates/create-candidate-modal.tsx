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
import { orpc } from "@/utils/orpc";

export function CreateCandidateModal({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const mutation = useMutation(orpc.candidates.create.mutationOptions());

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      skills: "",
      experience: 0,
      notes: "",
    },
    validators: {
      onSubmit: z.object({
        name: z.string().min(1, "Name is required"),
        email: z.email("Invalid email address"),
        phone: z.string(),
        skills: z.string(),
        experience: z.number().int().min(0),
        notes: z.string(),
      }),
    },
    onSubmit: async ({ value }) => {
      const skills = value.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      mutation.mutate(
        {
          name: value.name,
          email: value.email,
          phone: value.phone || undefined,
          skills,
          experience: value.experience,
          notes: value.notes || undefined,
        },
        {
          onSuccess: () => {
            toast.success("Candidate added successfully");
            setOpen(false);
            form.reset();
            router.refresh();
          },
          onError: (err) => {
            toast.error(err.message || "Failed to add candidate");
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
            New Candidate
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex flex-col gap-4 pt-2"
        >
          <div className="grid grid-cols-2 gap-4">
            <form.Field
              name="name"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <div className="flex flex-col gap-1.5">
                    <Label className="font-mono text-[10px] uppercase tracking-[0.15em]">
                      Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      placeholder="Full name"
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
              name="email"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <div className="flex flex-col gap-1.5">
                    <Label className="font-mono text-[10px] uppercase tracking-[0.15em]">
                      Email <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      type="email"
                      placeholder="email@example.com"
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <form.Field
              name="phone"
              children={(field) => (
                <div className="flex flex-col gap-1.5">
                  <Label className="font-mono text-[10px] uppercase tracking-[0.15em]">
                    Phone
                  </Label>
                  <Input
                    placeholder="+1 555 000 0000"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </div>
              )}
            />
            <form.Field
              name="experience"
              children={(field) => (
                <div className="flex flex-col gap-1.5">
                  <Label className="font-mono text-[10px] uppercase tracking-[0.15em]">
                    Experience (years)
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    max="50"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(
                        Number.parseInt(e.target.value, 10) || 0,
                      )
                    }
                  />
                </div>
              )}
            />
          </div>

          <form.Field
            name="skills"
            children={(field) => (
              <div className="flex flex-col gap-1.5">
                <Label className="font-mono text-[10px] uppercase tracking-[0.15em]">
                  Skills
                  <span className="ml-1 text-muted-foreground normal-case tracking-normal">
                    (comma-separated)
                  </span>
                </Label>
                <Input
                  placeholder="React, TypeScript, Node.js"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
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
                  {isSubmitting ? "Adding…" : "Add Candidate"}
                </Button>
              )}
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
