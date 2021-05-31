import { jobAdRepository } from "../../repositories";
import { GetJobAdsUseCase } from "./GetJobAdsUseCase";
import { GetJobAdsController } from "./GetJobAdsController";

const getJobAdsUseCase = new GetJobAdsUseCase(jobAdRepository);
const getJobAdsController = new GetJobAdsController(
  getJobAdsUseCase
);

export { getJobAdsController };
