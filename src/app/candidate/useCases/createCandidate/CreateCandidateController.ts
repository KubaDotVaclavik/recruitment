import { CreateCandidateUseCase } from "./CreateCandidateUseCase";
import { CreateCandidateRequestDTO } from "./CreateCandidateRequestDTO";
import { CreateCandidateErrors } from "./CreateCandidateErrors";
import { Response, Request } from "express";
import { isLeft } from "fp-ts/lib/Either";
import { Controller } from "../../../../core/utils/Controller";
import { CandidateFullNameErrors } from "../../domain/CandidateFullNameErrors";
import { CandidateSalaryErrors } from "../../domain/CandidateSalaryErrors";
import { CandidateSkillsErrors } from "../../domain/CandidateSkillsErrors";

export class CreateCandidateController extends Controller {
  private useCase: CreateCandidateUseCase;

  constructor(useCase: CreateCandidateUseCase) {
    super();
    this.useCase = useCase;
  }

  async execute(req: Request, res: Response): Promise<any> {
    const dto: CreateCandidateRequestDTO = {
      fullName: req.body.fullName,
      skills: req.body.skills,
      salary: req.body.salary,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (isLeft(result)) {
        const error = result.left;

        // TODO předělat na abstract class DomainError => 400 status
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
            return this.clientError(res, error.value);
          case CreateCandidateErrors.FullNameTakenError:
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
