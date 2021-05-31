import { AppError } from "../../../../core/utils/AppError";
import { JobAd } from "../../domain/JobAd";
import { JobAdTitle } from "../../domain/JobAdTitle";
import { JobAdSalary } from "../../domain/JobAdSalary";
import { CreateJobAdRequestDTO } from "./CreateJobAdRequestDTO";
import { Either, left, right, isLeft } from "fp-ts/lib/Either";
import { Result } from "../../../../core/utils/Result";
import { JobAdRepository } from "../../repositories/JobAdRepository";
import { UseCase } from "../../../../core/utils/UseCase";
import { JobAdTitleErrors } from "../../domain/JobAdTitleErrors";
import { JobAdSalaryErrors } from "../../domain/JobAdSalaryErrors";
import { JobAdText } from "../../domain/JobAdText";

type Response = Either<
  | JobAdTitleErrors.RequiredError
  | JobAdTitleErrors.NonStringError
  | JobAdTitleErrors.TooShortError
  | JobAdTitleErrors.TooLongError
  | JobAdSalaryErrors.NonNumberError
  | JobAdSalaryErrors.MinimumError
  | JobAdSalaryErrors.MaximumError
  | AppError.UnexpectedError
  | Result<any>,
  Result<void>
>;

export class CreateJobAdUseCase
  implements UseCase<CreateJobAdRequestDTO, Promise<Response>>
{
  private jobAdRepository: JobAdRepository;

  constructor(jobAdRepository: JobAdRepository) {
    this.jobAdRepository = jobAdRepository;
  }

  async execute(request: CreateJobAdRequestDTO): Promise<Response> {
    const titleOrError = JobAdTitle.create({
      title: request.title,
    });
    if (isLeft(titleOrError)) {
      return titleOrError;
    }

    const textOrError = JobAdText.create({
      text: request.text,
    });
    if (isLeft(textOrError)) {
      return textOrError;
    }

    let salary: JobAdSalary | undefined;
    if (request.salary !== undefined) {
      const salaryOrError = JobAdSalary.create({ salary: request.salary });
      if (salaryOrError && isLeft(salaryOrError)) {
        return salaryOrError;
      }
      salary = salaryOrError.right.value;
    }

    const title = titleOrError.right.value;
    const text = textOrError.right.value;

    try {
      const jobAdOrError = JobAd.create({
        title,
        text,
        salary,
      });

      if (isLeft(jobAdOrError)) {
        return jobAdOrError;
      }

      const jobAd = jobAdOrError.right.value;

      return this.jobAdRepository.save(jobAd);
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
