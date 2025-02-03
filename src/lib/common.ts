import { Response } from "express";
import { ResponseType, ErrorType } from "@/lib/types/response.type";

export const sendResponse = (res: Response, status: number, message: string = "OK", data: any = null, error: any = null) => {
  const env = process.env.NODE_ENV || "development";
  const response: ResponseType = { data, error: error ? env === "development" ? modelErrorObject(error) : null : null, message };
  res.status(status).json(response);
};

export const modelErrorObject = (e: unknown): ErrorType => {
  const responseError = (e as any)?.response?.data;
  if (responseError) {
    return {
      error: responseError,
      message: responseError.error_description ?? responseError.message ?? responseError.errorMessage ?? "An unknown error occurred",
    };
  }

  if ((e as any)?.errors?.length) {
    return {
      error: e,
      message: (e as any).errors[0]?.message ?? "An unknown GraphQL error occurred",
    };
  }

  if ((e as Error)?.message) {
    return {
      error: e,
      message: (e as Error).message,
    };
  }

  if (typeof e === "string") {
    return {
      error: e,
      message: e,
    };
  }

  return {
    error: e,
    message: JSON.stringify(e, null, 2) ?? "An unknown error occurred",
  };
};
