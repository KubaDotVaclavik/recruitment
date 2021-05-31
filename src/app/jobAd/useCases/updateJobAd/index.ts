import { jobAdRepository } from "../../repositories";
import { UpdateJobAdUseCase } from "./UpdateJobAdUseCase";
import { UpdateJobAdController } from "./UpdateJobAdController";

const updateJobAdUseCase = new UpdateJobAdUseCase(jobAdRepository);
const updateJobAdController = new UpdateJobAdController(
  updateJobAdUseCase
);

export { updateJobAdController };
