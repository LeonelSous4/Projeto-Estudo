import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, Folder, Plus, X, Trash } from "lucide-react";

type TipoEstudo = "teoria" | "questoes" | "revisao";

interface Caderno {
  nome: string;
  colecao: string;
  topicosConcluidos: number;
  totalTopicos: number;
  tempoSegundos: number;
  tipoMaisEstudado: TipoEstudo;
}

const colecoesIniciais = ["Programação", "Concursos", "Faculdade"];

const cadernos: Caderno[] = [
  {
    nome: "JavaScript",
    colecao: "Programação",
    topicosConcluidos: 2,
    totalTopicos: 4,
    tempoSegundos: 140880,
    tipoMaisEstudado: "teoria",
  },
  {
    nome: "TypeScript",
    colecao: "Programação",
    topicosConcluidos: 1,
    totalTopicos: 5,
    tempoSegundos: 72511,
    tipoMaisEstudado: "teoria",
  },
  {
    nome: "Direito Constitucional",
    colecao: "Concursos",
    topicosConcluidos: 0,
    totalTopicos: 8,
    tempoSegundos: 50280,
    tipoMaisEstudado: "questoes",
  },
  {
    nome: "Direito Administrativo",
    colecao: "Concursos",
    topicosConcluidos: 2,
    totalTopicos: 6,
    tempoSegundos: 48991,
    tipoMaisEstudado: "questoes",
  },
  {
    nome: "Cálculo I",
    colecao: "Faculdade",
    topicosConcluidos: 2,
    totalTopicos: 3,
    tempoSegundos: 129420,
    tipoMaisEstudado: "teoria",
  },
  {
    nome: "Banco de Dados",
    colecao: "Faculdade",
    topicosConcluidos: 1,
    totalTopicos: 4,
    tempoSegundos: 68640,
    tipoMaisEstudado: "questoes",
  },
];

const tonsTipo: Record<TipoEstudo, string> = {
  teoria: "var(--teoria-tint)",
  questoes: "var(--questoes-tint)",
  revisao: "var(--revisao-tint)",
};

function formatarDuracao(segundos: number, arredondar = false) {
  const minutosTotais = arredondar
    ? Math.round(segundos / 60)
    : Math.floor(segundos / 60);
  const horas = Math.floor(minutosTotais / 60);
  const minutos = minutosTotais % 60;

  return `${horas}h ${String(minutos).padStart(2, "0")}m`;
}

