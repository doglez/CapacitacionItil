import type { Intento, Puntaje } from '@/lib/tipos';
import PreguntaCard from './PreguntaCard';

interface Props {
  intento: Intento;
  puntaje: Puntaje;
  onRepetir: () => void;
  onFalladas: () => void;
  onCambiarModulo: () => void;
}

export default function Resultados({ intento, puntaje, onRepetir, onFalladas, onCambiarModulo }: Props) {
  const falladas = intento.preguntas
    .map((p, i) => ({ p, r: intento.respuestas[i], i }))
    .filter(({ p, r }) => r == null || !p.opciones[r].correcta);
  return (
    <div>
      <div className="card shadow-sm mb-3 text-center">
        <div className="card-body">
          <h1 className="h3">{puntaje.aciertos}/{puntaje.total} ({puntaje.porcentaje}%)</h1>
          <span className={`badge fs-6 ${puntaje.aprobado ? 'bg-success' : 'bg-danger'}`}>
            {puntaje.aprobado ? 'Aprobado' : 'No aprobado'}
          </span>
        </div>
      </div>
      <div className="card shadow-sm mb-3">
        <div className="card-header">Desglose por módulo</div>
        <ul className="list-group list-group-flush">
          {Object.entries(puntaje.porModulo).map(([m, v]) => (
            <li key={m} className="list-group-item d-flex justify-content-between">
              <span>Módulo {m}</span><span>{v.aciertos}/{v.total}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="d-grid d-sm-flex gap-2 mb-4">
        <button className="btn btn-primary" onClick={onRepetir}>Repetir con otras preguntas</button>
        <button className="btn btn-outline-primary" onClick={onFalladas} disabled={!falladas.length}>Reintentar solo las falladas</button>
        <button className="btn btn-outline-secondary" onClick={onCambiarModulo}>Cambiar módulo</button>
      </div>
      {falladas.length > 0 && <h2 className="h5">Repaso de preguntas falladas</h2>}
      {falladas.map(({ p, r, i }) => (
        <PreguntaCard key={i} pregunta={p} seleccion={r ?? -1} />
      ))}
    </div>
  );
}
