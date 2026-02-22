import { drizzle } from "drizzle-orm/node-postgres";
import dotenv from "dotenv";
import * as schema from "./schema";
import { jobs, candidates, applications } from "./schema/ats";

dotenv.config({ path: "../../apps/server/.env" });

const db = drizzle(process.env.DATABASE_URL!, { schema });

async function seed() {
  console.log("🌱 Seeding database...");

  // Clear existing ATS data
  await db.delete(applications);
  await db.delete(candidates);
  await db.delete(jobs);

  // Seed jobs
  const seedJobs = await db
    .insert(jobs)
    .values([
      {
        title: "Senior Frontend Engineer",
        department: "Engineering",
        description:
          "Build and maintain our Next.js web application. You'll work closely with design and product to ship high-quality user experiences.",
        location: "Remote",
        status: "OPEN",
      },
      {
        title: "Product Designer",
        department: "Design",
        description:
          "Own the end-to-end design process from research to final specs. Experience with Figma and design systems required.",
        location: "San Francisco, CA",
        status: "OPEN",
      },
      {
        title: "Backend Engineer",
        department: "Engineering",
        description:
          "Design and build scalable APIs and services. Strong experience with TypeScript, PostgreSQL, and distributed systems.",
        location: "Remote",
        status: "OPEN",
      },
      {
        title: "Head of Marketing",
        department: "Marketing",
        description:
          "Lead our go-to-market strategy and build the marketing team. 8+ years experience in B2B SaaS required.",
        location: "New York, NY",
        status: "DRAFT",
      },
      {
        title: "DevOps Engineer",
        department: "Infrastructure",
        description:
          "Manage our Cloudflare and AWS infrastructure. Experience with Terraform and CI/CD pipelines.",
        location: "Remote",
        status: "CLOSED",
      },
    ])
    .returning();

  console.log(`✅ Created ${seedJobs.length} jobs`);

  // Seed candidates
  const seedCandidates = await db
    .insert(candidates)
    .values([
      {
        name: "Alice Chen",
        email: "alice@example.com",
        phone: "+1-555-0101",
        skills: ["React", "TypeScript", "Next.js", "CSS"],
        experience: 5,
        notes: "Strong portfolio, previously at Vercel",
      },
      {
        name: "Bob Martinez",
        email: "bob@example.com",
        phone: "+1-555-0102",
        skills: ["Node.js", "PostgreSQL", "Redis", "Docker"],
        experience: 7,
        notes: "Led backend team at fintech startup",
      },
      {
        name: "Carol Williams",
        email: "carol@example.com",
        phone: "+1-555-0103",
        skills: ["Figma", "Design Systems", "User Research", "Prototyping"],
        experience: 4,
        notes: "Ex-Airbnb designer, excellent references",
      },
      {
        name: "David Kim",
        email: "david@example.com",
        phone: "+1-555-0104",
        skills: ["React", "Vue", "TypeScript", "GraphQL"],
        experience: 3,
        notes: "Strong open source contributions",
      },
      {
        name: "Emma Johnson",
        email: "emma@example.com",
        phone: "+1-555-0105",
        skills: ["AWS", "Terraform", "Kubernetes", "CI/CD"],
        experience: 6,
        notes: "Previously at AWS as solutions architect",
      },
      {
        name: "Frank Lee",
        email: "frank@example.com",
        phone: "+1-555-0106",
        skills: ["Go", "Rust", "PostgreSQL", "gRPC"],
        experience: 8,
        notes: "10 years in systems programming",
      },
      {
        name: "Grace Park",
        email: "grace@example.com",
        phone: "+1-555-0107",
        skills: ["Product Strategy", "B2B Marketing", "Content", "SEO"],
        experience: 9,
        notes: "CMO at two successful SaaS startups",
      },
      {
        name: "Henry Wang",
        email: "henry@example.com",
        phone: "+1-555-0108",
        skills: ["React", "TypeScript", "Tailwind", "Storybook"],
        experience: 2,
        notes: "Recent bootcamp grad, impressive projects",
      },
      {
        name: "Isabella Brown",
        email: "isabella@example.com",
        phone: "+1-555-0109",
        skills: ["Figma", "Sketch", "Motion Design", "Brand Identity"],
        experience: 5,
        notes: "Strong motion design background",
      },
      {
        name: "James Davis",
        email: "james@example.com",
        phone: "+1-555-0110",
        skills: ["Python", "Django", "PostgreSQL", "Docker"],
        experience: 4,
      },
      {
        name: "Kate Wilson",
        email: "kate@example.com",
        phone: "+1-555-0111",
        skills: ["Next.js", "React", "Node.js", "AWS"],
        experience: 6,
        notes: "Full-stack focused, great communication",
      },
      {
        name: "Liam Thompson",
        email: "liam@example.com",
        phone: "+1-555-0112",
        skills: ["Terraform", "AWS", "Azure", "Python"],
        experience: 5,
      },
      {
        name: "Mia Anderson",
        email: "mia@example.com",
        phone: "+1-555-0113",
        skills: ["React", "TypeScript", "Performance", "Accessibility"],
        experience: 7,
        notes: "Accessibility specialist, wrote book on a11y",
      },
      {
        name: "Noah Garcia",
        email: "noah@example.com",
        phone: "+1-555-0114",
        skills: ["Figma", "Prototyping", "React", "CSS"],
        experience: 3,
        notes: "Designer who codes — rare find",
      },
      {
        name: "Olivia Martinez",
        email: "olivia@example.com",
        phone: "+1-555-0115",
        skills: ["Marketing Ops", "HubSpot", "Analytics", "Content"],
        experience: 6,
        notes: "Built marketing stack from scratch",
      },
    ])
    .returning();

  console.log(`✅ Created ${seedCandidates.length} candidates`);

  // Helper to get ID by index
  const j = (i: number) => seedJobs[i].id;
  const c = (i: number) => seedCandidates[i].id;

  // Seed applications across pipeline stages
  const seedApplications = await db
    .insert(applications)
    .values([
      // Senior Frontend Engineer (Job 0) — full pipeline
      { jobId: j(0), candidateId: c(0), status: "OFFER" },
      { jobId: j(0), candidateId: c(3), status: "INTERVIEW" },
      { jobId: j(0), candidateId: c(7), status: "SCREENING" },
      { jobId: j(0), candidateId: c(12), status: "HIRED" },
      { jobId: j(0), candidateId: c(10), status: "APPLIED" },
      { jobId: j(0), candidateId: c(13), status: "REJECTED" },

      // Product Designer (Job 1) — mid pipeline
      { jobId: j(1), candidateId: c(2), status: "INTERVIEW" },
      { jobId: j(1), candidateId: c(8), status: "SCREENING" },
      { jobId: j(1), candidateId: c(13), status: "APPLIED" },

      // Backend Engineer (Job 2) — early stage
      { jobId: j(2), candidateId: c(1), status: "SCREENING" },
      { jobId: j(2), candidateId: c(5), status: "INTERVIEW" },
      { jobId: j(2), candidateId: c(9), status: "APPLIED" },
      { jobId: j(2), candidateId: c(10), status: "REJECTED" },

      // Head of Marketing (Job 3) — draft, some apps
      { jobId: j(3), candidateId: c(6), status: "APPLIED" },
      { jobId: j(3), candidateId: c(14), status: "APPLIED" },

      // DevOps Engineer (Job 4) — closed with results
      { jobId: j(4), candidateId: c(4), status: "HIRED" },
      { jobId: j(4), candidateId: c(11), status: "REJECTED" },
    ])
    .returning();

  console.log(`✅ Created ${seedApplications.length} applications`);
  console.log("🎉 Seed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
