import { candidateRepository } from "../../repositories";
import { GetCandidatesUseCase } from "./GetCandidatesUseCase";
import { GetCandidatesController } from "./GetCandidatesController";

const getCandidatesUseCase = new GetCandidatesUseCase(candidateRepository);
const getCandidatesController = new GetCandidatesController(
  getCandidatesUseCase
);

export { getCandidatesController };
