
import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

type Periodo = "hoje" | "7 dias";

const dadosHoje = [
  { tipo: "Teoria", minutos: 60 },
  { tipo: "Questões", minutos: 45 },
  { tipo: "Revisão", minutos: 30 },
];

const dadosSemana = [
  { tipo: "Teoria", minutos: 510 },
  { tipo: "Questões", minutos: 440 },
  { tipo: "Revisão", minutos: 300 },
];

const cores = ["var(--teoria)", "var(--questoes)", "var(--revisao)"];

function formatarTempo(minutos: number) {
  const horas = Math.floor(minutos / 60);
  const restoMinutos = minutos % 60;

  if (horas === 0) return `${restoMinutos}m`;
  return `${horas}h ${String(restoMinutos).padStart(2, "0")}m`;
}

export function TimeDistribuition() {
  const [periodo, setPeriodo] = useState<Periodo>("hoje");
  const dados = periodo === "hoje" ? dadosHoje : dadosSemana;
  const totalMinutos = dados.reduce((total, item) => total + item.minutos, 0);



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
              data={dados}
              dataKey="minutos"
              nameKey="tipo"
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={76}
              paddingAngle={3}
              stroke="none"
            >
              {dados.map((item, index) => (
                <Cell key={item.tipo} fill={cores[index]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-[20px] font-extrabold text-[var(--ink)]">
            {formatarTempo(totalMinutos)}
          </span>
          <span className="text-[9px] font-bold uppercase text-[var(--muted)]">
            estudados
          </span>
        </div>
      </div>






      <ul className="mt-2 space-y-2">
        {dados.map((item, index) => {
          const porcentagem = Math.round((item.minutos / totalMinutos) * 100);

          return (
            <li
              key={item.tipo}
              className="flex items-center justify-between text-[11px]"
            >
              <span className="flex items-center gap-2 text-[var(--muted)]">
                <i
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: cores[index] }}
                />
                {item.tipo}
              </span>
              <span className="font-semibold text-[var(--ink)]">
                {formatarTempo(item.minutos)}
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