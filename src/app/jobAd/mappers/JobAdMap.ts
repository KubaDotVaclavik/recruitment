import { AppError } from "../../../core/utils/AppError";
import { JobAd } from "../domain/JobAd";
import { JobAd as IJobAd } from "@prisma/client";
import { JobAdTitle } from "../domain/JobAdTitle";
import { JobAdSalary } from "../domain/JobAdSalary";
import { EntityId } from "../../../core/domain/EntityId";
import { Either, isLeft, left } from "fp-ts/lib/Either";
import { Result } from "../../../core/utils/Result";
import { JobAdText } from "../domain/JobAdText";

export interface IRawJobAd extends IJobAd {}

export class JobAdMap {
  public static toDomain(
    raw: IRawJobAd
  ): Either<AppError.DomainConsistencyError, Result<JobAd>> {
    const titleOrError = JobAdTitle.create({
      title: raw.title,
    });
    const textOrError = JobAdText.create({
      text: raw.text,
    });
    const salaryOrError = raw.salary
      ? JobAdSalary.create({ salary: raw.salary })
      : undefined;

    if (isLeft(titleOrError)) {
      return left(AppError.DomainConsistencyError.create(titleOrError.left));
    }
    if (isLeft(textOrError)) {
      return left(AppError.DomainConsistencyError.create(textOrError.left));
    }
    if (salaryOrError && isLeft(salaryOrError)) {
      return left(AppError.DomainConsistencyError.create(salaryOrError.left));
    }

    const jobAdOrError = JobAd.create(
      {
        title: titleOrError.right.value,
        text: textOrError.right.value,
        salary: salaryOrError && salaryOrError.right.value,
      },
      new EntityId(raw.id)
    );

    if (isLeft(jobAdOrError)) {
      return left(AppError.DomainConsistencyError.create(jobAdOrError.left));
    }
    return jobAdOrError;
  }

  public static toDTO(jobAd: JobAd) {
    return {
      id: jobAd.id.toValue(),
      title: jobAd.title.value,
      text: jobAd.text.value,
      salary: jobAd.salary?.value || null,
    };
  }

  public static toPersistence(jobAd: JobAd) {
    return {
      title: jobAd.title.value,
      text: jobAd.text.value,
      salary: jobAd.salary === null ? null : jobAd.salary?.value,
    };
  }
}
