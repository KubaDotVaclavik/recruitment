import { Result } from "./Result";
import { DomainError } from "../domain/DomainError";

export namespace AppError {
  export class UnexpectedError extends Result<DomainError> {
    public constructor(err: any) {
      super(false, DomainError.create(`An unexpected error occurred.`));

      console.log(`[AppError]: An unexpected error occurred`);
      console.error(err);
    }

    public static create(err: any): UnexpectedError {
      return new UnexpectedError(err);
    }
  }

  export class DomainConsistencyError extends Result<DomainError> {
    public constructor(err: any) {
      super(false, DomainError.create(`An unexpected error occurred.`));

      console.log(`[AppError]: A domain consistency error occurred`);
      console.error(err);
    }

    public static create(err: any): DomainConsistencyError {
      return new DomainConsistencyError(err);
    }
  }
}
