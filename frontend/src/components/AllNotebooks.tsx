import { useEffect, useState } from "react";
import { ArrowLeft, BookOpen } from "lucide-react";
import { getNotebooks, type Notebook } from "../services/notebooks";

interface AllNotebooksProps {
  onAbrirCaderno: (caderno: Notebook) => void;
  onVoltar: () => void;
}

export function AllNotebooks({ onAbrirCaderno, onVoltar }: AllNotebooksProps) {
  const [cadernos, setCadernos] = useState<Notebook[]>([]);

  useEffect(() => {
    getNotebooks().then(setCadernos).catch(() => setCadernos([]));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onVoltar}
          className="flex h-9 items-center gap-1.5 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3 text-[12px] font-bold text-[var(--muted)] transition hover:border-[var(--brand)] hover:text-[var(--ink)] cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </button>
        <div>
          <h1 className="font-display text-[22px] font-extrabold tracking-tight text-[var(--ink)]">Meus cadernos</h1>
          <p className="text-[12px] text-[var(--muted)]">{cadernos.length} {cadernos.length === 1 ? "caderno" : "cadernos"}</p>
        </div>
      </div>

      {cadernos.length === 0 ? (
        <p className="rounded-[18px] border border-dashed border-[var(--line)] bg-[var(--surface)] p-12 text-center text-[13px] text-[var(--muted)]">Nenhum caderno encontrado.</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cadernos.map((caderno) => (
            <button key={caderno.id} type="button" onClick={() => onAbrirCaderno(caderno)} className="flex min-h-[130px] cursor-pointer flex-col items-start justify-between rounded-[18px] border border-[var(--line)] bg-[var(--surface)] p-5 text-left shadow-[var(--shadow)] transition hover:border-[var(--brand)]">
              <span className="grid h-10 w-10 place-items-center rounded-[12px] bg-[var(--brand-tint)]"><BookOpen className="h-5 w-5 text-[var(--brand-text)]" /></span>
              <span>
                <span className="block font-display text-[15px] font-bold text-[var(--ink)]">{caderno.name}</span>
                <span className="mt-1 block text-[11px] text-[var(--muted)]">{caderno.collection_name}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
