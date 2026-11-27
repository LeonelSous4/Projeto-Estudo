import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  Clock,
  FileText,
  Lock,
  Pause,
  Pencil,
  Play,
  Trash,
} from "lucide-react";
import {
  deleteNotebook,
  renameNotebook,
  type Notebook,
} from "../services/notebooks";
import {
  createTopic,
  deleteTopic,
  getTopics,
  toggleTopic,
  updateTopic,
  type Topic,
} from "../services/topics";
import {
  finishTimer,
  getStudySessions,
  initTimer,
  pauseTimer,
  resumeTimer,
  type StudySession,
  type StudyType,
} from "../services/studySessions";
import {
  formatarDataSessao,
  formatarDuracao,
  formatarHMS,
} from "../utils/formatTime";

interface NotebookPageProps {
  caderno: Notebook;
  onVoltar: () => void;
  onAtualizado?: () => void;
}

type TipoUI = "Teoria" | "Questões" | "Revisão";

const TIPO_PARA_API: Record<TipoUI, StudyType> = {
  Teoria: "teoria",
  Questões: "questoes",
  Revisão: "revisao",
};

const LABEL_DA_API: Record<StudyType, TipoUI> = {
  teoria: "Teoria",
  questoes: "Questões",
  revisao: "Revisão",
};

const COR_TIPO: Record<StudyType, string> = {
  teoria: "var(--teoria)",
  questoes: "var(--questoes)",
  revisao: "var(--revisao)",
};

