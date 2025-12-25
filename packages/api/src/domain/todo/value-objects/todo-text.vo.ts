import { Result, ok, err } from "neverthrow";

import { InvalidTodoTextError } from "../errors/todo.errors";

const MAX_TODO_TEXT_LENGTH = 500;

export class TodoText {
  private constructor(private readonly value: string) {
    Object.freeze(this);
  }

  static create(text: string): Result<TodoText, InvalidTodoTextError> {
    const trimmed = text.trim();

    if (trimmed.length === 0) {
      return err(new InvalidTodoTextError("Text cannot be empty"));
    }

    if (trimmed.length > MAX_TODO_TEXT_LENGTH) {
      return err(
        new InvalidTodoTextError(
          `Text cannot exceed ${MAX_TODO_TEXT_LENGTH} characters`,
        ),
      );
    }

    return ok(new TodoText(trimmed));
  }

  getValue(): string {
    return this.value;
  }

  equals(other: TodoText): boolean {
    return this.value === other.value;
  }
}

