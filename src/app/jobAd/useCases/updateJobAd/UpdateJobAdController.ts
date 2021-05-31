import { Controller } from "../../../../core/utils/Controller";
import { isLeft } from "fp-ts/lib/Either";
import { JobAdErrors } from "../../domain/JobAdErrors";
import { JobAdRepositoryErrors } from "../../repositories/JobAdRepositoryErrors";
import { JobAdSalaryErrors } from "../../domain/JobAdSalaryErrors";
import { JobAdTitleErrors } from "../../domain/JobAdTitleErrors";
import { Response, Request } from "express";
import { UpdateJobAdRequestDTO } from "./UpdateJobAdRequestDTO";
import { UpdateJobAdUseCase } from "./UpdateJobAdUseCase";
import { JobAdTextErrors } from "../../domain/JobAdTextErrors";

export class UpdateJobAdController extends Controller {
  private useCase: UpdateJobAdUseCase;

  constructor(useCase: UpdateJobAdUseCase) {
    super();
    this.useCase = useCase;
  }

  async execute(req: Request, res: Response): Promise<any> {
    const { id } = req.params;

    const dto: UpdateJobAdRequestDTO = {
      id,
      title: req.body.title,
      text: req.body.text,
      salary: req.body.salary,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (isLeft(result)) {
        const error = result.left;

        switch (error.constructor) {
          case JobAdTitleErrors.RequiredError:
          case JobAdTitleErrors.NonStringError:
          case JobAdTitleErrors.TooShortError:
          case JobAdTitleErrors.TooLongError:
          case JobAdTextErrors.RequiredError:
          case JobAdTextErrors.NonStringError:
          case JobAdTextErrors.TooShortError:
          case JobAdTextErrors.TooLongError:
          case JobAdSalaryErrors.NonNumberError:
          case JobAdSalaryErrors.MinimumError:
          case JobAdSalaryErrors.MaximumError:
          case JobAdErrors.TitleRequiredError:
            return this.clientError(res, error.value);
          case JobAdRepositoryErrors.JobAdNotFoundError:
            return this.notFound(res, error.value);
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
