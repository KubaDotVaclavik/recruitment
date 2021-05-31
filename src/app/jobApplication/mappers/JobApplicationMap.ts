import { AppError } from "../../../core/utils/AppError";
import { JobApplication } from "../domain/JobApplication";
import { JobApplication as IJobApplication } from "@prisma/client";
import { EntityId } from "../../../core/domain/EntityId";
import { Either, isLeft, left } from "fp-ts/lib/Either";
import { Result } from "../../../core/utils/Result";
import { SingleConnectionMap } from "../../common/mappers/SingleConnectionMap";

export interface IRawJobApplication extends IJobApplication {}

export class JobApplicationMap {
  public static toDomain(
    raw: IRawJobApplication
  ): Either<AppError.DomainConsistencyError, Result<JobApplication>> {
    const candidateConnectionOrError = SingleConnectionMap.toDomain({
      id: raw.candidateId,
    });
    if (isLeft(candidateConnectionOrError)) {
      return left(
        AppError.DomainConsistencyError.create(candidateConnectionOrError.left)
      );
    }

    const jobAdConnectionOrError = SingleConnectionMap.toDomain({
      id: raw.jobAdId,
    });
    if (isLeft(jobAdConnectionOrError)) {
      return left(
        AppError.DomainConsistencyError.create(jobAdConnectionOrError.left)
      );
    }

    const jobApplicationOrError = JobApplication.create(
      {
        candidate: candidateConnectionOrError.right.value,
        jobAd: jobAdConnectionOrError.right.value,
      },
      new EntityId(raw.id)
    );
    if (isLeft(jobApplicationOrError)) {
      return left(
        AppError.DomainConsistencyError.create(jobApplicationOrError.left)
      );
    }
    return jobApplicationOrError;
  }

  public static toDTO(jobApplication: JobApplication) {
    return {
      id: jobApplication.id.toValue(),
      candidateId: SingleConnectionMap.toDTO(jobApplication.candidate),
      jobAdId: SingleConnectionMap.toDTO(jobApplication.jobAd),
    };
  }

  public static toPersistence(jobApplication: JobApplication) {
    return {
      candidate: SingleConnectionMap.toPersistence(jobApplication.candidate),
      jobAd: SingleConnectionMap.toPersistence(jobApplication.jobAd),
    };
  }
}
