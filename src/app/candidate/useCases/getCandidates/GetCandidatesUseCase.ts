import { AppError } from "../../../../core/utils/AppError";
import { CandidateRepository } from "../../repositories/CandidateRepository";
import { Either, isLeft, left, right } from "fp-ts/lib/Either";
import { GetCandidatesRequestDTO } from "./GetCandidatesRequestDTO";
import { GetCandidatesResponseDTO } from "./GetCandidatesResponseDTO";
import { Result } from "../../../../core/utils/Result";
import { UseCase } from "../../../../core/utils/UseCase";
import { CandidateMap } from "../../mappers/CandidateMap";

type Response = Either<
  AppError.UnexpectedError | AppError.DomainConsistencyError | Result<any>,
  GetCandidatesResponseDTO
>;

export class GetCandidatesUseCase
  implements UseCase<GetCandidatesRequestDTO, Promise<Response>>
{
  private candidateRepository: CandidateRepository;

  constructor(candidateRepository: CandidateRepository) {
    this.candidateRepository = candidateRepository;
  }

  public async execute(request: GetCandidatesRequestDTO) {
    try {
      const candidatesOrError = await this.candidateRepository.getCandidates({
        limit: request.limit,
        offset: request.offset,
        where: {
          fullName_contains: request.fullName_contains,
          skills_contains: request.skills_contains,
        },
      });

      if (isLeft(candidatesOrError)) {
        return candidatesOrError;
      }

      const candidatesDTO = candidatesOrError.right.map((result) =>
        CandidateMap.toDTO(result.value)
      );

      const count = await this.candidateRepository.getCandidatesCount({
        fullName_contains: request.fullName_contains,
        skills_contains: request.skills_contains,
      });

      return right({
        nodes: candidatesDTO,
        total: count,
      });
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
