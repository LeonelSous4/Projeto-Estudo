import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, Folder, Plus, Trash, X } from "lucide-react";
import {
  getCollections,
  deleteCollection,
  createCollection,
  type Collection,
} from "../services/collections";
import { getNotebooks, type Notebook } from "../services/notebooks";
import { getTopics, type Topic } from "../services/topics";
import {
  getStudySessions,
  type StudySession,
  type StudyType,
} from "../services/studySessions";
import { formatarDuracao } from "../utils/formatTime";

// ============================================================================
// 1. TIPOS E CORES AUXILIARES
// ============================================================================

interface CadernoResumo {
  id: number;
  nome: string;
  colecaoId: number;
  colecaoNome: string;
  topicosConcluidos: number;
  totalTopicos: number;
  tempoSegundos: number;
  tipoMaisEstudado: StudyType;
}

const TONS_TIPO: Record<StudyType, string> = {
  teoria: "var(--teoria-tint)",
  questoes: "var(--questoes-tint)",
  revisao: "var(--revisao-tint)",
};

// ============================================================================
// 2. COMPONENTE PRINCIPAL
// ============================================================================

interface CollectionsProps {
  onVerTodas?: () => void;
  onAbrirColecao?: (colecao: Collection) => void;
  onAbrirCaderno?: (caderno: Notebook) => void;
  atualizacao?: number;
}

