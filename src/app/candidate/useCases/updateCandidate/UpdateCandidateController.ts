import { CandidateErrors } from "../../domain/CandidateErrors";
import { CandidateFullNameErrors } from "../../domain/CandidateFullNameErrors";
import { CandidateRepositoryErrors } from "../../repositories/CandidateRepositoryErrors";
import { CandidateSalaryErrors } from "../../domain/CandidateSalaryErrors";
import { CandidateSkillsErrors } from "../../domain/CandidateSkillsErrors";
import { Controller } from "../../../../core/utils/Controller";
import { isLeft } from "fp-ts/lib/Either";
import { Response, Request } from "express";
import { UpdateCandidateErrors } from "./UpdateCandidateErrors";
import { UpdateCandidateRequestDTO } from "./UpdateCandidateRequestDTO";
import { UpdateCandidateUseCase } from "./UpdateCandidateUseCase";

export class UpdateCandidateController extends Controller {
  private useCase: UpdateCandidateUseCase;

  constructor(useCase: UpdateCandidateUseCase) {
    super();
    this.useCase = useCase;
  }

  async execute(req: Request, res: Response): Promise<any> {
    const { id } = req.params;

    const dto: UpdateCandidateRequestDTO = {
      id,
      fullName: req.body.fullName,
      skills: req.body.skills,
      salary: req.body.salary,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (isLeft(result)) {
        const error = result.left;

        switch (error.constructor) {
          case CandidateFullNameErrors.RequiredError:
          case CandidateFullNameErrors.NonStringError:
          case CandidateFullNameErrors.TooShortError:
          case CandidateFullNameErrors.TooLongError:
          case CandidateSalaryErrors.NonNumberError:
          case CandidateSalaryErrors.MinimumError:
          case CandidateSalaryErrors.MaximumError:
          case CandidateSkillsErrors.ListError:
          case CandidateSkillsErrors.MaximalCountError:
          case CandidateSkillsErrors.MinimalCountError:
          case CandidateSkillsErrors.NonStringError:
          case CandidateSkillsErrors.InvalidCharterError:
          case CandidateSkillsErrors.TooLongError:
          case CandidateSkillsErrors.TooShortError:
          case CandidateErrors.FullNameRequiredError:
          case CandidateErrors.SkillsRequiredError:
            return this.clientError(res, error.value);
          case CandidateRepositoryErrors.CandidateNotFoundError:
            return this.notFound(res, error.value);
          case UpdateCandidateErrors.FullNameTakenError:
            return this.conflict(res, error.value);
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
