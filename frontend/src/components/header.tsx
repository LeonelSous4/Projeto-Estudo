import { Plus } from "lucide-react";
import { Calendar } from "lucide-react";

export function Header() {
  // Lógica para pegar a data atual formatada em português:
  const dataHoje = (() => {
    const s = new Date().toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    // Coloca a primeira letra em maiúsculo (ex: "Sábado...")
    return s.charAt(0).toUpperCase() + s.slice(1);
  })();

  return (
    <header className="flex justify-between items-start ">
      
      <div>
        <h1 className="text-[28px] lg:text-[32px] font-display font-bold text-ink leading-none">
          Olá, Leonel! 👋
        </h1>
        <p className="flex items-center gap-1.5 text-sm text-muted mt-2">
        <Calendar size={14} />
          {dataHoje}
        </p>
      </div>

      {/* 2. Lado Direito: Botão + Novo */}
      <button className="bg-accent text-white px-5 py-2.5 rounded-full font-semibold text-sm flex items-center gap-2 shadow-soft hover:opacity-95 transition">
        <Plus size={16} />
        Novo
      </button>
    </header>
  );
}