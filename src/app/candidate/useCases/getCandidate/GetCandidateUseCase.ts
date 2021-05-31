import { AppError } from "../../../../core/utils/AppError";
import { CandidateRepository } from "../../repositories/CandidateRepository";
import { Either, left, right, isLeft } from "fp-ts/lib/Either";
import { GetCandidateRequestDTO } from "./GetCandidateRequestDTO";
import { GetCandidateResponseDTO } from "./GetCandidateResponseDTO";
import { Result } from "../../../../core/utils/Result";
import { UseCase } from "../../../../core/utils/UseCase";
import { CandidateMap } from "../../mappers/CandidateMap";
import { CandidateRepositoryErrors } from "../../repositories/CandidateRepositoryErrors";

type Response = Either<
  | CandidateRepositoryErrors.CandidateNotFoundError
  | AppError.UnexpectedError
  | AppError.DomainConsistencyError
  | Result<any>,
  GetCandidateResponseDTO
>;

export class GetCandidateUseCase
  implements UseCase<GetCandidateRequestDTO, Promise<Response>>
{
  private candidateRepository: CandidateRepository;

  constructor(candidateRepository: CandidateRepository) {
    this.candidateRepository = candidateRepository;
  }

  public async execute(req: GetCandidateRequestDTO) {
    try {
      const candidateOrError = await this.candidateRepository.getCandidate({
        id: req.id,
      });

      if (isLeft(candidateOrError)) {
        return candidateOrError;
      }

      return right(CandidateMap.toDTO(candidateOrError.right.value));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
