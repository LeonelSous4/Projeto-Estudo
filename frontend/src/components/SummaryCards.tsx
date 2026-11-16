import { Clock, BookOpen, PenTool, RefreshCcw, ArrowUpRight } from "lucide-react";

export function SummaryCards() {
  return (
    <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      
      {/* 1. Total Hoje */}
      <article className="rounded-[18px] border border-[var(--line)] bg-[var(--surface)] p-4 shadow-[var(--shadow)]">
        <div className="flex items-center justify-between">
          <span className="grid h-9 w-9 place-items-center rounded-[12px] bg-[var(--brand-tint)]">
            <Clock className="h-4 w-4 text-[var(--brand-text)]" />
          </span>
        </div>
        <p className="mt-3 text-[12px] text-[var(--muted)]">Total hoje</p>
        <p className="mt-1 font-display text-[24px] font-extrabold leading-none text-[var(--ink)] tabular-nums">
          2h 15m
        </p>
        <p className="mt-2">
          <span className="inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-bold text-[var(--success)] bg-[var(--surface-2)]">
            <ArrowUpRight className="h-3 w-3" />
            +18% vs ontem
          </span>
        </p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--track)]">
          <div className="h-full rounded-full bg-[var(--brand)] w-[56%]" />
        </div>
      </article>

      {/* 2. Teoria */}
      <article className="rounded-[18px] border border-[var(--line)] bg-[var(--surface)] p-4 shadow-[var(--shadow)]">
        <div className="flex items-center justify-between">
          <span className="grid h-9 w-9 place-items-center rounded-[12px] bg-[var(--teoria-tint)]">
            <BookOpen className="h-4 w-4 text-[var(--teoria)]" />
          </span>
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--teoria)]" />
        </div>
        <p className="mt-3 text-[12px] text-[var(--muted)]">Teoria</p>
        <p className="mt-1 font-display text-[24px] font-extrabold leading-none text-[var(--ink)] tabular-nums">
          1h 00m
        </p>
        <p className="mt-2">
          <span className="inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-bold text-[var(--success)] bg-[var(--surface-2)]">
            <ArrowUpRight className="h-3 w-3" />
            +12% vs ontem
          </span>
        </p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--track)]">
          <div className="h-full rounded-full bg-[var(--teoria)] w-[44%]" />
        </div>
      </article>

      {/* 3. Questões */}
      <article className="rounded-[18px] border border-[var(--line)] bg-[var(--surface)] p-4 shadow-[var(--shadow)]">
        <div className="flex items-center justify-between">
          <span className="grid h-9 w-9 place-items-center rounded-[12px] bg-[var(--questoes-tint)]">
            <PenTool className="h-4 w-4 text-[var(--questoes)]" />
          </span>
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--questoes)]" />
        </div>
        <p className="mt-3 text-[12px] text-[var(--muted)]">Questões</p>
        <p className="mt-1 font-display text-[24px] font-extrabold leading-none text-[var(--ink)] tabular-nums">
          45m
        </p>
        <p className="mt-2">
          <span className="inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-bold text-[var(--success)] bg-[var(--surface-2)]">
            <ArrowUpRight className="h-3 w-3" />
            +25% vs ontem
          </span>
        </p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--track)]">
          <div className="h-full rounded-full bg-[var(--questoes)] w-[33%]" />
        </div>
      </article>

      {/* 4. Revisão */}
      <article className="rounded-[18px] border border-[var(--line)] bg-[var(--surface)] p-4 shadow-[var(--shadow)]">
        <div className="flex items-center justify-between">
          <span className="grid h-9 w-9 place-items-center rounded-[12px] bg-[var(--revisao-tint)]">
            <RefreshCcw className="h-4 w-4 text-[var(--revisao)]" />
          </span>
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--revisao)]" />
        </div>
        <p className="mt-3 text-[12px] text-[var(--muted)]">Revisão</p>
        <p className="mt-1 font-display text-[24px] font-extrabold leading-none text-[var(--ink)] tabular-nums">
          30m
        </p>
        <p className="mt-2">
          <span className="inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-bold text-[var(--muted)] bg-[var(--surface-2)]">
            0% vs ontem
          </span>
        </p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--track)]">
          <div className="h-full rounded-full bg-[var(--revisao)] w-[22%]" />
        </div>
      </article>

    </section>
  );
}
