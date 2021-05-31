import { AppError } from "../../../../core/utils/AppError";
import { Controller } from "../../../../core/utils/Controller";
import { GetJobApplicationsRequestDTO } from "./GetJobApplicationsRequestDTO";
import { GetJobApplicationsResponseDTO } from "./GetJobApplicationsResponseDTO";
import { GetJobApplicationsUseCase } from "./GetJobApplicationsUseCase";
import { isLeft } from "fp-ts/lib/Either";
import { Response, Request } from "express";

export class GetJobApplicationsController extends Controller {
  private useCase: GetJobApplicationsUseCase;

  constructor(useCase: GetJobApplicationsUseCase) {
    super();
    this.useCase = useCase;
  }

  async execute(req: Request, res: Response): Promise<any> {
    const { offset, limit } = req.query;

    const dto: GetJobApplicationsRequestDTO = {
      offset: Number(offset) || 0,
      limit: Number(limit) || 5,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (isLeft(result)) {
        const error = result.left;

        switch (error.constructor) {
          case AppError.UnexpectedError:
          case AppError.DomainConsistencyError:
          default:
            return this.fail(res, error.value);
        }
      } else {
        return this.ok<GetJobApplicationsResponseDTO>(res, result.right);
      }
    } catch (err) {
      return this.fail(res, err);
    }
  }
}
