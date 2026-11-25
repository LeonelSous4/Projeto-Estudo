import { Sidebar } from "./components/sidebar";
import { Header } from "./components/header";
import { GoalBanner } from "./components/goalBanner";
import { SummaryCards } from "./components/SummaryCards";
import { WeekStudy } from "./components/WeekStudy";
import { Timer } from "./components/Timer";
import { TimeDistribuition } from "./components/TimeDistribuition";
import { MonthEvolution } from "./components/MonthEvolution";
import { Collections } from "./components/Collections";
import { TodaySessions } from "./components/TodaySessions";
import { SidebarRight } from "./components/SidebarRight";

export function App() {
  return (
    <div className="min-h-screen w-full bg-[var(--page)] text-[var(--ink)] antialiased transition-colors duration-200">
      {/* Moldura principal da aplicação (shell) */}
      <div className="min-h-screen w-full bg-[var(--shell)] overflow-hidden flex flex-col md:flex-row">
        
        {/* 1. Sidebar à esquerda */}
        <Sidebar />

        {/* 2. Área Central e painel direito */}
        <div className="flex min-w-0 flex-1 flex-col xl:flex-row">
          <main className="min-w-0 flex-1 bg-[var(--page)] overflow-y-auto">
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
                <div className="lg:col-span-3">
                  <MonthEvolution />
                </div>

                <div className="lg:col-span-5">
                  <Collections />
                </div>
                <div className="lg:col-span-5">
                  <TodaySessions />
                </div>
              </div>
            </div>
          </main>
          <SidebarRight />
        </div>

      </div>
    </div>
  );
}

export default App;
