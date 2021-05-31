import { AppError } from "../../../../core/utils/AppError";
import { JobAdRepository } from "../../repositories/JobAdRepository";
import { Either, left, right, isLeft } from "fp-ts/lib/Either";
import { GetJobAdRequestDTO } from "./GetJobAdRequestDTO";
import { GetJobAdResponseDTO } from "./GetJobAdResponseDTO";
import { Result } from "../../../../core/utils/Result";
import { UseCase } from "../../../../core/utils/UseCase";
import { JobAdMap } from "../../mappers/JobAdMap";
import { JobAdRepositoryErrors } from "../../repositories/JobAdRepositoryErrors";

type Response = Either<
  | JobAdRepositoryErrors.JobAdNotFoundError
  | AppError.UnexpectedError
  | AppError.DomainConsistencyError
  | Result<any>,
  GetJobAdResponseDTO
>;

export class GetJobAdUseCase
  implements UseCase<GetJobAdRequestDTO, Promise<Response>>
{
  private jobAdRepository: JobAdRepository;

  constructor(jobAdRepository: JobAdRepository) {
    this.jobAdRepository = jobAdRepository;
  }

  public async execute(req: GetJobAdRequestDTO) {
    try {
      const jobAdOrError = await this.jobAdRepository.getJobAd({
        id: req.id,
      });

      if (isLeft(jobAdOrError)) {
        return jobAdOrError;
      }

      return right(JobAdMap.toDTO(jobAdOrError.right.value));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
