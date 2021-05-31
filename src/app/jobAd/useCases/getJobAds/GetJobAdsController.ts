import { AppError } from "../../../../core/utils/AppError";
import { Controller } from "../../../../core/utils/Controller";
import { GetJobAdsRequestDTO } from "./GetJobAdsRequestDTO";
import { GetJobAdsResponseDTO } from "./GetJobAdsResponseDTO";
import { GetJobAdsUseCase } from "./GetJobAdsUseCase";
import { isLeft } from "fp-ts/lib/Either";
import { Response, Request } from "express";

export class GetJobAdsController extends Controller {
  private useCase: GetJobAdsUseCase;

  constructor(useCase: GetJobAdsUseCase) {
    super();
    this.useCase = useCase;
  }

  async execute(req: Request, res: Response): Promise<any> {
    const { offset, limit, title_contains, text_contains } = req.query;

    const dto: GetJobAdsRequestDTO = {
      offset: Number(offset) || 0,
      limit: Number(limit) || 5,
      title_contains:
        typeof title_contains === "string" ? title_contains : undefined,
      text_contains:
        typeof text_contains === "string" ? text_contains : undefined,
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
        return this.ok<GetJobAdsResponseDTO>(res, result.right);
      }
    } catch (err) {
      return this.fail(res, err);
    }
  }
}
