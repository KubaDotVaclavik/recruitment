export interface GetCandidatesRequestDTO {
  offset?: number;
  limit?: number;
  skills_contains?: string;
  fullName_contains?: string;
}
