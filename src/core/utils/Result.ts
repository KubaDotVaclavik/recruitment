export class Result<T> {
  private props:
    | { isSuccess: true; isFailure: false; value: T }
    | { isSuccess: false; isFailure: true; error: T };

  protected constructor(isSuccess: boolean, error?: T, value?: T) {
    if (isSuccess && error) {
      throw new Error(
        "InvalidOperation: A result cannot be successful and contain an error"
      );
    }

    if (!isSuccess && !error) {
      throw new Error(
        "InvalidOperation: A failing result needs to contain an error message"
      );
    }

    if (isSuccess) {
      this.props = {
        isSuccess: true,
        isFailure: false,
        value: value!,
      };
    } else {
      this.props = {
        isSuccess: false,
        isFailure: true,
        error: error!,
      };
    }
    Object.freeze(this);
  }

  get value(): T {
    if (!this.props.isSuccess) {
      return this.props.error;
    }
    return this.props.value;
  }

  get isFailure() {
    return this.props.isFailure;
  }

  get isSuccess() {
    return this.props.isSuccess;
  }

  public static ok<U>(value?: U) {
    return new Result<U>(true, undefined, value);
  }

  public static fail<U>(error: U) {
    return new Result<U>(false, error);
  }

  public static combine(
    results: (Result<any> | undefined | null)[]
  ): Result<any> {
    for (let result of results) {
      if (result?.isFailure) return result;
    }
    return Result.ok();
  }
}
