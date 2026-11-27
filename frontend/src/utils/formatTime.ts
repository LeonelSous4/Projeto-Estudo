// ============================================================================
// Helpers simples de formatação de tempo e datas usados no Dashboard
// ============================================================================

/**
 * Converte segundos em texto legível (ex: 3660 -> "1h 01m").
 * Se `mostrarSoMinutosQuandoMenorQue1h` for true, 900 -> "15m".
 */
export function formatarDuracao(
  segundos: number,
  mostrarSoMinutosQuandoMenorQue1h = false
): string {
  const minutosTotais = Math.floor(segundos / 60);
  const horas = Math.floor(minutosTotais / 60);
  const minutos = minutosTotais % 60;

  if (mostrarSoMinutosQuandoMenorQue1h && horas === 0) {
    return `${minutos}m`;
  }

  return `${horas}h ${String(minutos).padStart(2, "0")}m`;
}

/**
 * Converte minutos em texto legível (ex: 90 -> "1h 30m", 45 -> "45m").
 */
export function formatarMinutos(minutos: number): string {
  const horas = Math.floor(minutos / 60);
  const resto = minutos % 60;

  if (horas === 0) return `${resto}m`;
  return `${horas}h ${String(resto).padStart(2, "0")}m`;
}

/**
 * Verifica se duas datas caem no mesmo dia (ano, mês e dia).
 */
export function ehMesmoDia(dataA: Date, dataB: Date): boolean {
  return (
    dataA.getFullYear() === dataB.getFullYear() &&
    dataA.getMonth() === dataB.getMonth() &&
    dataA.getDate() === dataB.getDate()
  );
}

/**
 * Formata uma data ISO do banco (ex: "2026-11-26T14:30:00.000Z") para "14:30".
 */
export function formatarHora(dataIso: string): string {
  const data = new Date(dataIso);
  const horas = String(data.getHours()).padStart(2, "0");
  const minutos = String(data.getMinutes()).padStart(2, "0");
  return `${horas}:${minutos}`;
}

/**
 * Converte segundos em relógio HH:MM:SS (ex: 65 -> "00:01:05").
 */
export function formatarHMS(totalSegundos: number): string {
  const h = Math.floor(totalSegundos / 3600);
  const m = Math.floor((totalSegundos % 3600) / 60);
  const s = totalSegundos % 60;
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

/**
 * Formata data de sessão de forma amigável ("Hoje, 14:00", "Ontem, 16:30", "24/11, 15:00").
 */
export function formatarDataSessao(dataIso: string): string {
  const data = new Date(dataIso);
  const hoje = new Date();
  const ontem = new Date();
  ontem.setDate(hoje.getDate() - 1);

  const hora = formatarHora(dataIso);
  if (ehMesmoDia(data, hoje)) return `Hoje, ${hora}`;
  if (ehMesmoDia(data, ontem)) return `Ontem, ${hora}`;

  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  return `${dia}/${mes}, ${hora}`;
}

