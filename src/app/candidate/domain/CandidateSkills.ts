import { Either, left, right } from "fp-ts/lib/Either";
import { Result } from "../../../core/utils/Result";
import { ValueObject } from "../../../core/domain/ValueObject";
import { CandidateSkillsErrors } from "./CandidateSkillsErrors";

interface CandidateSkillsProps {
  skills: string[];
}

export class CandidateSkills extends ValueObject<CandidateSkillsProps> {
  public static minCount: number = 3;
  public static maxCount: number = 10;
  public static minLength: number = 2;
  public static maxLength: number = 20;
  public static separator = ";";

  get value(): string[] {
    return this.props.skills;
  }

  private constructor(props: CandidateSkillsProps) {
    super(props);
  }

  public static create(
    props: CandidateSkillsProps
  ): Either<
    | CandidateSkillsErrors.ListError
    | CandidateSkillsErrors.MinimalCountError
    | CandidateSkillsErrors.MaximalCountError
    | CandidateSkillsErrors.NonStringError
    | CandidateSkillsErrors.InvalidCharterError
    | CandidateSkillsErrors.TooShortError
    | CandidateSkillsErrors.TooLongError,
    Result<CandidateSkills>
  > {
    if (!Array.isArray(props.skills)) {
      return left(CandidateSkillsErrors.ListError.create());
    }

    // Filter out duplications
    const skillsList = props.skills.filter(
      (item, idx, array) => array.indexOf(item) === idx
    );

    if (skillsList.length < CandidateSkills.minCount) {
      return left(
        CandidateSkillsErrors.MinimalCountError.create(CandidateSkills.minCount)
      );
    }

    if (skillsList.length > CandidateSkills.maxCount) {
      return left(
        CandidateSkillsErrors.MaximalCountError.create(CandidateSkills.maxCount)
      );
    }

    for (const skill of skillsList) {
      if (typeof skill !== "string") {
        return left(CandidateSkillsErrors.NonStringError.create());
      }

      if (skill.indexOf(CandidateSkills.separator) > -1) {
        return left(
          CandidateSkillsErrors.InvalidCharterError.create(
            CandidateSkills.separator
          )
        );
      }

      if (skill.length < CandidateSkills.minLength) {
        return left(
          CandidateSkillsErrors.TooShortError.create(
            skill,
            CandidateSkills.minLength
          )
        );
      }

      if (skill.length > CandidateSkills.maxLength) {
        return left(
          CandidateSkillsErrors.TooLongError.create(
            skill,
            CandidateSkills.maxLength
          )
        );
      }
    }

    return right(Result.ok<CandidateSkills>(new CandidateSkills(props)));
  }
}
