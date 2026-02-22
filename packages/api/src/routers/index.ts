import type { RouterClient } from "@orpc/server";

import { publicProcedure } from "../index";
import { jobsRouter } from "./jobs";
import { candidatesRouter } from "./candidates";
import { applicationsRouter } from "./applications";

export const appRouter = {
  healthCheck: publicProcedure.handler(() => "OK"),
  jobs: jobsRouter,
  candidates: candidatesRouter,
  applications: applicationsRouter,
};

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
