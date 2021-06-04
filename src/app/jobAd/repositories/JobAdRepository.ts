import { AppError } from "../../../core/utils/AppError";
import { JobAd } from "../domain/JobAd";
import { JobAdMap } from "../mappers/JobAdMap";
import { JobAdRepositoryErrors } from "./JobAdRepositoryErrors";
import { Either, right, left } from "fp-ts/lib/Either";
import { lefts, rights } from "fp-ts/Array";
import { PrismaClient } from "@prisma/client";
import { Result } from "../../../core/utils/Result";

interface IJobAdsWhere {
  text_contains?: string;
  title_contains?: string;
}

export class JobAdRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  private static buildJobAdsWhere(where?: IJobAdsWhere) {
    const title_contains: string | undefined = where?.title_contains;
    const text_contains: string | undefined = where?.text_contains;
    return {
      ...(title_contains && {
        title: { contains: title_contains },
      }),
      ...(text_contains && {
        text: { contains: text_contains },
      }),
    };
  }

  public async getJobAds(props?: {
    offset?: number;
    limit?: number;
    where?: IJobAdsWhere;
  }): Promise<Either<AppError.DomainConsistencyError, Result<JobAd>[]>> {
    const offset: number = props?.offset || 0;
    const limit: number = Math.min(props?.limit || 5, 50);
    const where = JobAdRepository.buildJobAdsWhere(props?.where);

    const rawJobAds = await this.prisma.jobAd.findMany({
      skip: offset,
      take: limit,
      where,
    });

    const jobAdsOrErrors = rawJobAds.map(JobAdMap.toDomain);

    const errors = lefts(jobAdsOrErrors);
    if (errors.length > 0) {
      return left(errors[0]);
    }

    const jobAds = rights(jobAdsOrErrors);
    return right(jobAds);
  }

  public async getJobAd(where: {
    id: string;
  }): Promise<
    Either<
      | JobAdRepositoryErrors.JobAdNotFoundError
      | AppError.DomainConsistencyError,
      Result<JobAd>
    >
  > {
    const rawJobAd = await this.prisma.jobAd.findUnique({ where });
    if (rawJobAd === null) {
      return left(new JobAdRepositoryErrors.JobAdNotFoundError());
    }
    return JobAdMap.toDomain(rawJobAd);
  }

  public async getJobAdsCount(where?: IJobAdsWhere) {
    return this.prisma.jobAd.count({
      where: JobAdRepository.buildJobAdsWhere(where),
    });
  }

  public async exists(jobAd: JobAd): Promise<boolean> {
    if (!jobAd.exists()) {
      return false;
    }
    const id = jobAd.id.toValue();
    const found = await this.prisma.jobAd.findUnique({ where: { id } });
    return Boolean(found);
  }

  public async save(
    jobAd: JobAd
  ): Promise<Either<AppError.UnexpectedError, Result<void>>> {
    try {
      const exists = await this.exists(jobAd);

      if (exists && jobAd.isDeleted()) {
        await this.prisma.jobAd.delete({
          where: { id: jobAd.id.toValue() },
        });
        return right(Result.ok<void>());
      }

      if (exists) {
        const data = JobAdMap.toPersistence(jobAd);
        await this.prisma.jobAd.update({
          where: { id: jobAd.id.toValue() },
          data,
        });
      } else {
        const data = JobAdMap.toPersistence(jobAd);
        await this.prisma.jobAd.create({ data });
      }
      return right(Result.ok<void>());
    } catch (err) {
      return left(AppError.UnexpectedError.create(err));
    }
  }
}
