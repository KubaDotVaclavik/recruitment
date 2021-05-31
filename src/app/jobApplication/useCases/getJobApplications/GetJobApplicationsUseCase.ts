import { AppError } from "../../../../core/utils/AppError";
import { JobApplicationRepository } from "../../repositories/JobApplicationRepository";
import { Either, isLeft, left, right } from "fp-ts/lib/Either";
import { GetJobApplicationsRequestDTO } from "./GetJobApplicationsRequestDTO";
import { GetJobApplicationsResponseDTO } from "./GetJobApplicationsResponseDTO";
import { Result } from "../../../../core/utils/Result";
import { UseCase } from "../../../../core/utils/UseCase";
import { JobApplicationMap } from "../../mappers/JobApplicationMap";

type Response = Either<
  AppError.UnexpectedError | AppError.DomainConsistencyError | Result<any>,
  GetJobApplicationsResponseDTO
>;

export class GetJobApplicationsUseCase
  implements UseCase<GetJobApplicationsRequestDTO, Promise<Response>>
{
  private jobApplicationRepository: JobApplicationRepository;

  constructor(jobApplicationRepository: JobApplicationRepository) {
    this.jobApplicationRepository = jobApplicationRepository;
  }

  public async execute(request: GetJobApplicationsRequestDTO) {
    try {
      const jobApplicationsOrError =
        await this.jobApplicationRepository.getJobApplications({
          limit: request.limit,
          offset: request.offset,
        });

      if (isLeft(jobApplicationsOrError)) {
        return jobApplicationsOrError;
      }

      const jobApplicationsDTO = jobApplicationsOrError.right.map((result) =>
        JobApplicationMap.toDTO(result.value)
      );

      const count =
        await this.jobApplicationRepository.getJobApplicationsCount();

      return right({
        nodes: jobApplicationsDTO,
        total: count,
      });
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
