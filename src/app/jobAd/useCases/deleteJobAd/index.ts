import { jobAdRepository } from "../../repositories";
import { DeleteJobAdUseCase } from "./DeleteJobAdUseCase";
import { DeleteJobAdController } from "./DeleteJobAdController";

const deleteJobAdUseCase = new DeleteJobAdUseCase(jobAdRepository);
const deleteJobAdController = new DeleteJobAdController(
  deleteJobAdUseCase
);

export { deleteJobAdController };
