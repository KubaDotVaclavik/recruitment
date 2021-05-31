import { Router } from "express";
import { createJobAdController } from "../useCases/createJobAd";
import { deleteJobAdController } from "../useCases/deleteJobAd";
import { getJobAdController } from "../useCases/getJobAd";
import { getJobAdsController } from "../useCases/getJobAds";
import { updateJobAdController } from "../useCases/updateJobAd";

const jobAdRouter = Router({});

jobAdRouter.post("/", (req, res) => createJobAdController.bind(req, res));

jobAdRouter.patch("/:id", (req, res) => updateJobAdController.bind(req, res));

jobAdRouter.delete("/:id", (req, res) => deleteJobAdController.bind(req, res));

jobAdRouter.get("/", (req, res) => getJobAdsController.bind(req, res));

jobAdRouter.get("/:id", (req, res) => getJobAdController.bind(req, res));

export { jobAdRouter };
