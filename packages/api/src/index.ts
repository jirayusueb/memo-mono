// Re-export from presentation layer for backward compatibility
export {
  o,
  publicProcedure,
  protectedProcedure,
} from "./presentation/procedures";

export { appRouter } from "./presentation/routers";
export type { AppRouter, AppRouterClient } from "./presentation/routers";

export { createContext } from "./context";
export type { Context, CreateContextOptions } from "./context";
