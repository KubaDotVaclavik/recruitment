import { AppError } from "../../../../core/utils/AppError";
import { CandidateRepository } from "../../../candidate/repositories/CandidateRepository";
import { CandidateRepositoryErrors } from "../../../candidate/repositories/CandidateRepositoryErrors";
import { CreateJobApplicationErrors } from "./CreateJobApplicationErrors";
import { CreateJobApplicationRequestDTO } from "./CreateJobApplicationRequestDTO";
import { Either, left, isLeft } from "fp-ts/lib/Either";
import { JobAdRepository } from "../../../jobAd/repositories/JobAdRepository";
import { JobAdRepositoryErrors } from "../../../jobAd/repositories/JobAdRepositoryErrors";
import { JobApplication } from "../../domain/JobApplication";
import { JobApplicationRepository } from "../../repositories/JobApplicationRepository";
import { Result } from "../../../../core/utils/Result";
import { UseCase } from "../../../../core/utils/UseCase";

type Response = Either<
  | JobAdRepositoryErrors.JobAdNotFoundError
  | CandidateRepositoryErrors.CandidateNotFoundError
  | CreateJobApplicationErrors.JobApplicationExistsError
  | AppError.UnexpectedError
  | Result<any>,
  Result<void>
>;

export class CreateJobApplicationUseCase
  implements UseCase<CreateJobApplicationRequestDTO, Promise<Response>>
{
  private jobApplicationRepository: JobApplicationRepository;
  private jobAdRepository: JobAdRepository;
  private candidateRepository: CandidateRepository;

  constructor(
    jobApplicationRepository: JobApplicationRepository,
    jobAdRepository: JobAdRepository,
    candidateRepository: CandidateRepository
  ) {
    this.jobApplicationRepository = jobApplicationRepository;
    this.jobAdRepository = jobAdRepository;
    this.candidateRepository = candidateRepository;
  }

  async execute(request: CreateJobApplicationRequestDTO): Promise<Response> {
    const { candidateId, jobAdId } = request;

    const jobAdOrError = await this.jobAdRepository.getJobAd({
      id: jobAdId,
    });
    if (isLeft(jobAdOrError)) {
      return jobAdOrError;
    }

    const candidateOrError = await this.candidateRepository.getCandidate({
      id: candidateId,
    });
    if (isLeft(candidateOrError)) {
      return candidateOrError;
    }

    const jobAd = jobAdOrError.right.value;
    const candidate = candidateOrError.right.value;

    try {
      const jobApplicationAlreadyExists =
        await this.jobApplicationRepository.exists({ jobAd, candidate });

      if (jobApplicationAlreadyExists) {
        return left(
          CreateJobApplicationErrors.JobApplicationExistsError.create()
        );
      }

      const jobApplicationOrError = JobApplication.create({
        candidate,
        jobAd,
      });
      if (isLeft(jobApplicationOrError)) {
        return jobApplicationOrError;
      }

      const jobApplication = jobApplicationOrError.right.value;
      return this.jobApplicationRepository.save(jobApplication);
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
