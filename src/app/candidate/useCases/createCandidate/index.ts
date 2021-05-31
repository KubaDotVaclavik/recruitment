import { candidateRepository } from "../../repositories";
import { CreateCandidateUseCase } from "./CreateCandidateUseCase";
import { CreateCandidateController } from "./CreateCandidateController";

const createCandidateUseCase = new CreateCandidateUseCase(candidateRepository);
const createCandidateController = new CreateCandidateController(
  createCandidateUseCase
);

export { createCandidateController };
