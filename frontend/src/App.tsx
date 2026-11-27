import { useState, useRef, useEffect } from "react";
import { Sidebar } from "./components/sidebar";
import { Header } from "./components/header";
import { GoalBanner } from "./components/goalBanner";
import { SummaryCards } from "./components/SummaryCards";
import { WeekStudy } from "./components/WeekStudy";
import { Timer } from "./components/Timer";
import { TimeDistribuition } from "./components/TimeDistribuition";
import { MonthEvolution } from "./components/MonthEvolution";
import { Collections } from "./components/Collections";
import { AllCollections } from "./components/AllCollections";
import { CollectionNotebooks } from "./components/CollectionNotebooks";
import { NotebookPage } from "./components/NotebookPage";
import { AllNotebooks } from "./components/AllNotebooks";
import { TodaySessions } from "./components/TodaySessions";
import { SidebarRight } from "./components/SidebarRight";
import { type Collection } from "./services/collections";
import { type Notebook } from "./services/notebooks";

export function App() {
  const [paginaAtiva, setPaginaAtiva] = useState<"dashboard" | "colecoes" | "cadernos">("dashboard");
  const [colecaoAberta, setColecaoAberta] = useState<Collection | null>(null);
  const [cadernoAberto, setCadernoAberto] = useState<Notebook | null>(null);
  const [metaHoras, setMetaHoras] = useState(() => {
    const salva = Number(localStorage.getItem("foco-meta-horas"));
    return Number.isFinite(salva) && salva >= 1 && salva <= 16 ? salva : 4;
  });
  // Contador simples: quando o Timer finaliza uma sessão, somamos +1 para os cards e gráficos recarregarem
  const [atualizacaoDashboard, setAtualizacaoDashboard] = useState(0);

  function mudarPagina(novaPagina: "dashboard" | "colecoes" | "cadernos") {
    setPaginaAtiva(novaPagina);
    setColecaoAberta(null);
    setCadernoAberto(null);
  }

  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [paginaAtiva]);

  return (
    <div className="min-h-screen w-full bg-[var(--page)] text-[var(--ink)] antialiased transition-colors duration-200">
      {/* Moldura principal da aplicação (shell) */}
      <div className="min-h-screen w-full bg-[var(--shell)] overflow-hidden flex flex-col md:flex-row">
        
        {/* 1. Sidebar à esquerda */}
        <Sidebar paginaAtiva={paginaAtiva} onMudarPagina={mudarPagina} metaHoras={metaHoras} atualizacao={atualizacaoDashboard} />

        {/* 2. Área Central e painel direito */}
        <div className="flex min-w-0 flex-1 flex-col xl:flex-row">
          <div ref={mainRef} role="main" className="min-w-0 flex-1 bg-[var(--page)] overflow-y-auto">
            <div className="p-4 sm:p-6 lg:p-7 pb-24 space-y-4">
              {paginaAtiva === "colecoes" ? (
                cadernoAberto ? (
                  <NotebookPage
                    caderno={cadernoAberto}
                    onVoltar={() => setCadernoAberto(null)}
                    onAtualizado={() => setAtualizacaoDashboard((n) => n + 1)}
                  />
                ) : colecaoAberta ? (
                  <CollectionNotebooks
                    colecao={colecaoAberta}
                    onVoltar={() => setColecaoAberta(null)}
                    onAbrirCaderno={(caderno) => setCadernoAberto(caderno)}
                  />
                ) : (
                  <AllCollections
                    onVoltar={() => mudarPagina("dashboard")}
                    onAbrirColecao={(colecao) => setColecaoAberta(colecao)}
                  />
                )
              ) : paginaAtiva === "cadernos" ? (
                cadernoAberto ? (
                  <NotebookPage
                    caderno={cadernoAberto}
                    onVoltar={() => setCadernoAberto(null)}
                    onAtualizado={() => setAtualizacaoDashboard((n) => n + 1)}
                  />
                ) : (
                  <AllNotebooks
                    onAbrirCaderno={setCadernoAberto}
                    onVoltar={() => mudarPagina("dashboard")}
                  />
                )
              ) : (
                <>
                  <Header metaHoras={metaHoras} onSalvarMeta={(horas) => {
                    setMetaHoras(horas);
                    localStorage.setItem("foco-meta-horas", String(horas));
                  }} />
                  <GoalBanner metaHoras={metaHoras} atualizacao={atualizacaoDashboard} />
                  <SummaryCards atualizacao={atualizacaoDashboard} metaHoras={metaHoras} />
                  <div className="grid grid-cols-1 gap-3 lg:grid-cols-5">
                    <div className="lg:col-span-3">
                      <WeekStudy atualizacao={atualizacaoDashboard} />
                    </div>
                    <div className="lg:col-span-2">
                      <Timer onSessaoFinalizada={() => setAtualizacaoDashboard((n) => n + 1)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-3 lg:grid-cols-5">
                    <div className="lg:col-span-2">
                      <TimeDistribuition atualizacao={atualizacaoDashboard} />
                    </div>
                    <div className="lg:col-span-3">
                      <MonthEvolution atualizacao={atualizacaoDashboard} />
                    </div>

                    <div className="lg:col-span-5">
                      <Collections
                        atualizacao={atualizacaoDashboard}
                        onVerTodas={() => mudarPagina("colecoes")}
                        onAbrirColecao={(colecao) => {
                          setPaginaAtiva("colecoes");
                          setCadernoAberto(null);
                          setColecaoAberta(colecao);
                        }}
                        onAbrirCaderno={(caderno) => {
                          setPaginaAtiva("colecoes");
                          setCadernoAberto(caderno);
                        }}
                      />
                    </div>
                    <div className="lg:col-span-5">
                      <TodaySessions atualizacao={atualizacaoDashboard} />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
            <SidebarRight atualizacao={atualizacaoDashboard} />
        </div>

      </div>
    </div>
  );
}

export default App;
