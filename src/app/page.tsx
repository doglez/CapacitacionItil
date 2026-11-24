"use client";

import BarraProgreso from "@/components/BarraProgreso";
import FiltroModulo from "@/components/FiltroModulo";
import PreguntaCard from "@/components/PreguntaCard";
import Resultados from "@/components/Resultados";
import { useExamen } from "@/hooks/useExamen";

/** Lleva al usuario al selector de módulo de la barra superior. */
function enfocarFiltro() {
  window.scrollTo({ top: 0 });
  document.getElementById("filtro-modulo")?.focus();
}

export default function Home() {
  const e = useExamen();
  const pregunta = e.examen[e.actual];
  const respondida = pregunta ? pregunta.id in e.respuestas : false;
  const esUltima = e.actual === e.examen.length - 1;

  return (
    <>
      <FiltroModulo
        filtro={e.filtro}
        modulos={e.modulos}
        totalBanco={e.totalBanco}
        onCambiar={e.cambiarFiltro}
        onNuevoExamen={e.nuevoExamen}
      />
      <main className="container py-3" style={{ maxWidth: 760 }}>
        {e.error && <div className="alert alert-danger">Error al cargar las preguntas: {e.error}</div>}
        {e.cargando && <p className="text-center text-muted mt-5">Cargando preguntas…</p>}

        {e.puntaje ? (
          <Resultados
            puntaje={e.puntaje}
            respuestas={e.respuestas}
            historial={e.historial}
            onRepetir={e.nuevoExamen}
            onFalladas={e.reintentarFalladas}
            onCambiarModulo={enfocarFiltro}
          />
        ) : (
          pregunta && (
            <>
              <BarraProgreso actual={e.actual} total={e.examen.length} />
              <PreguntaCard
                key={pregunta.id}
                pregunta={pregunta}
                seleccion={e.respuestas[pregunta.id]}
                onResponder={(i) => e.responder(pregunta.id, i)}
              />
              <div className="d-flex justify-content-between mt-3">
                <button
                  className="btn btn-outline-secondary"
                  disabled={e.actual === 0}
                  onClick={() => e.setActual(e.actual - 1)}
                >
                  Anterior
                </button>
                {esUltima ? (
                  <button className="btn btn-success" disabled={!respondida} onClick={e.finalizar}>
                    Finalizar
                  </button>
                ) : (
                  <button className="btn btn-primary" disabled={!respondida} onClick={() => e.setActual(e.actual + 1)}>
                    Siguiente
                  </button>
                )}
              </div>
            </>
          )
        )}
      </main>
    </>
  );
}
