# Simulacro ITIL Foundation v5

Aplicación web 100% estática (Next.js + React + TypeScript + Bootstrap 5) para estudiar y practicar exámenes de ITIL Foundation v5. Las preguntas se leen desde `public/data/PreguntasITIL_Modulos1-10.csv`.

## Ejecución local

```bash
yarn install        # o npm install
yarn dev            # http://localhost:3000
yarn test           # pruebas con Vitest
yarn lint
yarn build          # genera la carpeta estática out/
```

## Configuración

- Número de preguntas por examen y umbral de aprobación (65 %): constantes en `src/lib/examen.ts`.
- Publicación en una subruta (p. ej. GitHub Pages): define `NEXT_PUBLIC_BASE_PATH=/nombre-repo` antes de `build`.

## Despliegue gratuito

### Vercel
1. Sube el repositorio a GitHub.
2. En vercel.com → *Add New Project* → importa el repositorio.
3. Framework: Next.js (detectado automáticamente). Pulsa *Deploy*.

### Netlify
1. *Add new site* → *Import an existing project* → elige el repositorio.
2. Build command: `yarn build` — Publish directory: `out`.
3. *Deploy*.

### GitHub Pages
1. En *Settings → Pages* selecciona *Source: GitHub Actions*.
2. Crea `.github/workflows/deploy.yml` que ejecute `yarn install`, `NEXT_PUBLIC_BASE_PATH=/<nombre-repo> yarn build` y publique `out/` con `actions/upload-pages-artifact` y `actions/deploy-pages`.
3. Haz push a `main`; el sitio quedará en `https://<usuario>.github.io/<nombre-repo>/`.
