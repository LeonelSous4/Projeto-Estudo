
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

const dadosEvolucao = [
  { dia: "01/11", horas: 1.5 },
  { dia: "02/11", horas: 5 },
  { dia: "03/11", horas: 1 },
  { dia: "04/11", horas: 6 },
  { dia: "05/11", horas: 4 },
  { dia: "06/11", horas: 1 },


];

export function MonthEvolution() {
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
              69h 06m
            </span>
            <span className="text-[10px] font-bold text-[var(--success)]">
              ▲ 1%
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
            />
            <YAxis
              unit="h"
              ticks={[1, 2, 3]}
              domain={[0, 4]}
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
              dot={{ r: 3, fill: "var(--brand)", strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </section>
  );
}