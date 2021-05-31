import { candidateRouter } from "../../../app/candidate/infrastructure/router";
import { jobAdRouter } from "../../../app/jobAd/infrastructure/router";
import express from "express";

const v1Router = express.Router();

v1Router.use("/candidates", candidateRouter);

v1Router.use("/jobAds", jobAdRouter);

export { v1Router };
