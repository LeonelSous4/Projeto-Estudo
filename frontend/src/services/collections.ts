
import { api } from "./api";

export interface Collection {
  id: number;
  name: string;
}

export async function getCollections(): Promise<Collection[]> {
  const response = await api.get<{ collections: Collection[] }>(
    "/collections"
  );

  return response.data.collections;
}


export async function deleteCollection(id: number): Promise<void> {
  await api.delete(`/collections/${id}`);
}

export async function createCollection(name: string): Promise<Collection> {
  const response = await api.post<Collection>("/collections", { name });
  return response.data;
}

export async function renameCollection(id: number, name: string): Promise<Collection> {
  const response = await api.put<Collection>(`/collections/${id}`, { name });
  return response.data;
}

