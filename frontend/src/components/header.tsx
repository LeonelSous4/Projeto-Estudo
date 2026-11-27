

import dayjs from "dayjs";
import "dayjs/locale/pt-br";

dayjs.locale("pt-br");




// Hooks do React para controlar estado e executar efeitos.
import { useEffect, useState, type FormEvent } from "react";

// Ícones usados nos botões.
import { Moon, Plus, Sun } from "lucide-react";

interface HeaderProps { onSalvarMeta: (horas: number) => void; metaHoras: number }

export function Header({ onSalvarMeta, metaHoras }: HeaderProps) {
  // Guarda o tema atual. Primeiro tenta recuperar o tema salvo no navegador.
  // Se não houver um tema válido ou o acesso falhar, começa no tema escuro.
  const [theme, setThemeState] = useState<"dark" | "light">(() => {
    try {
      const saved = localStorage.getItem("foco-theme");

      if (saved === "light" || saved === "dark") {
        return saved;
      }
    } catch {
      // O app continua funcionando mesmo se o navegador bloquear o localStorage.
    }

    return "dark";
  });
  const [modalMetaAberto, setModalMetaAberto] = useState(false);
  const [horasMeta, setHorasMeta] = useState(metaHoras);

  useEffect(() => setHorasMeta(metaHoras), [metaHoras]);

  function salvarMeta(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSalvarMeta(horasMeta);
    setModalMetaAberto(false);
  }

  // Sincroniza o tema com o elemento <html> e salva a escolha no navegador.
  // O CSS usa o atributo data-theme para aplicar as cores do tema.
  useEffect(() => {
    document.documentElement.dataset.theme = theme;

    try {
      localStorage.setItem("foco-theme", theme);
    } catch {
      // Se não for possível salvar, o tema ainda funciona nesta visita.
    }
  }, [theme]);

  // Alterna entre os temas claro e escuro.
  function toggleTheme() {
    setThemeState((currentTheme) =>
      currentTheme === "dark" ? "light" : "dark",
    );
  }










  // Cria a data de hoje por extenso em português.
  // A primeira letra é convertida para maiúscula.
 const dataHoje = dayjs().format("dddd, D [de] MMMM [de] YYYY");

  return (
    <header className="flex flex-wrap items-start justify-between gap-3">
      {/* Saudação e data exibidas à esquerda do cabeçalho. */}
      <div>
        <h1 className="font-display text-[28px] font-extrabold leading-tight text-[var(--ink)]">
          Olá, Leonel! 👋
        </h1>

        <p className="mt-1 text-[13px] text-[var(--muted)]">{dataHoje}</p>
      </div>

      {/* Ações exibidas à direita do cabeçalho. */}
      <div className="flex items-center gap-2">
        {/* Botão que alterna entre tema claro e escuro. */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Alternar tema"
          aria-pressed={theme === "light"}
          className="flex h-10 items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface-2)] px-3 text-[12px] font-semibold text-[var(--ink)] transition hover:opacity-90"
        >
          {theme === "dark" ? (
            <>
              <Sun className="h-4 w-4 text-[var(--brand-text)]" />
              <span>Claro</span>
            </>
          ) : (
            <>
              <Moon className="h-4 w-4 text-[var(--brand-text)]" />
              <span>Escuro</span>
            </>
          )}
        </button>

        {/* Botão visual para iniciar uma ação de criação. */}
        <button
          type="button"
          onClick={() => setModalMetaAberto(true)}
          className="flex h-10 cursor-pointer items-center gap-2 rounded-full bg-[var(--brand)] px-4 text-[13px] font-bold text-[var(--on-brand)] shadow-sm transition hover:opacity-95"
        >
          <Plus className="h-4 w-4" />
          <span>Crie sua meta</span>
        </button>
      </div>
      {modalMetaAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={(event) => { if (event.target === event.currentTarget) setModalMetaAberto(false); }}>
          <form onSubmit={salvarMeta} className="w-full max-w-sm rounded-[20px] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-2xl">
            <h2 className="font-display text-xl font-bold text-[var(--ink)]">Meta diária de estudo</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">Escolha quantas horas quer estudar por dia. Você pode mudar quando quiser.</p>
            <label htmlFor="meta-horas" className="mt-5 block text-xs font-bold uppercase text-[var(--muted)]">Horas por dia</label>
            <input id="meta-horas" type="number" min="1" max="16" step="0.5" value={horasMeta} onChange={(event) => setHorasMeta(Number(event.target.value))} className="mt-1 h-12 w-full rounded-xl border border-[var(--line)] bg-[var(--surface-2)] px-3 text-lg font-bold text-[var(--ink)] outline-none focus:border-[var(--brand)]" />
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setModalMetaAberto(false)} className="rounded-xl px-4 py-2 text-sm font-semibold text-[var(--muted)] hover:bg-[var(--surface-2)]">Cancelar</button>
              <button type="submit" disabled={horasMeta < 1 || horasMeta > 16} className="rounded-xl bg-[var(--brand)] px-4 py-2 text-sm font-bold text-[var(--on-brand)] disabled:opacity-50">Salvar meta</button>
            </div>
          </form>
        </div>
      )}
    </header>
  );
}
