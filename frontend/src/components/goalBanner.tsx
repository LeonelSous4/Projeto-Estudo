export function GoalBanner() {
  return (
    <section 
      className="relative overflow-hidden rounded-[20px] p-5 text-[var(--banner-ink)] border border-[var(--line)] shadow-sm"
      style={{ background: "var(--banner-bg)" }}
    >
      {/* Brilho decorativo suave no canto */}
      <div 
        className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full blur-2xl" 
        style={{ background: "var(--banner-glow)" }}
      />

      <div className="relative flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.12em] opacity-80">
            Hoje • Foco total
          </p>
          <h2 className="mt-1 font-display text-[20px] font-extrabold">
            Sua meta de hoje
          </h2>
          <p className="mt-1 text-[13px]">
            Você estudou 2h 15m de 4h. <span className="opacity-90 font-medium">Bom começo!</span>
          </p>
        </div>

        {/* Selo com a % */}
        <span 
          className="rounded-full px-3 py-1.5 text-[12px] font-extrabold shadow-sm"
          style={{ background: "var(--banner-ink)", color: "var(--shell)" }}
        >
          56%
        </span>
      </div>

      {/* Barra de Progresso */}
      <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-[var(--track)]">
        <div 
          className="h-full rounded-full transition-all duration-300 w-[56%]" 
          style={{ background: "var(--brand)" }}
        />
      </div>

      {/* Rodapé da Barra */}
      <div className="mt-2 flex justify-between text-[11px] font-semibold opacity-80">
        <span>2h 15m concluídos</span>
        <span>Meta: 4h 00m</span>
      </div>
    </section>
  );
}
