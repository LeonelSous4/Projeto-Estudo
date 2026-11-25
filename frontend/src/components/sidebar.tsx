import { 
  LayoutDashboard, 
  BookOpen, 
  History, 
  BarChart2, 
  Settings, 
  HelpCircle,
  Search,
  Target,
  Folder
} from "lucide-react";

export function Sidebar() {
  return (
    <aside className="hidden md:flex w-[240px] shrink-0 flex-col border-r border-[var(--line)] bg-[var(--shell)] min-h-screen">
      
      {/* 1. Logo */}
      <div className="flex items-center gap-2.5 px-5 pb-6 pt-6">
        <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-[var(--brand)] font-display text-[18px] font-extrabold text-[var(--on-brand)]">
          T
        </span>
        <span className="font-display text-[22px] font-extrabold tracking-tight text-[var(--ink)]">
          Trilhy
        </span>
      </div>

      <div className="px-3 flex-1 flex flex-col">
        {/* 2. Campo de Busca */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--faint)]" />
          <input 
            type="text" 
            placeholder="Buscar…" 
            readOnly
            className="h-10 w-full rounded-xl border-0 bg-[var(--surface-2)] pl-9 pr-10 text-[13px] text-[var(--ink)] outline-none placeholder:text-[var(--faint)]"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-[var(--surface)] px-1.5 py-0.5 text-[11px] font-semibold text-[var(--muted)]">
            ⌘K
          </kbd>
        </div>

        {/* 3. Grupo Dashboards */}
        <p className="px-2 pb-2 pt-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--faint)]">
          Dashboards
        </p>

        <nav className="space-y-1">
          <button className="flex w-full items-center gap-2.5 rounded-[12px] px-3 py-2.5 text-left text-[13.5px] bg-[var(--brand)] font-bold text-[var(--on-brand)] transition duration-150">
            <LayoutDashboard className="h-[18px] w-[18px]" />
            Dashboard
          </button>

          <button className="flex w-full items-center gap-2.5 rounded-[12px] px-3 py-2.5 text-left text-[13.5px] text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)] transition duration-150 font-medium">
            <Folder className="h-[18px] w-[18px]" />
            Coleções
          </button>

          <button className="flex w-full items-center gap-2.5 rounded-[12px] px-3 py-2.5 text-left text-[13.5px] text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)] transition duration-150 font-medium">
            <BookOpen className="h-[18px] w-[18px]" />
            Cadernos
          </button>

          <button className="flex w-full items-center gap-2.5 rounded-[12px] px-3 py-2.5 text-left text-[13.5px] text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)] transition duration-150 font-medium">
            <History className="h-[18px] w-[18px]" />
            Histórico
          </button>

          <button className="flex w-full items-center gap-2.5 rounded-[12px] px-3 py-2.5 text-left text-[13.5px] text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)] transition duration-150 font-medium">
            <BarChart2 className="h-[18px] w-[18px]" />
            Estatísticas
          </button>
        </nav>

        {/* 4. Grupo Configurações */}
        <p className="px-2 pb-2 pt-6 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--faint)]">
          Configurações
        </p>

        <div className="space-y-1">
          <button className="flex w-full items-center gap-2.5 rounded-[12px] px-3 py-2.5 text-left text-[13.5px] text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)] transition duration-150 font-medium">
            <Settings className="h-[18px] w-[18px]" />
            Configurações
          </button>

          <button className="flex w-full items-center gap-2.5 rounded-[12px] px-3 py-2.5 text-left text-[13.5px] text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)] transition duration-150 font-medium">
            <HelpCircle className="h-[18px] w-[18px]" />
            Ajuda
          </button>
        </div>

        {/* 5. Card Meta do Dia no rodapé da Sidebar */}
        <div className="mt-auto pt-6 pb-2">
          <div className="rounded-[18px] bg-[var(--surface)] p-4 border border-[var(--line)]">
            <div className="mb-2 flex items-center gap-2">
              <Target className="h-4 w-4 text-[var(--brand-text)]" />
              <p className="text-[13px] font-bold text-[var(--ink)]">Meta do dia</p>
            </div>
            <p className="text-[12px] leading-relaxed text-[var(--muted)]">
              Faltam 1h 45m para sua meta de 4h
            </p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--track)]">
              <div className="h-full rounded-full bg-[var(--brand)] transition-all duration-200 w-[56%]" />
            </div>
            <p className="mt-2 text-[11px] font-bold text-[var(--brand-text)]">
              56% concluído
            </p>
          </div>
        </div>

      </div>

    </aside>
  );
}
