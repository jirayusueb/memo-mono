import { TodoEntity } from "../../../domain/todo/entities/todo.entity";
import { TodoText } from "../../../domain/todo/value-objects/todo-text.vo";

export type TodoRecord = {
  id: number;
  text: string;
  completed: boolean;
};

export class TodoMapper {
  static toDomain(record: TodoRecord): TodoEntity {
    const textResult = TodoText.create(record.text);

    if (textResult.isErr()) {
      throw new Error(`Invalid todo text in database: ${record.text}`);
    }

    return TodoEntity.reconstitute(
      record.id,
      textResult.value,
      record.completed,
    );
  }

  static toPersistence(entity: TodoEntity): Omit<TodoRecord, "id"> {
    return {
      text: entity.getText(),
      completed: entity.isCompleted(),
    };
  }
}

