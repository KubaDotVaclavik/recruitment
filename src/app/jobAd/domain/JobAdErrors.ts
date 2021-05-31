import { Result } from "../../../core/utils/Result";
import { DomainError } from "../../../core/domain/DomainError";

export namespace JobAdErrors {
  export class TitleRequiredError extends Result<DomainError> {
    constructor() {
      super(false, DomainError.create(`Title is required`));
    }
    public static create() {
      return new TitleRequiredError();
    }
  }

  export class TextRequiredError extends Result<DomainError> {
    constructor() {
      super(false, DomainError.create(`Text is required`));
    }
    public static create() {
      return new TextRequiredError();
    }
  }
}
