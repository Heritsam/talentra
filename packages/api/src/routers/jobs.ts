import { ORPCError } from "@orpc/server";
import { applications, count, db, desc, eq, jobs, sql } from "@talentra/db";
import { z } from "zod";
import { protectedProcedure, publicProcedure } from "../index";

const createJobSchema = z.object({
  title: z.string().min(1),
  department: z.string().min(1),
  description: z.string().optional(),
  location: z.string().optional(),
  status: z.enum(["OPEN", "CLOSED", "DRAFT"]).default("DRAFT"),
});

const updateStatusSchema = z.object({
  id: z.string(),
  status: z.enum(["OPEN", "CLOSED", "DRAFT"]),
});

export const jobsRouter = {
  list: publicProcedure.handler(async () => {
    const rows = await db
      .select({
        id: jobs.id,
        title: jobs.title,
        department: jobs.department,
        description: jobs.description,
        location: jobs.location,
        status: jobs.status,
        createdAt: jobs.createdAt,
        applicationCount: count(applications.id),
      })
      .from(jobs)
      .leftJoin(applications, eq(applications.jobId, jobs.id))
      .groupBy(jobs.id)
      .orderBy(desc(jobs.createdAt));
    return rows;
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .handler(async ({ input }) => {
      const [job] = await db.select().from(jobs).where(eq(jobs.id, input.id));
      if (!job) throw new ORPCError("NOT_FOUND", { message: "Job not found" });

      const applicants = await db.query.applications.findMany({
        where: eq(applications.jobId, input.id),
        with: { candidate: true },
        orderBy: desc(applications.createdAt),
      });

      return { ...job, applications: applicants };
    }),

  create: protectedProcedure
    .input(createJobSchema)
    .handler(async ({ input }) => {
      const [row] = await db.insert(jobs).values(input).returning();
      return row;
    }),

  updateStatus: protectedProcedure
    .input(updateStatusSchema)
    .handler(async ({ input }) => {
      const [row] = await db
        .update(jobs)
        .set({ status: input.status })
        .where(eq(jobs.id, input.id))
        .returning();
      if (!row) throw new ORPCError("NOT_FOUND", { message: "Job not found" });
      return row;
    }),

  pipelineSummary: publicProcedure.handler(async () => {
    return db
      .select({
        id: jobs.id,
        title: jobs.title,
        department: jobs.department,
        appliedCount: sql<number>`COUNT(*) FILTER (WHERE ${applications.status} = 'APPLIED')`,
        screeningCount: sql<number>`COUNT(*) FILTER (WHERE ${applications.status} = 'SCREENING')`,
        interviewCount: sql<number>`COUNT(*) FILTER (WHERE ${applications.status} = 'INTERVIEW')`,
        offerCount: sql<number>`COUNT(*) FILTER (WHERE ${applications.status} = 'OFFER')`,
      })
      .from(jobs)
      .leftJoin(applications, eq(applications.jobId, jobs.id))
      .where(eq(jobs.status, "OPEN"))
      .groupBy(jobs.id)
      .orderBy(desc(jobs.createdAt));
  }),
};
