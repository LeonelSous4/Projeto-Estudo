import { useState, type FormEvent } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
  UserRound,
  X,
} from "lucide-react";

interface Topic {
  id: number;
  title: string;
  notebook: string;
  dueDate: Date;
  completed: boolean;
}

const notebooks = [
  "JavaScript",
  "Direito Administrativo",
  "Cálculo I",
  "TypeScript",
];

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function addDays(date: Date, amount: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
}

function formatDueDate(date: Date, today: Date) {
  const daysUntilDue = Math.round(
    (startOfDay(date).getTime() - today.getTime()) / 86_400_000,
  );

  if (daysUntilDue === 0) return "Hoje";
  if (daysUntilDue === 1) return "Amanhã";
  if (daysUntilDue < 0) return "Atrasado";
  if (daysUntilDue <= 6) return `Daqui a ${daysUntilDue} dias`;

  return date.toLocaleDateString("pt-BR", { day: "numeric", month: "short" });
}

function createInitialTopics(today: Date): Topic[] {
  return [
    {
      id: 1,
      title: "Closures e escopo léxico",
      notebook: "JavaScript",
      dueDate: today,
      completed: false,
    },
    {
      id: 2,
      title: "Princípios da Administração Pública",
      notebook: "Direito Administrativo",
      dueDate: addDays(today, 1),
      completed: false,
    },
    {
      id: 3,
      title: "Limites laterais",
      notebook: "Cálculo I",
      dueDate: addDays(today, 4),
      completed: false,
    },
    {
      id: 4,
      title: "Tipos genéricos",
      notebook: "TypeScript",
      dueDate: addDays(today, 6),
      completed: false,
    },
  ];
}

function createStudyDates(today: Date) {
  return new Set(
    [0, -1, -2, -3, -4, -5, -6, -7, -8, -10, -13, -17, -20, -25].map(
      (offset) => dateKey(addDays(today, offset)),
    ),
  );
}

function countCurrentStreak(studyDates: Set<string>, today: Date) {
  let current = studyDates.has(dateKey(today)) ? today : addDays(today, -1);
  let streak = 0;

  while (studyDates.has(dateKey(current))) {
    streak += 1;
    current = addDays(current, -1);
  }

  return streak;
}

function countBestStreak(studyDates: Set<string>, today: Date) {
  let best = 0;
  let current = 0;

  for (let offset = 30; offset >= 0; offset -= 1) {
    if (studyDates.has(dateKey(addDays(today, -offset)))) {
      current += 1;
      best = Math.max(best, current);
    } else {
      current = 0;
    }
  }

  return best;
}

