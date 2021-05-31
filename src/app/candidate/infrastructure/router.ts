import { Router } from "express";
import { createCandidateController } from "../useCases/createCandidate";
import { deleteCandidateController } from "../useCases/deleteCandidate";
import { getCandidateController } from "../useCases/getCandidate";
import { getCandidatesController } from "../useCases/getCandidates";
import { updateCandidateController } from "../useCases/updateCandidate";

const candidateRouter = Router({});

candidateRouter.post("/", (req, res) =>
  createCandidateController.bind(req, res)
);

candidateRouter.patch("/:id", (req, res) =>
  updateCandidateController.bind(req, res)
);

candidateRouter.delete("/:id", (req, res) =>
  deleteCandidateController.bind(req, res)
);

candidateRouter.get("/", (req, res) => getCandidatesController.bind(req, res));

candidateRouter.get("/:id", (req, res) =>
  getCandidateController.bind(req, res)
);

export { candidateRouter };
