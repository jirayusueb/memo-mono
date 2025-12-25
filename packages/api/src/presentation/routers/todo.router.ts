import { ORPCError } from "@orpc/server";
import z from "zod";

import { CreateTodoUseCase } from "@/application/todo/use-cases/create-todo.use-case";
import { DeleteTodoUseCase } from "@/application/todo/use-cases/delete-todo.use-case";
import { GetAllTodosUseCase } from "@/application/todo/use-cases/get-all-todos.use-case";
import { ToggleTodoUseCase } from "@/application/todo/use-cases/toggle-todo.use-case";
import { DrizzleTodoRepository } from "@/infrastructure/todo/drizzle-todo.repository";
import { publicProcedure } from "@/presentation/procedures";

// Dependency Injection
const todoRepository = new DrizzleTodoRepository();
const createTodoUseCase = new CreateTodoUseCase(todoRepository);
const getAllTodosUseCase = new GetAllTodosUseCase(todoRepository);
const toggleTodoUseCase = new ToggleTodoUseCase(todoRepository);
const deleteTodoUseCase = new DeleteTodoUseCase(todoRepository);

export const todoRouter = {
  getAll: publicProcedure.handler(async () => {
    // Debug: return hardcoded data first
    return [{ id: 1, text: "Test", completed: false }];
  }),

  create: publicProcedure
    .input(z.object({ text: z.string().min(1) }))
    .handler(async ({ input }) => {
      const result = await createTodoUseCase.execute({ text: input.text });

      if (result.isErr()) {
        if (result.error.code === "INVALID_TODO_TEXT") {
          throw new ORPCError("BAD_REQUEST", { message: result.error.message });
        }
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          message: result.error.message,
        });
      }

      return result.value;
    }),

  toggle: publicProcedure
    .input(z.object({ id: z.number(), completed: z.boolean() }))
    .handler(async ({ input }) => {
      const result = await toggleTodoUseCase.execute({
        id: input.id,
        completed: input.completed,
      });

      if (result.isErr()) {
        if (result.error.code === "TODO_NOT_FOUND") {
          throw new ORPCError("NOT_FOUND", { message: result.error.message });
        }
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          message: result.error.message,
        });
      }

      return { success: true };
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .handler(async ({ input }) => {
      const result = await deleteTodoUseCase.execute({ id: input.id });

      if (result.isErr()) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          message: result.error.message,
        });
      }

      return { success: true };
    }),
};
