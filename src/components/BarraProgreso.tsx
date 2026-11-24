interface Props {
  actual: number; // base 0
  total: number;
}

export default function BarraProgreso({ actual, total }: Props) {
  const pct = Math.round(((actual + 1) / total) * 100);
  return (
    <div className="mb-3">
      <div className="small text-muted mb-1">
        Pregunta {actual + 1} de {total}
      </div>
      <div
        className="progress"
        role="progressbar"
        aria-label="Progreso del examen"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="progress-bar" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
