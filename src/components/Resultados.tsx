import type { Filtro, Puntaje, RegistroHistorial, Respuestas } from "@/lib/tipos";
import { UMBRAL_APROBACION } from "@/lib/examen";
import PreguntaCard from "./PreguntaCard";

interface Props {
  puntaje: Puntaje;
  respuestas: Respuestas;
  historial: RegistroHistorial[];
  onRepetir: () => void;
  onFalladas: () => void;
  onCambiarModulo: () => void;
}

const etiquetaFiltro = (f: Filtro) => (f === "todos" ? "Todos" : `Módulo ${f}`);

export default function Resultados({ puntaje, respuestas, historial, onRepetir, onFalladas, onCambiarModulo }: Props) {
  const { aciertos, total, porcentaje, aprobado, porModulo, falladas } = puntaje;
  return (
    <>
      <div className="card shadow-sm text-center mb-4">
        <div className="card-body">
          <h1 className="h4">Resultado</h1>
          <p className="display-5 fw-bold mb-1">
            {aciertos}/{total}
          </p>
          <p className="fs-5 mb-2">{porcentaje}%</p>
          <span className={`badge fs-6 ${aprobado ? "text-bg-success" : "text-bg-danger"}`}>
            {aprobado ? "✓ Aprobado" : "✗ No aprobado"}
          </span>
          <p className="small text-muted mt-2 mb-0">Umbral de aprobación: {UMBRAL_APROBACION}%</p>
        </div>
      </div>

      <div className="d-grid d-sm-flex gap-2 mb-4">
        <button className="btn btn-primary" onClick={onRepetir}>
          Repetir con otras preguntas
        </button>
        <button className="btn btn-outline-primary" onClick={onFalladas} disabled={falladas.length === 0}>
          Reintentar solo las falladas
        </button>
        <button className="btn btn-outline-secondary" onClick={onCambiarModulo}>
          Cambiar módulo
        </button>
      </div>

      <h2 className="h5">Desglose por módulo</h2>
      <div className="table-responsive mb-4">
        <table className="table table-sm align-middle">
          <thead>
            <tr>
              <th>Módulo</th>
              <th className="text-end">Aciertos</th>
              <th className="text-end">%</th>
            </tr>
          </thead>
          <tbody>
            {porModulo.map((m) => (
              <tr key={m.modulo}>
                <td>Módulo {m.modulo}</td>
                <td className="text-end">
                  {m.aciertos}/{m.total}
                </td>
                <td className="text-end">{Math.round((m.aciertos / m.total) * 100)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {historial.length > 0 && (
        <>
          <h2 className="h5">Últimos puntajes</h2>
          <ul className="list-group mb-4">
            {historial.map((h) => (
              <li key={h.fecha} className="list-group-item d-flex justify-content-between">
                <span>
                  {new Date(h.fecha).toLocaleString("es")} · {etiquetaFiltro(h.filtro)}
                </span>
                <strong>
                  {h.aciertos}/{h.total} ({h.porcentaje}%)
                </strong>
              </li>
            ))}
          </ul>
        </>
      )}

      <h2 className="h5">Repaso de preguntas falladas ({falladas.length})</h2>
      {falladas.length === 0 ? (
        <p className="text-success">¡Sin errores!</p>
      ) : (
        <div className="d-grid gap-3 mb-4">
          {falladas.map((p) => (
            <PreguntaCard key={p.id} pregunta={p} seleccion={respuestas[p.id] ?? -1} mostrarModulo />
          ))}
        </div>
      )}
    </>
  );
}
