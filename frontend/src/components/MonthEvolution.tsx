import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getStudySessions, type StudySession } from "../services/studySessions";
import { ehMesmoDia, formatarDuracao } from "../utils/formatTime";

interface MonthEvolutionProps {
  atualizacao?: number;
}

function formatarDiaMes(data: Date): string {
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  return `${dia}/${mes}`;
}

export function MonthEvolution({ atualizacao = 0 }: MonthEvolutionProps) {
  const [sessoes, setSessoes] = useState<StudySession[]>([]);

  useEffect(() => {
    getStudySessions()
      .then((dados) => setSessoes(dados))
      .catch(() => {
        // Mantém os dados atuais em caso de erro
      });
  }, [atualizacao]);

  // Monta os últimos 30 dias em ordem cronológica
  const hoje = new Date();
  let totalPeriodoSeg = 0;

  const dadosEvolucao = Array.from({ length: 30 }, (_, index) => {
    const data = new Date(hoje);
    data.setDate(hoje.getDate() - (29 - index));

    let segDia = 0;
    for (const s of sessoes) {
      if (ehMesmoDia(new Date(s.created_at), data)) {
        segDia += s.duration_seconds;
      }
    }

    totalPeriodoSeg += segDia;

    return {
      dia: formatarDiaMes(data),
      horas: Number((segDia / 3600).toFixed(2)),
    };
  });

  return (
    <section className="rounded-[18px] border border-[var(--line)] bg-[var(--surface)] p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-[15px] font-bold text-[var(--ink)]">
            Evolução do mês
          </h3>
          <p className="text-[11px] text-[var(--muted)]">Últimos 30 dias</p>
        </div>

        <div className="text-right">
          <p className="text-[9px] font-bold uppercase text-[var(--muted)]">
            Total do período
          </p>
          <div className="flex items-center justify-end gap-2">
            <span className="font-display text-[18px] font-extrabold text-[var(--ink)]">
              {formatarDuracao(totalPeriodoSeg)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={dadosEvolucao}
            margin={{ top: 8, right: 12, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              stroke="var(--line)"
              strokeDasharray="4 4"
              vertical={false}
            />
            <XAxis
              dataKey="dia"
              stroke="var(--faint)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              interval={4}
            />
            <YAxis
              unit="h"
              domain={[0, "auto"]}
              stroke="var(--faint)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <ReferenceLine
              y={4}
              stroke="var(--brand)"
              strokeDasharray="4 4"
              label={{
                value: "Meta 4h",
                fill: "var(--brand)",
                position: "insideTopRight",
                fontSize: 10,
              }}
            />
            <Tooltip
              formatter={(value) => [`${value}h`, "Estudado"]}
              contentStyle={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--line)",
                borderRadius: "12px",
                color: "var(--ink)",
                fontSize: "11px",
              }}
            />
            <Line
              type="monotone"
              dataKey="horas"
              stroke="var(--brand)"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