export function Collections({
  onVerTodas,
  onAbrirColecao,
  onAbrirCaderno,
  atualizacao = 0,
}: CollectionsProps) {
  // --------------------------------------------------------------------------
  // Estados da tela
  // --------------------------------------------------------------------------
  const [colecoes, setColecoes] = useState<Collection[]>([]);
  const [cadernos, setCadernos] = useState<Notebook[]>([]);
  const [topicos, setTopicos] = useState<Topic[]>([]);
  const [sessoes, setSessoes] = useState<StudySession[]>([]);
  const [colecaoSelecionada, setColecaoSelecionada] = useState("Todas");

  // Estados do Modal de "Nova coleção"
  const [modalAberto, setModalAberto] = useState(false);
  const [nomeNovaColecao, setNomeNovaColecao] = useState("");
  const [erroNovaColecao, setErroNovaColecao] = useState("");

  // --------------------------------------------------------------------------
  // Efeitos (useEffect)
  // --------------------------------------------------------------------------

  // Busca coleções, cadernos, tópicos e sessões do backend ao abrir ou atualizar
  useEffect(() => {
    Promise.all([
      getCollections(),
      getNotebooks(),
      getTopics(),
      getStudySessions(),
    ])
      .then(([listaColecoes, listaCadernos, listaTopicos, listaSessoes]) => {
        setColecoes(listaColecoes);
        setCadernos(listaCadernos);
        setTopicos(listaTopicos);
        setSessoes(listaSessoes);
      })
      .catch(() => {
        // Mantém os dados atuais caso o servidor esteja indisponível
      });
  }, [atualizacao]);

  // Fecha o modal ao apertar a tecla ESC
  useEffect(() => {
    if (!modalAberto) return;

    function fecharComEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        fecharModal();
      }
    }

    document.addEventListener("keydown", fecharComEscape);
    return () => document.removeEventListener("keydown", fecharComEscape);
  }, [modalAberto]);

  // --------------------------------------------------------------------------
  // Funções de Ação (Criar e Excluir Coleção)
  // --------------------------------------------------------------------------

  function abrirModal() {
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setNomeNovaColecao("");
    setErroNovaColecao("");
  }

  async function salvarNovaColecao(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nome = nomeNovaColecao.trim();

    if (!nome) return;

    const jaExiste = colecoes.some(
      (colecao) => colecao.name.toLowerCase() === nome.toLowerCase()
    );

    if (jaExiste) {
      setErroNovaColecao("Já existe uma coleção com esse nome.");
      return;
    }

    try {
      await createCollection(nome);
      const dados = await getCollections();
      setColecoes(dados);
      setColecaoSelecionada(nome);
      fecharModal();
    } catch {
      setErroNovaColecao("Não foi possível criar a coleção.");
    }
  }

  async function handleDeleteCollection(id: number, nome: string) {
    const aviso = window.confirm(
      "Tem certeza que deseja excluir esta coleção? Esta ação não pode ser desfeita."
    );
    if (!aviso) return;

    try {
      await deleteCollection(id);
      setColecoes((atuais) => atuais.filter((colecao) => colecao.id !== id));
      setCadernos((atuais) =>
        atuais.filter((caderno) => caderno.collection_id !== id)
      );
      if (colecaoSelecionada === nome) {
        setColecaoSelecionada("Todas");
      }
    } catch {
      alert("Erro ao excluir coleção.");
    }
  }

  // --------------------------------------------------------------------------
  // Dados derivados (junta cadernos + tópicos + sessões de estudo)
  // --------------------------------------------------------------------------

  const cadernosComResumo: CadernoResumo[] = cadernos.map((caderno) => {
    const topicosDoCaderno = topicos.filter((t) => t.notebook_id === caderno.id);
    const topicosConcluidos = topicosDoCaderno.filter((t) =>
      Boolean(t.is_completed)
    ).length;

    const sessoesDoCaderno = sessoes.filter((s) => s.notebook_id === caderno.id);
    let tempoTotal = 0;
    const tempoPorTipo: Record<StudyType, number> = {
      teoria: 0,
      questoes: 0,
      revisao: 0,
    };

    for (const s of sessoesDoCaderno) {
      tempoTotal += s.duration_seconds;
      tempoPorTipo[s.type] += s.duration_seconds;
    }

    // Descobre qual tipo teve mais tempo estudado neste caderno
    let tipoMaisEstudado: StudyType = "teoria";
    if (
      tempoPorTipo.questoes >= tempoPorTipo.teoria &&
      tempoPorTipo.questoes >= tempoPorTipo.revisao &&
      tempoPorTipo.questoes > 0
    ) {
      tipoMaisEstudado = "questoes";
    } else if (
      tempoPorTipo.revisao > tempoPorTipo.teoria &&
      tempoPorTipo.revisao > tempoPorTipo.questoes
    ) {
      tipoMaisEstudado = "revisao";
    }

    return {
      id: caderno.id,
      nome: caderno.name,
      colecaoId: caderno.collection_id,
      colecaoNome: caderno.collection_name,
      topicosConcluidos,
      totalTopicos: topicosDoCaderno.length,
      tempoSegundos: tempoTotal,
      tipoMaisEstudado,
    };
  });

  const cadernosRecentes = [...cadernosComResumo]
    .sort((a, b) => {
      const dataA = cadernos.find((caderno) => caderno.id === a.id)?.created_at;
      const dataB = cadernos.find((caderno) => caderno.id === b.id)?.created_at;
      return (Date.parse(dataB ?? "") || 0) - (Date.parse(dataA ?? "") || 0);
    })
    .slice(0, 3);

  function calcularTempoDaColecao(nomeColecao: string): number {
    return cadernosComResumo
      .filter(
        (caderno) =>
          nomeColecao === "Todas" || caderno.colecaoNome === nomeColecao
      )
      .reduce((total, caderno) => total + caderno.tempoSegundos, 0);
  }

  function contarCadernosDaColecao(nomeColecao: string): number {
    if (nomeColecao === "Todas") return cadernosComResumo.length;
    return cadernosComResumo.filter(
      (caderno) => caderno.colecaoNome === nomeColecao
    ).length;
  }

  // --------------------------------------------------------------------------
  // Renderização (JSX)
  // --------------------------------------------------------------------------
  return (
    <div className="space-y-6">
      {/* ====================================================================
          SEÇÃO A: LISTA HORIZONTAL DE COLEÇÕES
         ==================================================================== */}
      <section>
        <div className="flex items-center justify-between">
          <h3 className="font-display text-[16px] font-bold text-[var(--ink)]">
            Coleções
          </h3>

          <button
            type="button"
            onClick={onVerTodas}
            className="flex items-center cursor-pointer gap-1 text-[11px] font-bold text-[var(--brand-text)]"
          >
            Ver todas <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <div
          className="mt-2 overflow-x-auto scroll-smooth pb-1"
          style={{ scrollbarWidth: "none" }}
        >
          <div className="flex w-max gap-2">
            {/* Botão "+ Nova coleção" (abre o modal) */}
            <button
              type="button"
              onClick={abrirModal}
              aria-label="Adicionar nova coleção"
              className="group flex min-h-[86px] w-[130px] shrink-0 cursor-pointer flex-col items-center justify-center rounded-[14px] border border-dashed border-[var(--line)] text-[11px] font-semibold text-[var(--muted)] transition-colors hover:border-[var(--brand)]"
            >
              <Plus className="mb-1 h-4 w-4 transition-colors group-hover:text-[var(--brand-text)]" />
              <span className="underline decoration-transparent underline-offset-2 transition-colors group-hover:text-[var(--brand-text)] group-hover:decoration-[var(--brand)]">
                Nova coleção
              </span>
            </button>

            {/* Cards das coleções ("Todas" + lista de coleções do banco) */}
            {[{ id: null, name: "Todas" }, ...colecoes].map((colecao) => {
              const nome = colecao.name;
              const selecionada = colecaoSelecionada === nome;
              const quantidade = contarCadernosDaColecao(nome);

              return (
                <div
                  key={colecao.id ?? "todas"}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    if (colecao.id !== null && onAbrirColecao) onAbrirColecao(colecao as Collection);
                    else setColecaoSelecionada(nome);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      if (colecao.id !== null && onAbrirColecao) onAbrirColecao(colecao as Collection);
                      else setColecaoSelecionada(nome);
                    }
                  }}
                  aria-pressed={selecionada}
                  className={`collection-card min-h-[86px] w-fit min-w-[165px] max-w-[260px] shrink-0 rounded-[14px] border p-3 text-left transition-colors ${
                    selecionada
                      ? "border-[var(--brand)] bg-[var(--brand-tint)]"
                      : "border-[var(--line)] bg-[var(--surface)] hover:border-[var(--brand)]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Folder className="h-4 w-4 text-[var(--brand)]" />

                    {/* Botão de excluir (não aparece na aba "Todas") */}
                    {nome !== "Todas" && (
                      <button
                        type="button"
                        aria-label={`Excluir coleção ${nome}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (colecao.id !== null) {
                            void handleDeleteCollection(colecao.id, nome);
                          }
                        }}
                        className="cursor-pointer rounded-md p-1.5 text-[var(--danger)] transition-colors duration-200 hover:bg-red-500/20"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <p className="mt-2 break-words text-[12px] font-bold leading-tight text-[var(--ink)]">
                    {nome}
                  </p>

                  <p className="mt-1 whitespace-normal break-words text-[9px] text-[var(--muted)]">
                    {quantidade} {quantidade === 1 ? "caderno" : "cadernos"}
                    {nome !== "Todas" &&
                      ` • ${formatarDuracao(calcularTempoDaColecao(nome))}`}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====================================================================
          SEÇÃO B: GRID DE CADERNOS RECENTES (FILTRADOS PELA COLEÇÃO)
         ==================================================================== */}
      <section>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-display text-[14px] font-bold text-[var(--ink)]">
            Cadernos recentes
          </h3>

          <span className="text-[10px] text-[var(--muted)]">
            {cadernosRecentes.length} mais recentes
          </span>
        </div>

        {cadernosRecentes.length === 0 ? (
          <p className="rounded-[14px] border border-dashed border-[var(--line)] p-6 text-center text-[11px] text-[var(--muted)]">
            Você ainda não tem cadernos.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {cadernosRecentes.map((caderno) => {
              const progresso =
                caderno.totalTopicos > 0
                  ? Math.round(
                      (caderno.topicosConcluidos / caderno.totalTopicos) * 100
                    )
                  : 0;

              return (
                <article
                  key={caderno.id}
                  className="rounded-[14px] border border-[var(--line)] bg-[var(--surface)] p-2.5"
                >
                  {/* Capa colorida do caderno */}
                  <div
                    className="flex h-12 items-center rounded-[9px] px-2.5"
                    style={{
                      backgroundImage: `linear-gradient(120deg, var(--surface-2), ${TONS_TIPO[caderno.tipoMaisEstudado]})`,
                    }}
                  >
                    <span className="rounded-full bg-[var(--surface)] px-2 py-1 text-[8px] font-bold text-[var(--ink)]">
                      {caderno.colecaoNome}
                    </span>
                  </div>

                  {/* Título e resumo de tópicos/tempo */}
                  <h4 className="mt-2 font-display text-[12px] font-bold text-[var(--ink)]">
                    {caderno.nome}
                  </h4>

                  <p className="mt-0.5 text-[9px] text-[var(--muted)]">
                    {caderno.topicosConcluidos} de {caderno.totalTopicos} tópicos
                    <span className="px-1">•</span>
                    {formatarDuracao(caderno.tempoSegundos)}
                  </p>

                  {/* Barra de progresso */}
                  <div className="mt-2 flex justify-between text-[8px] text-[var(--muted)]">
                    <span>Progresso</span>
                    <span>{progresso}%</span>
                  </div>

                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[var(--track)]">
                    <div
                      className="h-full rounded-full bg-[var(--brand)]"
                      style={{ width: `${progresso}%` }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const notebookReal = cadernos.find(
                        (c) => c.id === caderno.id
                      );
                      if (notebookReal && onAbrirCaderno) {
                        onAbrirCaderno(notebookReal);
                      } else {
                        onVerTodas?.();
                      }
                    }}
                    className="mt-2 inline-flex cursor-pointer items-center gap-1 text-[9px] font-bold text-[var(--brand-text)] hover:underline"
                  >
                    Continuar estudando
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* ====================================================================
          SEÇÃO C: MODAL DE CRIAR NOVA COLEÇÃO
         ==================================================================== */}
      {modalAberto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={(event) => {
            if (event.target === event.currentTarget) fecharModal();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="nova-colecao-titulo"
            className="w-full max-w-[525px] rounded-[22px] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-2xl"
          >
            {/* Cabeçalho do modal */}
            <div className="mb-5 flex items-center justify-between">
              <h2
                id="nova-colecao-titulo"
                className="font-display text-[20px] font-bold text-[var(--ink)]"
              >
                Nova coleção
              </h2>

              <button
                type="button"
                onClick={fecharModal}
                aria-label="Fechar"
                className="rounded-full p-1 text-[var(--muted)] transition hover:text-[var(--ink)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Formulário */}
            <form onSubmit={salvarNovaColecao}>
              <label
                htmlFor="nome-nova-colecao"
                className="mb-1.5 block text-[12px] font-bold uppercase text-[var(--muted)]"
              >
                Nome
              </label>

              <input
                id="nome-nova-colecao"
                autoFocus
                value={nomeNovaColecao}
                onChange={(event) => {
                  setNomeNovaColecao(event.target.value);
                  setErroNovaColecao("");
                }}
                placeholder="Ex.: Programação"
                className="h-16 w-full rounded-[16px] border-2 border-[var(--brand)] bg-[var(--surface-2)] px-4 text-[15px] text-[var(--ink)] outline-none placeholder:text-[var(--faint)]"
              />

              {erroNovaColecao && (
                <p className="mt-2 text-[12px] text-[var(--danger)]">
                  {erroNovaColecao}
                </p>
              )}

              {/* Botões do formulário */}
              <div className="mt-5 grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={fecharModal}
                  className="h-[54px] rounded-[15px] bg-[var(--surface-2)] text-[14px] font-bold text-[var(--ink)] transition hover:opacity-80"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={!nomeNovaColecao.trim()}
                  className="h-[54px] rounded-[15px] bg-[var(--brand)] text-[14px] font-bold text-[var(--on-brand)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
