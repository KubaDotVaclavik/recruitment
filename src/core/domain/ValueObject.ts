import isEqual from "lodash/isEqual";
import isNil from "lodash/isNil";

interface ValueObjectProps {
  [index: string]: any;
}

/**
 * @desc ValueObjects - equality is determined by structrual property
 */

export abstract class ValueObject<T extends ValueObjectProps> {
  public readonly props: T;

  constructor(props: T) {
    this.props = Object.freeze(props);
  }

  abstract get value(): any;

  public equals(vo?: ValueObject<T>): boolean {
    if (isNil(vo)) {
      return false;
    }
    if (vo.props === undefined) {
      return false;
    }
    return isEqual(this.props, vo.props);
  }
}
