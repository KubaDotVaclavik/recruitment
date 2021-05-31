import { candidateRepository } from "../../repositories";
import { UpdateCandidateUseCase } from "./UpdateCandidateUseCase";
import { UpdateCandidateController } from "./UpdateCandidateController";

const updateCandidateUseCase = new UpdateCandidateUseCase(candidateRepository);
const updateCandidateController = new UpdateCandidateController(
  updateCandidateUseCase
);

export { updateCandidateController };
