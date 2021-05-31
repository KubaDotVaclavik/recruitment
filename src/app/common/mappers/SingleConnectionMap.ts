import { SingleConnection } from "../domain/SingleConnection";
import { EntityId } from "../../../core/domain/EntityId";
import { Either, isLeft, left } from "fp-ts/lib/Either";
import { AppError } from "../../../core/utils/AppError";
import { Result } from "../../../core/utils/Result";

export interface IRawSingleConnection {
  id: string;
}

export class SingleConnectionMap {
  public static toDomain(
    raw: IRawSingleConnection
  ): Either<AppError.DomainConsistencyError, Result<SingleConnection>> {
    const { id } = raw;
    const singleConnectionOrError = SingleConnection.create(new EntityId(id));

    if (isLeft(singleConnectionOrError)) {
      return left(
        AppError.DomainConsistencyError.create(singleConnectionOrError.left)
      );
    }
    return singleConnectionOrError;
  }

  public static toDTO(entity: SingleConnection) {
    return entity.id.toValue();
  }

  public static toPersistence(entity: SingleConnection) {
    return { connect: { id: entity.id.toValue() } };
  }
}
