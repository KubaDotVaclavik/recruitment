import { Either, right } from "fp-ts/lib/Either";
import { Entity } from "../../../core/domain/Entity";
import { EntityId } from "../../../core/domain/EntityId";
import { Result } from "../../../core/utils/Result";
import { SingleConnection } from "app/common/domain/SingleConnection";

export interface JobApplicationProps {
  candidate: SingleConnection;
  jobAd: SingleConnection;
}

export class JobApplication extends Entity<JobApplicationProps> {
  public delete() {
    this._deleted = true;
    return right(Result.ok());
  }

  get candidate() {
    return this.getProp("candidate");
  }

  get jobAd() {
    return this.getProp("jobAd");
  }

  public static create(
    props: JobApplicationProps,
    id?: EntityId
  ): Either<never, Result<JobApplication>> {
    const jobApplication = new JobApplication(props, id);
    return right(Result.ok<JobApplication>(jobApplication));
  }
}
