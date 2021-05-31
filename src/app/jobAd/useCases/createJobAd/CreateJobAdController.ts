import { CreateJobAdUseCase } from "./CreateJobAdUseCase";
import { CreateJobAdRequestDTO } from "./CreateJobAdRequestDTO";
import { Response, Request } from "express";
import { isLeft } from "fp-ts/lib/Either";
import { Controller } from "../../../../core/utils/Controller";
import { JobAdTitleErrors } from "../../domain/JobAdTitleErrors";
import { JobAdSalaryErrors } from "../../domain/JobAdSalaryErrors";

export class CreateJobAdController extends Controller {
  private useCase: CreateJobAdUseCase;

  constructor(useCase: CreateJobAdUseCase) {
    super();
    this.useCase = useCase;
  }

  async execute(req: Request, res: Response): Promise<any> {
    const dto: CreateJobAdRequestDTO = {
      title: req.body.title,
      text: req.body.text,
      salary: req.body.salary,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (isLeft(result)) {
        const error = result.left;

        // TODO předělat na abstract class DomainError => 400 status
        switch (error.constructor) {
          case JobAdTitleErrors.RequiredError:
          case JobAdTitleErrors.NonStringError:
          case JobAdTitleErrors.TooShortError:
          case JobAdTitleErrors.TooLongError:
          case JobAdSalaryErrors.NonNumberError:
          case JobAdSalaryErrors.MinimumError:
          case JobAdSalaryErrors.MaximumError:
            return this.clientError(res, error.value);
          default:
            return this.fail(res, error.value);
        }
      } else {
        return this.ok(res);
      }
    } catch (err) {
      return this.fail(res, err);
    }
  }
}
