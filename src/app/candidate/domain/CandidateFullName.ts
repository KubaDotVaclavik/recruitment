import { ValueObject } from "../../../core/domain/ValueObject";
import { Result } from "../../../core/utils/Result";
import isNil from "lodash/isNil";
import { Either, left, right } from "fp-ts/lib/Either";
import { CandidateFullNameErrors } from "./CandidateFullNameErrors";

interface CandidateFullNameProps {
  fullName: string;
}

export class CandidateFullName extends ValueObject<CandidateFullNameProps> {
  public static minLength: number = 3;
  public static maxLength: number = 25;

  get value(): string {
    return this.props.fullName;
  }

  private constructor(props: CandidateFullNameProps) {
    super(props);
  }

  public static create(
    props: CandidateFullNameProps
  ): Either<
    | CandidateFullNameErrors.RequiredError
    | CandidateFullNameErrors.NonStringError
    | CandidateFullNameErrors.TooShortError
    | CandidateFullNameErrors.TooLongError,
    Result<CandidateFullName>
  > {
    if (isNil(props.fullName)) {
      return left(CandidateFullNameErrors.RequiredError.create());
    }

    if (typeof props.fullName !== "string") {
      return left(CandidateFullNameErrors.NonStringError.create());
    }

    if (props.fullName.length < CandidateFullName.minLength) {
      return left(
        CandidateFullNameErrors.TooShortError.create(
          CandidateFullName.minLength
        )
      );
    }

    if (props.fullName.length > CandidateFullName.maxLength) {
      return left(
        CandidateFullNameErrors.TooLongError.create(CandidateFullName.maxLength)
      );
    }

    return right(Result.ok(new CandidateFullName(props)));
  }
}
