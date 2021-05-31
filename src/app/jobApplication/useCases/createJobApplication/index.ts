import { jobApplicationRepository } from "../../repositories";
import { CreateJobApplicationUseCase } from "./CreateJobApplicationUseCase";
import { CreateJobApplicationController } from "./CreateJobApplicationController";
import { jobAdRepository } from "../../../jobAd/repositories";
import { candidateRepository } from "../../../candidate/repositories";

const createJobApplicationUseCase = new CreateJobApplicationUseCase(
  jobApplicationRepository,
  jobAdRepository,
  candidateRepository
);
const createJobApplicationController = new CreateJobApplicationController(
  createJobApplicationUseCase
);

export { createJobApplicationController };
