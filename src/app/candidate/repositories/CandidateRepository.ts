import { AppError } from "../../../core/utils/AppError";
import { Candidate } from "../domain/Candidate";
import { CandidateFullName } from "../domain/CandidateFullName";
import { CandidateMap } from "../mappers/CandidateMap";
import { CandidateRepositoryErrors } from "./CandidateRepositoryErrors";
import { Either, right, left } from "fp-ts/lib/Either";
import { lefts, rights } from "fp-ts/Array";
import { PrismaClient } from "@prisma/client";
import { Result } from "../../../core/utils/Result";

interface ICandidatesWhere {
  skills_contains?: string;
  fullName_contains?: string;
}

export class CandidateRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  private static buildCandidatesWhere(where?: ICandidatesWhere) {
    const fullName_contains: string | undefined = where?.fullName_contains;
    const skills_contains: string | undefined = where?.skills_contains;
    return {
      ...(fullName_contains && {
        fullName: { contains: fullName_contains },
      }),
      ...(skills_contains && {
        skills: { contains: skills_contains },
      }),
    };
  }

  public async getCandidates(props?: {
    offset?: number;
    limit?: number;
    where?: ICandidatesWhere;
  }): Promise<Either<AppError.DomainConsistencyError, Result<Candidate>[]>> {
    const offset: number = props?.offset || 0;
    const limit: number = Math.max(props?.limit || 5, 50);
    const where = CandidateRepository.buildCandidatesWhere(props?.where);

    const rawCandidates = await this.prisma.candidate.findMany({
      skip: offset,
      take: limit,
      where,
    });

    const candidatesOrErrors = rawCandidates.map(CandidateMap.toDomain);

    const errors = lefts(candidatesOrErrors);
    if (errors.length > 0) {
      return left(errors[0]);
    }

    const candidates = rights(candidatesOrErrors);
    return right(candidates);
  }

  public async getCandidate(
    props: { id: string } | { fullName: string }
  ): Promise<
    Either<
      | CandidateRepositoryErrors.CandidateNotFoundError
      | AppError.DomainConsistencyError,
      Result<Candidate>
    >
  > {
    const where =
      "id" in props ? { id: props.id } : { fullName: props.fullName };
    const rawCandidate = await this.prisma.candidate.findUnique({ where });

    if (rawCandidate === null) {
      return left(new CandidateRepositoryErrors.CandidateNotFoundError());
    }
    return CandidateMap.toDomain(rawCandidate);
  }

  public async getCandidatesCount(where?: ICandidatesWhere) {
    return this.prisma.candidate.count({
      where: CandidateRepository.buildCandidatesWhere(where),
    });
  }

  public async exists(
    candidateOrFullName: Candidate | CandidateFullName
  ): Promise<boolean> {
    if (candidateOrFullName instanceof CandidateFullName) {
      const fullName = candidateOrFullName.value;
      const found = await this.prisma.candidate.findUnique({
        where: { fullName },
      });
      return Boolean(found);
    }

    const candidate = candidateOrFullName;
    if (!candidate.exists()) {
      return false;
    }
    const id = candidate.id.toValue();
    const found = await this.prisma.candidate.findUnique({ where: { id } });
    return Boolean(found);
  }

  public async save(
    candidate: Candidate
  ): Promise<Either<AppError.UnexpectedError, Result<void>>> {
    try {
      const exists = await this.exists(candidate);

      if (exists && candidate.isDeleted()) {
        await this.prisma.candidate.delete({
          where: { id: candidate.id.toValue() },
        });
        return right(Result.ok<void>());
      }

      if (exists) {
        const data = CandidateMap.toPersistence(candidate);
        await this.prisma.candidate.update({
          where: { id: candidate.id.toValue() },
          data,
        });
      } else {
        const data = CandidateMap.toPersistence(candidate);
        await this.prisma.candidate.create({ data });
      }
      return right(Result.ok<void>());
    } catch (err) {
      return left(AppError.UnexpectedError.create(err));
    }
  }
}
