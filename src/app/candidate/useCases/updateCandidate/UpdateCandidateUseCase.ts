import { AppError } from "../../../../core/utils/AppError";
import { CandidateErrors } from "../../domain/CandidateErrors";
import { CandidateFullName } from "../../domain/CandidateFullName";
import { CandidateFullNameErrors } from "../../domain/CandidateFullNameErrors";
import { CandidateRepository } from "../../repositories/CandidateRepository";
import { CandidateRepositoryErrors } from "../../repositories/CandidateRepositoryErrors";
import { CandidateSalary } from "../../domain/CandidateSalary";
import { CandidateSalaryErrors } from "../../domain/CandidateSalaryErrors";
import { CandidateSkills } from "../../domain/CandidateSkills";
import { CandidateSkillsErrors } from "../../domain/CandidateSkillsErrors";
import { Either, left, right, isLeft } from "fp-ts/lib/Either";
import { Result } from "../../../../core/utils/Result";
import { UpdateCandidateErrors } from "./UpdateCandidateErrors";
import { UpdateCandidateRequestDTO } from "./UpdateCandidateRequestDTO";
import { UseCase } from "../../../../core/utils/UseCase";
import { Candidate } from "app/candidate/domain/Candidate";

type Response = Either<
  | CandidateRepositoryErrors.CandidateNotFoundError
  | UpdateCandidateErrors.FullNameTakenError
  | CandidateErrors.FullNameRequiredError
  | CandidateFullNameErrors.RequiredError
  | CandidateFullNameErrors.NonStringError
  | CandidateFullNameErrors.TooShortError
  | CandidateFullNameErrors.TooLongError
  | CandidateSalaryErrors.NonNumberError
  | CandidateSalaryErrors.MinimumError
  | CandidateSalaryErrors.MaximumError
  | CandidateErrors.SkillsRequiredError
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

export class UpdateCandidateUseCase
  implements UseCase<UpdateCandidateRequestDTO, Promise<Response>>
{
  private candidateRepository: CandidateRepository;

  constructor(candidateRepository: CandidateRepository) {
    this.candidateRepository = candidateRepository;
  }

  private async updateFullName(
    candidate: Candidate,
    request: UpdateCandidateRequestDTO
  ) {
    if (request.fullName) {
      const fullNameOrError = CandidateFullName.create({
        fullName: request.fullName,
      });
      if (isLeft(fullNameOrError)) {
        return fullNameOrError;
      }
      const fullName = fullNameOrError.right.value;

      const fullNameAlreadyExists = await this.candidateRepository.exists(
        fullName
      );
      if (fullNameAlreadyExists) {
        return left(
          new UpdateCandidateErrors.FullNameTakenError(fullName.value)
        );
      }

      const updateFullNameOrError = candidate.updateFullName(fullName);
      if (isLeft(updateFullNameOrError)) {
        return updateFullNameOrError;
      }
    }

    return right(Result.ok());
  }

  private updateSkills(
    candidate: Candidate,
    request: UpdateCandidateRequestDTO
  ) {
    if (request.skills) {
      const skillsOrError = CandidateSkills.create({
        skills: request.skills,
      });
      if (isLeft(skillsOrError)) {
        return skillsOrError;
      }

      const updateSkillsOrError = candidate.updateSkills(
        skillsOrError.right.value
      );
      if (isLeft(updateSkillsOrError)) {
        return updateSkillsOrError;
      }
    }

    return right(Result.ok());
  }

  private updateSalary(
    candidate: Candidate,
    request: UpdateCandidateRequestDTO
  ) {
    if (request.salary === null) {
      const updateSalaryOrError = candidate.updateSalary(null);
      if (isLeft(updateSalaryOrError)) {
        return updateSalaryOrError;
      }
    }

    if (request.salary || request.salary === 0) {
      const salaryOrError = CandidateSalary.create({
        salary: request.salary,
      });
      if (isLeft(salaryOrError)) {
        return salaryOrError;
      }
      const updateSalaryOrError = candidate.updateSalary(
        salaryOrError.right.value
      );
      if (isLeft(updateSalaryOrError)) {
        return updateSalaryOrError;
      }
    }

    return right(Result.ok());
  }

  async execute(request: UpdateCandidateRequestDTO): Promise<Response> {
    try {
      const candidateOrError = await this.candidateRepository.getCandidate({
        id: request.id,
      });
      if (isLeft(candidateOrError)) {
        return candidateOrError;
      }
      const candidate = candidateOrError.right.value;

      const updateFullNameOrError = await this.updateFullName(
        candidate,
        request
      );
      if (isLeft(updateFullNameOrError)) {
        return updateFullNameOrError;
      }

      const updateSkillsOrError = this.updateSkills(candidate, request);
      if (isLeft(updateSkillsOrError)) {
        return updateSkillsOrError;
      }

      const updateSalaryOrError = this.updateSalary(candidate, request);
      if (isLeft(updateSalaryOrError)) {
        return updateSalaryOrError;
      }

      return this.candidateRepository.save(candidate);
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
