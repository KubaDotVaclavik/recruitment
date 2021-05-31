import { AppError } from "../../../../core/utils/AppError";
import { CandidateMap } from "../../../candidate/mappers/CandidateMap";
import { CandidateRepository } from "../../../candidate/repositories/CandidateRepository";
import { CandidateRepositoryErrors } from "../../../candidate/repositories/CandidateRepositoryErrors";
import { Either, left, right, isLeft } from "fp-ts/lib/Either";
import { GetJobApplicationRequestDTO } from "./GetJobApplicationRequestDTO";
import { GetJobApplicationResponseDTO } from "./GetJobApplicationResponseDTO";
import { JobAdMap } from "../../../jobAd/mappers/JobAdMap";
import { JobAdRepository } from "../../../jobAd/repositories/JobAdRepository";
import { JobAdRepositoryErrors } from "../../../jobAd/repositories/JobAdRepositoryErrors";
import { JobApplicationRepository } from "../../repositories/JobApplicationRepository";
import { JobApplicationRepositoryErrors } from "../../repositories/JobApplicationRepositoryErrors";
import { Result } from "../../../../core/utils/Result";
import { UseCase } from "../../../../core/utils/UseCase";

type Response = Either<
  | JobAdRepositoryErrors.JobAdNotFoundError
  | CandidateRepositoryErrors.CandidateNotFoundError
  | JobApplicationRepositoryErrors.JobApplicationNotFoundError
  | AppError.UnexpectedError
  | AppError.DomainConsistencyError
  | Result<any>,
  GetJobApplicationResponseDTO
>;

export class GetJobApplicationUseCase
  implements UseCase<GetJobApplicationRequestDTO, Promise<Response>>
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

  public async execute(req: GetJobApplicationRequestDTO) {
    try {
      const jobApplicationOrError =
        await this.jobApplicationRepository.getJobApplication({
          id: req.id,
        });
      if (isLeft(jobApplicationOrError)) {
        return jobApplicationOrError;
      }
      const jobApplication = jobApplicationOrError.right.value;

      const jobAdOrError = await this.jobAdRepository.getJobAd({
        id: jobApplication.jobAd.id.toValue(),
      });
      if (isLeft(jobAdOrError)) {
        return jobAdOrError;
      }

      const candidateOrError = await this.candidateRepository.getCandidate({
        id: jobApplication.candidate.id.toValue(),
      });
      if (isLeft(candidateOrError)) {
        return candidateOrError;
      }

      const response: GetJobApplicationResponseDTO = {
        id: jobApplication.id.toValue(),
        jobAd: JobAdMap.toDTO(jobAdOrError.right.value),
        candidate: CandidateMap.toDTO(candidateOrError.right.value),
      };

      return right(response);
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
