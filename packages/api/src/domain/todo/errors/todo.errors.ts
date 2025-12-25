import { DomainError } from "../../../shared/errors/base.error";

export class InvalidTodoTextError extends DomainError {
  readonly code = "INVALID_TODO_TEXT";

  constructor(reason: string) {
    super(`Invalid todo text: ${reason}`);
  }
}

export class TodoNotFoundError extends DomainError {
  readonly code = "TODO_NOT_FOUND";

  constructor(id: number) {
    super(`Todo with id ${id} not found`);
  }
}

