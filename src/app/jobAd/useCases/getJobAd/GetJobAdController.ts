import { AppError } from "../../../../core/utils/AppError";
import { Controller } from "../../../../core/utils/Controller";
import { JobAdRepositoryErrors } from "../../repositories/JobAdRepositoryErrors";
import { GetJobAdRequestDTO } from "./GetJobAdRequestDTO";
import { GetJobAdResponseDTO } from "./GetJobAdResponseDTO";
import { GetJobAdUseCase } from "./GetJobAdUseCase";
import { isLeft } from "fp-ts/lib/Either";
import { Response, Request } from "express";

export class GetJobAdController extends Controller {
  private useCase: GetJobAdUseCase;

  constructor(useCase: GetJobAdUseCase) {
    super();
    this.useCase = useCase;
  }

  async execute(req: Request, res: Response): Promise<any> {
    const { id } = req.params;

    const dto: GetJobAdRequestDTO = {
      id: String(id),
    };

    try {
      const result = await this.useCase.execute(dto);

      if (isLeft(result)) {
        const error = result.left;

        switch (error.constructor) {
          case JobAdRepositoryErrors.JobAdNotFoundError:
            return this.notFound(res, error.value);
          case AppError.UnexpectedError:
          case AppError.DomainConsistencyError:
          default:
            return this.fail(res, error.value);
        }
      } else {
        const jobAdDTO = result.right;
        return this.ok<GetJobAdResponseDTO>(res, jobAdDTO);
      }
    } catch (err) {
      return this.fail(res, err);
    }
  }
}
