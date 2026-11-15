import { 
  LayoutDashboard, 
  BookOpen, 
  History, 
  BarChart2, 
  Settings, 
  Lightbulb, 
  Plus 
} from "lucide-react";

import { Sidebar } from "./components/sidebar";
import { Header } from "./components/header";
import { GoalBanner } from "./components/goalBanner";
import { SummaryCards } from "./components/SummaryCards";

export function App() {
  return (
    <div className="min-h-screen bg-page p-3 sm:p-6 text-ink">
      {/* O container fechado de 32px com sombra */}
      <div className="max-w-[1600px] mx-auto rounded-[32px] bg-surface shadow-[0_20px_60px_-20px_rgba(31,42,68,0.15)] overflow-hidden flex flex-col xl:flex-row min-h-[calc(100vh-3rem)] border border-surface">
        
        {/* 1. Sidebar à esquerda (fundo branco com borda) */}
        <Sidebar />

        {/* 2. Área do meio (o cinza mais claro: surfaceAlt) */}
        <main className="flex-1 min-w-0 bg-surfaceAlt overflow-y-auto">
          <div className="p-5 sm:p-7 lg:p-8 pb-28 lg:pb-8 space-y-6">
            <Header />
            
            {/* Aqui vão entrar o Banner, Resumo e os Cards brancos em cima desse cinza */}
          <GoalBanner />
          <SummaryCards />
          </div>



        </main>

      </div>
    </div>
  );
}

export default App;