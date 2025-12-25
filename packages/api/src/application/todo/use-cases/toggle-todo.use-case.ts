import { Result, ok, err } from "neverthrow";

import type { TodoRepository } from "../../../domain/todo/repositories/todo.repository";
import { TodoNotFoundError } from "../../../domain/todo/errors/todo.errors";
import { RepositoryError } from "../../../shared/errors/base.error";

export type ToggleTodoInput = {
  id: number;
  completed: boolean;
};

export type ToggleTodoError = TodoNotFoundError | RepositoryError;

export class ToggleTodoUseCase {
  constructor(private readonly todoRepository: TodoRepository) {}

  async execute(input: ToggleTodoInput): Promise<Result<void, ToggleTodoError>> {
    const findResult = await this.todoRepository.findById(input.id);

    if (findResult.isErr()) {
      return err(findResult.error);
    }

    const todo = findResult.value;

    if (!todo) {
      return err(new TodoNotFoundError(input.id));
    }

    if (input.completed) {
      todo.markComplete();
    } else {
      todo.markIncomplete();
    }

    const saveResult = await this.todoRepository.save(todo);

    if (saveResult.isErr()) {
      return err(saveResult.error);
    }

    return ok(undefined);
  }
}

