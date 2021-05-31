import { AppError } from "../../../../core/utils/AppError";
import { JobApplicationRepository } from "../../repositories/JobApplicationRepository";
import { JobApplicationRepositoryErrors } from "../../repositories/JobApplicationRepositoryErrors";
import { DeleteJobApplicationRequestDTO } from "./DeleteJobApplicationRequestDTO";
import { Either, left, right, isLeft } from "fp-ts/lib/Either";
import { Result } from "../../../../core/utils/Result";
import { UseCase } from "../../../../core/utils/UseCase";

type Response = Either<
  | JobApplicationRepositoryErrors.JobApplicationNotFoundError
  | AppError.DomainConsistencyError
  | AppError.UnexpectedError
  | Result<any>,
  Result<void>
>;

export class DeleteJobApplicationUseCase
  implements UseCase<DeleteJobApplicationRequestDTO, Promise<Response>>
{
  private jobApplicationRepository: JobApplicationRepository;

  constructor(jobApplicationRepository: JobApplicationRepository) {
    this.jobApplicationRepository = jobApplicationRepository;
  }

  async execute(request: DeleteJobApplicationRequestDTO): Promise<Response> {
    try {
      const jobApplicationOrError = await this.jobApplicationRepository.getJobApplication({
        id: request.id,
      });
      if (isLeft(jobApplicationOrError)) {
        return jobApplicationOrError;
      }
      const jobApplication = jobApplicationOrError.right.value;

      const deleteOrError = jobApplication.delete();
      if (isLeft(deleteOrError)) {
        return left(new AppError.UnexpectedError("Delete failed"));
      }

      return this.jobApplicationRepository.save(jobApplication);
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
