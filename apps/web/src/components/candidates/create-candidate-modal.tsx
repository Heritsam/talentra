"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    skills: "",
    experience: "0",
    notes: "",
  });

  const mutation = useMutation(orpc.candidates.create.mutationOptions());

  function handleChange(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email) return;

    const skills = form.skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    mutation.mutate(
      {
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        skills,
        experience: Number.parseInt(form.experience, 10) || 0,
        notes: form.notes || undefined,
      },
      {
        onSuccess: () => {
          toast.success("Candidate added successfully");
          setOpen(false);
          setForm({
            name: "",
            email: "",
            phone: "",
            skills: "",
            experience: "0",
            notes: "",
          });
          router.refresh();
        },
        onError: (err) => {
          toast.error(err.message || "Failed to add candidate");
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-bold font-mono tracking-tight">
            New Candidate
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="font-mono text-[10px] uppercase tracking-[0.15em]">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="Full name"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="font-mono text-[10px] uppercase tracking-[0.15em]">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                type="email"
                placeholder="email@example.com"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="font-mono text-[10px] uppercase tracking-[0.15em]">
                Phone
              </Label>
              <Input
                placeholder="+1 555 000 0000"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="font-mono text-[10px] uppercase tracking-[0.15em]">
                Experience (years)
              </Label>
              <Input
                type="number"
                min="0"
                max="50"
                value={form.experience}
                onChange={(e) => handleChange("experience", e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="font-mono text-[10px] uppercase tracking-[0.15em]">
              Skills
              <span className="ml-1 text-muted-foreground normal-case tracking-normal">
                (comma-separated)
              </span>
            </Label>
            <Input
              placeholder="React, TypeScript, Node.js"
              value={form.skills}
              onChange={(e) => handleChange("skills", e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Adding…" : "Add Candidate"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
