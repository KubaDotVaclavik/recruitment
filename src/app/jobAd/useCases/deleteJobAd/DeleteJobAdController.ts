import { JobAdRepositoryErrors } from "../../repositories/JobAdRepositoryErrors";
import { Controller } from "../../../../core/utils/Controller";
import { DeleteJobAdRequestDTO } from "./DeleteJobAdRequestDTO";
import { DeleteJobAdUseCase } from "./DeleteJobAdUseCase";
import { isLeft } from "fp-ts/lib/Either";
import { Response, Request } from "express";

export class DeleteJobAdController extends Controller {
  private useCase: DeleteJobAdUseCase;

  constructor(useCase: DeleteJobAdUseCase) {
    super();
    this.useCase = useCase;
  }

  async execute(req: Request, res: Response): Promise<any> {
    const { id } = req.params;

    if (!id) {
      return this.clientError(res, `Parametr "id" is required`);
    }

    const dto: DeleteJobAdRequestDTO = { id };

    try {
      const result = await this.useCase.execute(dto);

      if (isLeft(result)) {
        const error = result.left;

        switch (error.constructor) {
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
