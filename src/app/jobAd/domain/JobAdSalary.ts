import { ValueObject } from "../../../core/domain/ValueObject";
import { Result } from "../../../core/utils/Result";
import { JobAdSalaryErrors } from "./JobAdSalaryErrors";
import { Either, left, right } from "fp-ts/lib/Either";

interface JobAdSalaryProps {
  salary: number;
}

export class JobAdSalary extends ValueObject<JobAdSalaryProps> {
  public static min: number = 1;
  public static max: number = Infinity;

  get value(): number {
    return this.props.salary;
  }

  private constructor(props: JobAdSalaryProps) {
    super(props);
  }

  public static create(
    props: JobAdSalaryProps
  ): Either<
    | JobAdSalaryErrors.NonNumberError
    | JobAdSalaryErrors.MinimumError
    | JobAdSalaryErrors.MaximumError,
    Result<JobAdSalary>
  > {
    const salary = props.salary;

    if (typeof salary !== "number") {
      return left(JobAdSalaryErrors.NonNumberError.create());
    }

    if (salary < JobAdSalary.min) {
      return left(JobAdSalaryErrors.MinimumError.create(JobAdSalary.min));
    }

    if (salary > JobAdSalary.max) {
      return left(JobAdSalaryErrors.MaximumError.create(JobAdSalary.max));
    }

    return right(
      Result.ok<JobAdSalary>(
        new JobAdSalary({
          salary,
        })
      )
    );
  }
}
