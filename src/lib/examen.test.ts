import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parsearPreguntas } from "./csv";
import { barajar, calcularPuntaje, generarExamen } from "./examen";

const { preguntas, descartadas } = parsearPreguntas(
  readFileSync("public/data/PreguntasITIL_Modulos1-10.csv", "utf8"),
);

describe("CSV", () => {
  it("carga las preguntas sin descartar ninguna", () => {
    expect(descartadas).toEqual([]);
    expect(preguntas.length).toBeGreaterThan(100);
  });
});

describe("generarExamen", () => {
  const examen = generarExamen(preguntas);

  it("tiene 20 preguntas únicas", () => {
    expect(examen).toHaveLength(20);
    expect(new Set(examen.map((p) => p.id)).size).toBe(20);
  });

  it("cada pregunta tiene 4 opciones y exactamente 1 correcta", () => {
    for (const p of examen) {
      expect(p.opciones).toHaveLength(4);
      expect(p.opciones.filter((o) => o.correcta)).toHaveLength(1);
    }
  });

  it("el orden de las opciones difiere del original y entre intentos", () => {
    const previos = new Map<string, string>();
    const a = generarExamen(preguntas, 20, previos);
    const b = generarExamen(a.map((p) => preguntas.find((q) => q.id === p.id)!), 20, previos);
    for (const p of a) {
      const orig = preguntas.find((q) => q.id === p.id)!;
      expect(p.opciones.map((o) => o.texto)).not.toEqual(orig.opciones.map((o) => o.texto));
    }
    for (const p of b) {
      const previo = a.find((q) => q.id === p.id)!;
      expect(p.opciones.map((o) => o.texto)).not.toEqual(previo.opciones.map((o) => o.texto));
    }
  });

  it("usa todas las preguntas si el pool es menor a 20", () => {
    expect(generarExamen(preguntas.slice(0, 5))).toHaveLength(5);
  });
});

describe("barajar", () => {
  it("conserva los elementos", () => {
    expect(barajar([1, 2, 3, 4, 5]).sort()).toEqual([1, 2, 3, 4, 5]);
  });
});

describe("calcularPuntaje", () => {
  it("calcula aciertos, porcentaje, aprobación y falladas", () => {
    const examen = generarExamen(preguntas);
    const respuestas: Record<string, number> = {};
    examen.forEach((p, i) => {
      const correcta = p.opciones.findIndex((o) => o.correcta);
      respuestas[p.id] = i < 14 ? correcta : (correcta + 1) % 4;
    });
    const r = calcularPuntaje(examen, respuestas);
    expect(r.aciertos).toBe(14);
    expect(r.porcentaje).toBe(70);
    expect(r.aprobado).toBe(true);
    expect(r.falladas).toHaveLength(6);
    expect(r.porModulo.reduce((s, m) => s + m.total, 0)).toBe(20);
  });

  it("no aprueba bajo el umbral", () => {
    const examen = generarExamen(preguntas);
    expect(calcularPuntaje(examen, {}).aprobado).toBe(false);
  });
});
