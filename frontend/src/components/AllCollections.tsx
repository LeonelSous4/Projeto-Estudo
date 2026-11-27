import { ArrowLeft, Folder, MoreVertical, Pencil, Plus, Trash, X } from "lucide-react";
import { type Collection, getCollections, createCollection, deleteCollection, renameCollection } from "../services/collections";
import { useEffect, useState, type FormEvent } from "react";

// ============================================================================
// 1. PROPS DO COMPONENTE
// ============================================================================

interface AllCollectionsProps {
  onVoltar: () => void;
  onAbrirColecao?: (colecao: Collection) => void;
}


// ============================================================================
// 3. COMPONENTE PRINCIPAL
// ============================================================================

export function AllCollections({ onVoltar, onAbrirColecao }: AllCollectionsProps) {
  // --------------------------------------------------------------------------
  // Estados da tela
  // --------------------------------------------------------------------------
  const [colecoes, setColecoes] = useState<Collection[]>([]);
  const [menuAbertoId, setMenuAbertoId] = useState<number | null>(null);

  // Estados do Modal de "Nova coleção"
  const [modalAberto, setModalAberto] = useState(false);
  const [nomeNovaColecao, setNomeNovaColecao] = useState("");
  const [erroNovaColecao, setErroNovaColecao] = useState("");


  // --------------------------------------------------------------------------
  // Efeitos (useEffect)
  // --------------------------------------------------------------------------

    useEffect(() => {
        getCollections().then((dados) => {
          setColecoes(dados);
        });
      }, []);





  // [INTEGRAÇÃO]: Aqui vai o useEffect para buscar todas as coleções do banco
  // assim que a tela abrir (GET /collections).


  // --------------------------------------------------------------------------
  // Funções de Ação (Lógica + Futura Integração)
  // --------------------------------------------------------------------------

  function fecharModal() {
    setModalAberto(false);
    setNomeNovaColecao("");
    setErroNovaColecao("");
  }

  async function salvarNovaColecao(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nome = nomeNovaColecao.trim();

    if (!nome) return;

    if (colecoes.some((c) => c.name.toLowerCase() === nome.toLowerCase())) {
      setErroNovaColecao("Já existe uma coleção com esse nome.");
      return;
    }

    try {
      await createCollection(nome);
      const dados = await getCollections();
      setColecoes(dados);
      fecharModal();
      return; // ← encerra aqui, não deixa código abaixo rodar
    } catch (error) {
      setErroNovaColecao("Não foi possível criar a coleção.");
    }
  }





  async function renomearColecao(id: number, nomeAtual: string) {
    try {
      const response = window.prompt("Novo nome da coleção:", nomeAtual);

      if (!response) return;

      const novoNome = response.trim();

      if (!novoNome || novoNome === nomeAtual) return;

      if (colecoes.some((c) => c.name.toLowerCase() === novoNome.toLowerCase())) {
        alert("Já existe uma coleção com esse nome.");
        return;
      }

      await renameCollection(id, novoNome);

      const listaAtualizada = colecoes.map((c) =>
        c.id === id ? { ...c, name: novoNome } : c
      );

      setColecoes(listaAtualizada);
      setMenuAbertoId(null);
    } catch (error) {
      alert("Erro ao renomear coleção.");
    }
  }





 async function excluirColecao(id: number) {
  const aviso = window.confirm(
    "Tem certeza que deseja excluir esta coleção? Esta ação não pode ser desfeita."
  );

  if (!aviso) return;

  try {
    await deleteCollection(id);

    setColecoes((atuais) =>
      atuais.filter((colecao) => colecao.id !== id)
    );

    setMenuAbertoId(null);
  } catch (error) {
    alert("Erro ao excluir coleção.");
  }
}












  // --------------------------------------------------------------------------
  // Renderização (JSX)
  // --------------------------------------------------------------------------
  return (
    <div
      className="space-y-6"
      onClick={() => {
        if (menuAbertoId !== null) setMenuAbertoId(null);
      }}
    >

      {/* ====================================================================
          CABEÇALHO DA PÁGINA (Estilo NotebookLM)
         ==================================================================== */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onVoltar}
            className="flex h-9 items-center gap-1.5 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3 text-[12px] font-bold text-[var(--muted)] transition hover:border-[var(--brand)] hover:text-[var(--ink)] cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>

          <div>
            <h1 className="font-display text-[22px] font-extrabold tracking-tight text-[var(--ink)]">
              Minhas coleções
            </h1>
            <p className="text-[12px] text-[var(--muted)]">
              {colecoes.length} {colecoes.length === 1 ? "coleção cadastrada" : "coleções cadastradas"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setModalAberto(true)}
          className="flex h-10 items-center gap-2 rounded-full bg-[var(--brand)] px-4 text-[13px] font-bold text-[var(--on-brand)] transition hover:opacity-90 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Nova coleção
        </button>
      </div>


      {/* ====================================================================
          GRID DE COLEÇÕES
         ==================================================================== */}
      {colecoes.length === 0 ? (
        <div className="rounded-[18px] border border-dashed border-[var(--line)] bg-[var(--surface)] p-12 text-center">
          <p className="text-[14px] font-semibold text-[var(--ink)]">
            Nenhuma coleção encontrada
          </p>
          <p className="mt-1 text-[12px] text-[var(--muted)]">
            Clique em "+ Nova coleção" para criar a primeira.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {colecoes.map((colecao) => {
            const menuAberto = menuAbertoId === colecao.id;

            return (
              <div
                key={colecao.id}
                role="button"
                tabIndex={0}
                onClick={() => onAbrirColecao?.(colecao)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onAbrirColecao?.(colecao);
                  }
                }}
                className="relative flex min-h-[140px] cursor-pointer flex-col justify-between rounded-[18px] border border-[var(--line)] bg-[var(--surface)] p-5 text-left shadow-[var(--shadow)] transition hover:border-[var(--brand)]"
              >
                {/* Topo do card: ícone à esquerda + menu 3 pontinhos à direita */}
                <div className="flex items-start justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-[12px] bg-[var(--brand-tint)]">
                    <Folder className="h-5 w-5 text-[var(--brand-text)]" />
                  </span>

                  <div className="relative">
                    <button
                      type="button"
                      aria-label={`Opções de ${colecao.name}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuAbertoId(menuAberto ? null : colecao.id);
                      }}
                      className="rounded-lg p-1.5 text-[var(--muted)] transition hover:bg-[var(--surface-2)] hover:text-[var(--ink)] cursor-pointer"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>

                    {/* Menu dropdown de ações (Renomear / Excluir) */}
                    {menuAberto && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-0 top-9 z-20 w-36 rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-1 shadow-xl"
                      >
                        {/* [LÓGICA]: Implementar edição/renomear coleção */}
                        <button
                          type="button"
                          onClick={() => renomearColecao(colecao.id, colecao.name)}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[12px] font-medium text-[var(--ink)] hover:bg-[var(--surface)] cursor-pointer"
                        >
                          <Pencil className="h-3.5 w-3.5 text-[var(--muted)]" />
                          Renomear
                        </button>

                        <button
                          type="button"
                          onClick={() => excluirColecao(colecao.id)}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[12px] font-medium text-[var(--danger)] hover:bg-red-500/10 cursor-pointer"
                        >
                          <Trash className="h-3.5 w-3.5" />
                          Excluir
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Rodapé do card: Nome + contagem de cadernos */}
                <div className="mt-6">
                  <h2 className="font-display text-[16px] font-bold leading-snug text-[var(--ink)]">
                    {colecao.name}
                  </h2>
                  {/* <p className="mt-1 text-[12px] text-[var(--muted)]">
                    {colecao.totalCadernos} {colecao.totalCadernos === 1 ? "caderno" : "cadernos"} • {colecao.tempoTexto}
                  </p> */}
                </div>
              </div>
            );
          })}
        </div>
      )}


      {/* ====================================================================
          MODAL DE NOVA COLEÇÃO
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
            aria-labelledby="nova-colecao-pagina-titulo"
            className="w-full max-w-[525px] rounded-[22px] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-2xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2
                id="nova-colecao-pagina-titulo"
                className="font-display text-[20px] font-bold text-[var(--ink)]"
              >
                Nova coleção
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

            <form onSubmit={salvarNovaColecao}>
              <label
                htmlFor="nome-nova-colecao-pagina"
                className="mb-1.5 block text-[12px] font-bold uppercase text-[var(--muted)]"
              >
                Nome
              </label>
              <input
                id="nome-nova-colecao-pagina"
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

              <div className="mt-5 grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={fecharModal}
                  className="h-[54px] rounded-[15px] bg-[var(--surface-2)] text-[14px] font-bold text-[var(--ink)] transition hover:opacity-80 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!nomeNovaColecao.trim()}
                  className="h-[54px] rounded-[15px] bg-[var(--brand)] text-[14px] font-bold text-[var(--on-brand)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
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
