import { jobAdRepository } from "../../repositories";
import { CreateJobAdUseCase } from "./CreateJobAdUseCase";
import { CreateJobAdController } from "./CreateJobAdController";

const createJobAdUseCase = new CreateJobAdUseCase(jobAdRepository);
const createJobAdController = new CreateJobAdController(
  createJobAdUseCase
);

export { createJobAdController };
