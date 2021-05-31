import { Result } from "../../../core/utils/Result";
import { DomainError } from "../../../core/domain/DomainError";

export namespace CandidateSkillsErrors {
  export class RequiredError extends Result<DomainError> {
    constructor() {
      super(false, DomainError.create(`Skills is required`));
    }
    public static create() {
      return new RequiredError();
    }
  }

  export class ListError extends Result<DomainError> {
    constructor() {
      super(false, DomainError.create(`Skills-set must be a list`));
    }
    public static create() {
      return new ListError();
    }
  }

  export class MinimalCountError extends Result<DomainError> {
    constructor(minCount: number) {
      super(
        false,
        DomainError.create(`Minimum count of unique skills is ${minCount}.`)
      );
    }
    public static create(minCount: number) {
      return new MinimalCountError(minCount);
    }
  }

  export class MaximalCountError extends Result<DomainError> {
    constructor(maxCount: number) {
      super(
        false,
        DomainError.create(
          `You are too good for us. Maximum count of skills is ${maxCount}.`
        )
      );
    }
    public static create(maxCount: number) {
      return new MaximalCountError(maxCount);
    }
  }

  export class NonStringError extends Result<DomainError> {
    constructor() {
      super(false, DomainError.create(`Skill must be a string`));
    }
    public static create() {
      return new NonStringError();
    }
  }

  export class InvalidCharterError extends Result<DomainError> {
    constructor(charter: string) {
      super(false, DomainError.create(`The charter "${charter}" is invalid`));
    }
    public static create(charter: string) {
      return new InvalidCharterError(charter);
    }
  }

  export class TooShortError extends Result<DomainError> {
    constructor(skill: string, minLength: number) {
      super(
        false,
        DomainError.create(
          `Skill "${skill}" is too short. Minimum length of the text is ${minLength}`
        )
      );
    }
    public static create(skill: string, minLength: number) {
      return new TooShortError(skill, minLength);
    }
  }

  export class TooLongError extends Result<DomainError> {
    constructor(skill: string, maxLength: number) {
      super(
        false,
        DomainError.create(
          `Such an essay. Skill "${skill}" is too long. Maximum length of the text is ${maxLength} letters.`
        )
      );
    }
    public static create(skill: string, maxLength: number) {
      const slice = skill.slice(0, Math.max(8, maxLength - 4)) + "...";
      return new TooLongError(slice, maxLength);
    }
  }
}
