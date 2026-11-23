import { api } from "./api";



export interface SummaryCardsData {
  teoria: number;
  questoes: number;
  revisao: number;
  total: number;
}


export async function getSummaryCards(): Promise<SummaryCardsData> {
  const response = await api.get<SummaryCardsData>(
    "/study-sessions/today"
  );

  return response.data;
}