'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import FiltroModulo from '@/components/FiltroModulo';
import PreguntaCard from '@/components/PreguntaCard';
import BarraProgreso from '@/components/BarraProgreso';
import Resultados from '@/components/Resultados';
import { cargarPreguntas } from '@/lib/csv';
import { calcularPuntaje, generarExamen, remezclar } from '@/lib/examen';
import type { Pregunta } from '@/lib/tipos';

const K_FILTRO = 'itil.filtro';
const K_HIST = 'itil.historial';

export default function Home() {
  const [banco, setBanco] = useState<Pregunta[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<number | null>(null);
  const [examen, setExamen] = useState<Pregunta[]>([]);
  const [respuestas, setRespuestas] = useState<(number | null)[]>([]);
  const [actual, setActual] = useState(0);
  const [terminado, setTerminado] = useState(false);
  const [historial, setHistorial] = useState<number[]>([]);

  const iniciar = useCallback((preguntas: Pregunta[]) => {
    setExamen(preguntas);
    setRespuestas(preguntas.map(() => null));
    setActual(0);
    setTerminado(false);
  }, []);

  useEffect(() => {
    const g = localStorage.getItem(K_FILTRO);
    const f = g === null || g === '' ? null : Number(g);
    setFiltro(f);
    try { setHistorial(JSON.parse(localStorage.getItem(K_HIST) ?? '[]')); } catch { /* ignorar */ }
    cargarPreguntas()
      .then(({ preguntas, descartadas }) => {
        if (descartadas.length) console.warn(`${descartadas.length} preguntas descartadas`);
        setBanco(preguntas);
        const hay = f !== null && preguntas.some((p) => p.modulo === f);
        if (!hay) setFiltro(null);
        iniciar(generarExamen(preguntas, hay ? f : null));
      })
      .catch((e: Error) => setError(e.message));
  }, [iniciar]);

  const modulos = useMemo(() => {
    const c = new Map<number, number>();
    banco.forEach((p) => c.set(p.modulo, (c.get(p.modulo) ?? 0) + 1));
    return [...c.entries()].sort((a, b) => a[0] - b[0]);
  }, [banco]);

  const enCurso = !terminado && respuestas.some((r) => r !== null);
  const confirmar = () => !enCurso || window.confirm('Hay un examen en curso. ¿Deseas reiniciarlo?');

  const nuevo = (f: number | null) => iniciar(generarExamen(banco, f));
  const cambiarFiltro = (f: number | null) => {
    if (!confirmar()) return;
    setFiltro(f);
    localStorage.setItem(K_FILTRO, f === null ? '' : String(f));
    nuevo(f);
  };

  const responder = (i: number) => {
    if (respuestas[actual] !== null) return;
    setRespuestas((r) => r.map((x, k) => (k === actual ? i : x)));
  };

  const terminar = () => {
    const { porcentaje } = calcularPuntaje(examen, respuestas);
    const h = [...historial, porcentaje].slice(-10);
    setHistorial(h);
    localStorage.setItem(K_HIST, JSON.stringify(h));
    setTerminado(true);
  };

  const puntaje = useMemo(() => calcularPuntaje(examen, respuestas), [examen, respuestas]);

  return (
    <>
      <FiltroModulo modulos={modulos} total={banco.length} valor={filtro} onCambiar={cambiarFiltro} onNuevo={() => confirmar() && nuevo(filtro)} />
      <main className="container pb-5" style={{ maxWidth: 800 }}>
        {error && <div className="alert alert-danger">{error}</div>}
        {!error && !examen.length && <p>Cargando…</p>}
        {examen.length > 0 && !terminado && (
          <>
            <BarraProgreso actual={actual + 1} total={examen.length} />
            <PreguntaCard pregunta={examen[actual]} seleccion={respuestas[actual]} onResponder={responder} />
            <div className="d-flex justify-content-between">
              <button className="btn btn-outline-secondary" disabled={actual === 0} onClick={() => setActual(actual - 1)}>Anterior</button>
              {actual < examen.length - 1 ? (
                <button className="btn btn-primary" disabled={respuestas[actual] === null} onClick={() => setActual(actual + 1)}>Siguiente</button>
              ) : (
                <button className="btn btn-success" disabled={respuestas[actual] === null} onClick={terminar}>Ver resultados</button>
              )}
            </div>
          </>
        )}
        {terminado && (
          <>
            <Resultados
              intento={{ preguntas: examen, respuestas }}
              puntaje={puntaje}
              onRepetir={() => nuevo(filtro)}
              onFalladas={() => iniciar(remezclar(examen.filter((p, i) => respuestas[i] === null || !p.opciones[respuestas[i] as number].correcta)))}
              onCambiarModulo={() => { setTerminado(false); window.scrollTo(0, 0); nuevo(null); setFiltro(null); localStorage.setItem(K_FILTRO, ''); }}
            />
            {historial.length > 0 && <p className="text-muted small">Últimos puntajes: {historial.join('% · ')}%</p>}
          </>
        )}
      </main>
    </>
  );
}
