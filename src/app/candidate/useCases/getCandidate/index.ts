import { candidateRepository } from "../../repositories";
import { GetCandidateUseCase } from "./GetCandidateUseCase";
import { GetCandidateController } from "./GetCandidateController";

const getCandidateUseCase = new GetCandidateUseCase(candidateRepository);
const getCandidateController = new GetCandidateController(
  getCandidateUseCase
);

export { getCandidateController };
