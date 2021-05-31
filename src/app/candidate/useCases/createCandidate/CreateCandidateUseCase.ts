import { AppError } from "../../../../core/utils/AppError";
import { Candidate } from "../../domain/Candidate";
import { CandidateFullName } from "../../domain/CandidateFullName";
import { CandidateSalary } from "../../domain/CandidateSalary";
import { CandidateSkills } from "../../domain/CandidateSkills";
import { CreateCandidateRequestDTO } from "./CreateCandidateRequestDTO";
import { CreateCandidateErrors } from "./CreateCandidateErrors";
import { Either, left, right, isLeft } from "fp-ts/lib/Either";
import { Result } from "../../../../core/utils/Result";
import { CandidateRepository } from "../../repositories/CandidateRepository";
import { UseCase } from "../../../../core/utils/UseCase";
import { CandidateFullNameErrors } from "../../domain/CandidateFullNameErrors";
import { CandidateSalaryErrors } from "../../domain/CandidateSalaryErrors";
import { CandidateSkillsErrors } from "../../domain/CandidateSkillsErrors";

type Response = Either<
  | CreateCandidateErrors.FullNameTakenError
  | CandidateFullNameErrors.RequiredError
  | CandidateFullNameErrors.NonStringError
  | CandidateFullNameErrors.TooShortError
  | CandidateFullNameErrors.TooLongError
  | CandidateSalaryErrors.NonNumberError
  | CandidateSalaryErrors.MinimumError
  | CandidateSalaryErrors.MaximumError
  | CandidateSkillsErrors.ListError
  | CandidateSkillsErrors.InvalidCharterError
  | CandidateSkillsErrors.NonStringError
  | CandidateSkillsErrors.MaximalCountError
  | CandidateSkillsErrors.MinimalCountError
  | CandidateSkillsErrors.TooLongError
  | CandidateSkillsErrors.TooShortError
  | AppError.UnexpectedError
  | Result<any>,
  Result<void>
>;

export class CreateCandidateUseCase
  implements UseCase<CreateCandidateRequestDTO, Promise<Response>>
{
  private candidateRepository: CandidateRepository;

  constructor(candidateRepository: CandidateRepository) {
    this.candidateRepository = candidateRepository;
  }

  async execute(request: CreateCandidateRequestDTO): Promise<Response> {
    const fullNameOrError = CandidateFullName.create({
      fullName: request.fullName,
    });
    if (isLeft(fullNameOrError)) {
      return fullNameOrError;
    }

    const skillsOrError = CandidateSkills.create({
      skills: request.skills,
    });
    if (isLeft(skillsOrError)) {
      return skillsOrError;
    }

    let salary: CandidateSalary | undefined;
    if (request.salary !== undefined) {
      const salaryOrError = CandidateSalary.create({ salary: request.salary });
      if (salaryOrError && isLeft(salaryOrError)) {
        return salaryOrError;
      }
      salary = salaryOrError.right.value;
    }

    const fullName = fullNameOrError.right.value;
    const skills = skillsOrError.right.value;

    try {
      const candidateAlreadyExists = await this.candidateRepository.exists(
        fullName
      );

      if (candidateAlreadyExists) {
        return left(
          new CreateCandidateErrors.FullNameTakenError(fullName.value)
        );
      }

      const candidateOrError = Candidate.create({
        fullName,
        skills,
        salary,
      });

      if (isLeft(candidateOrError)) {
        return candidateOrError;
      }

      const candidate = candidateOrError.right.value;

      await this.candidateRepository.save(candidate);

      return right(Result.ok<void>());
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
