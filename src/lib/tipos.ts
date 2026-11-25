export interface Opcion {
  texto: string;
  correcta: boolean;
}

export interface Pregunta {
  id: string;
  modulo: number;
  enunciado: string;
  opciones: Opcion[];
  /** Página (columna Hoja del CSV) donde se encuentra la respuesta; undefined si no se indica. */
  hoja?: string;
}

/** Filtro de módulo: "todos" o el número de módulo. */
export type Filtro = "todos" | number;

/** Índice de la opción elegida por pregunta (clave = id de pregunta). */
export type Respuestas = Record<string, number>;

export interface PuntajeModulo {
  modulo: number;
  aciertos: number;
  total: number;
}

export interface Puntaje {
  aciertos: number;
  total: number;
  porcentaje: number;
  aprobado: boolean;
  porModulo: PuntajeModulo[];
  falladas: Pregunta[];
}

export interface RegistroHistorial {
  fecha: string;
  filtro: Filtro;
  aciertos: number;
  total: number;
  porcentaje: number;
}
