import { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { getStudySessions, type StudySession } from "../services/studySessions";
import { ehMesmoDia, formatarMinutos } from "../utils/formatTime";

type Periodo = "hoje" | "7 dias";

interface TimeDistribuitionProps {
  atualizacao?: number;
}

const CORES = ["var(--teoria)", "var(--questoes)", "var(--revisao)"];

export function TimeDistribuition({ atualizacao = 0 }: TimeDistribuitionProps) {
  const [periodo, setPeriodo] = useState<Periodo>("hoje");
  const [sessoes, setSessoes] = useState<StudySession[]>([]);

  useEffect(() => {
    getStudySessions()
      .then((dados) => setSessoes(dados))
      .catch(() => {
        // Mantém os dados atuais em caso de erro
      });
  }, [atualizacao]);

  // Filtra as sessões de acordo com o botão selecionado ("Hoje" ou "7 dias")
  const hoje = new Date();
  const seteDiasAtras = new Date();
  seteDiasAtras.setDate(hoje.getDate() - 6);
  seteDiasAtras.setHours(0, 0, 0, 0);

  const sessoesFiltradas = sessoes.filter((s) => {
    const dataSessao = new Date(s.created_at);
    if (periodo === "hoje") {
      return ehMesmoDia(dataSessao, hoje);
    }
    return dataSessao >= seteDiasAtras;
  });

  // Soma os segundos de cada tipo e converte para minutos
  let segTeoria = 0;
  let segQuestoes = 0;
  let segRevisao = 0;

  for (const s of sessoesFiltradas) {
    if (s.type === "teoria") segTeoria += s.duration_seconds;
    else if (s.type === "questoes") segQuestoes += s.duration_seconds;
    else if (s.type === "revisao") segRevisao += s.duration_seconds;
  }

  const dados = [
    { tipo: "Teoria", minutos: Math.round(segTeoria / 60) },
    { tipo: "Questões", minutos: Math.round(segQuestoes / 60) },
    { tipo: "Revisão", minutos: Math.round(segRevisao / 60) },
  ];

  const totalMinutos = dados.reduce((total, item) => total + item.minutos, 0);

  // Quando tudo está zerado, usamos um dado neutro apenas para desenhar o anel vazio
  const dadosGrafico =
    totalMinutos > 0 ? dados : [{ tipo: "Sem dados", minutos: 1 }];

  return (
    <section className="rounded-[18px] border border-[var(--line)] bg-[var(--surface)] p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-[15px] font-bold text-[var(--ink)]">
          Distribuição do tempo
        </h3>
        <div className="flex items-center gap-1 rounded-full bg-[var(--surface-2)] p-1">
          <button
            type="button"
            onClick={() => setPeriodo("hoje")}
            aria-pressed={periodo === "hoje"}
            className={`rounded-full px-3 py-1 text-[11px] font-bold ${
              periodo === "hoje"
                ? "bg-[var(--surface)] text-[var(--ink)] shadow-sm"
                : "text-[var(--muted)]"
            }`}
          >
            Hoje
          </button>
          <button
            type="button"
            onClick={() => setPeriodo("7 dias")}
            aria-pressed={periodo === "7 dias"}
            className={`rounded-full px-3 py-1 text-[11px] font-bold ${
              periodo === "7 dias"
                ? "bg-[var(--surface)] text-[var(--ink)] shadow-sm"
                : "text-[var(--muted)]"
            }`}
          >
            7 dias
          </button>
        </div>
      </div>

      <div className="relative mx-auto h-[180px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={dadosGrafico}
              dataKey="minutos"
              nameKey="tipo"
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={76}
              paddingAngle={totalMinutos > 0 ? 3 : 0}
              stroke="none"
            >
              {dadosGrafico.map((item, index) => (
                <Cell
                  key={item.tipo}
                  fill={totalMinutos > 0 ? CORES[index] : "var(--track)"}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-[20px] font-extrabold text-[var(--ink)]">
            {formatarMinutos(totalMinutos)}
          </span>
          <span className="text-[9px] font-bold uppercase text-[var(--muted)]">
            estudados
          </span>
        </div>
      </div>

      <ul className="mt-2 space-y-2">
        {dados.map((item, index) => {
          const porcentagem =
            totalMinutos > 0 ? Math.round((item.minutos / totalMinutos) * 100) : 0;

          return (
            <li
              key={item.tipo}
              className="flex items-center justify-between text-[11px]"
            >
              <span className="flex items-center gap-2 text-[var(--muted)]">
                <i
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: CORES[index] }}
                />
                {item.tipo}
              </span>
              <span className="font-semibold text-[var(--ink)]">
                {formatarMinutos(item.minutos)}
                <span className="ml-1.5 text-[var(--muted)]">
                  {porcentagem}%
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
