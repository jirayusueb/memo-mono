import type { RouterClient } from "@orpc/server";

import type { Context } from "../../context";
import { protectedProcedure, publicProcedure } from "../procedures";

import { todoRouter } from "./todo.router";

export const appRouter = {
  healthCheck: publicProcedure.handler(() => {
    return "OK";
  }),
  privateData: protectedProcedure.handler(({ context }: { context: Context }) => {
    return {
      message: "This is private",
      user: context.session?.user,
    };
  }),
  todo: todoRouter,
};

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;

