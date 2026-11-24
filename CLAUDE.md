# Rol y objetivo

Eres un desarrollador senior de frontend. Crea una aplicación web de estudio y simulacro de examen **ITIL Foundation v5** usando **Next.js (App Router) + React + TypeScript + Bootstrap 5**, 100% estática (sin backend ni base de datos) para poder desplegarla gratis en Vercel, Netlify o GitHub Pages. Todo el texto de la interfaz debe estar en **español**.

## Token Efficiency Rules

- Read only the files needed for the current task. Avoid reading entire directories.
- Request only the line ranges you need from large files.
- Do not emit summaries of what you just did — the diff speaks for itself.
- Keep responses short and direct. Skip preambles and trailing recaps.
- Reuse existing abstractions. Never duplicate logic to avoid a small refactor.

## Design Principles

- **DRY** — Don't Repeat Yourself. Reuse existing components, hooks and helpers instead of re-implementing them.
- **SRP** — Single Responsibility Principle. Each component/hook/module does one thing; split when it accumulates unrelated responsibilities.

# Fuente de datos

- Archivo: `PreguntasITIL_Modulos1-10.csv` (codificación UTF-8 con BOM, saltos de línea CRLF, todos los campos entre comillas dobles).
- Columnas: `Modulo`, `Pregunta`, `Respuestas`, `Correcto`.
- Estructura real: cada pregunta ocupa **4 filas consecutivas** (una por opción). `Correcto` vale `verdadero` en exactamente 1 de las 4 y `falso` en las otras 3. Hay ~257 preguntas únicas (1,028 filas) en los módulos 1 a 10.
- Cópialo a `public/data/PreguntasITIL_Modulos1-10.csv` y cárgalo en el cliente con `fetch` + **PapaParse** (`header: true`, `skipEmptyLines: true`, elimina el BOM). Agrupa las filas por (`Modulo` + `Pregunta`) para formar objetos tipados:
    ```ts
    interface Opcion {
        texto: string;
        correcta: boolean;
    }
    interface Pregunta {
        id: string;
        modulo: number;
        enunciado: string;
        opciones: Opcion[];
    }
    ```
- Valida al cargar: si una pregunta no tiene exactamente 1 opción correcta, descártala y avisa en consola.
- No pongas rutas absolutas; usa `process.env.NEXT_PUBLIC_BASE_PATH` o `basePath` configurable para poder publicar en GitHub Pages.

# Funcionalidades

## 1. Filtro superior (barra fija arriba, Bootstrap navbar)

- Selector: **"Todos los módulos"**, Módulo 1 … Módulo 10 (solo los que existan en el CSV, con el conteo de preguntas, ej. "Módulo 6 (63)").
- Al cambiar el filtro se reinicia el examen en curso (pide confirmación si hay un examen a medias).
- Botón "Nuevo examen".

## 2. Examen aleatorio

- Cada examen = **20 preguntas** elegidas al azar (sin repetir) del módulo filtrado o de todos. Si el filtro tiene menos de 20 preguntas, usa todas las disponibles.
- Mezcla las preguntas y **las respuestas de cada pregunta con Fisher-Yates**. El orden de las respuestas **nunca debe ser el original del CSV ni repetirse igual** entre intentos: si tras mezclar el orden coincide con el del CSV, vuelve a mezclar. Cada vez que una pregunta aparezca en un nuevo examen se vuelve a mezclar.
- Muestra una pregunta a la vez (con barra de progreso "Pregunta 7 de 20") y botones Anterior/Siguiente, o todas en una sola página con navegación; elige la opción que dé mejor UX en móvil.
- Una opción seleccionada por pregunta (radio buttons grandes, clicables en toda la tarjeta).

## 3. Retroalimentación inmediata por pregunta

Al responder (se bloquea la pregunta, no se puede cambiar):

- La opción **correcta** siempre se resalta en **verde claro** (`#d1e7dd` con borde `#198754`).
- Si el usuario eligió una opción **incorrecta**, esa opción se resalta en **rojo claro** (`#f8d7da` con borde `#dc3545`) y además se muestra la correcta en verde.
- Las demás opciones quedan neutras. No dependas solo del color: agrega un ícono ✓ / ✗ y `aria-label` para accesibilidad.

## 4. Resultado final

- Pantalla de resultados con **puntaje** (aciertos/20 y porcentaje), indicador de aprobado/no aprobado (umbral de aprobación 65%, configurable en una constante), y desglose por módulo.
- Sección de **repaso**: lista de las preguntas falladas con tu respuesta (rojo claro) y la correcta (verde claro).
- Botones: "Repetir con otras preguntas", "Reintentar solo las falladas", "Cambiar módulo".

## 5. Extras (ligeros, sin romper lo anterior)

- Persistir en `localStorage` el filtro elegido y el historial de los últimos 10 puntajes.
- Diseño responsive mobile-first con Bootstrap 5 (importa el CSS en `layout.tsx`; no uses jQuery).

# Requisitos técnicos

- Next.js 14+ con App Router, TypeScript en modo `strict`, ESLint.
- Configura `next.config.js` con `output: 'export'` (y `images: { unoptimized: true }`) para generar la carpeta `out/` estática. Verifica que `npm run build` termine sin errores.
- Componentes de cliente (`'use client'`) donde haya estado. Estructura sugerida:
    ```
    src/app/{layout.tsx,page.tsx,globals.css}
    src/components/{FiltroModulo,PreguntaCard,Resultados,BarraProgreso}.tsx
    src/lib/{csv.ts,examen.ts,tipos.ts}
    public/data/PreguntasITIL_Modulos1-10.csv
    ```
- Funciones puras y testeables en `src/lib/examen.ts` (`barajar`, `generarExamen`, `calcularPuntaje`). Agrega pruebas con Vitest que confirmen: 20 preguntas únicas, 4 opciones por pregunta, exactamente 1 correcta, y que el orden de opciones difiere del original.
- Sin dependencias innecesarias: solo `bootstrap`, `papaparse` (+ `@types/papaparse`).

# Entregables y verificación

1. Proyecto completo funcionando con `npm install && npm run dev`.
2. `README.md` en español con instrucciones de ejecución y pasos de despliegue gratuito en **Vercel**, **Netlify** y **GitHub Pages**.
3. Antes de terminar: ejecuta `npm run build` y las pruebas, abre la app y verifica manualmente que (a) el filtro por módulo funciona, (b) el examen tiene 20 preguntas, (c) los colores verde/rojo claro se aplican correctamente, (d) el puntaje final es correcto. Reporta cualquier pregunta del CSV descartada por datos inválidos.
