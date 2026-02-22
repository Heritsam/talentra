import { createRouterClient } from "@orpc/server";
import { appRouter } from "@talentra/api/routers/index";

/**
 * Server-side API caller.
 * Use in Server Components to call API procedures directly without HTTP.
 * For client components, use `orpc` from "@/utils/orpc" with TanStack Query.
 */
export const api = createRouterClient(appRouter, {
  context: { session: null },
});
