import { ORPCError } from "@orpc/server";
import {
  applications,
  asc,
  candidates,
  count,
  db,
  desc,
  eq,
  gte,
  inArray,
  jobs,
  sql,
} from "@talentra/db";
import { z } from "zod";
import { protectedProcedure, publicProcedure } from "../index";

const updateStatusSchema = z.object({
  id: z.string(),
  status: z.enum([
    "APPLIED",
    "SCREENING",
    "INTERVIEW",
    "OFFER",
    "HIRED",
    "REJECTED",
  ]),
});

export const applicationsRouter = {
  stats: publicProcedure.handler(async () => {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const [jobStats] = await db
      .select({
        openJobs: sql<number>`COUNT(*) FILTER (WHERE ${jobs.status} = 'OPEN')`,
        openJobsThisWeek: sql<number>`COUNT(*) FILTER (WHERE ${jobs.status} = 'OPEN' AND ${jobs.createdAt} >= ${sevenDaysAgo})`,
        totalCandidates: sql<number>`COUNT(DISTINCT ${candidates.id})`,
        candidatesThisWeek: sql<number>`COUNT(DISTINCT ${candidates.id}) FILTER (WHERE ${candidates.createdAt} >= ${sevenDaysAgo})`,
      })
      .from(jobs)
      .leftJoin(applications, eq(applications.jobId, jobs.id))
      .leftJoin(candidates, eq(candidates.id, applications.candidateId));
    const [appStats] = await db
      .select({
        totalApplications: count(applications.id),
        applicationsThisWeek: sql<number>`COUNT(*) FILTER (WHERE ${applications.createdAt} >= ${sevenDaysAgo})`,
        inInterview: sql<number>`COUNT(*) FILTER (WHERE ${applications.status} = 'INTERVIEW')`,
        inInterviewThisWeek: sql<number>`COUNT(*) FILTER (WHERE ${applications.status} = 'INTERVIEW' AND ${applications.updatedAt} >= ${sevenDaysAgo})`,
      })
      .from(applications);
    return { ...jobStats, ...appStats };
  }),

  trend: publicProcedure.handler(async () => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return db
      .select({
        day: sql<string>`DATE_TRUNC('day', ${applications.createdAt})::date::text`.as(
          "day",
        ),
        count: count(applications.id),
      })
      .from(applications)
      .where(gte(applications.createdAt, thirtyDaysAgo))
      .groupBy(sql`DATE_TRUNC('day', ${applications.createdAt})`)
      .orderBy(sql`DATE_TRUNC('day', ${applications.createdAt})`);
  }),

  stale: publicProcedure.handler(async () => {
    return db
      .select({
        id: applications.id,
        status: applications.status,
        updatedAt: applications.updatedAt,
        candidateName: candidates.name,
        candidateId: candidates.id,
        jobTitle: jobs.title,
        jobId: jobs.id,
      })
      .from(applications)
      .innerJoin(candidates, eq(applications.candidateId, candidates.id))
      .innerJoin(jobs, eq(applications.jobId, jobs.id))
      .where(inArray(applications.status, ["APPLIED", "SCREENING", "OFFER"]))
      .orderBy(asc(applications.updatedAt))
      .limit(10);
  }),

  listByJob: publicProcedure
    .input(z.object({ jobId: z.string() }))
    .handler(async ({ input }) => {
      const rows = await db
        .select({
          id: applications.id,
          status: applications.status,
          notes: applications.notes,
          createdAt: applications.createdAt,
          updatedAt: applications.updatedAt,
          candidateId: candidates.id,
          candidateName: candidates.name,
          candidateEmail: candidates.email,
          candidateSkills: candidates.skills,
          candidateExperience: candidates.experience,
        })
        .from(applications)
        .innerJoin(candidates, eq(candidates.id, applications.candidateId))
        .where(eq(applications.jobId, input.jobId))
        .orderBy(desc(applications.createdAt));

      return rows;
    }),

  recent: publicProcedure.handler(async () => {
    return db
      .select({
        id: applications.id,
        status: applications.status,
        updatedAt: applications.updatedAt,
        candidateName: candidates.name,
        jobTitle: jobs.title,
        jobId: jobs.id,
      })
      .from(applications)
      .innerJoin(candidates, eq(applications.candidateId, candidates.id))
      .innerJoin(jobs, eq(applications.jobId, jobs.id))
      .orderBy(desc(applications.updatedAt))
      .limit(10);
  }),

  create: protectedProcedure
    .input(
      z.object({
        jobId: z.string(),
        candidateId: z.string(),
      }),
    )
    .handler(async ({ input }) => {
      const [row] = await db.insert(applications).values(input).returning();
      return row;
    }),

  updateStatus: protectedProcedure
    .input(updateStatusSchema)
    .handler(async ({ input }) => {
      const [row] = await db
        .update(applications)
        .set({ status: input.status, updatedAt: new Date() })
        .where(eq(applications.id, input.id))
        .returning();
      if (!row)
        throw new ORPCError("NOT_FOUND", { message: "Application not found" });
      return row;
    }),
};
