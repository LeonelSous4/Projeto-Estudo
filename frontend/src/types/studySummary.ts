// Formato compartilhado pelo serviço que buscará os dados e pelos cartões.
// Todas as durações são medidas em segundos.
export interface StudySummary {
  total: number;
  teoria: number;
  questoes: number;
  revisao: number;
}
