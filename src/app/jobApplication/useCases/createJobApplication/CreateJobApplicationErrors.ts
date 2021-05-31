import { Result } from "../../../../core/utils/Result";
import { DomainError } from "../../../../core/domain/DomainError";

export namespace CreateJobApplicationErrors {
  export class JobApplicationExistsError extends Result<DomainError> {
    private constructor() {
      super(
        false,
        DomainError.create(`The same job application already exists.`)
      );
    }
    public static create() {
      return new JobApplicationExistsError();
    }
  }
}
