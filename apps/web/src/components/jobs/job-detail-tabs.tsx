import Link from "next/link";

function tabClass(active: boolean) {
  return `border-r px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.15em] transition-colors hover:bg-muted/30 ${
    active ? "bg-primary text-primary-foreground" : "text-muted-foreground"
  }`;
}

export function JobDetailTabs({
  jobId,
  active,
}: {
  jobId: string;
  active: "overview" | "pipeline";
}) {
  return (
    <div className="flex gap-0 border-b">
      <Link href={`/jobs/${jobId}`} className={tabClass(active === "overview")}>
        Overview
      </Link>
      <Link
        href={`/jobs/${jobId}/pipeline`}
        className={tabClass(active === "pipeline")}
      >
        Pipeline
      </Link>
    </div>
  );
}
