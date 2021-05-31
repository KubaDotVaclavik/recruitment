import { AppError } from "../../../../core/utils/AppError";
import { Controller } from "../../../../core/utils/Controller";
import { GetCandidatesRequestDTO } from "./GetCandidatesRequestDTO";
import { GetCandidatesResponseDTO } from "./GetCandidatesResponseDTO";
import { GetCandidatesUseCase } from "./GetCandidatesUseCase";
import { isLeft } from "fp-ts/lib/Either";
import { Response, Request } from "express";

export class GetCandidatesController extends Controller {
  private useCase: GetCandidatesUseCase;

  constructor(useCase: GetCandidatesUseCase) {
    super();
    this.useCase = useCase;
  }

  async execute(req: Request, res: Response): Promise<any> {
    const { offset, limit, fullName_contains, skills_contains } = req.query;

    const dto: GetCandidatesRequestDTO = {
      offset: Number(offset) || 0,
      limit: Number(limit) || 5,
      fullName_contains:
        typeof fullName_contains === "string" ? fullName_contains : undefined,
      skills_contains:
        typeof skills_contains === "string" ? skills_contains : undefined,
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
        return this.ok<GetCandidatesResponseDTO>(res, result.right);
      }
    } catch (err) {
      return this.fail(res, err);
    }
  }
}
