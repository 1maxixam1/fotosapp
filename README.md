# Photographer Gallery (Vite + React)

## Desarrollo local
```bash
npm install
npm run dev
# http://localhost:5173
```

## Build producción
```bash
npm run build
npm run preview
# http://localhost:4173
```

## Deploy en Netlify (solución a MIME "application/octet-stream")
**No** subas el repo sin build. Debe construirse con Vite para que sirva JS con el MIME correcto.

1. Asegúrate que `package.json` tenga `"build": "vite build"` (ya está).
2. Incluye este archivo `netlify.toml` en el repo:
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"

   [build.environment]
     NODE_VERSION = "18"
     NPM_FLAGS = "--no-fund --no-audit"
   ```
3. En Netlify: *New site from Git* → elige tu repo → **Build command:** `npm run build` → **Publish directory:** `dist`.
4. (Opcional, si usas React Router) crea `public/_redirects` con:
   ```
   /*    /index.html   200
   ```

> Si ves `Failed to load module script ... MIME type application/octet-stream`, es porque se está sirviendo `/src/main.jsx` directamente (dev-only). Al hacer build, Vite genera `/dist/assets/*.js` con MIME **text/javascript** y Netlify lo sirve correctamente.
