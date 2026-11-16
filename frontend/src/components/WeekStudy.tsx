import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ReferenceLine 
} from "recharts";

const dados = [
  { dia: "Seg", teoria: 1.5, questoes: 1.0, revisao: 0.5 },
  { dia: "Ter", teoria: 2.0, questoes: 1.5, revisao: 0.5 },
  { dia: "Qua", teoria: 0.8, questoes: 2.0, revisao: 0.0 },
  { dia: "Qui", teoria: 1.2, questoes: 0.8, revisao: 1.0 },
  { dia: "Sex", teoria: 2.5, questoes: 1.5, revisao: 0.5 },
  { dia: "Sáb", teoria: 1.0, questoes: 0.75, revisao: 0.5 },
  { dia: "Dom", teoria: 0.0, questoes: 0.0, revisao: 0.0 },
];

export function WeekStudy() {
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
          Total 17h 45m • Média 2h 32m/dia
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
                fontSize: "12px"
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
            Sexta-feira, 13 de novembro foi seu melhor dia: 5h 30m.
          </p>
      </div>
    </section>
  );
}
