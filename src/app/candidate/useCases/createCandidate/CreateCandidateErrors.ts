import { Result } from "../../../../core/utils/Result";
import { DomainError } from "../../../../core/domain/DomainError";

export namespace CreateCandidateErrors {
  export class FullNameTakenError extends Result<DomainError> {
    private constructor(fullName: string) {
      super(
        false,
        DomainError.create(`The full name "${fullName}" is already taken`)
      );
    }
    public static create(fullName: string) {
      return new FullNameTakenError(fullName);
    }
  }
}
