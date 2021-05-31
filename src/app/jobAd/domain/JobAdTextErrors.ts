import { Result } from "../../../core/utils/Result";
import { DomainError } from "../../../core/domain/DomainError";

export namespace JobAdTextErrors {
  export class RequiredError extends Result<DomainError> {
    constructor() {
      super(false, DomainError.create(`Text is required`));
    }
    public static create() {
      return new RequiredError();
    }
  }

  export class NonStringError extends Result<DomainError> {
    constructor() {
      super(false, DomainError.create(`Text must be a string`));
    }
    public static create() {
      return new NonStringError();
    }
  }

  export class TooShortError extends Result<DomainError> {
    constructor(minLength: number) {
      super(
        false,
        DomainError.create(`Text is too short. Minimum length is ${minLength}`)
      );
    }
    public static create(minLength: number) {
      return new TooShortError(minLength);
    }
  }

  export class TooLongError extends Result<DomainError> {
    constructor(maxLength: number) {
      super(
        false,
        DomainError.create(`Text is too long. Maximum length is ${maxLength}`)
      );
    }
    public static create(maxLength: number) {
      return new TooLongError(maxLength);
    }
  }
}
