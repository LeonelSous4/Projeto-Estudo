import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, ChevronDown, Timer as TimerIcon } from "lucide-react";

// ─── Tipos ──────────────────────────────────────────────────────────────────
type Tipo = "Teoria" | "Questões" | "Revisão";
type Status = "parado" | "rodando" | "pausado";

interface TimerState {
  status: Status;
  tipo: Tipo;
  materiaId: string;
  /** ms acumulados ANTES da rodada atual */
  acumuladoMs: number;
  /** Date.now() do momento em que o timer foi (re)iniciado */
  iniciadoEm: number | null;
  /** Modo Pomodoro ativo? */
  pomodoro: boolean;
}

// ─── Constantes ─────────────────────────────────────────────────────────────
const STORAGE_KEY = "foco-timer-v2";
const POMODORO_MS = 25 * 60 * 1000;
const TIPOS: Tipo[] = ["Teoria", "Questões", "Revisão"];

// Cor de fundo da pill ativa por tipo
function corTipo(tipo: Tipo): string {
  const map: Record<Tipo, string> = {
    Teoria: "var(--teoria)",
    Questões: "var(--questoes)",
    Revisão: "var(--revisao)",
  };
  return map[tipo];
}

// ─── Helpers de formatação ──────────────────────────────────────────────────
function formatRelogio(ms: number): string {
  const totalSeg = Math.floor(Math.abs(ms) / 1000);
  const h = Math.floor(totalSeg / 3600);
  const m = Math.floor((totalSeg % 3600) / 60);
  const s = totalSeg % 60;
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

function formatPomodoro(restanteMs: number): string {
  const totalSeg = Math.max(0, Math.floor(restanteMs / 1000));
  const m = Math.floor(totalSeg / 60);
  const s = totalSeg % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// ─── Leitura/escrita no localStorage ────────────────────────────────────────
function lerStorage(): TimerState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as TimerState;
  } catch {
    return null;
  }
}

function salvarStorage(state: TimerState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* silencioso */
  }
}

function limparStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* silencioso */
  }
}

// ─── Estado inicial ──────────────────────────────────────────────────────────
function estadoInicial(): TimerState {
  return {
    status: "parado",
    tipo: "Teoria",
    materiaId: "5",
    acumuladoMs: 0,
    iniciadoEm: null,
    pomodoro: false,
  };
}

