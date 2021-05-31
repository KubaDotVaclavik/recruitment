import { EntityId } from "./EntityId";

const isEntity = (v: any): v is Entity<any> => {
  return v instanceof Entity;
};

export abstract class Entity<T> {
  protected readonly _id: EntityId;
  protected readonly initial: T;
  protected readonly changed: Partial<T>;

  protected readonly _exists: boolean;
  protected _deleted: boolean;
  //   protected _disconnected: boolean

  constructor(props: T, id?: EntityId) {
    const exists = id !== undefined;

    this._id = id ? id : new EntityId();
    this.initial = props;
    this.changed = exists ? {} : props;
    this._exists = exists;
    this._deleted = false;
    // this._disconnected = false
  }

  protected setProp<K extends keyof T>(field: K, value: T[K]): void {
    this.changed[field] = value;
  }

  // public delete() {
  //   this._deleted = true;
  // }

  // public resetDelete() {
  //   this._deleted = false;
  // }

  public isDeleted() {
    return this._deleted;
  }

  public exists() {
    return this._exists;
  }

  public getProp<K extends keyof T>(field: K): T[K] {
    if (this.changed[field] === undefined) {
      return this.initial[field];
    } else {
      return this.changed[field] as T[K];
    }
  }

  public getChangedProp<K extends keyof T>(field: K): T[K] | undefined {
    return this.changed[field];
  }

  get id() {
    return this._id;
  }

  public equals(object?: Entity<T>): boolean {
    if (object == null || object == undefined) {
      return false;
    }

    if (this === object) {
      return true;
    }

    if (!isEntity(object)) {
      return false;
    }

    return this._id.equals(object._id);
  }
}
