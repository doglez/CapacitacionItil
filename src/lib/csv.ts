import Papa from 'papaparse';
import type { Pregunta } from './tipos';

interface Fila { Modulo: string; Pregunta: string; Respuestas: string; Correcto: string }

export function parsearPreguntas(texto: string): { preguntas: Pregunta[]; descartadas: string[] } {
  const { data } = Papa.parse<Fila>(texto.replace(/^\uFEFF/, ''), { header: true, skipEmptyLines: true });
  const grupos = new Map<string, Pregunta & { _c: number }>();
  for (const f of data) {
    if (!f.Pregunta || !f.Respuestas) continue;
    const modulo = parseInt(f.Modulo, 10);
    const id = `${modulo}|${f.Pregunta.trim()}`;
    let g = grupos.get(id);
    if (!g) grupos.set(id, (g = { id, modulo, enunciado: f.Pregunta.trim(), opciones: [], _c: 0 }));
    const correcta = f.Correcto.trim().toLowerCase() === 'verdadero';
    if (correcta) g._c++;
    g.opciones.push({ texto: f.Respuestas.trim(), correcta });
  }
  const preguntas: Pregunta[] = [];
  const descartadas: string[] = [];
  for (const { _c, ...p } of grupos.values()) {
    if (_c === 1 && Number.isFinite(p.modulo)) preguntas.push(p);
    else {
      descartadas.push(p.id);
      console.warn(`Pregunta descartada (correctas: ${_c}): ${p.id}`);
    }
  }
  return { preguntas, descartadas };
}

export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

export async function cargarPreguntas() {
  const res = await fetch(`${BASE_PATH}/data/PreguntasITIL_Modulos1-10.csv`);
  if (!res.ok) throw new Error('No se pudo cargar el CSV');
  return parsearPreguntas(await res.text());
}
