import { CandidateErrors } from "./CandidateErrors";
import { CandidateFullName } from "./CandidateFullName";
import { CandidateSalary } from "./CandidateSalary";
import { CandidateSkills } from "./CandidateSkills";
import { Either, left, right } from "fp-ts/lib/Either";
import { Entity } from "../../../core/domain/Entity";
import { EntityId } from "../../../core/domain/EntityId";
import { Result } from "../../../core/utils/Result";
import isNil from "lodash/isNil";

export interface CandidateProps {
  fullName: CandidateFullName;
  salary?: CandidateSalary | null;
  skills: CandidateSkills;
}

export class Candidate extends Entity<CandidateProps> {
  get fullName() {
    return this.getProp("fullName");
  }
  get salary() {
    return this.getProp("salary");
  }
  get skills() {
    return this.getProp("skills");
  }

  public updateFullName(fullName: CandidateFullName) {
    if (isNil(fullName)) {
      return left(CandidateErrors.FullNameRequiredError.create());
    }
    this.setProp("fullName", fullName);
    return right(Result.ok());
  }

  public updateSkills(skills: CandidateSkills) {
    if (isNil(skills)) {
      return left(CandidateErrors.SkillsRequiredError.create());
    }
    this.setProp("skills", skills);
    return right(Result.ok());
  }

  public updateSalary(salary: CandidateSalary | null) {
    this.setProp("salary", salary);
    return right(Result.ok());
  }

  public delete() {
    this._deleted = true;
    return right(Result.ok());
  }

  public static create(
    props: CandidateProps,
    id?: EntityId
  ): Either<
    CandidateErrors.FullNameRequiredError | CandidateErrors.SkillsRequiredError,
    Result<Candidate>
  > {
    if (isNil(props.fullName)) {
      return left(CandidateErrors.FullNameRequiredError.create());
    }

    if (isNil(props.skills)) {
      return left(CandidateErrors.SkillsRequiredError.create());
    }

    const candidate = new Candidate(props, id);
    return right(Result.ok<Candidate>(candidate));
  }
}
