import { api } from "./api";

export interface Topic {
  id: number;
  name: string;
  notebook_id: number;
  notebook_name?: string;
  content: string | null;
  is_completed: number | boolean;
}

/**
 * Busca tópicos. Se `notebookId` for informado, traz apenas os daquele caderno.
 */
export async function getTopics(notebookId?: number): Promise<Topic[]> {
  const url = notebookId ? `/topics?notebook_id=${notebookId}` : "/topics";
  const response = await api.get<Topic[]>(url);
  return response.data;
}

/**
 * Cria um novo tópico dentro de um caderno (POST /topics).
 */
export async function createTopic(
  name: string,
  notebookId: number,
  content?: string
): Promise<void> {
  await api.post("/topics", {
    name,
    notebook_id: notebookId,
    content: content || undefined,
  });
}

/**
 * Atualiza o nome e/ou resumo de um tópico (PUT /topics/:id).
 */
export async function updateTopic(
  id: number,
  name: string,
  content?: string
): Promise<void> {
  await api.put(`/topics/${id}`, { name, content });
}

/**
 * Exclui um tópico (DELETE /topics/:id).
 */
export async function deleteTopic(id: number): Promise<void> {
  await api.delete(`/topics/${id}`);
}

/**
 * Marca ou desmarca um tópico como concluído (PATCH /topics/:id/toggle).
 */
export async function toggleTopic(id: number): Promise<boolean> {
  const response = await api.patch<{ is_completed: boolean }>(
    `/topics/${id}/toggle`
  );
  return response.data.is_completed;
}
