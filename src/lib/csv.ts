import Papa from "papaparse";
import type { Opcion, Pregunta } from "./tipos";

interface FilaCsv {
  Modulo: string;
  Pregunta: string;
  Respuestas: string;
  Correcto: string;
  Hoja?: string;
}

export interface ResultadoCsv {
  preguntas: Pregunta[];
  descartadas: string[];
}

export const RUTA_CSV = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/data/PreguntasITIL_Modulos1-10.csv`;

/** Convierte el texto del CSV en preguntas tipadas; descarta las que no tengan exactamente 1 correcta. */
export function parsearPreguntas(texto: string): ResultadoCsv {
  const { data } = Papa.parse<FilaCsv>(texto.replace(/^﻿/, ""), {
    header: true,
    skipEmptyLines: true,
  });

  const grupos = new Map<string, { modulo: number; enunciado: string; opciones: Opcion[]; hoja?: string }>();
  for (const fila of data) {
    const modulo = Number(fila.Modulo);
    if (!Number.isFinite(modulo) || !fila.Pregunta || !fila.Respuestas) continue;
    const clave = `${modulo}|${fila.Pregunta}`;
    const grupo = grupos.get(clave) ?? { modulo, enunciado: fila.Pregunta, opciones: [] };
    grupo.opciones.push({
      texto: fila.Respuestas,
      correcta: fila.Correcto?.trim().toLowerCase() === "verdadero",
    });
    grupo.hoja ||= fila.Hoja?.trim() || undefined;
    grupos.set(clave, grupo);
  }

  const preguntas: Pregunta[] = [];
  const descartadas: string[] = [];
  let n = 0;
  for (const g of grupos.values()) {
    const correctas = g.opciones.filter((o) => o.correcta).length;
    if (correctas !== 1) {
      descartadas.push(`Módulo ${g.modulo}: ${g.enunciado}`);
      console.warn(`Pregunta descartada (${correctas} correctas): módulo ${g.modulo} - ${g.enunciado}`);
      continue;
    }
    preguntas.push({ id: `${g.modulo}-${n++}`, ...g });
  }
  return { preguntas, descartadas };
}

export async function cargarPreguntas(): Promise<ResultadoCsv> {
  const respuesta = await fetch(RUTA_CSV);
  if (!respuesta.ok) throw new Error(`No se pudo cargar el CSV (${respuesta.status})`);
  return parsearPreguntas(await respuesta.text());
}
