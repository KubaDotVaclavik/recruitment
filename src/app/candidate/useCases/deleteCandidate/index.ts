import { candidateRepository } from "../../repositories";
import { DeleteCandidateUseCase } from "./DeleteCandidateUseCase";
import { DeleteCandidateController } from "./DeleteCandidateController";

const deleteCandidateUseCase = new DeleteCandidateUseCase(candidateRepository);
const deleteCandidateController = new DeleteCandidateController(
  deleteCandidateUseCase
);

export { deleteCandidateController };