export function SidebarRight() {
  const today = startOfDay(new Date());
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [topics, setTopics] = useState(() => createInitialTopics(today));
  const [isAddingTopic, setIsAddingTopic] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [newTopicNotebook, setNewTopicNotebook] = useState(notebooks[0]);
  const [newTopicDueDate, setNewTopicDueDate] = useState(dateKey(today));
  const studyDates = createStudyDates(today);
  const pendingTopics = topics.filter((topic) => !topic.completed);
  const completedTopics = topics.length - pendingTopics.length;
  const streak = countCurrentStreak(studyDates, today);
  const bestStreak = countBestStreak(studyDates, today);

  const monthTitle = visibleMonth.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });
  const firstWeekday = visibleMonth.getDay();
  const daysInMonth = new Date(
    visibleMonth.getFullYear(),
    visibleMonth.getMonth() + 1,
    0,
  ).getDate();
  const gridCellCount = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;

  function changeMonth(amount: number) {
    setVisibleMonth(
      (month) => new Date(month.getFullYear(), month.getMonth() + amount, 1),
    );
  }

  function toggleTopic(id: number) {
    setTopics((currentTopics) =>
      currentTopics.map((topic) =>
        topic.id === id ? { ...topic, completed: !topic.completed } : topic,
      ),
    );
  }

  function addTopic(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = newTopicTitle.trim();
    if (!title) return;

    const [year, month, day] = newTopicDueDate.split("-").map(Number);
    setTopics((currentTopics) => [
      ...currentTopics,
      {
        id: Date.now(),
        title,
        notebook: newTopicNotebook,
        dueDate: new Date(year, month - 1, day),
        completed: false,
      },
    ]);
    setNewTopicTitle("");
    setNewTopicDueDate(dateKey(today));
    setIsAddingTopic(false);
  }

  return (
    <aside className="w-full shrink-0 border-t border-[var(--line)] bg-[var(--shell)] p-4 sm:p-5 xl:w-[320px] xl:border-l xl:border-t-0">
      <div className="space-y-5">
        <section className="flex items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--brand)] text-[13px] font-extrabold text-[var(--on-brand)]">
            LN
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-semibold text-[var(--ink)]">
              Leonel
            </p>
            <p className="text-[12px] text-[var(--muted)]">Estudante</p>
          </div>
          <button
            type="button"
            className="flex h-8 items-center gap-1.5 rounded-full border border-[var(--line)] px-3 text-[11px] font-semibold text-[var(--muted)] transition hover:bg-[var(--surface-2)] hover:text-[var(--ink)]"
          >
            <UserRound className="h-3.5 w-3.5" />
            Perfil
          </button>
        </section>

        <section className="rounded-[18px] border border-[var(--line)] bg-[var(--surface)] p-4 shadow-[var(--shadow)]">
          <div className="mb-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              aria-label="Mês anterior"
              className="grid h-8 w-8 place-items-center rounded-lg text-[var(--muted)] transition hover:bg-[var(--surface-2)] hover:text-[var(--ink)]"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <h2 className="font-display text-[14px] font-bold capitalize text-[var(--ink)]">
              {monthTitle}
            </h2>
            <button
              type="button"
              onClick={() => changeMonth(1)}
              aria-label="Próximo mês"
              className="grid h-8 w-8 place-items-center rounded-lg text-[var(--muted)] transition hover:bg-[var(--surface-2)] hover:text-[var(--ink)]"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 text-center">
            {["D", "S", "T", "Q", "Q", "S", "S"].map((weekday, index) => (
              <span
                key={`${weekday}-${index}`}
                className="pb-2 text-[10px] font-semibold text-[var(--faint)]"
              >
                {weekday}
              </span>
            ))}
            {Array.from({ length: gridCellCount }, (_, index) => {
              const dayNumber = index - firstWeekday + 1;
              const dayDate = new Date(
                visibleMonth.getFullYear(),
                visibleMonth.getMonth(),
                dayNumber,
              );
              const isToday = dateKey(dayDate) === dateKey(today);
              const hasStudy = studyDates.has(dateKey(dayDate));
              const isCurrentMonth = dayNumber >= 1 && dayNumber <= daysInMonth;

              return (
                <span
                  key={dateKey(dayDate)}
                  aria-current={isToday ? "date" : undefined}
                  className={`relative mx-auto mb-1 grid h-8 w-8 place-items-center rounded-full text-[11px] font-medium ${
                    isToday
                      ? "bg-[var(--brand)] font-bold text-[var(--on-brand)]"
                      : hasStudy && isCurrentMonth
                        ? "bg-[var(--brand-tint)] text-[var(--ink)]"
                        : "text-[var(--muted)]"
                  } ${isCurrentMonth ? "" : "opacity-35"}`}
                >
                  {dayDate.getDate()}
                  {hasStudy && !isToday && (
                    <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-[var(--brand)]" />
                  )}
                </span>
              );
            })}
          </div>

          <p className="mt-2 flex items-center gap-1.5 text-[10px] text-[var(--muted)]">
            <CalendarDays className="h-3 w-3 text-[var(--brand-text)]" />
            <span>● Hoje</span>
            <span>•</span>
            <span>● Dia com estudo</span>
          </p>
        </section>

        <section className="flex items-center gap-3 rounded-[18px] border border-[var(--line)] bg-[var(--surface)] p-4 shadow-[var(--shadow)]">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[12px] bg-[var(--brand-tint)] text-[20px]">
            🔥
          </span>
          <div>
            {streak > 0 ? (
              <>
                <p className="font-display text-[15px] font-bold text-[var(--ink)]">
                  {streak} {streak === 1 ? "dia seguido" : "dias seguidos"}
                </p>
                <p className="text-[11px] text-[var(--muted)]">
                  Seu melhor: {bestStreak} dias
                </p>
              </>
            ) : (
              <>
                <p className="font-display text-[15px] font-bold text-[var(--ink)]">
                  Comece hoje sua sequência
                </p>
                <p className="text-[11px] text-[var(--muted)]">
                  Um pouco de estudo já conta.
                </p>
              </>
            )}
          </div>
        </section>

        <section className="rounded-[18px] border border-[var(--line)] bg-[var(--surface)] p-4 shadow-[var(--shadow)]">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="font-display text-[15px] font-bold text-[var(--ink)]">
                Tópicos pendentes
              </h2>
              <p className="mt-1 text-[11px] text-[var(--muted)]">
                {completedTopics} de {topics.length} concluídos
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-[var(--brand)] px-2.5 py-1 text-[10px] font-bold text-[var(--on-brand)]">
              {pendingTopics.length} pendentes
            </span>
          </div>

          {pendingTopics.length === 0 ? (
            <p className="py-6 text-center text-[13px] text-[var(--muted)]">
              Tudo em dia! 🎉
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-[var(--line)]">
              {pendingTopics.map((topic) => {
                const isDueToday = dateKey(topic.dueDate) === dateKey(today);
                const isOverdue = startOfDay(topic.dueDate) < today;

                return (
                  <li key={topic.id} className="flex gap-2.5 py-3 first:pt-1">
                    <button
                      type="button"
                      aria-label="Marcar tópico como concluído"
                      aria-pressed={topic.completed}
                      onClick={() => toggleTopic(topic.id)}
                      className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded border border-[var(--line)] bg-[var(--surface-2)] transition hover:border-[var(--brand-text)]"
                    >
                      {topic.completed && (
                        <span className="h-2 w-2 rounded-sm bg-[var(--brand)]" />
                      )}
                    </button>
                    <div className="min-w-0 flex-1">
                      <p className="text-[12px] font-semibold leading-4 text-[var(--ink)]">
                        {topic.title}
                      </p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                        <span className="max-w-full truncate rounded-full bg-[var(--surface-2)] px-2 py-0.5 text-[10px] text-[var(--muted)]">
                          {topic.notebook}
                        </span>
                        <span
                          className={`text-[10px] ${
                            isDueToday || isOverdue
                              ? "font-semibold text-[var(--warning)]"
                              : "text-[var(--muted)]"
                          }`}
                        >
                          {formatDueDate(topic.dueDate, today)}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          <button
            type="button"
            onClick={() => setIsAddingTopic(true)}
            className="mt-2 flex h-9 w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-[var(--line)] text-[11px] font-semibold text-[var(--muted)] transition hover:border-[var(--brand-text)] hover:text-[var(--ink)]"
          >
            <Plus className="h-3.5 w-3.5" />
            Adicionar tópico
          </button>
        </section>
      </div>

      {isAddingTopic && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsAddingTopic(false);
          }}
        >
          <form
            onSubmit={addTopic}
            className="w-full max-w-sm rounded-[18px] border border-[var(--line)] bg-[var(--surface)] p-5 shadow-2xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-[17px] font-bold text-[var(--ink)]">
                Novo tópico
              </h2>
              <button
                type="button"
                aria-label="Fechar"
                onClick={() => setIsAddingTopic(false)}
                className="grid h-8 w-8 place-items-center rounded-lg text-[var(--muted)] hover:bg-[var(--surface-2)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <label
              htmlFor="topic-title"
              className="mb-1.5 block text-[11px] font-semibold text-[var(--muted)]"
            >
              Título
            </label>
            <input
              id="topic-title"
              autoFocus
              required
              value={newTopicTitle}
              onChange={(event) => setNewTopicTitle(event.target.value)}
              placeholder="Ex.: Funções assíncronas"
              className="mb-4 h-10 w-full rounded-xl border border-[var(--line)] bg-[var(--surface-2)] px-3 text-[13px] text-[var(--ink)] outline-none placeholder:text-[var(--faint)] focus:border-[var(--brand-text)]"
            />

            <label
              htmlFor="topic-notebook"
              className="mb-1.5 block text-[11px] font-semibold text-[var(--muted)]"
            >
              Caderno
            </label>
            <select
              id="topic-notebook"
              value={newTopicNotebook}
              onChange={(event) => setNewTopicNotebook(event.target.value)}
              className="mb-4 h-10 w-full rounded-xl border border-[var(--line)] bg-[var(--surface-2)] px-3 text-[13px] text-[var(--ink)] outline-none focus:border-[var(--brand-text)]"
            >
              {notebooks.map((notebook) => (
                <option key={notebook} value={notebook}>
                  {notebook}
                </option>
              ))}
            </select>

            <label
              htmlFor="topic-due-date"
              className="mb-1.5 block text-[11px] font-semibold text-[var(--muted)]"
            >
              Prazo
            </label>
            <input
              id="topic-due-date"
              type="date"
              required
              value={newTopicDueDate}
              onChange={(event) => setNewTopicDueDate(event.target.value)}
              className="mb-5 h-10 w-full rounded-xl border border-[var(--line)] bg-[var(--surface-2)] px-3 text-[13px] text-[var(--ink)] outline-none focus:border-[var(--brand-text)]"
            />

            <button
              type="submit"
              className="h-10 w-full rounded-xl bg-[var(--brand)] text-[13px] font-bold text-[var(--on-brand)] transition hover:opacity-90"
            >
              Adicionar tópico
            </button>
          </form>
        </div>
      )}
    </aside>
  );
}
