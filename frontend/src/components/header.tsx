

import dayjs from "dayjs";
import "dayjs/locale/pt-br";

dayjs.locale("pt-br");




// Hooks do React para controlar estado e executar efeitos.
import { useEffect, useState } from "react";

// Ícones usados nos botões.
import { Moon, Plus, Sun } from "lucide-react";

export function Header() {
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
        {/* <button
          type="button"
          className="flex h-10 items-center gap-2 rounded-full bg-[var(--brand)] px-4 text-[13px] font-bold text-[var(--on-brand)] shadow-sm transition hover:opacity-95"
        >
          <Plus className="h-4 w-4" />
          <span>Novo</span>
        </button> */}
      </div>
    </header>
  );
}
