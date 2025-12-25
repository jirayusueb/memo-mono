import { TodoText } from "../value-objects/todo-text.vo";

export class TodoEntity {
  private constructor(
    private readonly id: number | null,
    private text: TodoText,
    private completed: boolean,
  ) {}

  static create(text: TodoText): TodoEntity {
    return new TodoEntity(null, text, false);
  }

  static reconstitute(
    id: number,
    text: TodoText,
    completed: boolean,
  ): TodoEntity {
    return new TodoEntity(id, text, completed);
  }

  getId(): number | null {
    return this.id;
  }

  getText(): string {
    return this.text.getValue();
  }

  getTextVO(): TodoText {
    return this.text;
  }

  isCompleted(): boolean {
    return this.completed;
  }

  toggle(): void {
    this.completed = !this.completed;
  }

  markComplete(): void {
    this.completed = true;
  }

  markIncomplete(): void {
    this.completed = false;
  }

  updateText(newText: TodoText): void {
    this.text = newText;
  }

  toDTO(): TodoDTO {
    return {
      id: this.id!,
      text: this.getText(),
      completed: this.completed,
    };
  }
}

export type TodoDTO = {
  id: number;
  text: string;
  completed: boolean;
};

