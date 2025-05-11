// types.ts
export interface IApiResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data:unknown;
}
