"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-10">
      <div className="text-center">
        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
          Error
        </p>
        <h2 className="mt-1 font-bold font-mono text-xl tracking-tight">
          Something went wrong
        </h2>
        <p className="mt-2 font-sans text-muted-foreground text-sm">
          {error.message || "An unexpected error occurred."}
        </p>
      </div>
      <Button onClick={reset} variant="outline" size="sm">
        Try again
      </Button>
    </div>
  );
}
