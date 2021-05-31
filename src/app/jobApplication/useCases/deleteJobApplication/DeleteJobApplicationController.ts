import { JobApplicationRepositoryErrors } from "../../repositories/JobApplicationRepositoryErrors";
import { Controller } from "../../../../core/utils/Controller";
import { DeleteJobApplicationRequestDTO } from "./DeleteJobApplicationRequestDTO";
import { DeleteJobApplicationUseCase } from "./DeleteJobApplicationUseCase";
import { isLeft } from "fp-ts/lib/Either";
import { Response, Request } from "express";

export class DeleteJobApplicationController extends Controller {
  private useCase: DeleteJobApplicationUseCase;

  constructor(useCase: DeleteJobApplicationUseCase) {
    super();
    this.useCase = useCase;
  }

  async execute(req: Request, res: Response): Promise<any> {
    const { id } = req.params;

    if (!id) {
      return this.clientError(res, `Parametr "id" is required`);
    }

    const dto: DeleteJobApplicationRequestDTO = { id };

    try {
      const result = await this.useCase.execute(dto);

      if (isLeft(result)) {
        const error = result.left;

        switch (error.constructor) {
          case JobApplicationRepositoryErrors.JobApplicationNotFoundError:
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
