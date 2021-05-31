import { candidateRouter } from "../../../app/candidate/infrastructure/router";
import { jobAdRouter } from "../../../app/jobAd/infrastructure/router";
import { jobApplicationRouter } from "../../../app/jobApplication/infrastructure/router";
import express from "express";

const v1Router = express.Router();

v1Router.use("/candidates", candidateRouter);

v1Router.use("/jobAds", jobAdRouter);

v1Router.use("/jobApplications", jobApplicationRouter);

export { v1Router };
