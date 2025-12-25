import { Result, ok, err } from "neverthrow";

import type { TodoRepository } from "../../../domain/todo/repositories/todo.repository";
import { RepositoryError } from "../../../shared/errors/base.error";

export type DeleteTodoInput = {
  id: number;
};

export type DeleteTodoError = RepositoryError;

export class DeleteTodoUseCase {
  constructor(private readonly todoRepository: TodoRepository) {}

  async execute(input: DeleteTodoInput): Promise<Result<void, DeleteTodoError>> {
    const result = await this.todoRepository.delete(input.id);

    if (result.isErr()) {
      return err(result.error);
    }

    return ok(undefined);
  }
}

