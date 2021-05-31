import { jobApplicationRepository } from "../../repositories";
import { GetJobApplicationUseCase } from "./GetJobApplicationUseCase";
import { GetJobApplicationController } from "./GetJobApplicationController";
import { jobAdRepository } from "../../../jobAd/repositories";
import { candidateRepository } from "../../../candidate/repositories";

const getJobApplicationUseCase = new GetJobApplicationUseCase(
  jobApplicationRepository,
  jobAdRepository,
  candidateRepository
);
const getJobApplicationController = new GetJobApplicationController(
  getJobApplicationUseCase
);

export { getJobApplicationController };
