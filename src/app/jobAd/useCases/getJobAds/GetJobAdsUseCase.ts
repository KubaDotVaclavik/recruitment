import { AppError } from "../../../../core/utils/AppError";
import { JobAdRepository } from "../../repositories/JobAdRepository";
import { Either, isLeft, left, right } from "fp-ts/lib/Either";
import { GetJobAdsRequestDTO } from "./GetJobAdsRequestDTO";
import { GetJobAdsResponseDTO } from "./GetJobAdsResponseDTO";
import { Result } from "../../../../core/utils/Result";
import { UseCase } from "../../../../core/utils/UseCase";
import { JobAdMap } from "../../mappers/JobAdMap";

type Response = Either<
  AppError.UnexpectedError | AppError.DomainConsistencyError | Result<any>,
  GetJobAdsResponseDTO
>;

export class GetJobAdsUseCase
  implements UseCase<GetJobAdsRequestDTO, Promise<Response>>
{
  private jobAdRepository: JobAdRepository;

  constructor(jobAdRepository: JobAdRepository) {
    this.jobAdRepository = jobAdRepository;
  }

  public async execute(request: GetJobAdsRequestDTO) {
    try {
      const jobAdsOrError = await this.jobAdRepository.getJobAds({
        limit: request.limit,
        offset: request.offset,
        where: {
          title_contains: request.title_contains,
          text_contains: request.text_contains,
        },
      });

      if (isLeft(jobAdsOrError)) {
        return jobAdsOrError;
      }

      const jobAdsDTO = jobAdsOrError.right.map((result) =>
        JobAdMap.toDTO(result.value)
      );

      const count = await this.jobAdRepository.getJobAdsCount({
        title_contains: request.title_contains,
        text_contains: request.text_contains,
      });

      return right({
        nodes: jobAdsDTO,
        total: count,
      });
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
