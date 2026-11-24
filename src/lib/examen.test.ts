import { describe, it, expect } from 'vitest';
import { generarExamen, calcularPuntaje, barajar } from './examen';
import { parsearPreguntas } from './csv';
import type { Pregunta } from './tipos';

const banco: Pregunta[] = Array.from({ length: 60 }, (_, i) => ({
  id: `${(i % 3) + 1}|p${i}`, modulo: (i % 3) + 1, enunciado: `P${i}`,
  opciones: [0, 1, 2, 3].map((k) => ({ texto: `o${k}`, correcta: k === 0 })),
}));

describe('examen', () => {
  it('20 únicas, 4 opciones, 1 correcta, orden distinto', () => {
    for (let n = 0; n < 50; n++) {
      const ex = generarExamen(banco);
      expect(ex).toHaveLength(20);
      expect(new Set(ex.map((p) => p.id)).size).toBe(20);
      for (const p of ex) {
        const orig = banco.find((b) => b.id === p.id)!;
        expect(p.opciones).toHaveLength(4);
        expect(p.opciones.filter((o) => o.correcta)).toHaveLength(1);
        expect(p.opciones.map((o) => o.texto)).not.toEqual(orig.opciones.map((o) => o.texto));
      }
    }
  });
  it('filtra por módulo y usa todas si hay menos de 20', () => {
    expect(generarExamen(banco, 2)).toHaveLength(20);
    expect(generarExamen(banco.slice(0, 5), null)).toHaveLength(5);
  });
  it('barajar conserva elementos', () => {
    expect(barajar([1, 2, 3, 4]).sort()).toEqual([1, 2, 3, 4]);
  });
  it('calcula puntaje', () => {
    const ex = banco.slice(0, 4);
    const r = calcularPuntaje(ex, [0, 1, null, 0]);
    expect(r.aciertos).toBe(2);
    expect(r.porcentaje).toBe(50);
    expect(r.aprobado).toBe(false);
  });
  it('descarta preguntas inválidas del CSV', () => {
    const csv = '\uFEFF"Modulo","Pregunta","Respuestas","Correcto"\r\n' +
      ['verdadero', 'falso', 'falso', 'falso'].map((c, i) => `"1","Q1","a${i}","${c}"`).join('\r\n') + '\r\n' +
      ['falso', 'falso'].map((c, i) => `"1","Q2","b${i}","${c}"`).join('\r\n') + '\r\n';
    const { preguntas, descartadas } = parsearPreguntas(csv);
    expect(preguntas).toHaveLength(1);
    expect(descartadas).toHaveLength(1);
  });
});
