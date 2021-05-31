import { v4 as uuid } from "uuid";
import isNil from "lodash/isNil";

export class EntityId {
  private value: string;

  constructor(value?: string) {
    this.value = value ? value : uuid();
  }

  public equals(id?: EntityId): boolean {
    if (isNil(id)) {
      return false;
    }
    if (!(id instanceof EntityId)) {
      return false;
    }
    return id.toValue() === this.value;
  }

  public toValue(): string {
    return this.value;
  }
}
