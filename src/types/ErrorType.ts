import { AxiosError } from "axios";

export type AxiosErrorType = AxiosError<{
  message?: string;
}>;