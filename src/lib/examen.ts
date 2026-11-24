import type { Pregunta, Puntaje } from './tipos';

export const PREGUNTAS_POR_EXAMEN = 20;
export const UMBRAL_APROBACION = 65;

export function barajar<T>(arr: T[], rnd: () => number = Math.random): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function barajarOpciones(p: Pregunta, rnd: () => number): Pregunta {
  const orig = p.opciones;
  if (orig.length < 2) return p;
  let m = barajar(orig, rnd);
  let intentos = 0;
  while (m.every((o, i) => o === orig[i]) && intentos++ < 100) m = barajar(orig, rnd);
  if (m.every((o, i) => o === orig[i])) m = [...orig.slice(1), orig[0]];
  return { ...p, opciones: m };
}

export function generarExamen(
  banco: Pregunta[], modulo: number | null = null, cantidad = PREGUNTAS_POR_EXAMEN, rnd: () => number = Math.random,
): Pregunta[] {
  const pool = modulo === null ? banco : banco.filter((p) => p.modulo === modulo);
  return barajar(pool, rnd).slice(0, cantidad).map((p) => barajarOpciones(p, rnd));
}

export function remezclar(preguntas: Pregunta[], rnd: () => number = Math.random): Pregunta[] {
  return barajar(preguntas, rnd).map((p) => barajarOpciones(p, rnd));
}

export function calcularPuntaje(
  preguntas: Pregunta[], respuestas: (number | null)[], umbral = UMBRAL_APROBACION,
): Puntaje {
  const porModulo: Puntaje['porModulo'] = {};
  let aciertos = 0;
  preguntas.forEach((p, i) => {
    const r = respuestas[i];
    const ok = r != null && p.opciones[r]?.correcta === true;
    if (ok) aciertos++;
    const m = (porModulo[p.modulo] ??= { aciertos: 0, total: 0 });
    m.total++;
    if (ok) m.aciertos++;
  });
  const total = preguntas.length;
  const porcentaje = total ? Math.round((aciertos / total) * 100) : 0;
  return { aciertos, total, porcentaje, aprobado: total > 0 && (aciertos / total) * 100 >= umbral, porModulo };
}
