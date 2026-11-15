import { 
  Clock, 
  BookOpen, 
  PenTool, 
  RefreshCcw 
} from "lucide-react";

export function SummaryCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      
      {/* 1. Card: Total hoje */}
      <div className="rounded-[22px] bg-surface border border-line p-4 shadow-card">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-[12px] bg-primaryTint text-primary flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-semibold text-muted uppercase tracking-wide">
            Total hoje
          </span>
        </div>

        <div className="mt-3 text-[22px] font-extrabold tracking-tight text-ink font-display">
          2h 15m
        </div>

        <div className="mt-3 h-1.5 rounded-full bg-page overflow-hidden">
          <div className="h-full rounded-full bg-primary w-full" />
        </div>
      </div>

      {/* 2. Card: Teoria */}
      <div className="rounded-[22px] bg-surface border border-line p-4 shadow-card">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-[12px] bg-teoriaTint text-teoria flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-semibold text-muted uppercase tracking-wide">
            Teoria
          </span>
        </div>

        <div className="mt-3 text-[22px] font-extrabold tracking-tight text-ink font-display">
          1h 00m
        </div>

        <div className="mt-3 h-1.5 rounded-full bg-page overflow-hidden">
          <div className="h-full rounded-full bg-teoria w-[44%]" />
        </div>
      </div>

      {/* 3. Card: Questões */}
      <div className="rounded-[22px] bg-surface border border-line p-4 shadow-card">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-[12px] bg-questoesTint text-questoes flex items-center justify-center">
            <PenTool className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-semibold text-muted uppercase tracking-wide">
            Questões
          </span>
        </div>

        <div className="mt-3 text-[22px] font-extrabold tracking-tight text-ink font-display">
          45m
        </div>

        <div className="mt-3 h-1.5 rounded-full bg-page overflow-hidden">
          <div className="h-full rounded-full bg-questoes w-[33%]" />
        </div>
      </div>

      {/* 4. Card: Revisão */}
      <div className="rounded-[22px] bg-surface border border-line p-4 shadow-card">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-[12px] bg-revisaoTint text-revisao flex items-center justify-center">
            <RefreshCcw className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-semibold text-muted uppercase tracking-wide">
            Revisão
          </span>
        </div>

        <div className="mt-3 text-[22px] font-extrabold tracking-tight text-ink font-display">
          30m
        </div>

        <div className="mt-3 h-1.5 rounded-full bg-page overflow-hidden">
          <div className="h-full rounded-full bg-revisao w-[22%]" />
        </div>
      </div>

    </div>
  );
}