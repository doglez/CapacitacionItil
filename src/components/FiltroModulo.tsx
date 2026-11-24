"use client";

import type { Filtro } from "@/lib/tipos";

interface Props {
  filtro: Filtro;
  modulos: { modulo: number; total: number }[];
  totalBanco: number;
  onCambiar: (f: Filtro) => void;
  onNuevoExamen: () => void;
}

export default function FiltroModulo({ filtro, modulos, totalBanco, onCambiar, onNuevoExamen }: Props) {
  return (
    <nav className="navbar navbar-dark bg-primary fixed-top shadow-sm">
      <div className="container-fluid gap-2 flex-nowrap">
        <span className="navbar-brand mb-0 h1 fs-6 text-truncate">ITIL v5</span>
        <div className="d-flex gap-2 ms-auto">
          <select
            id="filtro-modulo"
            className="form-select form-select-sm"
            aria-label="Filtrar por módulo"
            value={String(filtro)}
            onChange={(e) => onCambiar(e.target.value === "todos" ? "todos" : Number(e.target.value))}
          >
            <option value="todos">Todos los módulos ({totalBanco})</option>
            {modulos.map(({ modulo, total }) => (
              <option key={modulo} value={modulo}>
                Módulo {modulo} ({total})
              </option>
            ))}
          </select>
          <button type="button" className="btn btn-light btn-sm text-nowrap" onClick={onNuevoExamen}>
            Nuevo examen
          </button>
        </div>
      </div>
    </nav>
  );
}
