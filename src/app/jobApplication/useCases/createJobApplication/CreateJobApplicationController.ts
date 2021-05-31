import { CreateJobApplicationUseCase } from "./CreateJobApplicationUseCase";
import { CreateJobApplicationRequestDTO } from "./CreateJobApplicationRequestDTO";
import { Response, Request } from "express";
import { isLeft } from "fp-ts/lib/Either";
import { Controller } from "../../../../core/utils/Controller";
import { JobAdRepositoryErrors } from "../../../jobAd/repositories/JobAdRepositoryErrors";
import { CandidateRepositoryErrors } from "../../../candidate/repositories/CandidateRepositoryErrors";
import { CreateJobApplicationErrors } from "./CreateJobApplicationErrors";

export class CreateJobApplicationController extends Controller {
  private useCase: CreateJobApplicationUseCase;

  constructor(useCase: CreateJobApplicationUseCase) {
    super();
    this.useCase = useCase;
  }

  async execute(req: Request, res: Response): Promise<any> {
    const { jobAdId, candidateId } = req.body;

    if (!jobAdId) {
      return this.clientError(res, `Attribute "jobAdId" is required`);
    }
    if (!candidateId) {
      return this.clientError(res, `Attribute "candidateId" is required`);
    }

    const dto: CreateJobApplicationRequestDTO = {
      jobAdId,
      candidateId,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (isLeft(result)) {
        const error = result.left;

        switch (error.constructor) {
          case JobAdRepositoryErrors.JobAdNotFoundError:
          case CandidateRepositoryErrors.CandidateNotFoundError:
            return this.notFound(res, error.value);
          case CreateJobApplicationErrors.JobApplicationExistsError:
            return this.clientError(res, error.value);
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
