import { ResultAsync } from "neverthrow";

import { RepositoryError } from "@/shared/errors/base.error";

import { TodoEntity } from "../entities/todo.entity";

export interface TodoRepository {
  findAll(): ResultAsync<TodoEntity[], RepositoryError>;
  findById(id: number): ResultAsync<TodoEntity | null, RepositoryError>;
  save(todo: TodoEntity): ResultAsync<TodoEntity, RepositoryError>;
  delete(id: number): ResultAsync<void, RepositoryError>;
}

