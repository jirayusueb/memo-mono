import { Result, ok, err } from "neverthrow";

import type { TodoDTO } from "../../../domain/todo/entities/todo.entity";
import { TodoEntity } from "../../../domain/todo/entities/todo.entity";
import { InvalidTodoTextError } from "../../../domain/todo/errors/todo.errors";
import type { TodoRepository } from "../../../domain/todo/repositories/todo.repository";
import { TodoText } from "../../../domain/todo/value-objects/todo-text.vo";
import { RepositoryError } from "../../../shared/errors/base.error";

export type CreateTodoInput = {
  text: string;
};

export type CreateTodoError = InvalidTodoTextError | RepositoryError;

export class CreateTodoUseCase {
  constructor(private readonly todoRepository: TodoRepository) {}

  async execute(
    input: CreateTodoInput,
  ): Promise<Result<TodoDTO, CreateTodoError>> {
    const textResult = TodoText.create(input.text);

    if (textResult.isErr()) {
      return err(textResult.error);
    }

    const todoEntity = TodoEntity.create(textResult.value);

    const saveResult = await this.todoRepository.save(todoEntity);

    if (saveResult.isErr()) {
      return err(saveResult.error);
    }

    return ok(saveResult.value.toDTO());
  }
}

