import { Result, ok, err } from "neverthrow";

import { TodoDTO } from "@/domain/todo/entities/todo.entity";
import { TodoRepository } from "@/domain/todo/repositories/todo.repository";
import { RepositoryError } from "@/shared/errors/base.error";

export type GetAllTodosError = RepositoryError;

export class GetAllTodosUseCase {
  constructor(private readonly todoRepository: TodoRepository) {}

  async execute(): Promise<Result<TodoDTO[], GetAllTodosError>> {
    const result = await this.todoRepository.findAll();

    if (result.isErr()) {
      return err(result.error);
    }

    const dtos = result.value.map((entity) => entity.toDTO());
    return ok(dtos);
  }
}

