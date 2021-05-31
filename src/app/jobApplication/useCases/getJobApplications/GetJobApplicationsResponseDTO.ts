export interface GetJobApplicationsResponseDTO {
  nodes: {
    id: string;
    jobAdId: string;
    candidateId: string;
  }[];
  total: number;
}
