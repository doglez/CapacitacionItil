import type { Pregunta } from "@/lib/tipos";

interface Props {
  pregunta: Pregunta;
  /** Índice elegido; undefined si aún no responde. En el repaso se usa -1 si no respondió. */
  seleccion?: number;
  onResponder?: (indice: number) => void;
  mostrarModulo?: boolean;
}

function etiqueta(correcta: boolean, elegida: boolean) {
  if (correcta) return elegida ? "Tu respuesta, correcta" : "Respuesta correcta";
  return elegida ? "Tu respuesta, incorrecta" : undefined;
}

export default function PreguntaCard({ pregunta, seleccion, onResponder, mostrarModulo }: Props) {
  const respondida = seleccion !== undefined;
  const idEnunciado = `enunciado-${pregunta.id}`;
  return (
    <div className="card shadow-sm">
      <div className="card-body">
        {mostrarModulo && <span className="badge text-bg-secondary mb-2">Módulo {pregunta.modulo}</span>}
        <h2 className="h5 mb-3" id={idEnunciado}>
          {pregunta.enunciado}
        </h2>
        <div role="radiogroup" aria-labelledby={idEnunciado} className="d-grid gap-2">
          {pregunta.opciones.map((op, i) => {
            const elegida = seleccion === i;
            const estado = !respondida ? "opcion-activa" : op.correcta ? "opcion-correcta" : elegida ? "opcion-incorrecta" : "";
            const aria = respondida ? etiqueta(op.correcta, elegida) : undefined;
            return (
              <label
                key={i}
                className={`opcion d-flex align-items-start gap-2 p-3 rounded border ${estado}`}
                title={aria}
              >
                <input
                  type="radio"
                  className="form-check-input mt-1 flex-shrink-0"
                  name={`p-${pregunta.id}`}
                  checked={elegida}
                  disabled={respondida}
                  aria-label={aria ? `${op.texto}. ${aria}` : op.texto}
                  onChange={() => onResponder?.(i)}
                />
                <span className="flex-grow-1">{op.texto}</span>
                {respondida && op.correcta && (
                  <span aria-hidden="true" className="fw-bold text-success">
                    ✓
                  </span>
                )}
                {respondida && elegida && !op.correcta && (
                  <span aria-hidden="true" className="fw-bold text-danger">
                    ✗
                  </span>
                )}
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}
