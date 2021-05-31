export interface GetJobAdsResponseDTO {
  nodes: {
    id: string;
    title: string;
    text: string;
    salary: number | null;
  }[];
  total: number;
}
