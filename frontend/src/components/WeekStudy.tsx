import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { getStudySessions, type StudySession } from "../services/studySessions";
import { ehMesmoDia, formatarDuracao } from "../utils/formatTime";

interface WeekStudyProps {
  atualizacao?: number;
}

const NOMES_DIAS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const NOMES_COMPLETOS = [
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
  "Domingo",
];

function segundosParaHoras(segundos: number): number {
  return Number((segundos / 3600).toFixed(2));
}

export function WeekStudy({ atualizacao = 0 }: WeekStudyProps) {
  const [sessoes, setSessoes] = useState<StudySession[]>([]);

  useEffect(() => {
    getStudySessions()
      .then((dados) => setSessoes(dados))
      .catch(() => {
        // Mantém os dados atuais em caso de erro
      });
  }, [atualizacao]);

  // Descobre a segunda-feira da semana atual para montar os 7 dias (Seg a Dom)
  const hoje = new Date();
  const diaSemana = hoje.getDay(); // 0 = Dom, 1 = Seg, ..., 6 = Sáb
  const diferencaParaSegunda = diaSemana === 0 ? -6 : 1 - diaSemana;
  const segunda = new Date(hoje);
  segunda.setDate(hoje.getDate() + diferencaParaSegunda);
  segunda.setHours(0, 0, 0, 0);

  let totalSemanaSeg = 0;
  let melhorIndice = 0;
  let melhorDiaSeg = 0;

  const dados = NOMES_DIAS.map((nomeDia, index) => {
    const dataDia = new Date(segunda);
    dataDia.setDate(segunda.getDate() + index);

    let segTeoria = 0;
    let segQuestoes = 0;
    let segRevisao = 0;

    for (const s of sessoes) {
      if (ehMesmoDia(new Date(s.created_at), dataDia)) {
        if (s.type === "teoria") segTeoria += s.duration_seconds;
        else if (s.type === "questoes") segQuestoes += s.duration_seconds;
        else if (s.type === "revisao") segRevisao += s.duration_seconds;
      }
    }

    const totalDiaSeg = segTeoria + segQuestoes + segRevisao;
    totalSemanaSeg += totalDiaSeg;

    if (totalDiaSeg > melhorDiaSeg) {
      melhorDiaSeg = totalDiaSeg;
      melhorIndice = index;
    }

    return {
      dia: nomeDia,
      teoria: segundosParaHoras(segTeoria),
      questoes: segundosParaHoras(segQuestoes),
      revisao: segundosParaHoras(segRevisao),
    };
  });

  const mediaDiaSeg = Math.round(totalSemanaSeg / 7);

  return (
    <section className="rounded-[18px] border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[var(--shadow)]">
      {/* Topo do Card */}
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-display text-[16px] font-bold text-[var(--ink)]">
            Estudo da semana
          </h3>
          <p className="text-[12px] text-[var(--muted)]">
            Horas por tipo de estudo
          </p>
        </div>

        <span className="rounded-full bg-[var(--surface-2)] px-2.5 py-1 text-[11px] font-bold text-[var(--ink)] border border-[var(--line)]">
          Total {formatarDuracao(totalSemanaSeg)} • Média {formatarDuracao(mediaDiaSeg)}/dia
        </span>
      </div>

      {/* Legendas */}
      <div className="mt-3 flex flex-wrap gap-3 text-[11px] font-semibold text-[var(--muted)]">
        <span className="flex items-center gap-1.5 text-[var(--ink)]">
          <i className="h-2 w-2 rounded-full bg-[var(--teoria)]" />
          Teoria
        </span>
        <span className="flex items-center gap-1.5 text-[var(--ink)]">
          <i className="h-2 w-2 rounded-full bg-[var(--questoes)]" />
          Questões
        </span>
        <span className="flex items-center gap-1.5 text-[var(--ink)]">
          <i className="h-2 w-2 rounded-full bg-[var(--revisao)]" />
          Revisão
        </span>
        <span className="flex items-center gap-1.5 text-[var(--muted)]">
          <i className="inline-block w-3 border-b-2 border-dashed border-[var(--danger)]" />
          Meta 4h
        </span>
      </div>

      {/* Gráfico Recharts */}
      <div className="mt-4 h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dados} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
            <XAxis
              dataKey="dia"
              stroke="var(--faint)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              unit="h"
              stroke="var(--faint)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={{ fill: "var(--surface-2)" }}
              contentStyle={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--line)",
                borderRadius: "12px",
                color: "var(--ink)",
                fontSize: "12px",
              }}
            />
            <ReferenceLine y={4} stroke="var(--danger)" strokeDasharray="4 4" />

            <Bar dataKey="teoria" fill="var(--teoria)" stackId="a" />
            <Bar dataKey="questoes" fill="var(--questoes)" stackId="a" />
            <Bar dataKey="revisao" fill="var(--revisao)" stackId="a" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="p-1">
        <p className="text-[12px] text-[var(--muted)]">
          {melhorDiaSeg > 0
            ? `${NOMES_COMPLETOS[melhorIndice]} foi seu melhor dia: ${formatarDuracao(melhorDiaSeg)}.`
            : "Nenhuma sessão registrada nesta semana ainda."}
        </p>
      </div>
    </section>
  );
}
