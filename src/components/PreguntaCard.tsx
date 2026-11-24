import type { Pregunta } from '@/lib/tipos';

interface Props {
  pregunta: Pregunta;
  seleccion: number | null;
  onResponder?: (i: number) => void;
}

export default function PreguntaCard({ pregunta, seleccion, onResponder }: Props) {
  const respondida = seleccion !== null;
  return (
    <div className="card shadow-sm mb-3">
      <div className="card-body">
        <h2 className="h5 mb-3">{pregunta.enunciado}</h2>
        <div role="radiogroup" className="d-grid gap-2">
          {pregunta.opciones.map((o, i) => {
            const elegida = seleccion === i;
            const estado = respondida ? (o.correcta ? 'correcta' : elegida ? 'incorrecta' : '') : '';
            const etiqueta = estado === 'correcta' ? 'Respuesta correcta' : estado === 'incorrecta' ? 'Tu respuesta incorrecta' : undefined;
            return (
              <label
                key={i}
                className={`opcion d-flex align-items-center gap-3 rounded p-3 ${estado} ${respondida ? 'bloqueada' : ''}`}
                aria-label={etiqueta ? `${etiqueta}: ${o.texto}` : undefined}
              >
                <input
                  type="radio"
                  className="form-check-input m-0"
                  name={`p-${pregunta.id}`}
                  checked={elegida}
                  disabled={respondida}
                  onChange={() => onResponder?.(i)}
                />
                <span className="flex-grow-1">{o.texto}</span>
                {estado === 'correcta' && <span className="text-success fw-bold" aria-hidden="true">✓</span>}
                {estado === 'incorrecta' && <span className="text-danger fw-bold" aria-hidden="true">✗</span>}
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}