// ─── Componente ─────────────────────────────────────────────────────────────
export function Timer() {
  // --- cadernos / coleções (mock enquanto API não está conectada) ---
  // Quando conectar ao backend, substitua por um useEffect que busca /notebooks
  const colecoes = ["Concurso", "Faculdade", "Programação"];
  const cadernos = [
    { id: "1", nome: "Português", colecao: "Concurso" },
    { id: "2", nome: "Matemática", colecao: "Concurso" },
    { id: "3", nome: "Cálculo", colecao: "Faculdade" },
    { id: "4", nome: "React", colecao: "Programação" },
    { id: "5", nome: "JavaScript", colecao: "Programação" },
  ];

  // --- state do timer ---
  const [ts, setTs] = useState<TimerState>(() => lerStorage() ?? estadoInicial());
  // displayMs = ms totais que o relógio deve mostrar (recalculado a cada tick)
  const [displayMs, setDisplayMs] = useState(0);
  const [salvando, setSalvando] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Calcula ms atuais ──────────────────────────────────────────────────────
  const calcMs = useCallback(
    (state: TimerState): number => {
      if (state.status === "rodando" && state.iniciadoEm !== null) {
        return state.acumuladoMs + (Date.now() - state.iniciadoEm);
      }
      return state.acumuladoMs;
    },
    []
  );

  // ── Tick do intervalo ──────────────────────────────────────────────────────
  const tick = useCallback(() => {
    setTs((prev) => {
      const atual = calcMs(prev);
      setDisplayMs(atual);

      // Auto-finalizar Pomodoro
      if (prev.pomodoro && prev.status === "rodando" && atual >= POMODORO_MS) {
        // Finaliza automaticamente
        limparStorage();
        return estadoInicial();
      }
      return prev;
    });
  }, [calcMs]);

  // ── Gerencia intervalo ─────────────────────────────────────────────────────
  useEffect(() => {
    if (ts.status === "rodando") {
      setDisplayMs(calcMs(ts));
      intervalRef.current = setInterval(tick, 250);
    } else {
      setDisplayMs(ts.acumuladoMs);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [ts.status, tick, calcMs, ts]);

  // ── Page Visibility API — pausa o tick quando a aba está oculta ───────────
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "visible" && ts.status === "rodando") {
        setDisplayMs(calcMs(ts));
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [ts, calcMs]);

  // ── Atualiza storage sempre que o estado muda ──────────────────────────────
  useEffect(() => {
    if (ts.status !== "parado") {
      salvarStorage(ts);
    }
  }, [ts]);

  // ─── Ações ─────────────────────────────────────────────────────────────────
  function iniciar() {
    const novo: TimerState = {
      ...ts,
      status: "rodando",
      acumuladoMs: 0,
      iniciadoEm: Date.now(),
    };
    setTs(novo);
    salvarStorage(novo);
  }

  function pausar() {
    const acumulado = calcMs(ts);
    const novo: TimerState = {
      ...ts,
      status: "pausado",
      acumuladoMs: acumulado,
      iniciadoEm: null,
    };
    setTs(novo);
    salvarStorage(novo);
  }

  function retomar() {
    const novo: TimerState = {
      ...ts,
      status: "rodando",
      iniciadoEm: Date.now(),
    };
    setTs(novo);
    salvarStorage(novo);
  }

  async function finalizar() {
    // Daqui você vai chamar a API para salvar a sessão.
    // Por ora, apenas limpa o estado.
    setSalvando(true);
    await new Promise((r) => setTimeout(r, 400)); // simula latência
    setSalvando(false);
    limparStorage();
    setTs(estadoInicial());
    setDisplayMs(0);
  }

  function trocarTipo(novoTipo: Tipo) {
    if (ts.status !== "parado") return; // bloqueado enquanto roda
    setTs((prev) => ({ ...prev, tipo: novoTipo }));
  }

  function trocarMateria(id: string) {
    if (ts.status !== "parado") return;
    setTs((prev) => ({ ...prev, materiaId: id }));
  }

  function togglePomodoro() {
    if (ts.status !== "parado") return;
    setTs((prev) => ({ ...prev, pomodoro: !prev.pomodoro }));
  }

  // ─── Derivações para o display ─────────────────────────────────────────────
  const pomodoroRestanteMs = Math.max(0, POMODORO_MS - displayMs);
  const pomodoroProgressoPct = Math.min(100, (displayMs / POMODORO_MS) * 100);

  const labelStatus: Record<Status, string> = {
    parado: "Parado",
    rodando: "Rodando",
    pausado: "Pausado",
  };

  const nomeCaderno =
    cadernos.find((c) => c.id === ts.materiaId)?.nome ?? "—";

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <section className="h-full rounded-[18px] border border-[var(--line)] bg-[var(--surface)] p-4 shadow-[var(--shadow)]">

      {/* ── Cabeçalho: título + badge de status ── */}
      <div className="flex items-center justify-between">
        <h3 className="font-display text-[16px] font-bold">Cronômetro</h3>
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-bold transition-colors duration-200 ${
            ts.status === "rodando"
              ? "bg-[var(--brand-tint)] text-[var(--brand-text)]"
              : "bg-[var(--surface-2)] text-[var(--muted)]"
          }`}
        >
          {labelStatus[ts.status]}
        </span>
      </div>

      {/* ── Select de matéria ── */}
      <label
        htmlFor="timer-materia"
        className="mt-3 block text-[11px] font-bold uppercase tracking-wide text-[var(--faint)]"
      >
        Matéria
      </label>
      <div className="relative mt-1.5">
        <select
          id="timer-materia"
          value={ts.materiaId}
          disabled={ts.status !== "parado"}
          onChange={(e) => trocarMateria(e.target.value)}
          className="h-9 w-full rounded-xl border-0 bg-[var(--surface-2)] pl-3 pr-9 text-[12px] font-medium text-[var(--ink)] outline-none disabled:opacity-60 appearance-none"
        >
          <option value="">Selecionar caderno…</option>
          {colecoes.map((col) => (
            <optgroup key={col} label={col}>
              {cadernos
                .filter((c) => c.colecao === col)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
            </optgroup>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--faint)]" />
      </div>

      {/* ── Pills de tipo ── */}
      <div className="mt-2 flex flex-wrap gap-1.5">
        {TIPOS.map((t) => (
          <button
            key={t}
            onClick={() => trocarTipo(t)}
            aria-pressed={ts.tipo === t}
            disabled={ts.status !== "parado"}
            className={`rounded-full px-3 py-1.5 text-[11px] font-bold transition duration-150 disabled:cursor-not-allowed ${
              ts.tipo === t
                ? "text-[var(--on-type)]"
                : "bg-[var(--surface-2)] text-[var(--muted)]"
            }`}
            style={ts.tipo === t ? { background: corTipo(t) } : undefined}
          >
            {t}
          </button>
        ))}

      </div>

      {/* ── Display principal ── */}
      <p
        className="tabular mt-4 text-center font-display leading-none tracking-tight"
        style={{ fontSize: "clamp(38px, 4vw, 56px)", fontWeight: 800 }}
      >
        {ts.pomodoro ? formatPomodoro(pomodoroRestanteMs) : formatRelogio(displayMs)}
      </p>

      {/* ── Subtítulo ── */}
      <p className="mt-1 text-center text-[11px] text-[var(--muted)]">
        {ts.tipo} • {nomeCaderno}
        {ts.pomodoro ? " • Pomodoro 25:00" : ""}
      </p>

      {/* ── Barra de progresso do Pomodoro ── */}
      {ts.pomodoro && (
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--track)]">
          <div
            className="h-full rounded-full bg-[var(--brand)] transition-all duration-300"
            style={{ width: `${pomodoroProgressoPct}%` }}
          />
        </div>
      )}

      {/* ── Botões de ação ── */}
      <div className="mt-3 grid grid-cols-2 gap-2">

        {/* Estado: parado → botão Iniciar em full width */}
        {ts.status === "parado" && (
          <button
            onClick={iniciar}
            className="col-span-2 flex h-9 items-center justify-center gap-1.5 rounded-xl bg-[var(--brand)] text-[12px] font-bold text-[var(--on-brand)] transition hover:opacity-90 active:scale-[0.98]"
          >
            <Play className="h-4 w-4 fill-current" />
            Iniciar
          </button>
        )}

        {/* Estado: rodando → Pausar + Finalizar */}
        {ts.status === "rodando" && (
          <>
            <button
              onClick={pausar}
              className="flex h-9 items-center justify-center gap-1.5 rounded-xl bg-[var(--surface-2)] text-[12px] font-bold transition hover:opacity-80"
            >
              <Pause className="h-4 w-4" />
              Pausar
            </button>
            <button
              onClick={() => void finalizar()}
              disabled={salvando}
              className="flex h-9 items-center justify-center rounded-xl bg-[var(--ink)] text-[12px] font-bold text-[var(--shell)] transition hover:opacity-80 disabled:opacity-60"
            >
              {salvando ? "Salvando…" : "Finalizar"}
            </button>
          </>
        )}

        {/* Estado: pausado → Retomar + Finalizar */}
        {ts.status === "pausado" && (
          <>
            <button
              onClick={retomar}
              className="flex h-9 items-center justify-center gap-1.5 rounded-xl bg-[var(--brand)] text-[12px] font-bold text-[var(--on-brand)] transition hover:opacity-90"
            >
              <Play className="h-4 w-4 fill-current" />
              Retomar
            </button>
            <button
              onClick={() => void finalizar()}
              disabled={salvando}
              className="flex h-9 items-center justify-center rounded-xl bg-[var(--ink)] text-[12px] font-bold text-[var(--shell)] transition hover:opacity-80 disabled:opacity-60"
            >
              {salvando ? "Salvando…" : "Finalizar"}
            </button>
          </>
        )}
      </div>

      <div className="mt-3 rounded-xl bg-[var(--surface-2)] px-3 py-2">
        <button
          type="button"
          onClick={togglePomodoro}
          disabled={ts.status !== "parado"}
          aria-pressed={ts.pomodoro}
          className="flex w-full items-center justify-between gap-2 text-[11px] font-bold text-[var(--ink)] disabled:cursor-not-allowed"
        >
          <span className="flex items-center gap-1.5">
            <TimerIcon className="h-3.5 w-3.5 text-[var(--brand-text)]" />
            Modo Pomodoro
          </span>
          <span
            aria-hidden="true"
            className={`flex h-5 w-9 items-center rounded-full p-0.5 transition-colors ${
              ts.pomodoro ? "bg-[var(--brand)]" : "bg-[var(--line)]"
            }`}
          >
            <span
              className={`h-4 w-4 rounded-full bg-[var(--surface)] shadow transition-transform ${
                ts.pomodoro ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </span>
        </button>
        <p className="mt-1 text-[10px] leading-4 text-[var(--muted)]">
          O Pomodoro conta 25 minutos e salva a sessão ao zerar.
        </p>
      </div>

      {/* ── Dica: tempo acumulado ao pausar ── */}
      {ts.status === "pausado" && (
        <p className="mt-2 text-center text-[11px] text-[var(--muted)]">
          Tempo acumulado: {formatRelogio(ts.acumuladoMs)}
        </p>
      )}
    </section>
  );
}
