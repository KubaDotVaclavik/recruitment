import { AppError } from "../../../../core/utils/AppError";
import { CandidateRepository } from "../../repositories/CandidateRepository";
import { CandidateRepositoryErrors } from "../../repositories/CandidateRepositoryErrors";
import { DeleteCandidateRequestDTO } from "./DeleteCandidateRequestDTO";
import { Either, left, right, isLeft } from "fp-ts/lib/Either";
import { Result } from "../../../../core/utils/Result";
import { UseCase } from "../../../../core/utils/UseCase";

type Response = Either<
  | CandidateRepositoryErrors.CandidateNotFoundError
  | AppError.DomainConsistencyError
  | AppError.UnexpectedError
  | Result<any>,
  Result<void>
>;

export class DeleteCandidateUseCase
  implements UseCase<DeleteCandidateRequestDTO, Promise<Response>>
{
  private candidateRepository: CandidateRepository;

  constructor(candidateRepository: CandidateRepository) {
    this.candidateRepository = candidateRepository;
  }

  async execute(request: DeleteCandidateRequestDTO): Promise<Response> {
    try {
      const candidateOrError = await this.candidateRepository.getCandidate({
        id: request.id,
      });
      if (isLeft(candidateOrError)) {
        return candidateOrError;
      }
      const candidate = candidateOrError.right.value;

      const deleteOrError = candidate.delete();
      if (isLeft(deleteOrError)) {
        return left(new AppError.UnexpectedError("Delete failed"));
      }

      return this.candidateRepository.save(candidate);
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
