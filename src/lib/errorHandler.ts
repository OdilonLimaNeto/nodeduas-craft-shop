import { ApiResponse } from "@/interfaces/response";

export class AppError extends Error {
  constructor(message: string, public statusCode: number = 400) {
    super(message);
    this.name = "AppError";
  }
}

export function createSuccessResponse<T>(data: T): ApiResponse<T> {
  return {
    data,
    error: null,
    success: true,
  };
}

export function createErrorResponse<T>(message: string): ApiResponse<T> {
  return {
    data: null,
    error: message,
    success: false,
  };
}

export async function handleServiceOperation<T>(
  operation: () => Promise<T>
): Promise<ApiResponse<T>> {
  try {
    const data = await operation();
    return createSuccessResponse(data);
  } catch (error) {
    if (error instanceof AppError) {
      return createErrorResponse(error.message);
    }
    console.error("Erro inesperado:", error);
    return createErrorResponse(
      "Ocorreu um erro inesperado. Tente novamente mais tarde."
    );
  }
}
