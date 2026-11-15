import { 
  LayoutDashboard, 
  BookOpen, 
  History, 
  BarChart2, 
  Settings, 
  Lightbulb, 
  Folder 
} from "lucide-react";



export function Sidebar() {
  return (
    <aside className="hidden md:flex w-[240px] shrink-0 bg-surface rounded-3xl p-5 shadow-soft flex-col justify-between h-fit sticky top-6">
      
      <div>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white font-display font-bold text-xl">
            F
          </div>
          <span className="font-display font-bold text-xl text-ink">
            Foco
          </span>
        </div>

       
        <nav className="space-y-1">
          
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium bg-primaryTint text-primary">
            <LayoutDashboard size={18} />
            Dashboard
            </button>

            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted hover:bg-surfaceAlt hover:text-ink transition duration-150">
            <Folder size={18} />
            Coleções
            </button>
    
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted hover:bg-surfaceAlt hover:text-ink transition duration-150">
            <BookOpen size={18} />
            Cadernos
            </button>
    
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted hover:bg-surfaceAlt hover:text-ink transition duration-150">
            <History size={18} />
            Historico
            </button>

            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted hover:bg-surfaceAlt hover:text-ink transition duration-150">
            <BarChart2  size={18} />
            Historico
            </button>

            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted hover:bg-surfaceAlt hover:text-ink transition duration-150">
            <Settings  size={18} />
            Configurações
            </button>
            
        </nav>
      </div>

      <div className="mt-8 bg-surfaceAlt rounded-3xl p-4" >
        <div className="flex items-center gap-2 text-primary font-semibold text-sm mb-2 ">
          <Lightbulb size={16} className="bg-white rounded-sm w-" />
          <span>Dica do dia</span>
        </div>
        <p className="text-[13px] leading-relaxed text-ink">
          Revise em 24h o que aprendeu hoje. Seu cérebro fixa melhor o conteúdo.
        </p>
      </div>

    </aside>
  );
}





























