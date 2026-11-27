import { useEffect, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, UserRound } from "lucide-react";
import { getTopics, toggleTopic, type Topic } from "../services/topics";
import { getStudySessions } from "../services/studySessions";

interface SidebarRightProps { atualizacao: number }

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function countCurrentStreak(studyDates: Set<string>, today: Date) {
  let current = studyDates.has(dateKey(today)) ? today : new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
  let streak = 0;
  while (studyDates.has(dateKey(current))) {
    streak += 1;
    current = new Date(current.getFullYear(), current.getMonth(), current.getDate() - 1);
  }
  return streak;
}

function countBestStreak(studyDates: Set<string>, today: Date) {
  let best = 0;
  let current = 0;
  for (let offset = 30; offset >= 0; offset -= 1) {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - offset);
    if (studyDates.has(dateKey(date))) {
      current += 1;
      best = Math.max(best, current);
    } else current = 0;
  }
  return best;
}

export function SidebarRight({ atualizacao }: SidebarRightProps) {
  const today = startOfDay(new Date());
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [topics, setTopics] = useState<Topic[]>([]);
  const [studyDates, setStudyDates] = useState<Set<string>>(() => new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([getTopics(), getStudySessions()])
      .then(([allTopics, sessions]) => {
        setTopics(allTopics);
        setStudyDates(new Set(sessions.map((session) => dateKey(new Date(session.created_at)))));
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [atualizacao]);

  const pendingTopics = topics.filter((topic) => !Boolean(topic.is_completed));
  const completedTopics = topics.length - pendingTopics.length;
  const streak = countCurrentStreak(studyDates, today);
  const bestStreak = countBestStreak(studyDates, today);
  const monthTitle = visibleMonth.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  const firstWeekday = visibleMonth.getDay();
  const daysInMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0).getDate();
  const gridCellCount = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;

  function changeMonth(amount: number) {
    setVisibleMonth((month) => new Date(month.getFullYear(), month.getMonth() + amount, 1));
  }

  async function handleToggleTopic(topic: Topic) {
    const previous = Boolean(topic.is_completed);
    setTopics((current) => current.map((item) => item.id === topic.id ? { ...item, is_completed: !previous } : item));
    try {
      const isCompleted = await toggleTopic(topic.id);
      setTopics((current) => current.map((item) => item.id === topic.id ? { ...item, is_completed: isCompleted } : item));
    } catch {
      setTopics((current) => current.map((item) => item.id === topic.id ? { ...item, is_completed: previous } : item));
    }
  }

  return (
    <aside className="w-full shrink-0 border-t border-[var(--line)] bg-[var(--shell)] p-4 sm:p-5 xl:w-[320px] xl:border-l xl:border-t-0">
      <div className="space-y-5">
        <section className="flex items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--brand)] text-[13px] font-extrabold text-[var(--on-brand)]">LN</div>
          <div className="min-w-0 flex-1"><p className="truncate text-[14px] font-semibold text-[var(--ink)]">Leonel</p><p className="text-[12px] text-[var(--muted)]">Estudante</p></div>
          <span className="flex h-8 items-center gap-1.5 rounded-full border border-[var(--line)] px-3 text-[11px] font-semibold text-[var(--muted)]"><UserRound className="h-3.5 w-3.5" />Perfil</span>
        </section>

        <section className="rounded-[18px] border border-[var(--line)] bg-[var(--surface)] p-4 shadow-[var(--shadow)]">
          <div className="mb-4 flex items-center justify-between">
            <button type="button" onClick={() => changeMonth(-1)} aria-label="Mês anterior" className="grid h-8 w-8 place-items-center rounded-lg text-[var(--muted)] transition hover:bg-[var(--surface-2)] hover:text-[var(--ink)]"><ChevronLeft className="h-4 w-4" /></button>
            <h2 className="font-display text-[14px] font-bold capitalize text-[var(--ink)]">{monthTitle}</h2>
            <button type="button" onClick={() => changeMonth(1)} aria-label="Próximo mês" className="grid h-8 w-8 place-items-center rounded-lg text-[var(--muted)] transition hover:bg-[var(--surface-2)] hover:text-[var(--ink)]"><ChevronRight className="h-4 w-4" /></button>
          </div>
          <div className="grid grid-cols-7 text-center">
            {["D", "S", "T", "Q", "Q", "S", "S"].map((weekday, index) => <span key={`${weekday}-${index}`} className="pb-2 text-[10px] font-semibold text-[var(--faint)]">{weekday}</span>)}
            {Array.from({ length: gridCellCount }, (_, index) => {
              const dayNumber = index - firstWeekday + 1;
              const date = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), dayNumber);
              const isToday = dateKey(date) === dateKey(today);
              const hasStudy = studyDates.has(dateKey(date));
              const isCurrentMonth = dayNumber >= 1 && dayNumber <= daysInMonth;
              return <span key={dateKey(date)} aria-current={isToday ? "date" : undefined} className={`relative mx-auto mb-1 grid h-8 w-8 place-items-center rounded-full text-[11px] font-medium ${isToday ? "bg-[var(--brand)] font-bold text-[var(--on-brand)]" : hasStudy && isCurrentMonth ? "bg-[var(--brand-tint)] text-[var(--ink)]" : "text-[var(--muted)]"} ${isCurrentMonth ? "" : "opacity-35"}`}>
                {date.getDate()}{hasStudy && !isToday && <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-[var(--brand)]" />}
              </span>;
            })}
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-[10px] text-[var(--muted)]"><CalendarDays className="h-3 w-3 text-[var(--brand-text)]" /><span>● Hoje</span><span>•</span><span>● Dia com estudo</span></p>
        </section>

        <section className="flex items-center gap-3 rounded-[18px] border border-[var(--line)] bg-[var(--surface)] p-4 shadow-[var(--shadow)]">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[12px] bg-[var(--brand-tint)] text-[20px]">🔥</span>
          <div>{streak > 0 ? <><p className="font-display text-[15px] font-bold text-[var(--ink)]">{streak} {streak === 1 ? "dia seguido" : "dias seguidos"}</p><p className="text-[11px] text-[var(--muted)]">Seu melhor: {bestStreak} dias</p></> : <><p className="font-display text-[15px] font-bold text-[var(--ink)]">Comece hoje sua sequência</p><p className="text-[11px] text-[var(--muted)]">Um pouco de estudo já conta.</p></>}</div>
        </section>

        <section className="rounded-[18px] border border-[var(--line)] bg-[var(--surface)] p-4 shadow-[var(--shadow)]">
          <div className="flex items-start justify-between gap-2"><div><h2 className="font-display text-[15px] font-bold text-[var(--ink)]">Tópicos pendentes</h2><p className="mt-1 text-[11px] text-[var(--muted)]">{completedTopics} de {topics.length} concluídos</p></div><span className="shrink-0 rounded-full bg-[var(--brand)] px-2.5 py-1 text-[10px] font-bold text-[var(--on-brand)]">{pendingTopics.length} pendentes</span></div>
          {isLoading ? <p className="py-6 text-center text-[12px] text-[var(--muted)]">Carregando tópicos…</p> : pendingTopics.length === 0 ? <p className="py-6 text-center text-[13px] text-[var(--muted)]">{topics.length === 0 ? "Nenhum tópico cadastrado." : "Tudo em dia! 🎉"}</p> : <ul className="mt-3 max-h-[360px] divide-y divide-[var(--line)] overflow-y-auto">{pendingTopics.map((topic) => <li key={topic.id} className="flex gap-2.5 py-3 first:pt-1"><button type="button" aria-label={`Marcar ${topic.name} como concluído`} aria-pressed={Boolean(topic.is_completed)} onClick={() => void handleToggleTopic(topic)} className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded border border-[var(--line)] bg-[var(--surface-2)] transition hover:border-[var(--brand-text)]" /><div className="min-w-0 flex-1"><p className="text-[12px] font-semibold leading-4 text-[var(--ink)]">{topic.name}</p><span className="mt-1.5 inline-block max-w-full truncate rounded-full bg-[var(--surface-2)] px-2 py-0.5 text-[10px] text-[var(--muted)]">{topic.notebook_name ?? "Caderno"}</span></div></li>)}</ul>}
        </section>
      </div>
    </aside>
  );
}
