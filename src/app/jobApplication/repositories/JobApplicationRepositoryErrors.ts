import { Result } from "../../../core/utils/Result";
import { DomainError } from "../../../core/domain/DomainError";

export namespace JobApplicationRepositoryErrors {
  export class JobApplicationNotFoundError extends Result<DomainError> {
    constructor() {
      super(false, DomainError.create(`Job application not found`));
    }
  }
}
