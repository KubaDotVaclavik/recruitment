import { jobApplicationRepository } from "../../repositories";
import { DeleteJobApplicationUseCase } from "./DeleteJobApplicationUseCase";
import { DeleteJobApplicationController } from "./DeleteJobApplicationController";

const deleteJobApplicationUseCase = new DeleteJobApplicationUseCase(jobApplicationRepository);
const deleteJobApplicationController = new DeleteJobApplicationController(
  deleteJobApplicationUseCase
);

export { deleteJobApplicationController };
