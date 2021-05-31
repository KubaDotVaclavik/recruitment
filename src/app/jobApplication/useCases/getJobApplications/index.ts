import { jobApplicationRepository } from "../../repositories";
import { GetJobApplicationsUseCase } from "./GetJobApplicationsUseCase";
import { GetJobApplicationsController } from "./GetJobApplicationsController";

const getJobApplicationsUseCase = new GetJobApplicationsUseCase(jobApplicationRepository);
const getJobApplicationsController = new GetJobApplicationsController(
  getJobApplicationsUseCase
);

export { getJobApplicationsController };
