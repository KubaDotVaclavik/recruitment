import { AppError } from "../../../core/utils/AppError";
import { Candidate } from "../../candidate/domain/Candidate";
import { Either, right, left } from "fp-ts/lib/Either";
import { JobAd } from "../../jobAd/domain/JobAd";
import { JobApplication } from "../domain/JobApplication";
import { JobApplicationMap } from "../mappers/JobApplicationMap";
import { JobApplicationRepositoryErrors } from "./JobApplicationRepositoryErrors";
import { lefts, rights } from "fp-ts/Array";
import { PrismaClient } from "@prisma/client";
import { Result } from "../../../core/utils/Result";

export class JobApplicationRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  public async getJobApplications(props?: {
    offset?: number;
    limit?: number;
  }): Promise<
    Either<AppError.DomainConsistencyError, Result<JobApplication>[]>
  > {
    const offset: number = props?.offset || 0;
    const limit: number = Math.min(props?.limit || 5, 50);

    const rawjobApplications = await this.prisma.jobApplication.findMany({
      skip: offset,
      take: limit,
    });

    const jobApplicationsOrErrors = rawjobApplications.map(
      JobApplicationMap.toDomain
    );

    const errors = lefts(jobApplicationsOrErrors);
    if (errors.length > 0) {
      return left(errors[0]);
    }

    const jobApplications = rights(jobApplicationsOrErrors);
    return right(jobApplications);
  }

  public async getJobApplication(where: {
    id: string;
  }): Promise<
    Either<
      | JobApplicationRepositoryErrors.JobApplicationNotFoundError
      | AppError.DomainConsistencyError,
      Result<JobApplication>
    >
  > {
    const rawJobApplication = await this.prisma.jobApplication.findUnique({
      where,
    });

    if (rawJobApplication === null) {
      return left(
        new JobApplicationRepositoryErrors.JobApplicationNotFoundError()
      );
    }
    return JobApplicationMap.toDomain(rawJobApplication);
  }

  public async getJobApplicationsCount() {
    return this.prisma.jobApplication.count();
  }

  public async exists(
    arg: JobApplication | { jobAd: JobAd; candidate: Candidate }
  ): Promise<boolean> {
    if (arg instanceof JobApplication) {
      const jobApplication = arg;
      if (!jobApplication.exists()) {
        return false;
      }
      const id = jobApplication.id.toValue();
      const found = await this.prisma.jobApplication.findUnique({
        where: { id },
      });
      return Boolean(found);
    } else {
      const jobAdId = arg.jobAd.id.toValue();
      const candidateId = arg.candidate.id.toValue();
      const found = await this.prisma.jobApplication.findUnique({
        where: { candidateId_jobAdId: { candidateId, jobAdId } },
      });
      return Boolean(found);
    }
  }

  public async save(
    jobApplication: JobApplication
  ): Promise<Either<AppError.UnexpectedError, Result<void>>> {
    try {
      const exists = await this.exists(jobApplication);

      if (exists && jobApplication.isDeleted()) {
        await this.prisma.jobApplication.delete({
          where: { id: jobApplication.id.toValue() },
        });
        return right(Result.ok<void>());
      }

      if (exists) {
        const data = JobApplicationMap.toPersistence(jobApplication);
        await this.prisma.jobApplication.update({
          where: { id: jobApplication.id.toValue() },
          data,
        });
        return right(Result.ok<void>());
      } else {
        const data = JobApplicationMap.toPersistence(jobApplication);
        await this.prisma.jobApplication.create({ data });
        return right(Result.ok<void>());
      }
    } catch (err) {
      return left(AppError.UnexpectedError.create(err));
    }
  }
}
