import { ORPCError } from "@orpc/server";
import { z } from "zod";
import {
  and,
  applications,
  candidates,
  count,
  db,
  desc,
  eq,
  gte,
  ilike,
  jobs,
  or,
} from "@talentra/db";
import { publicProcedure } from "../index";

const createCandidateSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  skills: z.array(z.string()).default([]),
  experience: z.number().int().min(0).default(0),
  notes: z.string().optional(),
});

export const candidatesRouter = {
  list: publicProcedure
    .input(
      z.object({
        search: z.string().optional(),
        skill: z.string().optional(),
        minExp: z.number().int().min(0).optional(),
      }),
    )
    .handler(async ({ input }) => {
      const conditions = [];

      if (input.search) {
        conditions.push(
          or(
            ilike(candidates.name, `%${input.search}%`),
            ilike(candidates.email, `%${input.search}%`),
          ),
        );
      }

      if (input.minExp !== undefined) {
        conditions.push(gte(candidates.experience, input.minExp));
      }

      const rows = await db
        .select({
          id: candidates.id,
          name: candidates.name,
          email: candidates.email,
          phone: candidates.phone,
          skills: candidates.skills,
          experience: candidates.experience,
          notes: candidates.notes,
          createdAt: candidates.createdAt,
          applicationCount: count(applications.id),
        })
        .from(candidates)
        .leftJoin(applications, eq(applications.candidateId, candidates.id))
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .groupBy(candidates.id)
        .orderBy(desc(candidates.createdAt));

      return rows;
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .handler(async ({ input }) => {
      const [candidate] = await db
        .select()
        .from(candidates)
        .where(eq(candidates.id, input.id));

      if (!candidate)
        throw new ORPCError("NOT_FOUND", { message: "Candidate not found" });

      const history = await db
        .select({
          id: applications.id,
          status: applications.status,
          notes: applications.notes,
          createdAt: applications.createdAt,
          updatedAt: applications.updatedAt,
          jobId: jobs.id,
          jobTitle: jobs.title,
          jobDepartment: jobs.department,
        })
        .from(applications)
        .innerJoin(jobs, eq(jobs.id, applications.jobId))
        .where(eq(applications.candidateId, input.id))
        .orderBy(desc(applications.createdAt));

      return { ...candidate, applications: history };
    }),

  create: publicProcedure
    .input(createCandidateSchema)
    .handler(async ({ input }) => {
      const [row] = await db.insert(candidates).values(input).returning();
      return row;
    }),
};
