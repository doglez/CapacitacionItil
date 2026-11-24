export default function BarraProgreso({ actual, total }: { actual: number; total: number }) {
  const pct = Math.round((actual / total) * 100);
  return (
    <div className="mb-3">
      <div className="small text-muted mb-1">Pregunta {actual} de {total}</div>
      <div className="progress" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className="progress-bar" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
