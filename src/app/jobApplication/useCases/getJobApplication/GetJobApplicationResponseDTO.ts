import { GetCandidateResponseDTO } from "../../../candidate/useCases/getCandidate/GetCandidateResponseDTO";
import { GetJobAdResponseDTO } from "../../../jobAd/useCases/getJobAd/GetJobAdResponseDTO";

export interface GetJobApplicationResponseDTO {
  id: string;
  jobAd: GetJobAdResponseDTO;
  candidate: GetCandidateResponseDTO;
}
