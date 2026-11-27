import { useEffect, useState } from "react";
import { BookOpen, Clock, PenTool, RefreshCcw } from "lucide-react";
import { getSummaryCards, type SummaryCardsData } from "../services/SumaryCards";
import { formatarDuracao } from "../utils/formatTime";

interface SummaryCardsProps {
  /** Número incrementado quando o Timer finaliza uma sessão para recarregar os dados */
  atualizacao?: number;
}

interface SummaryCardsWithGoalProps extends SummaryCardsProps { metaHoras: number }

export function SummaryCards({ atualizacao = 0, metaHoras }: SummaryCardsWithGoalProps) {
  const [summary, setSummary] = useState<SummaryCardsData>({
    teoria: 0,
    questoes: 0,
    revisao: 0,
    total: 0,
  });

  // Busca o resumo de hoje sempre que o componente abre ou uma sessão termina
  useEffect(() => {
    getSummaryCards()
      .then((data) => setSummary(data))
      .catch(() => {
        // Mantém os valores atuais em caso de erro de rede
      });
  }, [atualizacao]);

  const pctMetaTotal = Math.min(
    100,
    Math.round((summary.total / (metaHoras * 3600)) * 100)
  );

  return (
    <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {/* 1. Total hoje */}
      <article className="rounded-[18px] border border-[var(--line)] bg-[var(--surface)] p-4 shadow-[var(--shadow)]">
        <div className="flex items-center justify-between">
          <span className="grid h-9 w-9 place-items-center rounded-[12px] bg-[var(--brand-tint)]">
            <Clock aria-hidden="true" className="h-4 w-4 text-[var(--brand-text)]" />
          </span>
        </div>
        <p className="mt-3 text-[12px] text-[var(--muted)]">Total hoje</p>
        <p className="mt-1 font-display text-[24px] font-extrabold leading-none text-[var(--ink)] tabular-nums">
          {formatarDuracao(summary.total)}
        </p>
        <p className="mt-2">
          <span className="inline-flex items-center rounded-full bg-[var(--surface-2)] px-2 py-0.5 text-[11px] font-bold text-[var(--brand-text)]">
            {pctMetaTotal}% da meta ({metaHoras}h)
          </span>
        </p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--track)]">
          <div
            className="h-full rounded-full bg-[var(--brand)] transition-all duration-300"
            style={{ width: `${pctMetaTotal}%` }}
          />
        </div>
      </article>

      {/* 2. Teoria */}
      <article className="rounded-[18px] border border-[var(--line)] bg-[var(--surface)] p-4 shadow-[var(--shadow)]">
        <div className="flex items-center justify-between">
          <span className="grid h-9 w-9 place-items-center rounded-[12px] bg-[var(--teoria-tint)]">
            <BookOpen aria-hidden="true" className="h-4 w-4 text-[var(--teoria)]" />
          </span>
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[var(--teoria)]" />
        </div>
        <p className="mt-3 text-[12px] text-[var(--muted)]">Teoria</p>
        <p className="mt-1 font-display text-[24px] font-extrabold leading-none text-[var(--ink)] tabular-nums">
          {formatarDuracao(summary.teoria)}
        </p>
      </article>

      {/* 3. Questões */}
      <article className="rounded-[18px] border border-[var(--line)] bg-[var(--surface)] p-4 shadow-[var(--shadow)]">
        <div className="flex items-center justify-between">
          <span className="grid h-9 w-9 place-items-center rounded-[12px] bg-[var(--questoes-tint)]">
            <PenTool aria-hidden="true" className="h-4 w-4 text-[var(--questoes)]" />
          </span>
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[var(--questoes)]" />
        </div>
        <p className="mt-3 text-[12px] text-[var(--muted)]">Questões</p>
        <p className="mt-1 font-display text-[24px] font-extrabold leading-none text-[var(--ink)] tabular-nums">
          {formatarDuracao(summary.questoes)}
        </p>
      </article>

      {/* 4. Revisão */}
      <article className="rounded-[18px] border border-[var(--line)] bg-[var(--surface)] p-4 shadow-[var(--shadow)]">
        <div className="flex items-center justify-between">
          <span className="grid h-9 w-9 place-items-center rounded-[12px] bg-[var(--revisao-tint)]">
            <RefreshCcw aria-hidden="true" className="h-4 w-4 text-[var(--revisao)]" />
          </span>
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[var(--revisao)]" />
        </div>
        <p className="mt-3 text-[12px] text-[var(--muted)]">Revisão</p>
        <p className="mt-1 font-display text-[24px] font-extrabold leading-none text-[var(--ink)] tabular-nums">
          {formatarDuracao(summary.revisao)}
        </p>
      </article>
    </section>
  );
}
