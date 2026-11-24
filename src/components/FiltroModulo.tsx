interface Props {
  modulos: [number, number][];
  total: number;
  valor: number | null;
  onCambiar: (m: number | null) => void;
  onNuevo: () => void;
}

export default function FiltroModulo({ modulos, total, valor, onCambiar, onNuevo }: Props) {
  return (
    <nav className="navbar navbar-dark bg-dark fixed-top">
      <div className="container d-flex gap-2 flex-nowrap">
        <span className="navbar-brand mb-0 d-none d-sm-block">ITIL v5</span>
        <select
          className="form-select"
          aria-label="Filtrar por módulo"
          value={valor ?? ''}
          onChange={(e) => onCambiar(e.target.value === '' ? null : Number(e.target.value))}
        >
          <option value="">Todos los módulos ({total})</option>
          {modulos.map(([m, c]) => (
            <option key={m} value={m}>Módulo {m} ({c})</option>
          ))}
        </select>
        <button className="btn btn-primary text-nowrap" onClick={onNuevo}>Nuevo examen</button>
      </div>
    </nav>
  );
}
