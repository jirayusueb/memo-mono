export abstract class DomainError extends Error {
  abstract readonly code: string;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class RepositoryError extends DomainError {
  readonly code = "REPOSITORY_ERROR";

  constructor(message: string, public readonly cause?: unknown) {
    super(message);
  }
}

