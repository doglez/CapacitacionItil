import type { Filtro, Opcion, Pregunta, Puntaje } from "./tipos";

export const PREGUNTAS_POR_EXAMEN = 20;
export const UMBRAL_APROBACION = 65; // porcentaje

/** Fisher-Yates. Devuelve una copia barajada. */
export function barajar<T>(items: readonly T[], aleatorio: () => number = Math.random): T[] {
  const copia = [...items];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(aleatorio() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

const firma = (opciones: Opcion[]) => opciones.map((o) => o.texto).join("\u0000");

/** Baraja las opciones evitando el orden original del CSV y el orden previo indicado. */
export function barajarOpciones(pregunta: Pregunta, firmaPrevia?: string): Pregunta {
  const original = firma(pregunta.opciones);
  if (pregunta.opciones.length < 3) return pregunta;
  let opciones: Opcion[];
  do {
    opciones = barajar(pregunta.opciones);
    const f = firma(opciones);
    if (f !== original && f !== firmaPrevia) break;
  } while (true);
  return { ...pregunta, opciones };
}

/**
 * Elige hasta `cantidad` preguntas al azar sin repetir, con opciones barajadas.
 * `previos` (id → firma del último orden) se actualiza para no repetir el mismo orden entre intentos.
 */
export function generarExamen(
  pool: readonly Pregunta[],
  cantidad: number = PREGUNTAS_POR_EXAMEN,
  previos: Map<string, string> = new Map(),
): Pregunta[] {
  return barajar(pool)
    .slice(0, cantidad)
    .map((p) => {
      const q = barajarOpciones(p, previos.get(p.id));
      previos.set(p.id, firma(q.opciones));
      return q;
    });
}

export function filtrarPorModulo(preguntas: readonly Pregunta[], filtro: Filtro): Pregunta[] {
  return filtro === "todos" ? [...preguntas] : preguntas.filter((p) => p.modulo === filtro);
}

export function calcularPuntaje(
  examen: readonly Pregunta[],
  respuestas: Record<string, number>,
  umbral: number = UMBRAL_APROBACION,
): Puntaje {
  const porModulo = new Map<number, { aciertos: number; total: number }>();
  const falladas: Pregunta[] = [];
  let aciertos = 0;

  for (const p of examen) {
    const acierto = p.opciones[respuestas[p.id]]?.correcta === true;
    const m = porModulo.get(p.modulo) ?? { aciertos: 0, total: 0 };
    m.total++;
    if (acierto) {
      m.aciertos++;
      aciertos++;
    } else {
      falladas.push(p);
    }
    porModulo.set(p.modulo, m);
  }

  const total = examen.length;
  const porcentaje = total ? Math.round((aciertos / total) * 100) : 0;
  return {
    aciertos,
    total,
    porcentaje,
    aprobado: total > 0 && (aciertos / total) * 100 >= umbral,
    porModulo: [...porModulo.entries()]
      .map(([modulo, v]) => ({ modulo, ...v }))
      .sort((a, b) => a.modulo - b.modulo),
    falladas,
  };
}
