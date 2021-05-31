import { Result } from "../../../core/utils/Result";
import { DomainError } from "../../../core/domain/DomainError";

export namespace CandidateErrors {
  export class FullNameRequiredError extends Result<DomainError> {
    constructor() {
      super(false, DomainError.create(`Fullname is required`));
    }
    public static create() {
      return new FullNameRequiredError();
    }
  }

  export class SkillsRequiredError extends Result<DomainError> {
    constructor() {
      super(false, DomainError.create(`Skills is required`));
    }
    public static create() {
      return new SkillsRequiredError();
    }
  }
}
