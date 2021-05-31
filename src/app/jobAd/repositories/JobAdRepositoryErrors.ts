import { Result } from "../../../core/utils/Result";
import { DomainError } from "../../../core/domain/DomainError";

export namespace JobAdRepositoryErrors {
  export class JobAdNotFoundError extends Result<DomainError> {
    constructor() {
      super(false, DomainError.create(`JobAd not found`));
    }
  }
}
