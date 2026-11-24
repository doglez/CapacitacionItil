import type { Filtro, RegistroHistorial } from "./tipos";

const CLAVE_FILTRO = "itil:filtro";
const CLAVE_HISTORIAL = "itil:historial";
export const MAX_HISTORIAL = 10;

function leer<T>(clave: string, porDefecto: T): T {
  try {
    const crudo = window.localStorage.getItem(clave);
    return crudo ? (JSON.parse(crudo) as T) : porDefecto;
  } catch {
    return porDefecto;
  }
}

function escribir(clave: string, valor: unknown) {
  try {
    window.localStorage.setItem(clave, JSON.stringify(valor));
  } catch {
    /* almacenamiento no disponible */
  }
}

export const leerFiltro = (): Filtro => leer<Filtro>(CLAVE_FILTRO, "todos");
export const guardarFiltro = (f: Filtro) => escribir(CLAVE_FILTRO, f);
export const leerHistorial = (): RegistroHistorial[] => leer<RegistroHistorial[]>(CLAVE_HISTORIAL, []);

export function agregarHistorial(registro: RegistroHistorial): RegistroHistorial[] {
  const nuevo = [registro, ...leerHistorial()].slice(0, MAX_HISTORIAL);
  escribir(CLAVE_HISTORIAL, nuevo);
  return nuevo;
}
