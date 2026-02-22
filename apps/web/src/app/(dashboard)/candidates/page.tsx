import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { api } from "@/lib/api";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { CandidatesTable } from "@/components/candidates/candidates-table";
import { CreateCandidateModal } from "@/components/candidates/create-candidate-modal";

export default async function CandidatesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;
  const candidates = await api.candidates.list({ search });

  return (
    <>
      <header className="flex h-12 shrink-0 items-center justify-between gap-2 border-b px-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Candidates
          </span>
        </div>
        <CreateCandidateModal>
          <Button size="sm" className="gap-1.5">
            <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} className="size-3.5" />
            New Candidate
          </Button>
        </CreateCandidateModal>
      </header>

      <div className="flex flex-1 flex-col">
        <CandidatesTable candidates={candidates} initialSearch={search} />
      </div>
    </>
  );
}