export function NotebookPage({
  caderno,
  onVoltar,
  onAtualizado,
}: NotebookPageProps) {
  // --------------------------------------------------------------------------
  // Estados principais do caderno, tópicos e histórico
  // --------------------------------------------------------------------------
  const [nomeCaderno, setNomeCaderno] = useState(caderno.name);
  const [topicos, setTopicos] = useState<Topic[]>([]);
  const [sessoes, setSessoes] = useState<StudySession[]>([]);

  // Renomear / Excluir caderno
  const [renomeando, setRenomeando] = useState(false);
  const [novoNomeCaderno, setNovoNomeCaderno] = useState(caderno.name);
  const [confirmarExclusao, setConfirmarExclusao] = useState(false);

  // Novo tópico
  const [tituloNovoTopico, setTituloNovoTopico] = useState("");
  const [resumoNovoTopico, setResumoNovoTopico] = useState("");
  const [mostrarResumoInicial, setMostrarResumoInicial] = useState(false);

  // Edição do título de um tópico inline
  const [editandoTopicoId, setEditandoTopicoId] = useState<number | null>(null);
  const [tituloEditado, setTituloEditado] = useState("");

  // Tópico selecionado e editor de resumo
  const [topicoSelecionadoId, setTopicoSelecionadoId] = useState<number | null>(
    null
  );
  const [rascunhoResumo, setRascunhoResumo] = useState("");
  const [salvandoResumo, setSalvandoResumo] = useState(false);

  // Cronômetro rápido deste caderno
  const [tipoEstudo, setTipoEstudo] = useState<TipoUI>("Teoria");
  const [sessaoAtivaId, setSessaoAtivaId] = useState<number | null>(null);
  const [statusTimer, setStatusTimer] = useState<
    "parado" | "rodando" | "pausado"
  >("parado");
  const [segundosDecorridos, setSegundosDecorridos] = useState(0);
  const [salvandoTimer, setSalvandoTimer] = useState(false);

  // Aviso simples (toast)
  const [aviso, setAviso] = useState<string | null>(null);

  function mostrarAviso(mensagem: string) {
    setAviso(mensagem);
    window.setTimeout(() => setAviso(null), 3000);
  }

  // --------------------------------------------------------------------------
  // Carrega tópicos e sessões do caderno ao abrir
  // --------------------------------------------------------------------------
  async function carregarDadosDoCaderno() {
    try {
      const [listaTopicos, listaSessoes] = await Promise.all([
        getTopics(caderno.id),
        getStudySessions(caderno.id),
      ]);

      setTopicos(listaTopicos);
      // Ordena histórico da sessão mais recente para a mais antiga
      setSessoes(
        [...listaSessoes].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      );

      // Seleciona o primeiro tópico automaticamente se nenhum estiver selecionado
      if (listaTopicos.length > 0 && topicoSelecionadoId === null) {
        setTopicoSelecionadoId(listaTopicos[0].id);
        setRascunhoResumo(listaTopicos[0].content ?? "");
      }
    } catch {
      mostrarAviso("Erro ao carregar dados do caderno.");
    }
  }

  useEffect(() => {
    setNomeCaderno(caderno.name);
    setNovoNomeCaderno(caderno.name);
    setTopicoSelecionadoId(null);
    setRascunhoResumo("");
    void carregarDadosDoCaderno();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caderno.id]);

  // Relógio do cronômetro quando está rodando
  useEffect(() => {
    if (statusTimer !== "rodando") return;
    const intervalo = window.setInterval(() => {
      setSegundosDecorridos((v) => v + 1);
    }, 1000);
    return () => window.clearInterval(intervalo);
  }, [statusTimer]);

  // --------------------------------------------------------------------------
  // Ações do Caderno (Renomear e Excluir)
  // --------------------------------------------------------------------------
  async function salvarNomeCaderno() {
    const nome = novoNomeCaderno.trim();
    if (!nome) return;
    try {
      await renameNotebook(caderno.id, nome);
      setNomeCaderno(nome);
      setRenomeando(false);
      onAtualizado?.();
      mostrarAviso("Caderno renomeado.");
    } catch {
      mostrarAviso("Não foi possível renomear o caderno.");
    }
  }

  async function excluirEsteCaderno() {
    try {
      await deleteNotebook(caderno.id);
      onAtualizado?.();
      onVoltar();
    } catch {
      mostrarAviso("Erro ao excluir caderno.");
    }
  }

  // --------------------------------------------------------------------------
  // Ações dos Tópicos (Criar, Concluir, Editar, Excluir, Salvar resumo)
  // --------------------------------------------------------------------------
  async function adicionarTopico() {
    const nome = tituloNovoTopico.trim();
    if (!nome) return;

    try {
      await createTopic(nome, caderno.id, resumoNovoTopico.trim() || undefined);
      setTituloNovoTopico("");
      setResumoNovoTopico("");
      setMostrarResumoInicial(false);
      const atualizados = await getTopics(caderno.id);
      setTopicos(atualizados);
      const ultimo = atualizados[atualizados.length - 1];
      if (ultimo) {
        setTopicoSelecionadoId(ultimo.id);
        setRascunhoResumo(ultimo.content ?? "");
      }
      onAtualizado?.();
      mostrarAviso("Tópico adicionado.");
    } catch {
      mostrarAviso("Erro ao adicionar tópico.");
    }
  }

  async function alternarConclusao(id: number) {
    try {
      const concluido = await toggleTopic(id);
      setTopicos((atuais) =>
        atuais.map((t) =>
          t.id === id ? { ...t, is_completed: concluido } : t
        )
      );
      onAtualizado?.();
    } catch {
      mostrarAviso("Erro ao atualizar tópico.");
    }
  }

  async function salvarTituloTopico(topico: Topic) {
    const novoTitulo = tituloEditado.trim();
    setEditandoTopicoId(null);
    if (!novoTitulo || novoTitulo === topico.name) return;

    try {
      await updateTopic(topico.id, novoTitulo, topico.content ?? undefined);
      setTopicos((atuais) =>
        atuais.map((t) =>
          t.id === topico.id ? { ...t, name: novoTitulo } : t
        )
      );
      mostrarAviso("Tópico atualizado.");
    } catch {
      mostrarAviso("Erro ao editar tópico.");
    }
  }

  async function excluirTopico(id: number) {
    try {
      await deleteTopic(id);
      setTopicos((atuais) => atuais.filter((t) => t.id !== id));
      if (topicoSelecionadoId === id) {
        setTopicoSelecionadoId(null);
        setRascunhoResumo("");
      }
      onAtualizado?.();
      mostrarAviso("Tópico excluído.");
    } catch {
      mostrarAviso("Erro ao excluir tópico.");
    }
  }

  async function salvarResumo() {
    if (!topicoSelecionado) return;
    setSalvandoResumo(true);
    try {
      await updateTopic(
        topicoSelecionado.id,
        topicoSelecionado.name,
        rascunhoResumo
      );
      setTopicos((atuais) =>
        atuais.map((t) =>
          t.id === topicoSelecionado.id ? { ...t, content: rascunhoResumo } : t
        )
      );
      mostrarAviso("Resumo salvo!");
    } catch {
      mostrarAviso("Erro ao salvar resumo.");
    } finally {
      setSalvandoResumo(false);
    }
  }

  // --------------------------------------------------------------------------
  // Ações do Cronômetro do Caderno
  // --------------------------------------------------------------------------
  async function iniciarOuRetomar() {
    if (salvandoTimer) return;
    setSalvandoTimer(true);
    try {
      if (statusTimer === "parado") {
        const id = await initTimer(caderno.id, TIPO_PARA_API[tipoEstudo]);
        setSessaoAtivaId(id);
        setSegundosDecorridos(0);
        setStatusTimer("rodando");
      } else if (statusTimer === "pausado" && sessaoAtivaId !== null) {
        await resumeTimer(sessaoAtivaId);
        setStatusTimer("rodando");
      }
    } catch {
      mostrarAviso("Erro ao iniciar o cronômetro.");
    } finally {
      setSalvandoTimer(false);
    }
  }

  async function pausar() {
    if (sessaoAtivaId === null || salvandoTimer) return;
    setSalvandoTimer(true);
    try {
      const segundos = await pauseTimer(sessaoAtivaId);
      setSegundosDecorridos(segundos);
      setStatusTimer("pausado");
    } catch {
      mostrarAviso("Erro ao pausar.");
    } finally {
      setSalvandoTimer(false);
    }
  }

  async function finalizar() {
    if (sessaoAtivaId === null || salvandoTimer) return;
    setSalvandoTimer(true);
    try {
      await finishTimer(sessaoAtivaId);
      setSessaoAtivaId(null);
      setStatusTimer("parado");
      setSegundosDecorridos(0);
      await carregarDadosDoCaderno();
      onAtualizado?.();
      mostrarAviso("Sessão registrada no histórico!");
    } catch {
      mostrarAviso("Erro ao finalizar sessão.");
    } finally {
      setSalvandoTimer(false);
    }
  }

  // --------------------------------------------------------------------------
  // Cálculos derivados para o layout
  // --------------------------------------------------------------------------
  const topicoSelecionado =
    topicos.find((t) => t.id === topicoSelecionadoId) ?? null;

  const concluidos = topicos.filter((t) => Boolean(t.is_completed)).length;
  const progressoPct =
    topicos.length > 0 ? Math.round((concluidos / topicos.length) * 100) : 0;

  let segTeoria = 0;
  let segQuestoes = 0;
  let segRevisao = 0;

  for (const s of sessoes) {
    if (s.type === "teoria") segTeoria += s.duration_seconds;
    else if (s.type === "questoes") segQuestoes += s.duration_seconds;
    else if (s.type === "revisao") segRevisao += s.duration_seconds;
  }

  const totalEstudadoSeg = segTeoria + segQuestoes + segRevisao;
  const divisorBarra = totalEstudadoSeg || 1;

  return (
    <div className="space-y-4">
      {/* ====================================================================
          CABEÇALHO DO CADERNO
         ==================================================================== */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onVoltar}
            className="flex h-9 items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3 text-[12px] font-bold text-[var(--muted)] transition hover:border-[var(--brand)] hover:text-[var(--ink)] cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>

          <span className="rounded-full bg-[var(--surface-2)] px-2.5 py-1 text-[11px] font-bold text-[var(--muted)]">
            {caderno.collection_name}
          </span>
        </div>

        <div className="min-w-0">
          {renomeando ? (
            <div className="flex max-w-md flex-wrap items-center gap-2">
              <input
                value={novoNomeCaderno}
                onChange={(e) => setNovoNomeCaderno(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void salvarNomeCaderno();
                  if (e.key === "Escape") setRenomeando(false);
                }}
                autoFocus
                aria-label="Novo nome do caderno"
                className="h-10 min-w-0 flex-1 rounded-xl bg-[var(--surface-2)] px-3 text-[16px] font-bold text-[var(--ink)] outline-none"
              />
              <button
                type="button"
                onClick={() => void salvarNomeCaderno()}
                className="h-9 rounded-xl bg-[var(--brand)] px-3 text-[12px] font-bold text-[var(--on-brand)] cursor-pointer"
              >
                Salvar
              </button>
              <button
                type="button"
                onClick={() => setRenomeando(false)}
                className="h-9 rounded-xl bg-[var(--surface-2)] px-3 text-[12px] font-bold text-[var(--ink)] cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h1 className="font-display text-[clamp(24px,4vw,34px)] font-extrabold leading-tight text-[var(--ink)] [overflow-wrap:anywhere]">
                {nomeCaderno}
              </h1>
              <button
                type="button"
                onClick={() => {
                  setNovoNomeCaderno(nomeCaderno);
                  setRenomeando(true);
                }}
                aria-label="Renomear caderno"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--surface-2)] text-[var(--muted)] transition hover:text-[var(--ink)] cursor-pointer"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setConfirmarExclusao((v) => !v)}
                aria-label="Excluir caderno"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--surface-2)] text-[var(--muted)] transition hover:text-[var(--danger)] cursor-pointer"
              >
                <Trash className="h-4 w-4" />
              </button>
            </div>
          )}

          {confirmarExclusao && (
            <div className="mt-3 max-w-md rounded-[18px] border border-[var(--line)] bg-[var(--surface)] p-4 shadow-[var(--shadow)]">
              <p className="text-[13px] font-bold text-[var(--ink)]">
                Excluir este caderno?
              </p>
              <p className="mt-1 text-[12px] text-[var(--muted)]">
                Os tópicos e o histórico deste caderno serão removidos.
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => void excluirEsteCaderno()}
                  className="h-9 rounded-xl bg-[var(--danger)] px-3 text-[12px] font-bold text-white cursor-pointer"
                >
                  Excluir caderno
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmarExclusao(false)}
                  className="h-9 rounded-xl bg-[var(--surface-2)] px-3 text-[12px] font-bold text-[var(--ink)] cursor-pointer"
                >
                  Manter caderno
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Cards de resumo do caderno */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <section className="rounded-[18px] border border-[var(--line)] bg-[var(--surface)] p-4 shadow-[var(--shadow)]">
            <div className="flex items-center gap-2 text-[12px] font-semibold text-[var(--muted)]">
              <Clock className="h-4 w-4 text-[var(--brand-text)]" />
              Tempo estudado
            </div>
            <p className="font-display mt-2 text-[32px] font-extrabold leading-none text-[var(--ink)] tabular-nums">
              {formatarDuracao(totalEstudadoSeg)}
            </p>
            <p className="mt-2 text-[11px] text-[var(--faint)]">
              Acumulado neste caderno
            </p>
          </section>

          <section className="rounded-[18px] border border-[var(--line)] bg-[var(--surface)] p-4 shadow-[var(--shadow)]">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-semibold text-[var(--muted)]">
                Progresso
              </span>
              <span className="rounded-full bg-[var(--surface-2)] px-2.5 py-1 text-[11px] font-bold text-[var(--ink)]">
                {progressoPct}%
              </span>
            </div>
            <p className="mt-2 text-[14px] font-bold text-[var(--ink)]">
              {concluidos} de {topicos.length} tópicos concluídos •{" "}
              {progressoPct}%
            </p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--track)]">
              <div
                className="h-full rounded-full bg-[var(--brand)] transition-all duration-200"
                style={{ width: `${progressoPct}%` }}
              />
            </div>
          </section>
        </div>
      </header>

      {/* ====================================================================
          CONTEÚDO EM 2 COLUNAS
         ==================================================================== */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        {/* COLUNA ESQUERDA: Checklist de Tópicos + Resumo */}
        <div className="space-y-4 lg:col-span-3">
          {/* Tópicos */}
          <section className="rounded-[18px] border border-[var(--line)] bg-[var(--surface)] p-4 shadow-[var(--shadow)]">
            <div className="flex items-center justify-between">
              <h2 className="text-[16px] font-bold text-[var(--ink)]">
                Tópicos
              </h2>
              <span className="rounded-full bg-[var(--surface-2)] px-2.5 py-1 text-[11px] font-bold text-[var(--muted)]">
                {concluidos} de {topicos.length}
              </span>
            </div>

            <div className="mt-4 space-y-2">
              <input
                value={tituloNovoTopico}
                onChange={(e) => setTituloNovoTopico(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void adicionarTopico();
                }}
                placeholder="+ Novo tópico"
                aria-label="Nome do novo tópico"
                className="h-11 w-full rounded-xl bg-[var(--surface-2)] px-3 text-[13px] text-[var(--ink)] outline-none placeholder:text-[var(--faint)]"
              />
              {!mostrarResumoInicial ? (
                <button
                  type="button"
                  onClick={() => setMostrarResumoInicial(true)}
                  className="text-[11px] font-semibold text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer"
                >
                  + Adicionar resumo inicial (opcional)
                </button>
              ) : (
                <textarea
                  value={resumoNovoTopico}
                  onChange={(e) => setResumoNovoTopico(e.target.value)}
                  placeholder="Resumo inicial (opcional)"
                  aria-label="Resumo inicial opcional"
                  className="min-h-[72px] w-full rounded-xl bg-[var(--surface-2)] p-3 text-[13px] text-[var(--ink)] outline-none placeholder:text-[var(--faint)]"
                />
              )}
              <button
                type="button"
                onClick={() => void adicionarTopico()}
                disabled={!tituloNovoTopico.trim()}
                className="h-9 w-full rounded-xl bg-[var(--brand)] text-[12px] font-bold text-[var(--on-brand)] transition hover:opacity-90 disabled:opacity-40 cursor-pointer"
              >
                Adicionar
              </button>
            </div>

            <ul className="mt-4 space-y-2">
              {topicos.map((topico) => {
                const selecionado = topicoSelecionadoId === topico.id;
                const editando = editandoTopicoId === topico.id;
                const concluido = Boolean(topico.is_completed);

                return (
                  <li
                    key={topico.id}
                    onClick={() => {
                      if (!editando) {
                        setTopicoSelecionadoId(topico.id);
                        setRascunhoResumo(topico.content ?? "");
                      }
                    }}
                    className="cursor-pointer rounded-xl bg-[var(--surface-2)] p-3 transition"
                    style={
                      selecionado
                        ? {
                            border: "1px solid var(--brand)",
                            backgroundColor: "var(--brand-tint)",
                          }
                        : { border: "1px solid transparent" }
                    }
                  >
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        aria-label={`Concluir ${topico.name}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          void alternarConclusao(topico.id);
                        }}
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition cursor-pointer ${
                          concluido
                            ? "border-[var(--brand)] bg-[var(--brand)] text-[var(--on-brand)]"
                            : "border-[var(--line)] bg-[var(--surface)]"
                        }`}
                      >
                        {concluido && <Check className="h-3.5 w-3.5" />}
                      </button>

                      {editando ? (
                        <span
                          className="flex min-w-0 flex-1 flex-wrap items-center gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            value={tituloEditado}
                            onChange={(e) => setTituloEditado(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter")
                                void salvarTituloTopico(topico);
                              if (e.key === "Escape")
                                setEditandoTopicoId(null);
                            }}
                            autoFocus
                            className="h-8 min-w-0 flex-1 rounded-lg bg-[var(--surface)] px-2 text-[13px] font-semibold text-[var(--ink)] outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => void salvarTituloTopico(topico)}
                            className="h-8 rounded-lg bg-[var(--brand)] px-2 text-[11px] font-bold text-[var(--on-brand)] cursor-pointer"
                          >
                            Salvar
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditandoTopicoId(null)}
                            className="h-8 rounded-lg bg-[var(--surface)] px-2 text-[11px] font-bold text-[var(--ink)] cursor-pointer"
                          >
                            Cancelar
                          </button>
                        </span>
                      ) : (
                        <span
                          className={`min-w-0 flex-1 text-[13px] font-semibold [overflow-wrap:anywhere] ${
                            concluido
                              ? "text-[var(--muted)] line-through"
                              : "text-[var(--ink)]"
                          }`}
                        >
                          {topico.name}
                        </span>
                      )}

                      {Boolean(topico.content?.trim()) && (
                        <span
                          className="shrink-0 text-[var(--muted)]"
                          title="Tem resumo"
                        >
                          <FileText className="h-4 w-4" />
                        </span>
                      )}

                      <button
                        type="button"
                        aria-label={`Editar ${topico.name}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditandoTopicoId(topico.id);
                          setTituloEditado(topico.name);
                        }}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--ink)] cursor-pointer"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        aria-label={`Excluir ${topico.name}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          void excluirTopico(topico.id);
                        }}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--danger)] cursor-pointer"
                      >
                        <Trash className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </li>
                );
              })}

              {topicos.length === 0 && (
                <li className="rounded-xl bg-[var(--surface-2)] p-4 text-center text-[12px] text-[var(--muted)]">
                  Nenhum tópico ainda. Adicione o primeiro acima.
                </li>
              )}
            </ul>
          </section>

          {/* Resumo / anotações */}
          <section className="rounded-[18px] border border-[var(--line)] bg-[var(--surface)] p-4 shadow-[var(--shadow)]">
            {!topicoSelecionado ? (
              <div className="flex min-h-[240px] flex-col items-center justify-center gap-3 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface-2)] text-[var(--faint)]">
                  <FileText className="h-5 w-5" />
                </span>
                <p className="max-w-xs text-[13px] text-[var(--muted)]">
                  Selecione um tópico para ver ou escrever o resumo
                </p>
              </div>
            ) : (
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-display text-[18px] font-bold text-[var(--ink)] [overflow-wrap:anywhere]">
                    {topicoSelecionado.name}
                  </h2>
                  {Boolean(topicoSelecionado.content?.trim()) && (
                    <span className="rounded-full bg-[var(--surface-2)] px-2.5 py-1 text-[11px] font-bold text-[var(--muted)]">
                      Resumo salvo
                    </span>
                  )}
                </div>

                <label
                  htmlFor="resumo-topico"
                  className="mt-1 block text-[11px] text-[var(--faint)]"
                >
                  Resumo / anotações
                </label>

                <textarea
                  id="resumo-topico"
                  value={rascunhoResumo}
                  onChange={(e) => setRascunhoResumo(e.target.value)}
                  placeholder="Escreva o resumo deste tópico aqui..."
                  className="mt-3 min-h-[240px] w-full rounded-xl border-0 bg-[var(--surface-2)] p-4 text-[14px] leading-relaxed text-[var(--ink)] outline-none placeholder:text-[var(--faint)]"
                />

                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="text-[11px] text-[var(--faint)]">
                    {rascunhoResumo.length} caracteres
                  </span>
                  <button
                    type="button"
                    onClick={() => void salvarResumo()}
                    disabled={salvandoResumo}
                    className="h-9 rounded-xl bg-[var(--brand)] px-4 text-[12px] font-bold text-[var(--on-brand)] transition hover:opacity-90 disabled:opacity-60 cursor-pointer"
                  >
                    {salvandoResumo ? "Salvando..." : "Salvar alterações"}
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* COLUNA DIREITA: Estudar agora + Histórico */}
        <div className="space-y-4 lg:col-span-2">
          {/* Estudar agora */}
          <section className="rounded-[18px] border border-[var(--line)] bg-[var(--surface)] p-4 shadow-[var(--shadow)]">
            <div className="flex items-center justify-between">
              <h2 className="text-[16px] font-bold text-[var(--ink)]">
                Estudar agora
              </h2>
              <span
                className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                  statusTimer === "rodando"
                    ? "bg-[var(--brand-tint)] text-[var(--brand-text)]"
                    : "bg-[var(--surface-2)] text-[var(--muted)]"
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)]" />
                {statusTimer === "rodando"
                  ? "Estudando"
                  : statusTimer === "pausado"
                  ? "Pausado"
                  : "Parado"}
              </span>
            </div>

            <div className="mt-3 flex items-center gap-2 rounded-xl bg-[var(--surface-2)] px-3 py-2 text-[12px] font-semibold text-[var(--ink)]">
              <Lock className="h-3.5 w-3.5 text-[var(--muted)]" />
              <span className="[overflow-wrap:anywhere]">{nomeCaderno}</span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {(["Teoria", "Questões", "Revisão"] as TipoUI[]).map((t) => {
                const ativo = tipoEstudo === t;
                return (
                  <button
                    key={t}
                    type="button"
                    disabled={statusTimer !== "parado"}
                    onClick={() => setTipoEstudo(t)}
                    className="rounded-full px-2.5 py-1 text-[11px] font-bold transition disabled:cursor-not-allowed cursor-pointer"
                    style={
                      ativo
                        ? {
                            backgroundColor: COR_TIPO[TIPO_PARA_API[t]],
                            color: "var(--on-type)",
                          }
                        : {
                            backgroundColor: "var(--surface-2)",
                            color: "var(--muted)",
                          }
                    }
                  >
                    {t}
                  </button>
                );
              })}
            </div>

            <p className="font-display mt-4 text-center text-[clamp(36px,6vw,44px)] font-extrabold tabular-nums leading-none text-[var(--ink)]">
              {formatarHMS(segundosDecorridos)}
            </p>
            <p className="mt-2 text-center text-[11px] text-[var(--faint)]">
              Tipo atual: {tipoEstudo}
            </p>

            <div className="mt-4 flex gap-2">
              {statusTimer !== "rodando" ? (
                <button
                  type="button"
                  disabled={salvandoTimer}
                  onClick={() => void iniciarOuRetomar()}
                  className="flex h-9 flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--brand)] text-[12px] font-bold text-[var(--on-brand)] transition hover:opacity-90 disabled:opacity-60 cursor-pointer"
                >
                  <Play className="h-4 w-4 fill-current" />
                  {statusTimer === "pausado"
                    ? "Continuar estudo"
                    : "Iniciar estudo"}
                </button>
              ) : (
                <button
                  type="button"
                  disabled={salvandoTimer}
                  onClick={() => void pausar()}
                  className="flex h-9 flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--brand)] text-[12px] font-bold text-[var(--on-brand)] transition hover:opacity-90 disabled:opacity-60 cursor-pointer"
                >
                  <Pause className="h-4 w-4 fill-current" />
                  Pausar
                </button>
              )}

              <button
                type="button"
                onClick={() => void finalizar()}
                disabled={sessaoAtivaId === null || salvandoTimer}
                className="h-9 rounded-xl bg-[var(--surface-2)] px-4 text-[12px] font-bold text-[var(--ink)] transition hover:opacity-80 disabled:opacity-40 cursor-pointer"
              >
                Finalizar
              </button>
            </div>

            <div className="mt-5 border-t border-[var(--line)] pt-4">
              <p className="text-[12px] font-semibold text-[var(--muted)]">
                Quebra por tipo neste caderno
              </p>
              <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[12px] font-semibold text-[var(--ink)]">
                <span className="flex items-center gap-1.5">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: "var(--teoria)" }}
                  />
                  Teoria {formatarDuracao(segTeoria, true)}
                </span>
                <span className="flex items-center gap-1.5">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: "var(--questoes)" }}
                  />
                  Questões {formatarDuracao(segQuestoes, true)}
                </span>
                <span className="flex items-center gap-1.5">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: "var(--revisao)" }}
                  />
                  Revisão {formatarDuracao(segRevisao, true)}
                </span>
              </p>

              <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-[var(--track)]">
                <div
                  style={{
                    width: `${(segTeoria / divisorBarra) * 100}%`,
                    backgroundColor: "var(--teoria)",
                  }}
                />
                <div
                  style={{
                    width: `${(segQuestoes / divisorBarra) * 100}%`,
                    backgroundColor: "var(--questoes)",
                  }}
                />
                <div
                  style={{
                    width: `${(segRevisao / divisorBarra) * 100}%`,
                    backgroundColor: "var(--revisao)",
                  }}
                />
              </div>
            </div>
          </section>

          {/* Histórico deste caderno */}
          <section className="rounded-[18px] border border-[var(--line)] bg-[var(--surface)] p-4 shadow-[var(--shadow)]">
            <div className="flex items-center justify-between">
              <h2 className="text-[16px] font-bold text-[var(--ink)]">
                Histórico
              </h2>
              <span className="rounded-full bg-[var(--surface-2)] px-2.5 py-1 text-[11px] font-bold text-[var(--muted)]">
                {sessoes.length}{" "}
                {sessoes.length === 1 ? "sessão" : "sessões"}
              </span>
            </div>

            <ul className="mt-3 space-y-2">
              {sessoes.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center gap-3 rounded-xl bg-[var(--surface-2)] px-3 py-3"
                >
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: COR_TIPO[s.type] }}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] font-bold text-[var(--ink)]">
                      {LABEL_DA_API[s.type]}
                    </span>
                    <span className="block text-[11px] text-[var(--muted)]">
                      {formatarDataSessao(s.created_at)}
                    </span>
                  </span>
                  <span className="shrink-0 rounded-full bg-[var(--surface)] px-2.5 py-1 text-[11px] font-bold text-[var(--ink)]">
                    {formatarDuracao(s.duration_seconds, true)}
                  </span>
                </li>
              ))}

              {sessoes.length === 0 && (
                <li className="rounded-xl bg-[var(--surface-2)] p-4 text-center text-[12px] text-[var(--muted)]">
                  Nenhuma sessão ainda. Inicie o cronômetro.
                </li>
              )}
            </ul>
          </section>
        </div>
      </div>

      {/* Aviso temporário (Toast) */}
      {aviso && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-2.5 text-[13px] font-semibold text-[var(--ink)] shadow-[var(--shadow)]"
        >
          {aviso}
        </div>
      )}
    </div>
  );
}
