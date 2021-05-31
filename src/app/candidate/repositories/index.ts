import { prisma } from "../../../core/infrastructure/prisma";
import { CandidateRepository } from "./CandidateRepository";

const candidateRepository = new CandidateRepository(prisma);

export { candidateRepository };
