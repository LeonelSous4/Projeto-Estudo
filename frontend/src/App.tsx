import { Sidebar } from "./components/sidebar";
import { Header } from "./components/header";
import { GoalBanner } from "./components/goalBanner";
import { SummaryCards } from "./components/SummaryCards";
import { WeekStudy } from "./components/WeekStudy";
import { Timer } from "./components/Timer";
import { TimeDistribuition } from "./components/TimeDistribuition";

export function App() {
  return (
    <div className="min-h-screen bg-[var(--page)] p-3 sm:p-6 text-[var(--ink)] antialiased transition-colors duration-200">
      {/* Moldura principal da aplicação (shell) */}
      <div className="max-w-[1500px] mx-auto rounded-[28px] bg-[var(--shell)] border border-[var(--line)] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[calc(100vh-3rem)]">
        
        {/* 1. Sidebar à esquerda */}
        <Sidebar />

        {/* 2. Área Central de Conteúdo */}
        <main className="flex-1 min-w-0 bg-[var(--page)] overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-7 pb-24 space-y-4">
            <Header />
            <GoalBanner />
            <SummaryCards />
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-5">
              <div className="lg:col-span-3">
                <WeekStudy />
              </div>
              <div className="lg:col-span-2">
                <Timer />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-5">
              <div className="lg:col-span-2">
                <TimeDistribuition />
              </div>
            </div>
          </div>
        </main>

      </div>
    </div>
  );
}

export default App;
