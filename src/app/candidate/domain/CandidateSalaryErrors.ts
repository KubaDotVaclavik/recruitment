import { Result } from "../../../core/utils/Result";
import { DomainError } from "../../../core/domain/DomainError";

export namespace CandidateSalaryErrors {
  export class NonNumberError extends Result<DomainError> {
    constructor() {
      super(false, DomainError.create(`Salary is non-number`));
    }
    public static create() {
      return new NonNumberError();
    }
  }

  export class MinimumError extends Result<DomainError> {
    constructor(min: number) {
      super(false, DomainError.create(`Minimum salary is ${min}`));
    }
    public static create(minLength: number) {
      return new MinimumError(minLength);
    }
  }

  export class MaximumError extends Result<DomainError> {
    constructor(max: number) {
      super(false, DomainError.create(`Maximum salary is ${max}`));
    }
    public static create(max: number) {
      return new MaximumError(max);
    }
  }
}
