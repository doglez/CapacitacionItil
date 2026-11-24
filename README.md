# Simulacro ITIL Foundation v5

App estática (Next.js App Router + React + TypeScript + Bootstrap 5) para estudiar y simular el examen ITIL Foundation v5. Sin backend.

## Ejecución

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # pruebas Vitest
npm run build    # genera la carpeta out/
```

## Datos

Las preguntas se leen de `public/data/PreguntasITIL_Modulos1-10.csv` (columnas `Modulo`, `Pregunta`, `Respuestas`, `Correcto`; 4 filas por pregunta). **El archivo incluido es un ejemplo de 30 preguntas: reemplázalo por el CSV real.** Las preguntas que no tengan exactamente 1 opción correcta se descartan y se avisan en la consola del navegador.

El umbral de aprobación (65%) y el tamaño del examen (20) están en `src/lib/examen.ts`.

## Despliegue gratuito

- **Vercel**: importa el repo; Vercel detecta Next.js. Listo.
- **Netlify**: build command `npm run build`, publish directory `out`.
- **GitHub Pages**: compila con `NEXT_PUBLIC_BASE_PATH=/CapacitacionItil npm run build`, publica el contenido de `out/` (p. ej. con GitHub Actions `actions/upload-pages-artifact` + `deploy-pages`) y añade un archivo `out/.nojekyll`.
