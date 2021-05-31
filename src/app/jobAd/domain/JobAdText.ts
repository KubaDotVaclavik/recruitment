import { Either, left, right } from "fp-ts/lib/Either";
import { JobAdTextErrors } from "./JobAdTextErrors";
import { Result } from "../../../core/utils/Result";
import { ValueObject } from "../../../core/domain/ValueObject";
import isNil from "lodash/isNil";

interface JobAdTextProps {
  text: string;
}

export class JobAdText extends ValueObject<JobAdTextProps> {
  public static minLength: number = 3;
  public static maxLength: number = 5000;

  get value(): string {
    return this.props.text;
  }

  private constructor(props: JobAdTextProps) {
    super(props);
  }

  public static create(
    props: JobAdTextProps
  ): Either<
    | JobAdTextErrors.RequiredError
    | JobAdTextErrors.NonStringError
    | JobAdTextErrors.TooShortError
    | JobAdTextErrors.TooLongError,
    Result<JobAdText>
  > {
    if (isNil(props.text)) {
      return left(JobAdTextErrors.RequiredError.create());
    }

    if (typeof props.text !== "string") {
      return left(JobAdTextErrors.NonStringError.create());
    }

    if (props.text.length < JobAdText.minLength) {
      return left(JobAdTextErrors.TooShortError.create(JobAdText.minLength));
    }

    if (props.text.length > JobAdText.maxLength) {
      return left(JobAdTextErrors.TooLongError.create(JobAdText.maxLength));
    }

    return right(Result.ok(new JobAdText(props)));
  }
}
