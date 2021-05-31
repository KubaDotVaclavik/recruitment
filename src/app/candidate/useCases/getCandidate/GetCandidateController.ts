import { AppError } from "../../../../core/utils/AppError";
import { Controller } from "../../../../core/utils/Controller";
import { CandidateRepositoryErrors } from "../../repositories/CandidateRepositoryErrors";
import { GetCandidateRequestDTO } from "./GetCandidateRequestDTO";
import { GetCandidateResponseDTO } from "./GetCandidateResponseDTO";
import { GetCandidateUseCase } from "./GetCandidateUseCase";
import { isLeft } from "fp-ts/lib/Either";
import { Response, Request } from "express";

export class GetCandidateController extends Controller {
  private useCase: GetCandidateUseCase;

  constructor(useCase: GetCandidateUseCase) {
    super();
    this.useCase = useCase;
  }

  async execute(req: Request, res: Response): Promise<any> {
    const { id } = req.params;

    const dto: GetCandidateRequestDTO = {
      id: String(id),
    };

    try {
      const result = await this.useCase.execute(dto);

      if (isLeft(result)) {
        const error = result.left;

        switch (error.constructor) {
          case CandidateRepositoryErrors.CandidateNotFoundError:
            return this.notFound(res, error.value);
          case AppError.UnexpectedError:
          case AppError.DomainConsistencyError:
          default:
            return this.fail(res, error.value);
        }
      } else {
        const candidateDTO = result.right;
        return this.ok<GetCandidateResponseDTO>(res, candidateDTO);
      }
    } catch (err) {
      return this.fail(res, err);
    }
  }
}
