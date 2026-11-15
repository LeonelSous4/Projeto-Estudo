import { Target } from "lucide-react";

export function GoalBanner() {
  return (
    <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-primary to-primaryMid p-6 sm:p-7 text-white shadow-soft">
      {/* 1. Formas decorativas no fundo */}
      <div className="absolute -right-6 -top-8 w-40 h-40 rounded-full bg-white/10 pointer-events-none" />
      <div className="absolute right-20 top-10 w-24 h-24 rounded-full bg-white/10 pointer-events-none" />
      <div className="absolute right-10 bottom-0 w-64 h-20 rounded-[24px] bg-white/[0.07] rotate-[-12deg] pointer-events-none" />

      {/* 2. Conteúdo textual e barra de progresso */}
      <div className="relative z-10">
        
        {/* Label do topo */}
        <div className="flex items-center gap-2 text-[12px] font-semibold tracking-widest uppercase opacity-80">
          <Target className="w-4 h-4" />
          <span>Sua meta de hoje</span>
        </div>

        {/* Título de horas */}
        <h3 className="mt-3 text-[20px] sm:text-[22px] font-bold leading-tight">
          Você estudou 2h 15m de 4h. <span className="font-normal opacity-90">Bom começo!</span>
        </h3>

        {/* Barra de Progresso + Pílula de % */}
        <div className="mt-5 flex items-center gap-4">
          <div className="flex-1 h-3 rounded-full bg-white/20 overflow-hidden">
            <div className="h-full rounded-full bg-accent w-[56%]" />
          </div>

          <span className="text-[14px] font-bold bg-surface text-primary px-3 py-1 rounded-full shadow-sm">
            56%
          </span>
        </div>

      </div>
    </div>
  );
}