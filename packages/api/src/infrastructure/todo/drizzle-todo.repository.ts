import { db } from "@memo-mono/db";
import { todo } from "@memo-mono/db/schema/todo";
import { eq } from "drizzle-orm";
import { ResultAsync } from "neverthrow";

import { TodoEntity } from "../../../domain/todo/entities/todo.entity";
import type { TodoRepository } from "../../../domain/todo/repositories/todo.repository";
import { RepositoryError } from "../../../shared/errors/base.error";

import { TodoMapper } from "./todo.mapper";

export class DrizzleTodoRepository implements TodoRepository {
  findAll(): ResultAsync<TodoEntity[], RepositoryError> {
    return ResultAsync.fromPromise(
      db.select().from(todo),
      (error) => new RepositoryError("Failed to fetch todos", error),
    ).map((records) => records.map(TodoMapper.toDomain));
  }

  findById(id: number): ResultAsync<TodoEntity | null, RepositoryError> {
    return ResultAsync.fromPromise(
      db.select().from(todo).where(eq(todo.id, id)),
      (error) => new RepositoryError(`Failed to fetch todo with id ${id}`, error),
    ).map((records) => {
      if (records.length === 0) return null;
      return TodoMapper.toDomain(records[0]);
    });
  }

  save(entity: TodoEntity): ResultAsync<TodoEntity, RepositoryError> {
    const id = entity.getId();
    const data = TodoMapper.toPersistence(entity);

    if (id === null) {
      return ResultAsync.fromPromise(
        db.insert(todo).values(data).returning(),
        (error) => new RepositoryError("Failed to create todo", error),
      ).map((records) => {
        const record = records[0];
        if (!record) {
          throw new RepositoryError("Failed to create todo: no record returned");
        }
        return TodoMapper.toDomain(record);
      });
    }

    return ResultAsync.fromPromise(
      db.update(todo).set(data).where(eq(todo.id, id)).returning(),
      (error) => new RepositoryError(`Failed to update todo with id ${id}`, error),
    ).map((records) => {
      const record = records[0];
      if (!record) {
        throw new RepositoryError(`Failed to update todo with id ${id}: no record returned`);
      }
      return TodoMapper.toDomain(record);
    });
  }

  delete(id: number): ResultAsync<void, RepositoryError> {
    return ResultAsync.fromPromise(
      db.delete(todo).where(eq(todo.id, id)),
      (error) => new RepositoryError(`Failed to delete todo with id ${id}`, error),
    ).map(() => undefined);
  }
}

