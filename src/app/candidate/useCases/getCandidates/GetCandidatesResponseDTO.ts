export interface GetCandidatesResponseDTO {
  nodes: {
    id: string;
    fullName: string;
    skills: string[];
    salary: number | null;
  }[];
  total: number;
}
