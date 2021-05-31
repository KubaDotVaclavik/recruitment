import { ValueObject } from "../../../core/domain/ValueObject";
import { Result } from "../../../core/utils/Result";
import { CandidateSalaryErrors } from "./CandidateSalaryErrors";
import { Either, left, right } from "fp-ts/lib/Either";

interface CandidateSalaryProps {
  salary: number;
}

export class CandidateSalary extends ValueObject<CandidateSalaryProps> {
  public static min: number = 1;
  public static max: number = Infinity;

  get value(): number {
    return this.props.salary;
  }

  private constructor(props: CandidateSalaryProps) {
    super(props);
  }

  public static create(
    props: CandidateSalaryProps
  ): Either<
    | CandidateSalaryErrors.NonNumberError
    | CandidateSalaryErrors.MinimumError
    | CandidateSalaryErrors.MaximumError,
    Result<CandidateSalary>
  > {
    const salary = props.salary;

    if (typeof salary !== "number") {
      return left(CandidateSalaryErrors.NonNumberError.create());
    }

    if (salary < CandidateSalary.min) {
      return left(
        CandidateSalaryErrors.MinimumError.create(CandidateSalary.min)
      );
    }

    if (salary > CandidateSalary.max) {
      return left(
        CandidateSalaryErrors.MaximumError.create(CandidateSalary.max)
      );
    }

    return right(
      Result.ok<CandidateSalary>(
        new CandidateSalary({
          salary,
        })
      )
    );
  }
}
