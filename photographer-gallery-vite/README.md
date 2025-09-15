# Galería Fotográfica — React + Vite + Tailwind (LocalStorage)

App preparada para fotógrafos: administra clientes, fotos públicas/privadas y IDs autorizados (modo Admin). Todo se guarda en `localStorage`, sin backend.

## 🧰 Características
- **Login por código de cliente** (p.ej. `LUNA2024`, `SOL2024`).
- **Vista pública** (no requiere ID): solo fotos públicas.
- **Acceso privado** (requiere ID autorizado): ve públicas + privadas.
- **Modo Administrador** (PIN por defecto: `1234`):
  - Crear/editar/eliminar clientes.
  - Agregar/eliminar fotos (públicas o privadas).
  - Generar IDs autorizados o agregarlos manualmente.
  - Cambiar PIN.

> Los **IDs** son los únicos que pueden ver fotos privadas de su cliente.

## 🚀 Cómo correrlo
1. Descomprime este zip.
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Ejecuta en desarrollo:
   ```bash
   npm run dev
   ```
4. Abre la URL que muestre Vite (por defecto `http://localhost:5173`).

## 🎨 Tailwind
Ya viene configurado. Clases utilitarias usadas en toda la app.

## 🧪 Datos de demo
- Códigos: `LUNA2024`, `SOL2024`
- IDs: `LUNA-001`, `LUNA-002`, `SOL-001`
- PIN Admin: `1234`

Puedes borrar/editar desde el **Panel Admin**.

## 📦 Build
```bash
npm run build
npm run preview
```

## 📁 Estructura
```
photographer-gallery-vite/
├─ src/
│  ├─ components/
│  │  ├─ Admin.jsx
│  │  ├─ AnimatedBackground.jsx
│  │  ├─ Gallery.jsx
│  │  ├─ Header.jsx
│  │  └─ Login.jsx
│  ├─ lib/
│  │  └─ storage.js
│  ├─ App.jsx
│  ├─ index.css
│  └─ main.jsx
├─ index.html
├─ package.json
├─ postcss.config.js
├─ tailwind.config.js
├─ vite.config.js
└─ README.md
```

## 🔐 Notas
- Esto es solo frontend. La seguridad real requiere backend.
- No se suben fotos; se manejan **URLs**. Puedes adaptar para carga real más adelante.


## 👑 Acceso Admin
- Solo por **PIN** (por defecto: `1234`).
- Desde la pantalla inicial, usa **Administrador (PIN)** para abrir el panel.

## 🔒 Fotos privadas por usuario
- En **Admin**, selecciona un **cliente** y luego un **usuario** para agregarle/quitarle fotos privadas específicas.
- En **login privado**, el cliente ingresa su **código** + **ID de usuario** y solo verá sus fotos privadas (más las públicas del cliente).


## 🖼️ Subida de archivos locales
En **Admin** ahora puedes cargar fotos desde tu computadora. Se guardan como **Data URL** en `localStorage` para mantener todo offline.
> Nota: `localStorage` tiene límite (5–10MB aprox. según navegador). Para sesiones grandes conviene migrar a **IndexedDB** o backend.


## 🌐 Galería pública
El botón **Ver todas públicas** entra directo y muestra todas las fotos públicas (de todos los clientes).

## 🔒 Acceso privado por ID
Para ver privadas: ingresa solo tu **ID** (no hace falta el código del cliente). El sistema detecta a qué cliente perteneces.
