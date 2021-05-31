export class DomainError {
  public readonly message: string;

  private constructor(message: string) {
    this.message = message;
  }

  public toString() {
    return this.message;
  }

  public static create(message: string) {
    return new DomainError(message);
  }
}
