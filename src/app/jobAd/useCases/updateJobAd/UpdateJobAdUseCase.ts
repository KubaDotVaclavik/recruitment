import { AppError } from "../../../../core/utils/AppError";
import { JobAdErrors } from "../../domain/JobAdErrors";
import { JobAdTitle } from "../../domain/JobAdTitle";
import { JobAdTitleErrors } from "../../domain/JobAdTitleErrors";
import { JobAdTextErrors } from "../../domain/JobAdTextErrors";
import { JobAdRepository } from "../../repositories/JobAdRepository";
import { JobAdRepositoryErrors } from "../../repositories/JobAdRepositoryErrors";
import { JobAdSalary } from "../../domain/JobAdSalary";
import { JobAdSalaryErrors } from "../../domain/JobAdSalaryErrors";
import { Either, left, right, isLeft } from "fp-ts/lib/Either";
import { Result } from "../../../../core/utils/Result";
import { UpdateJobAdRequestDTO } from "./UpdateJobAdRequestDTO";
import { UseCase } from "../../../../core/utils/UseCase";
import { JobAd } from "../../domain/JobAd";
import { JobAdText } from "../../domain/JobAdText";

type Response = Either<
  | JobAdRepositoryErrors.JobAdNotFoundError
  | JobAdErrors.TitleRequiredError
  | JobAdTitleErrors.RequiredError
  | JobAdTitleErrors.NonStringError
  | JobAdTitleErrors.TooShortError
  | JobAdTitleErrors.TooLongError
  | JobAdTextErrors.RequiredError
  | JobAdTextErrors.NonStringError
  | JobAdTextErrors.TooShortError
  | JobAdTextErrors.TooLongError
  | JobAdSalaryErrors.NonNumberError
  | JobAdSalaryErrors.MinimumError
  | JobAdSalaryErrors.MaximumError
  | AppError.UnexpectedError
  | Result<any>,
  Result<void>
>;

export class UpdateJobAdUseCase
  implements UseCase<UpdateJobAdRequestDTO, Promise<Response>>
{
  private jobAdRepository: JobAdRepository;

  constructor(jobAdRepository: JobAdRepository) {
    this.jobAdRepository = jobAdRepository;
  }

  private updateTitle(jobAd: JobAd, request: UpdateJobAdRequestDTO) {
    if (request.title) {
      const titleOrError = JobAdTitle.create({
        title: request.title,
      });
      if (isLeft(titleOrError)) {
        return titleOrError;
      }
      const updateTitleOrError = jobAd.updateTitle(titleOrError.right.value);
      if (isLeft(updateTitleOrError)) {
        return updateTitleOrError;
      }
    }

    return right(Result.ok());
  }

  private updateText(jobAd: JobAd, request: UpdateJobAdRequestDTO) {
    if (request.text) {
      const textOrError = JobAdText.create({
        text: request.text,
      });
      if (isLeft(textOrError)) {
        return textOrError;
      }
      const updateTextOrError = jobAd.updateText(textOrError.right.value);
      if (isLeft(updateTextOrError)) {
        return updateTextOrError;
      }
    }

    return right(Result.ok());
  }

  private updateSalary(jobAd: JobAd, request: UpdateJobAdRequestDTO) {
    if (request.salary === null) {
      const updateSalaryOrError = jobAd.updateSalary(null);
      if (isLeft(updateSalaryOrError)) {
        return updateSalaryOrError;
      }
    }

    if (request.salary || request.salary === 0) {
      const salaryOrError = JobAdSalary.create({
        salary: request.salary,
      });
      if (isLeft(salaryOrError)) {
        return salaryOrError;
      }
      const updateSalaryOrError = jobAd.updateSalary(salaryOrError.right.value);
      if (isLeft(updateSalaryOrError)) {
        return updateSalaryOrError;
      }
    }

    return right(Result.ok());
  }

  async execute(request: UpdateJobAdRequestDTO): Promise<Response> {
    try {
      const jobAdOrError = await this.jobAdRepository.getJobAd({
        id: request.id,
      });
      if (isLeft(jobAdOrError)) {
        return jobAdOrError;
      }
      const jobAd = jobAdOrError.right.value;

      const updateTitleOrError = await this.updateTitle(jobAd, request);
      if (isLeft(updateTitleOrError)) {
        return updateTitleOrError;
      }

      const updateTextOrError = await this.updateText(jobAd, request);
      if (isLeft(updateTextOrError)) {
        return updateTextOrError;
      }

      const updateSalaryOrError = this.updateSalary(jobAd, request);
      if (isLeft(updateSalaryOrError)) {
        return updateSalaryOrError;
      }

      return this.jobAdRepository.save(jobAd);
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
