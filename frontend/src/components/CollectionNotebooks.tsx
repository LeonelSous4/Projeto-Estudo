import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, BookOpen, Plus, X } from "lucide-react";
import { type Collection } from "../services/collections";
import {
  createNotebook,
  getNotebooks,
  type Notebook,
} from "../services/notebooks";
import { getTopics, type Topic } from "../services/topics";

interface CollectionNotebooksProps {
  colecao: Collection;
  onVoltar: () => void;
  onAbrirCaderno: (caderno: Notebook) => void;
}

export function CollectionNotebooks({
  colecao,
  onVoltar,
  onAbrirCaderno,
}: CollectionNotebooksProps) {
  const [cadernos, setCadernos] = useState<Notebook[]>([]);
  const [topicos, setTopicos] = useState<Topic[]>([]);

  // Modal de "Novo caderno"
  const [modalAberto, setModalAberto] = useState(false);
  const [nomeNovo, setNomeNovo] = useState("");
  const [erroNovo, setErroNovo] = useState("");

  // Carrega os cadernos desta coleção e os tópicos para calcular o progresso
  useEffect(() => {
    Promise.all([getNotebooks(colecao.id), getTopics()])
      .then(([listaCadernos, listaTopicos]) => {
        setCadernos(listaCadernos);
        setTopicos(listaTopicos);
      })
      .catch(() => {
        // Mantém a tela limpa se a API falhar
      });
  }, [colecao.id]);

  function fecharModal() {
    setModalAberto(false);
    setNomeNovo("");
    setErroNovo("");
  }

  async function salvarNovoCaderno(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nome = nomeNovo.trim();
    if (!nome) return;

    const jaExiste = cadernos.some(
      (c) => c.name.toLowerCase() === nome.toLowerCase()
    );
    if (jaExiste) {
      setErroNovo("Já existe um caderno com esse nome nesta coleção.");
      return;
    }

    try {
      await createNotebook(nome, colecao.id);
      const atualizados = await getNotebooks(colecao.id);
      setCadernos(atualizados);
      fecharModal();
    } catch {
      setErroNovo("Não foi possível criar o caderno.");
    }
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho da coleção */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={onVoltar}
            className="mb-3 flex h-9 items-center gap-1.5 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3 text-[12px] font-bold text-[var(--muted)] transition hover:border-[var(--brand)] hover:text-[var(--ink)] cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>

          <p className="text-[12px] font-semibold text-[var(--muted)]">
            Coleção
          </p>
          <h1 className="font-display mt-1 text-[clamp(24px,4vw,32px)] font-extrabold text-[var(--ink)]">
            Coleção: {colecao.name}
          </h1>
          <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-[var(--muted)]">
            Escolha um caderno para organizar os tópicos, escrever resumos e
            registrar suas sessões de estudo.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalAberto(true)}
          className="flex h-10 items-center gap-2 rounded-full bg-[var(--brand)] px-4 text-[13px] font-bold text-[var(--on-brand)] transition hover:opacity-90 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Novo caderno
        </button>
      </div>

      {/* Grid de cadernos */}
      {cadernos.length === 0 ? (
        <div className="rounded-[18px] border border-dashed border-[var(--line)] bg-[var(--surface)] p-12 text-center">
          <p className="text-[14px] font-semibold text-[var(--ink)]">
            Nenhum caderno nesta coleção ainda
          </p>
          <p className="mt-1 text-[12px] text-[var(--muted)]">
            Clique em "+ Novo caderno" para adicionar o primeiro.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {cadernos.map((caderno) => {
            const topicosCaderno = topicos.filter(
              (t) => t.notebook_id === caderno.id
            );
            const concluidos = topicosCaderno.filter((t) =>
              Boolean(t.is_completed)
            ).length;
            const total = topicosCaderno.length;
            const pct = total > 0 ? Math.round((concluidos / total) * 100) : 0;

            return (
              <article
                key={caderno.id}
                tabIndex={0}
                role="button"
                aria-label={`Abrir caderno ${caderno.name}`}
                onClick={() => onAbrirCaderno(caderno)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onAbrirCaderno(caderno);
                  }
                }}
                className="cursor-pointer rounded-[18px] border border-[var(--line)] bg-[var(--surface)] p-4 shadow-[var(--shadow)] transition hover:border-[var(--brand)]"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--surface-2)] text-[var(--brand-text)]">
                    <BookOpen className="h-5 w-5" />
                  </span>
                </div>

                <h2 className="font-display mt-4 text-[16px] font-bold text-[var(--ink)] [overflow-wrap:anywhere]">
                  {caderno.name}
                </h2>
                <p className="mt-1 text-[12px] text-[var(--muted)]">
                  {concluidos} de {total}{" "}
                  {total === 1 ? "tópico concluído" : "tópicos concluídos"}
                </p>

                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--track)]">
                  <div
                    className="h-full rounded-full bg-[var(--brand)] transition-all duration-200"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-[12px] font-bold text-[var(--muted)]">
                    {pct}% concluído
                  </span>
                  <span className="flex h-9 items-center rounded-xl bg-[var(--brand)] px-3 text-[12px] font-bold text-[var(--on-brand)]">
                    Abrir caderno →
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Modal de criar caderno */}
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
            aria-labelledby="novo-caderno-titulo"
            className="w-full max-w-[480px] rounded-[22px] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-2xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2
                id="novo-caderno-titulo"
                className="font-display text-[20px] font-bold text-[var(--ink)]"
              >
                Novo caderno
              </h2>
              <button
                type="button"
                onClick={fecharModal}
                aria-label="Fechar"
                className="rounded-full p-1 text-[var(--muted)] transition hover:text-[var(--ink)] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={salvarNovoCaderno}>
              <label
                htmlFor="nome-novo-caderno"
                className="mb-1.5 block text-[12px] font-bold uppercase text-[var(--muted)]"
              >
                Nome do caderno
              </label>
              <input
                id="nome-novo-caderno"
                autoFocus
                value={nomeNovo}
                onChange={(e) => {
                  setNomeNovo(e.target.value);
                  setErroNovo("");
                }}
                placeholder="Ex.: Direito Constitucional"
                className="h-14 w-full rounded-[16px] border-2 border-[var(--brand)] bg-[var(--surface-2)] px-4 text-[15px] text-[var(--ink)] outline-none placeholder:text-[var(--faint)]"
              />
              {erroNovo && (
                <p className="mt-2 text-[12px] text-[var(--danger)]">
                  {erroNovo}
                </p>
              )}

              <div className="mt-5 grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={fecharModal}
                  className="h-12 rounded-[15px] bg-[var(--surface-2)] text-[14px] font-bold text-[var(--ink)] transition hover:opacity-80 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!nomeNovo.trim()}
                  className="h-12 rounded-[15px] bg-[var(--brand)] text-[14px] font-bold text-[var(--on-brand)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
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
