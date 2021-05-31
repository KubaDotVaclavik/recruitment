import { JobAdErrors } from "./JobAdErrors";
import { JobAdTitle } from "./JobAdTitle";
import { JobAdSalary } from "./JobAdSalary";
import { JobAdText } from "./JobAdText";
import { Either, left, right } from "fp-ts/lib/Either";
import { Entity } from "../../../core/domain/Entity";
import { EntityId } from "../../../core/domain/EntityId";
import { Result } from "../../../core/utils/Result";
import isNil from "lodash/isNil";

export interface JobAdProps {
  title: JobAdTitle;
  salary?: JobAdSalary | null;
  text: JobAdText;
}

export class JobAd extends Entity<JobAdProps> {
  get title() {
    return this.getProp("title");
  }
  get salary() {
    return this.getProp("salary");
  }
  get text() {
    return this.getProp("text");
  }

  public updateTitle(title: JobAdTitle) {
    if (isNil(title)) {
      return left(JobAdErrors.TitleRequiredError.create());
    }
    this.setProp("title", title);
    return right(Result.ok());
  }

  public updateText(text: JobAdText) {
    if (isNil(text)) {
      return left(JobAdErrors.TextRequiredError.create());
    }
    this.setProp("text", text);
    return right(Result.ok());
  }

  public updateSalary(salary: JobAdSalary | null) {
    this.setProp("salary", salary);
    return right(Result.ok());
  }

  public delete() {
    this._deleted = true;
    return right(Result.ok());
  }

  public static create(
    props: JobAdProps,
    id?: EntityId
  ): Either<
    JobAdErrors.TitleRequiredError | JobAdErrors.TextRequiredError,
    Result<JobAd>
  > {
    if (isNil(props.title)) {
      return left(JobAdErrors.TitleRequiredError.create());
    }

    if (isNil(props.text)) {
      return left(JobAdErrors.TextRequiredError.create());
    }

    const jobAd = new JobAd(props, id);
    return right(Result.ok<JobAd>(jobAd));
  }
}
