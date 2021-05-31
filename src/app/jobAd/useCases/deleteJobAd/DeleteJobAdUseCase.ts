import { AppError } from "../../../../core/utils/AppError";
import { JobAdRepository } from "../../repositories/JobAdRepository";
import { JobAdRepositoryErrors } from "../../repositories/JobAdRepositoryErrors";
import { DeleteJobAdRequestDTO } from "./DeleteJobAdRequestDTO";
import { Either, left, right, isLeft } from "fp-ts/lib/Either";
import { Result } from "../../../../core/utils/Result";
import { UseCase } from "../../../../core/utils/UseCase";

type Response = Either<
  | JobAdRepositoryErrors.JobAdNotFoundError
  | AppError.DomainConsistencyError
  | AppError.UnexpectedError
  | Result<any>,
  Result<void>
>;

export class DeleteJobAdUseCase
  implements UseCase<DeleteJobAdRequestDTO, Promise<Response>>
{
  private jobAdRepository: JobAdRepository;

  constructor(jobAdRepository: JobAdRepository) {
    this.jobAdRepository = jobAdRepository;
  }

  async execute(request: DeleteJobAdRequestDTO): Promise<Response> {
    try {
      const jobAdOrError = await this.jobAdRepository.getJobAd({
        id: request.id,
      });
      if (isLeft(jobAdOrError)) {
        return jobAdOrError;
      }
      const jobAd = jobAdOrError.right.value;

      const deleteOrError = jobAd.delete();
      if (isLeft(deleteOrError)) {
        return left(new AppError.UnexpectedError("Delete failed"));
      }

      await this.jobAdRepository.save(jobAd);

      return right(Result.ok<void>());
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
