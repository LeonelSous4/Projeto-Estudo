import axios from "axios";
import { api } from "./api";

interface ApiErrorResponse {
  message?: string;
}

export interface CreateCollectionResponse {
  message: string;
  name: string;
}

export async function createCollection(
  name: string,
): Promise<CreateCollectionResponse> {
  try {
    const response = await api.post<CreateCollectionResponse>("/collections", {
      name,
    });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
      throw new Error(
        error.response?.data?.message ?? "Não foi possível conectar ao servidor.",
      );
    }

    throw error;
  }
}
