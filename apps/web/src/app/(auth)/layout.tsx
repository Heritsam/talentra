import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { ModeToggle } from "@/components/mode-toggle";

const STAGES = [
  {
    label: "Applied",
    color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  },
  {
    label: "Screening",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  },
  {
    label: "Interview",
    color:
      "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  },
  {
    label: "Offer",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  },
  {
    label: "Hired",
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-svh bg-muted/30">
      <div className="relative mx-auto w-full max-w-5xl bg-background text-foreground sm:px-4">
        {/* Side stripes */}
        <div className="absolute top-0 bottom-0 left-0 flex h-full min-h-screen w-2 flex-col bg-stripes sm:w-4" />
        <div className="absolute top-0 right-0 bottom-0 flex h-full min-h-screen w-2 flex-col bg-stripes sm:w-4" />

        <div className="border-x">
          {/* Top accent bar */}
          <div className="h-0.5 w-full bg-primary" />

          {/* Header */}
          <header className="flex h-12 items-center justify-between border-b px-5">
            <Link
              href="/"
              className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground uppercase tracking-[0.18em] transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-3 w-3" />
              Back
            </Link>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-primary" />
              <span className="font-bold font-mono text-sm uppercase tracking-widest">
                Talentra
              </span>
            </div>
            <ModeToggle />
          </header>

          {/* Body — 2 columns */}
          <div className="grid min-h-[calc(100vh-3.125rem)] grid-cols-1 md:grid-cols-2">
            {/* Left — form */}
            <div className="flex flex-col justify-center border-r px-8 py-14 md:px-12">
              {children}
            </div>

            {/* Right — editorial panel */}
            <div className="relative hidden flex-col justify-between overflow-hidden bg-muted/30 p-10 md:flex">
              {/* Large ghost text watermark */}
              <span className="pointer-events-none absolute -right-4 -bottom-6 select-none font-bold font-mono text-[11rem] text-foreground/4 leading-none">
                ATS
              </span>

              {/* Top — headline */}
              <div>
                <p className="mb-3 font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
                  Talentra ATS
                </p>
                <p className="font-bold font-mono text-4xl leading-[1.1] tracking-tight">
                  Track.
                  <br />
                  Screen.
                  <br />
                  <span className="text-primary italic">Hire.</span>
                </p>
              </div>

              {/* Middle — pipeline stages */}
              <div>
                <p className="mb-3 font-mono text-[10px] text-muted-foreground uppercase tracking-[0.18em]">
                  Pipeline stages
                </p>
                <div className="flex flex-col gap-1.5">
                  {STAGES.map((s, i) => (
                    <div key={s.label} className="flex items-center gap-3">
                      <span className="font-mono text-[10px] text-muted-foreground/50 tabular-nums">
                        0{i + 1}
                      </span>
                      <span
                        className={`${s.color} inline-flex items-center rounded-full px-2 py-0.5 font-medium font-mono text-[10px]`}
                      >
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom — stats */}
              <div className="border-t pt-6">
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: "5", label: "Jobs" },
                    { value: "15", label: "Candidates" },
                    { value: "30+", label: "Applications" },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <div className="font-bold font-mono text-2xl tabular-nums leading-none">
                        {stat.value}
                      </div>
                      <div className="mt-1 font-mono text-[9px] text-muted-foreground uppercase tracking-[0.18em]">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom accent bar */}
          <div className="h-0.5 w-full bg-primary" />
        </div>
      </div>
    </div>
  );
}
