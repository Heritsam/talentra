import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const PIPELINE_STAGES = [
  {
    label: "Applied",
    color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    cards: [
      { name: "Alice Chen", role: "5 yrs · React, TS" },
      { name: "Bob Martinez", role: "7 yrs · Node, PG" },
      { name: "Kate Wilson", role: "6 yrs · Next, AWS" },
    ],
  },
  {
    label: "Screening",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
    cards: [
      { name: "Carol Williams", role: "4 yrs · Figma" },
      { name: "Henry Wang", role: "2 yrs · React" },
    ],
  },
  {
    label: "Interview",
    color:
      "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
    cards: [
      { name: "David Kim", role: "3 yrs · Vue, TS" },
      { name: "Mia Anderson", role: "7 yrs · a11y" },
    ],
  },
  {
    label: "Offer",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    cards: [{ name: "Frank Lee", role: "8 yrs · Go, Rust" }],
  },
  {
    label: "Hired",
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
    cards: [
      { name: "Grace Park", role: "9 yrs · B2B Mkt." },
      { name: "Emma Johnson", role: "6 yrs · AWS" },
    ],
  },
  {
    label: "Rejected",
    color: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
    cards: [{ name: "Liam Thompson", role: "5 yrs · Terraform" }],
  },
];

// Ghost letters spell T·A·L·E·N·T
const FEATURES = [
  {
    ghost: "T",
    title: "Track Applications",
    description:
      "Every application in one place. No spreadsheet can replicate this.",
  },
  {
    ghost: "A",
    title: "Advance Candidates",
    description:
      "Drag cards across stages in real time. The whole team sees it instantly.",
  },
  {
    ghost: "L",
    title: "List Open Roles",
    description:
      "Open, Draft, Closed. Manage your entire hiring roadmap at a glance.",
  },
  {
    ghost: "E",
    title: "Evaluate Profiles",
    description:
      "Skills, experience, notes, and full history. Know every candidate cold.",
  },
  {
    ghost: "N",
    title: "Navigate the Pipeline",
    description:
      "Six stages. One board. Applied to Hired without losing anyone.",
  },
  {
    ghost: "T",
    title: "Team Transparency",
    description:
      "Everyone sees the same data. No stale emails, no siloed spreadsheets.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="relative mx-auto w-full max-w-5xl bg-background px-2 text-foreground sm:px-4">
        <div className="absolute top-0 bottom-0 left-0 flex h-full min-h-screen w-2 flex-col bg-stripes sm:w-4" />
        <div className="border-x">
          {/* Top accent bar */}
          <div className="h-0.5 w-full bg-primary" />

          {/* Header */}
          <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-sm">
            <div className="flex h-12 items-center justify-between px-5">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 bg-primary" />
                <span className="font-bold font-mono text-sm uppercase tracking-widest">
                  Talentra
                </span>
              </div>
              <nav className="hidden items-center gap-6 md:flex">
                <Link
                  href="#features"
                  className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.18em] transition-colors hover:text-foreground"
                >
                  Features
                </Link>
                <Link
                  href="#how-it-works"
                  className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.18em] transition-colors hover:text-foreground"
                >
                  Workflow
                </Link>
              </nav>
              <div className="flex items-center gap-2">
                <ModeToggle />
                <Button variant="outline" asChild>
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">
                    Get started <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>
          </header>

          {/* Hero — centered */}
          <section className="border-b px-5 pt-20 pb-10 text-center">
            <div className="mb-8 inline-flex items-center gap-2 border px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
                Applicant Tracking System
              </span>
            </div>
            <h1 className="mx-auto mb-6 max-w-3xl font-bold font-mono text-5xl leading-[1.08] tracking-tight md:text-6xl">
              Track. Screen. <span className="text-primary italic">Hire.</span>
            </h1>
            <p className="mx-auto mb-10 max-w-md font-sans text-base text-muted-foreground leading-relaxed">
              The talent pipeline built for teams that move fast. From
              application to offer — no one falls through the cracks.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button size="lg" asChild>
                <Link href="/login">
                  Start for free <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/jobs">
                  View demo <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="mt-14 flex items-center justify-center border-t pt-8">
              {[
                { value: "5", label: "Active jobs" },
                { value: "15", label: "Candidates" },
                { value: "30+", label: "Applications tracked" },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  className={`px-10 text-center ${i < 2 ? "border-r" : ""}`}
                >
                  <div className="font-bold font-mono text-3xl tabular-nums leading-none">
                    {stat.value}
                  </div>
                  <div className="mt-1.5 font-mono text-[10px] text-muted-foreground uppercase tracking-[0.18em]">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Pipeline visual — full width */}
          <section className="overflow-x-auto border-b-2 border-b-primary/20">
            <div className="min-w-200">
              <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-2.5">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.15em]">
                    Pipeline — Senior Frontend Engineer
                  </span>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground">
                  17 applicants
                </span>
              </div>
              <div className="grid grid-cols-6 divide-x bg-muted/20">
                {PIPELINE_STAGES.map((stage) => (
                  <div key={stage.label} className="flex flex-col">
                    <div className="flex items-center justify-between border-b bg-card/80 px-2 py-2">
                      <Badge
                        className={`${stage.color} rounded-full border-0 px-1.5 py-0 font-medium font-mono text-[9px]`}
                      >
                        {stage.label}
                      </Badge>
                      <span className="font-mono text-[9px] text-muted-foreground">
                        {stage.cards.length}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col gap-1.5 p-1.5">
                      {stage.cards.map((card) => (
                        <div key={card.name} className="border bg-card p-1.5">
                          <div className="font-medium font-mono text-[10px] leading-tight">
                            {card.name}
                          </div>
                          <div className="mt-0.5 font-sans text-[9px] text-muted-foreground">
                            {card.role}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Features 2x3 grid with ghost letters */}
          <section id="features" className="border-b">
            <div className="border-b px-5 py-10">
              <p className="font-mono text-muted-foreground text-xs uppercase tracking-[0.2em]">
                What you get
              </p>
              <h2 className="mt-1 font-bold font-mono text-2xl tracking-tight">
                Everything your hiring team needs.
              </h2>
            </div>
            <div className="relative grid grid-cols-3">
              {FEATURES.map((f, i) => (
                <div
                  key={`${f.title}-${i}`}
                  className={[
                    "relative overflow-hidden border-r border-b p-6",
                    i >= 3 ? "border-b-0" : "",
                    (i + 1) % 3 === 0 ? "border-r-0" : "",
                  ].join(" ")}
                >
                  <span className="pointer-events-none absolute right-2 bottom-0 select-none font-bold font-mono text-9xl text-foreground/5 leading-none">
                    {f.ghost}
                  </span>
                  <h3 className="relative mb-2 font-mono font-semibold">
                    {f.title}
                  </h3>
                  <p className="relative font-sans text-muted-foreground text-sm leading-relaxed lg:mr-8">
                    {f.description}
                  </p>
                </div>
              ))}
              {/* × markers at internal intersections */}
              <span className="pointer-events-none absolute top-1/2 left-1/3 z-10 -translate-x-1/2 -translate-y-1/2 select-none font-mono text-muted-foreground/40 text-sm">
                ×
              </span>
              <span className="pointer-events-none absolute top-1/2 left-2/3 z-10 -translate-x-1/2 -translate-y-1/2 select-none font-mono text-muted-foreground/40 text-sm">
                ×
              </span>
            </div>
          </section>

          {/* Workflow 4-step */}
          <section id="how-it-works" className="border-b">
            <div className="border-b px-5 py-10">
              <p className="font-mono text-muted-foreground text-xs uppercase tracking-[0.2em]">
                The workflow
              </p>
              <h2 className="mt-1 font-bold font-mono text-2xl tracking-tight">
                From job post to offer in four steps.
              </h2>
            </div>
            <div className="grid grid-cols-2 divide-x divide-y md:grid-cols-4 md:divide-y-0">
              {[
                {
                  step: "01",
                  title: "Post a job",
                  body: "Create a role. Set department, location, and status.",
                },
                {
                  step: "02",
                  title: "Add candidates",
                  body: "Track skills, experience, and contact details.",
                },
                {
                  step: "03",
                  title: "Build pipeline",
                  body: "Link candidates to jobs. Each one starts at Applied.",
                },
                {
                  step: "04",
                  title: "Drag to hire",
                  body: "Move cards across the board. Hired feels satisfying.",
                },
              ].map((item) => (
                <div key={item.step} className="p-5">
                  <div className="mb-3 font-bold font-mono text-3xl text-primary/20 tabular-nums leading-none">
                    {item.step}
                  </div>
                  <h3 className="mb-1.5 font-mono font-semibold">
                    {item.title}
                  </h3>
                  <p className="font-sans text-muted-foreground text-sm leading-relaxed">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA — centered */}
          <section className="border-b px-5 py-20 text-center">
            <p className="mb-4 font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
              Ready to ship
            </p>
            <h2 className="mx-auto mb-4 max-w-xl font-bold font-mono text-4xl leading-tight tracking-tight">
              Stop losing great candidates{" "}
              <span className="text-primary italic">in your inbox.</span>
            </h2>
            <p className="mx-auto mb-10 max-w-sm font-sans text-muted-foreground text-sm leading-relaxed">
              One pipeline. Every candidate. Zero spreadsheets. Start for free
              and see your hiring process transform.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button size="lg" asChild>
                <Link href="/login">
                  Get started free <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/jobs">Explore the demo</Link>
              </Button>
            </div>
          </section>

          {/* Footer — centered minimal */}
          <footer className="px-5 py-10 text-center">
            <div className="mb-4 flex justify-center">
              <div className="h-8 w-8 bg-primary" />
            </div>
            <div className="font-mono text-muted-foreground text-xs uppercase tracking-[0.2em]">
              © 2026 Talentra — Built with Next.js + Hono
            </div>
          </footer>

          {/* Bottom accent bar */}
          <div className="h-0.5 w-full bg-primary" />
        </div>
        <div className="absolute top-0 right-0 bottom-0 flex h-full min-h-screen w-2 flex-col bg-stripes sm:w-4" />
      </div>
    </div>
  );
}
