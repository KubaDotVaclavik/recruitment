export interface GetJobAdsRequestDTO {
  offset?: number;
  limit?: number;
  text_contains?: string;
  title_contains?: string;
}
