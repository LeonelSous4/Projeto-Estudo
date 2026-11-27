import { api } from "./api";

export interface Notebook {
  id: number;
  name: string;
  collection_id: number;
  collection_name: string;
  created_at?: string;
}

/**
 * Busca cadernos do backend. Se `collectionId` for passado, filtra por coleção.
 */
export async function getNotebooks(collectionId?: number): Promise<Notebook[]> {
  const url = collectionId
    ? `/notebooks?collection_id=${collectionId}`
    : "/notebooks";
  const response = await api.get<Notebook[]>(url);
  return response.data;
}

/**
 * Cria um novo caderno dentro de uma coleção (POST /notebooks).
 */
export async function createNotebook(
  name: string,
  collectionId: number
): Promise<void> {
  await api.post("/notebooks", { name, collection_id: collectionId });
}

/**
 * Renomeia um caderno existente (PUT /notebooks/:id).
 */
export async function renameNotebook(id: number, name: string): Promise<void> {
  await api.put(`/notebooks/${id}`, { name });
}

/**
 * Exclui um caderno (DELETE /notebooks/:id).
 */
export async function deleteNotebook(id: number): Promise<void> {
  await api.delete(`/notebooks/${id}`);
}
