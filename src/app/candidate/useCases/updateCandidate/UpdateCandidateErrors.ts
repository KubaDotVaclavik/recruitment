import { Result } from "../../../../core/utils/Result";
import { DomainError } from "../../../../core/domain/DomainError";

export namespace UpdateCandidateErrors {
  export class FullNameTakenError extends Result<DomainError> {
    constructor(fullName: string) {
      super(
        false,
        DomainError.create(`The full name "${fullName}" is already taken`)
      );
    }
  }
}
