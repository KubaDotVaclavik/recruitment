import { AppError } from "../../../../core/utils/AppError";
import { CandidateRepositoryErrors } from "../../../candidate/repositories/CandidateRepositoryErrors";
import { Controller } from "../../../../core/utils/Controller";
import { GetJobApplicationRequestDTO } from "./GetJobApplicationRequestDTO";
import { GetJobApplicationResponseDTO } from "./GetJobApplicationResponseDTO";
import { GetJobApplicationUseCase } from "./GetJobApplicationUseCase";
import { isLeft } from "fp-ts/lib/Either";
import { JobAdRepositoryErrors } from "../../../jobAd/repositories/JobAdRepositoryErrors";
import { JobApplicationRepositoryErrors } from "../../repositories/JobApplicationRepositoryErrors";
import { Response, Request } from "express";

export class GetJobApplicationController extends Controller {
  private useCase: GetJobApplicationUseCase;

  constructor(useCase: GetJobApplicationUseCase) {
    super();
    this.useCase = useCase;
  }

  async execute(req: Request, res: Response): Promise<any> {
    const { id } = req.params;

    const dto: GetJobApplicationRequestDTO = {
      id: String(id),
    };

    try {
      const result = await this.useCase.execute(dto);

      if (isLeft(result)) {
        const error = result.left;

        switch (error.constructor) {
          case JobAdRepositoryErrors.JobAdNotFoundError:
          case CandidateRepositoryErrors.CandidateNotFoundError:
          case JobApplicationRepositoryErrors.JobApplicationNotFoundError:
            return this.notFound(res, error.value);
          case AppError.UnexpectedError:
          case AppError.DomainConsistencyError:
          default:
            return this.fail(res, error.value);
        }
      } else {
        const jobApplicationDTO = result.right;
        return this.ok<GetJobApplicationResponseDTO>(res, jobApplicationDTO);
      }
    } catch (err) {
      return this.fail(res, err);
    }
  }
}
