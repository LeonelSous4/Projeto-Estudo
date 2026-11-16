import { useState, useEffect } from "react";
import { Plus, Sun, Moon } from "lucide-react";

export function Header() {
  const [theme, setThemeState] = useState<"dark" | "light">(() => {
    try {
      const saved = localStorage.getItem("foco-theme");
      if (saved === "light" || saved === "dark") return saved;
    } catch {}
    return "dark";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("foco-theme", theme);
    } catch {}
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((curr) => (curr === "dark" ? "light" : "dark"));
  };

  const dataHoje = (() => {
    const s = new Date().toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return s.charAt(0).toUpperCase() + s.slice(1);
  })();

  return (
    <header className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="font-display text-[28px] font-extrabold leading-tight text-[var(--ink)]">
          Olá, Leonel! 👋
        </h1>
        <p className="mt-1 text-[13px] text-[var(--muted)]">
          {dataHoje}
        </p>
      </div>

      <div className="flex items-center gap-2">
        {/* Botão de Alternar Tema (Dark/Light) */}
        <button 
          onClick={toggleTheme}
          aria-label="Alternar tema"
          aria-pressed={theme === "light"}
          className="flex h-10 items-center gap-2 rounded-full bg-[var(--surface-2)] px-3 text-[12px] font-semibold text-[var(--ink)] border border-[var(--line)] hover:opacity-90 transition"
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

        {/* Botão + Novo */}
        <button className="flex h-10 items-center gap-2 rounded-full bg-[var(--brand)] px-4 text-[13px] font-bold text-[var(--on-brand)] shadow-sm hover:opacity-95 transition">
          <Plus className="h-4 w-4" />
          <span>Novo</span>
        </button>
      </div>
    </header>
  );
}
