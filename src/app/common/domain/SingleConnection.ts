import { Either, right } from "fp-ts/lib/Either";
import { Entity } from "../../../core/domain/Entity";
import { EntityId } from "../../../core/domain/EntityId";
import { Result } from "../../../core/utils/Result";

export class SingleConnection extends Entity<{}> {
  public static create(id: EntityId): Either<never, Result<SingleConnection>> {
    return right(Result.ok(new SingleConnection({}, id)));
  }
}
