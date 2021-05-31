import { CandidateRepositoryErrors } from "../../repositories/CandidateRepositoryErrors";
import { Controller } from "../../../../core/utils/Controller";
import { DeleteCandidateRequestDTO } from "./DeleteCandidateRequestDTO";
import { DeleteCandidateUseCase } from "./DeleteCandidateUseCase";
import { isLeft } from "fp-ts/lib/Either";
import { Response, Request } from "express";

export class DeleteCandidateController extends Controller {
  private useCase: DeleteCandidateUseCase;

  constructor(useCase: DeleteCandidateUseCase) {
    super();
    this.useCase = useCase;
  }

  async execute(req: Request, res: Response): Promise<any> {
    const { id } = req.params;

    const dto: DeleteCandidateRequestDTO = { id };

    try {
      const result = await this.useCase.execute(dto);

      if (isLeft(result)) {
        const error = result.left;

        switch (error.constructor) {
          case CandidateRepositoryErrors.CandidateNotFoundError:
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
