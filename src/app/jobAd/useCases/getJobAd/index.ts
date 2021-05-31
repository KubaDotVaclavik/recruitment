import { jobAdRepository } from "../../repositories";
import { GetJobAdUseCase } from "./GetJobAdUseCase";
import { GetJobAdController } from "./GetJobAdController";

const getJobAdUseCase = new GetJobAdUseCase(jobAdRepository);
const getJobAdController = new GetJobAdController(
  getJobAdUseCase
);

export { getJobAdController };
