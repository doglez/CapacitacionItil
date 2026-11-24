export interface Opcion { texto: string; correcta: boolean }
export interface Pregunta { id: string; modulo: number; enunciado: string; opciones: Opcion[] }
export interface Intento { preguntas: Pregunta[]; respuestas: (number | null)[] }
export interface Puntaje { aciertos: number; total: number; porcentaje: number; aprobado: boolean; porModulo: Record<number, { aciertos: number; total: number }> }
