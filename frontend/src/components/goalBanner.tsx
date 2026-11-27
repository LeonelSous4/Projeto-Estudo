import { useEffect, useState } from "react";
import { getSummaryCards } from "../services/SumaryCards";
import { formatarDuracao } from "../utils/formatTime";

interface GoalBannerProps { metaHoras: number; atualizacao: number }

export function GoalBanner({ metaHoras, atualizacao }: GoalBannerProps) {
  const [segundosEstudados, setSegundosEstudados] = useState(0);
  useEffect(() => {
    getSummaryCards().then((resumo) => setSegundosEstudados(resumo.total)).catch(() => {});
  }, [atualizacao]);

  const metaSegundos = metaHoras * 3600;
  const progresso = Math.min(100, Math.round((segundosEstudados / metaSegundos) * 100));
  const metaAtingida = segundosEstudados >= metaSegundos;

  return (
    <section className="relative overflow-hidden rounded-[20px] border border-[var(--line)] p-5 text-[var(--banner-ink)] shadow-sm" style={{ background: "var(--banner-bg)" }}>
      <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full blur-2xl" style={{ background: "var(--banner-glow)" }} />
      <div className="relative flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.12em] opacity-80">Hoje • Foco total</p>
          <h2 className="mt-1 font-display text-[20px] font-extrabold">Sua meta de hoje</h2>
          <p className="mt-1 text-[13px]">{formatarDuracao(segundosEstudados)} de {metaHoras}h estudadas. <span className="font-medium opacity-90">{metaAtingida ? "Meta concluída!" : "No seu ritmo."}</span></p>
        </div>
        <span className="rounded-full px-3 py-1.5 text-[12px] font-extrabold shadow-sm" style={{ background: "var(--banner-ink)", color: "var(--shell)" }}>{progresso}%</span>
      </div>
      <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-[var(--track)]"><div className="h-full rounded-full transition-all duration-300" style={{ background: "var(--brand)", width: `${progresso}%` }} /></div>
      <div className="mt-2 flex justify-between text-[11px] font-semibold opacity-80"><span>{formatarDuracao(segundosEstudados)} concluídos</span><span>Meta: {metaHoras}h</span></div>
    </section>
  );
}
