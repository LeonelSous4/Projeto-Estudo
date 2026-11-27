import { api } from "./api";

export type StudyType = "teoria" | "questoes" | "revisao";

export interface StudySession {
  id: number;
  notebook_id: number;
  notebook_name: string;
  type: StudyType;
  duration_seconds: number;
  status: "active" | "paused" | "finished";
  created_at: string;
  finished_at: string | null;
}

export async function getStudySessions(
  notebookId?: number
): Promise<StudySession[]> {
  const url = notebookId
    ? `/study-sessions?notebook_id=${notebookId}`
    : "/study-sessions";
  const response = await api.get<StudySession[]>(url);
  return response.data;
}

export async function initTimer(notebookId: number, type: StudyType): Promise<number> {
  const response = await api.post<{ id: number }>("/study-sessions", {
    notebook_id: notebookId,
    type,
  });
  return response.data.id;
}

export async function pauseTimer(id: number): Promise<number> {
  const response = await api.patch<{ time: number }>(`/study-sessions/${id}/pause`);
  return response.data.time;
}

export async function resumeTimer(id: number): Promise<void> {
  await api.patch(`/study-sessions/${id}/resume`);
}

export async function finishTimer(id: number): Promise<number> {
  const response = await api.patch<{ duration_seconds: number }>(`/study-sessions/${id}/finish`);
  return response.data.duration_seconds;
}