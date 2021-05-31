import { AppError } from "../../../core/utils/AppError";
import { Candidate } from "../domain/Candidate";
import { Candidate as ICandidate } from "@prisma/client";
import { CandidateFullName } from "../domain/CandidateFullName";
import { CandidateSalary } from "../domain/CandidateSalary";
import { CandidateSkillsMap } from "./CandidateSkillsMap";
import { EntityId } from "../../../core/domain/EntityId";
import { Either, either, isLeft, left } from "fp-ts/lib/Either";
import { sequenceT } from "fp-ts/lib/Apply";
import { Result } from "../../../core/utils/Result";

export interface IRawCandidate extends ICandidate {}

export class CandidateMap {
  public static toDomain(
    raw: IRawCandidate
  ): Either<AppError.DomainConsistencyError, Result<Candidate>> {
    const skillsOrError = CandidateSkillsMap.toDomain(raw.skills);
    const fullNameOrError = CandidateFullName.create({
      fullName: raw.fullName,
    });
    const salaryOrError = raw.salary
      ? CandidateSalary.create({ salary: raw.salary })
      : undefined;

    if (isLeft(skillsOrError)) {
      return left(AppError.DomainConsistencyError.create(skillsOrError.left));
    }
    if (isLeft(fullNameOrError)) {
      return left(AppError.DomainConsistencyError.create(fullNameOrError.left));
    }
    if (salaryOrError && isLeft(salaryOrError)) {
      return left(AppError.DomainConsistencyError.create(salaryOrError.left));
    }

    const candidateOrError = Candidate.create(
      {
        fullName: fullNameOrError.right.value,
        skills: skillsOrError.right.value,
        salary: salaryOrError && salaryOrError.right.value,
      },
      new EntityId(raw.id)
    );

    if (isLeft(candidateOrError)) {
      return left(
        AppError.DomainConsistencyError.create(candidateOrError.left)
      );
    }
    return candidateOrError;
  }

  public static toDTO(candidate: Candidate) {
    return {
      id: candidate.id.toValue(),
      fullName: candidate.fullName.value,
      skills: CandidateSkillsMap.toDTO(candidate.skills),
      salary: candidate.salary?.value || null,
    };
  }

  public static toPersistence(candidate: Candidate) {
    return {
      fullName: candidate.fullName.value,
      skills: CandidateSkillsMap.toPersistence(candidate.skills),
      salary: candidate.salary === null ? null : candidate.salary?.value,
    };
  }
}
