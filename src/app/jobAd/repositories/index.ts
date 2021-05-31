import { prisma } from "../../../core/infrastructure/prisma";
import { JobAdRepository } from "./JobAdRepository";

const jobAdRepository = new JobAdRepository(prisma);

export { jobAdRepository };
