import { Either, left, right } from "fp-ts/lib/Either";
import { JobAdTitleErrors } from "./JobAdTitleErrors";
import { Result } from "../../../core/utils/Result";
import { ValueObject } from "../../../core/domain/ValueObject";
import isNil from "lodash/isNil";

interface JobAdTitleProps {
  title: string;
}

export class JobAdTitle extends ValueObject<JobAdTitleProps> {
  public static minLength: number = 3;
  public static maxLength: number = 25;

  get value(): string {
    return this.props.title;
  }

  private constructor(props: JobAdTitleProps) {
    super(props);
  }

  public static create(
    props: JobAdTitleProps
  ): Either<
    | JobAdTitleErrors.RequiredError
    | JobAdTitleErrors.NonStringError
    | JobAdTitleErrors.TooShortError
    | JobAdTitleErrors.TooLongError,
    Result<JobAdTitle>
  > {
    if (isNil(props.title)) {
      return left(JobAdTitleErrors.RequiredError.create());
    }

    if (typeof props.title !== "string") {
      return left(JobAdTitleErrors.NonStringError.create());
    }

    if (props.title.length < JobAdTitle.minLength) {
      return left(JobAdTitleErrors.TooShortError.create(JobAdTitle.minLength));
    }

    if (props.title.length > JobAdTitle.maxLength) {
      return left(JobAdTitleErrors.TooLongError.create(JobAdTitle.maxLength));
    }

    return right(Result.ok(new JobAdTitle(props)));
  }
}
