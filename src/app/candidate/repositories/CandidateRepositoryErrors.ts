import { Result } from "../../../core/utils/Result";
import { DomainError } from "../../../core/domain/DomainError";

export namespace CandidateRepositoryErrors {
  export class CandidateNotFoundError extends Result<DomainError> {
    constructor() {
      super(false, DomainError.create(`Candidate not found`));
    }
  }
}
