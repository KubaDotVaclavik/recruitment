import { Router } from "express";
import { createJobApplicationController } from "../useCases/createJobApplication";
import { deleteJobApplicationController } from "../useCases/deleteJobApplication";
import { getJobApplicationController } from "../useCases/getJobApplication";
import { getJobApplicationsController } from "../useCases/getJobApplications";

const jobApplicationRouter = Router({});

jobApplicationRouter.post("/", (req, res) =>
  createJobApplicationController.bind(req, res)
);

jobApplicationRouter.delete("/:id", (req, res) =>
  deleteJobApplicationController.bind(req, res)
);

jobApplicationRouter.get("/", (req, res) =>
  getJobApplicationsController.bind(req, res)
);

jobApplicationRouter.get("/:id", (req, res) =>
  getJobApplicationController.bind(req, res)
);

export { jobApplicationRouter };