export function Collections() {
  const [colecoes, setColecoes] = useState(colecoesIniciais);
  const [colecaoSelecionada, setColecaoSelecionada] = useState("Todas");
  const [modalAberto, setModalAberto] = useState(false);
  const [nomeNovaColecao, setNomeNovaColecao] = useState("");
  const [erroNovaColecao, setErroNovaColecao] = useState("");

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

  function fecharModal() {
    setModalAberto(false);
    setNomeNovaColecao("");
    setErroNovaColecao("");
  }

  function salvarNovaColecao(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nome = nomeNovaColecao.trim();

    if (!nome) return;

    if (colecoes.some((colecao) => colecao.toLowerCase() === nome.toLowerCase())) {
      setErroNovaColecao("Já existe uma coleção com esse nome.");
      return;
    }

    // Adiciona apenas visualmente no estado
    setColecoes((atuais) => [...atuais, nome]);
    setColecaoSelecionada(nome);
    fecharModal();
  }

  function handleDeleteCollection(nomeParaDeletar: string) {
    // Remove apenas visualmente no estado
    setColecoes((atuais) => atuais.filter((colecao) => colecao !== nomeParaDeletar));

    if (colecaoSelecionada === nomeParaDeletar) {
      setColecaoSelecionada("Todas");
    }
  }

  const cadernosVisiveis =
    colecaoSelecionada === "Todas"
      ? cadernos
      : cadernos.filter((caderno) => caderno.colecao === colecaoSelecionada);

  const tempoDaColecao = (nome: string) =>
    cadernos
      .filter((caderno) => nome === "Todas" || caderno.colecao === nome)
      .reduce((total, caderno) => total + caderno.tempoSegundos, 0);

  return (
    <div className="space-y-4">
      <section>
        <div className="flex items-center justify-between">
          <h3 className="font-display text-[16px] font-bold text-[var(--ink)]">
            Coleções
          </h3>
          <button className="flex items-center gap-1 text-[11px] font-bold text-[var(--brand-text)]">
            Ver todas <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <div
          className="mt-2 overflow-x-auto scroll-smooth pb-1"
          style={{ scrollbarWidth: "none" }}
        >
          <div className="flex w-max gap-2">
            {["Todas", ...colecoes].map((nome) => {
              const selecionada = colecaoSelecionada === nome;
              const quantidade =
                nome === "Todas"
                  ? cadernos.length
                  : cadernos.filter((caderno) => caderno.colecao === nome)
                      .length;

              return (
                <button
                  key={nome}
                  type="button"
                  onClick={() => setColecaoSelecionada(nome)}
                  aria-pressed={selecionada}
                  className={`collection-card min-h-[86px] w-fit min-w-[165px] max-w-[260px] shrink-0 rounded-[14px] border p-3 text-left ${
                    selecionada
                      ? "border-[var(--brand)] bg-[var(--brand-tint)]"
                      : "border-[var(--line)] bg-[var(--surface)] hover:border-[var(--brand)]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Folder className="h-4 w-4 text-[var(--brand)]" />

                    {nome !== "Todas" && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCollection(nome);
                        }}
                      >
                        <Trash className="h-4 w-4 text-[var(--danger)] cursor-pointer hover:opacity-80" />
                      </button>
                    )}
                  </div>

                  <p className="mt-2 break-words text-[12px] font-bold leading-tight text-[var(--ink)]">
                    {nome}
                  </p>
                  <p className="mt-1 whitespace-normal break-words text-[9px] text-[var(--muted)]">
                    {quantidade} cadernos
                    {nome !== "Todas" &&
                      ` • ${formatarDuracao(tempoDaColecao(nome), true)}`}
                  </p>
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setModalAberto(true)}
              aria-label="Adicionar nova coleção"
              className="group flex min-h-[86px] w-[130px] shrink-0 flex-col items-center justify-center rounded-[14px] border border-dashed border-[var(--line)] text-[11px] font-semibold text-[var(--muted)] transition-colors hover:border-[var(--brand)]"
            >
              <Plus className="mb-1 h-4 w-4 transition-colors group-hover:text-[var(--brand-text)]" />
              <span className="underline decoration-transparent underline-offset-2 transition-colors group-hover:text-[var(--brand-text)] group-hover:decoration-[var(--brand)]">
                Nova coleção
              </span>
            </button>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-display text-[14px] font-bold text-[var(--ink)]">
            Cadernos recentes
          </h3>
          <span className="text-[10px] text-[var(--muted)]">
            Mostrando {cadernosVisiveis.length} cadernos
          </span>
        </div>

        {cadernosVisiveis.length === 0 ? (
          <p className="rounded-[14px] border border-dashed border-[var(--line)] p-6 text-center text-[11px] text-[var(--muted)]">
            Esta coleção ainda não tem cadernos.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {cadernosVisiveis.map((caderno) => {
              const progresso = Math.round(
                (caderno.topicosConcluidos / caderno.totalTopicos) * 100
              );

              return (
                <article
                  key={caderno.nome}
                  className="rounded-[14px] border border-[var(--line)] bg-[var(--surface)] p-2.5"
                >
                  <div
                    className="flex h-12 items-center rounded-[9px] px-2.5"
                    style={{
                      backgroundImage: `linear-gradient(120deg, var(--surface-2), ${tonsTipo[caderno.tipoMaisEstudado]})`,
                    }}
                  >
                    <span className="rounded-full bg-[var(--surface)] px-2 py-1 text-[8px] font-bold text-[var(--ink)]">
                      {caderno.colecao}
                    </span>
                  </div>

                  <h4 className="mt-2 font-display text-[12px] font-bold text-[var(--ink)]">
                    {caderno.nome}
                  </h4>
                  <p className="mt-0.5 text-[9px] text-[var(--muted)]">
                    {caderno.topicosConcluidos} de {caderno.totalTopicos} tópicos
                    <span className="px-1">•</span>
                    {formatarDuracao(caderno.tempoSegundos)}
                  </p>

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

                  <span className="mt-2 inline-flex items-center gap-1 text-[9px] font-bold text-[var(--brand-text)]">
                    Continuar estudando
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </article>
              );
            })}
          </div>
        )}
      </section>

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
            aria-describedby="nova-colecao-ajuda"
            className="w-full max-w-[525px] rounded-[22px] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-2xl"
          >
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

            <p
              id="nova-colecao-ajuda"
              className="mt-3 text-[12px] text-[var(--muted)]"
            >
              O item criado aparece na tela e fica salvo nos seus registros.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
