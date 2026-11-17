import { Clock } from "lucide-react";

type TipoSessao = "Teoria" | "Questões" | "Revisão";

interface Sessao {
  caderno: string;
  tipo: TipoSessao;
  inicio: string;
  fim: string;
  duracaoSegundos: number;
}

const sessoesHoje: Sessao[] = [
  {
    caderno: "Cálculo I",
    tipo: "Revisão",
    inicio: "14:00",
    fim: "14:30",
    duracaoSegundos: 30 * 60,
  },
  {
    caderno: "Direito Constitucional",
    tipo: "Questões",
    inicio: "10:15",
    fim: "11:00",
    duracaoSegundos: 45 * 60,
  },
  {
    caderno: "JavaScript",
    tipo: "Teoria",
    inicio: "08:30",
    fim: "09:30",
    duracaoSegundos: 60 * 60,
  },
];

const coresTipo: Record<TipoSessao, string> = {
  Teoria: "var(--teoria)",
  Questões: "var(--questoes)",
  Revisão: "var(--revisao)",
};

function formatarDuracao(segundos: number) {
  const horas = Math.floor(segundos / 3600);
  const minutos = Math.floor((segundos % 3600) / 60);

  if (horas === 0) return `${minutos}m`;
  return `${horas}h ${String(minutos).padStart(2, "0")}m`;
}

export function TodaySessions() {
  return (
    <section className="rounded-[18px] border border-[var(--line)] bg-[var(--surface)] p-4 shadow-[var(--shadow)]">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-[16px] font-bold text-[var(--ink)]">
          Sessões de hoje
        </h3>
        <span className="text-[11px] text-[var(--muted)]">
          {sessoesHoje.length} sessões
        </span>
      </div>

      {sessoesHoje.length === 0 ? (
        <div
          role="status"
          className="flex items-center gap-2 py-4 text-[13px] text-[var(--muted)]"
        >
          <Clock className="h-4 w-4" />
          <p>Nenhuma sessão hoje. Que tal começar agora?</p>
        </div>
      ) : (
        <ul className="divide-y divide-[var(--line)]">
          {sessoesHoje.map((sessao) => (
            <li
              key={`${sessao.caderno}-${sessao.tipo}-${sessao.inicio}`}
              className="flex items-center justify-between gap-3 py-3 first:pt-1 last:pb-1"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: coresTipo[sessao.tipo] }}
                />
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold text-[var(--ink)]">
                    {sessao.caderno} — {sessao.tipo}
                  </p>
                  <p className="text-[11px] text-[var(--muted)]">
                    {sessao.inicio} – {sessao.fim}
                  </p>
                </div>
              </div>
              <span className="shrink-0 rounded-full bg-[var(--surface-2)] px-2.5 py-1 text-[11px] font-semibold text-[var(--ink)]">
                {formatarDuracao(sessao.duracaoSegundos)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}