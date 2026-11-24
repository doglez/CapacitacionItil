"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cargarPreguntas } from "@/lib/csv";
import { calcularPuntaje, filtrarPorModulo, generarExamen } from "@/lib/examen";
import { agregarHistorial, guardarFiltro, leerFiltro, leerHistorial } from "@/lib/almacenamiento";
import type { Filtro, Pregunta, RegistroHistorial, Respuestas } from "@/lib/tipos";

export function useExamen() {
  const [banco, setBanco] = useState<Pregunta[]>([]);
  const [descartadas, setDescartadas] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltroEstado] = useState<Filtro>("todos");
  const [examen, setExamen] = useState<Pregunta[]>([]);
  const [respuestas, setRespuestas] = useState<Respuestas>({});
  const [actual, setActual] = useState(0);
  const [finalizado, setFinalizado] = useState(false);
  const [historial, setHistorial] = useState<RegistroHistorial[]>([]);
  const previos = useRef(new Map<string, string>());

  const iniciar = useCallback((pool: Pregunta[]) => {
    setExamen(generarExamen(pool, undefined, previos.current));
    setRespuestas({});
    setActual(0);
    setFinalizado(false);
  }, []);

  useEffect(() => {
    cargarPreguntas()
      .then(({ preguntas, descartadas }) => {
        const guardado = leerFiltro();
        const valido = guardado === "todos" || preguntas.some((p) => p.modulo === guardado);
        const f = valido ? guardado : "todos";
        setBanco(preguntas);
        setDescartadas(descartadas);
        setFiltroEstado(f);
        setHistorial(leerHistorial());
        iniciar(filtrarPorModulo(preguntas, f));
      })
      .catch((e: Error) => setError(e.message));
  }, [iniciar]);

  const modulos = useMemo(() => {
    const conteo = new Map<number, number>();
    banco.forEach((p) => conteo.set(p.modulo, (conteo.get(p.modulo) ?? 0) + 1));
    return [...conteo.entries()].sort((a, b) => a[0] - b[0]).map(([modulo, total]) => ({ modulo, total }));
  }, [banco]);

  const enCurso = !finalizado && Object.keys(respuestas).length > 0;
  const puntaje = useMemo(
    () => (finalizado ? calcularPuntaje(examen, respuestas) : null),
    [finalizado, examen, respuestas],
  );

  const confirmarAbandono = () =>
    !enCurso || window.confirm("Hay un examen a medias. ¿Deseas descartarlo y empezar uno nuevo?");

  const cambiarFiltro = (f: Filtro) => {
    if (f === filtro || !confirmarAbandono()) return;
    setFiltroEstado(f);
    guardarFiltro(f);
    iniciar(filtrarPorModulo(banco, f));
  };

  const nuevoExamen = () => {
    if (confirmarAbandono()) iniciar(filtrarPorModulo(banco, filtro));
  };

  const reintentarFalladas = () => {
    if (puntaje) iniciar(puntaje.falladas);
  };

  const responder = (idPregunta: string, indice: number) =>
    setRespuestas((r) => (idPregunta in r ? r : { ...r, [idPregunta]: indice }));

  const finalizar = () => {
    const p = calcularPuntaje(examen, respuestas);
    setHistorial(
      agregarHistorial({
        fecha: new Date().toISOString(),
        filtro,
        aciertos: p.aciertos,
        total: p.total,
        porcentaje: p.porcentaje,
      }),
    );
    setFinalizado(true);
  };

  return {
    cargando: banco.length === 0 && !error,
    error,
    descartadas,
    modulos,
    totalBanco: banco.length,
    filtro,
    examen,
    respuestas,
    actual,
    setActual,
    finalizado,
    puntaje,
    historial,
    cambiarFiltro,
    nuevoExamen,
    reintentarFalladas,
    responder,
    finalizar,
  };
}
