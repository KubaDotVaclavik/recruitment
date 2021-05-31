import { prisma } from "../../../core/infrastructure/prisma";
import { JobApplicationRepository } from "./JobApplicationRepository";

const jobApplicationRepository = new JobApplicationRepository(prisma);

export { jobApplicationRepository };
