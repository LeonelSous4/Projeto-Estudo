import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { getStudySessions, type StudySession, type StudyType } from "../services/studySessions";
import { ehMesmoDia, formatarDuracao, formatarHora } from "../utils/formatTime";

interface TodaySessionsProps {
  atualizacao?: number;
}

const LABELS_TIPO: Record<StudyType, string> = {
  teoria: "Teoria",
  questoes: "Questões",
  revisao: "Revisão",
};

const CORES_TIPO: Record<StudyType, string> = {
  teoria: "var(--teoria)",
  questoes: "var(--questoes)",
  revisao: "var(--revisao)",
};

export function TodaySessions({ atualizacao = 0 }: TodaySessionsProps) {
  const [sessoesHoje, setSessoesHoje] = useState<StudySession[]>([]);

  useEffect(() => {
    getStudySessions()
      .then((todas) => {
        const hoje = new Date();
        // Filtra apenas sessões criadas hoje e ordena da mais recente para a mais antiga
        const deHoje = todas
          .filter((s) => ehMesmoDia(new Date(s.created_at), hoje))
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        setSessoesHoje(deHoje);
      })
      .catch(() => {
        // Mantém a lista atual em caso de falha
      });
  }, [atualizacao]);

  return (
    <section className="rounded-[18px] border border-[var(--line)] bg-[var(--surface)] p-4 shadow-[var(--shadow)]">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-[16px] font-bold text-[var(--ink)]">
          Sessões de hoje
        </h3>
        <span className="text-[11px] text-[var(--muted)]">
          {sessoesHoje.length} {sessoesHoje.length === 1 ? "sessão" : "sessões"}
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
          {sessoesHoje.map((sessao) => {
            const horaInicio = formatarHora(sessao.created_at);
            const horaFim = sessao.finished_at
              ? formatarHora(sessao.finished_at)
              : "Em andamento";

            return (
              <li
                key={sessao.id}
                className="flex items-center justify-between gap-3 py-3 first:pt-1 last:pb-1"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: CORES_TIPO[sessao.type] }}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold text-[var(--ink)]">
                      {sessao.notebook_name} — {LABELS_TIPO[sessao.type]}
                    </p>
                    <p className="text-[11px] text-[var(--muted)]">
                      {horaInicio} – {horaFim}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 rounded-full bg-[var(--surface-2)] px-2.5 py-1 text-[11px] font-semibold text-[var(--ink)]">
                  {formatarDuracao(sessao.duration_seconds, true)}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
