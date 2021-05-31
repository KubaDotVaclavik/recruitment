import { Result } from "../../../core/utils/Result";
import { CandidateSkills } from "../domain/CandidateSkills";
import { Either, isLeft, left } from "fp-ts/lib/Either";
import { AppError } from "../../../core/utils/AppError";

export type TRawCandidateSkills = string;

export class CandidateSkillsMap {
  public static toDomain(
    raw: TRawCandidateSkills
  ): Either<AppError.DomainConsistencyError, Result<CandidateSkills>> {
    const candidateSkillsOrError = CandidateSkills.create({
      skills: raw.split(";"),
    });
    if (isLeft(candidateSkillsOrError)) {
      return left(
        AppError.DomainConsistencyError.create(candidateSkillsOrError.left)
      );
    }
    return candidateSkillsOrError;
  }

  public static toDTO(candidateSkills: CandidateSkills): string[] {
    return candidateSkills.value;
  }

  public static toPersistence(candidateSkills: CandidateSkills): string {
    return candidateSkills.value.join(";");
  }
}
