# UniformesYA — Notas del proyecto

## Estado inicial del repo (2026-04-25)

### Estructura encontrada
- `UniformesYA.html` — HTML con React 18 via CDN + Babel standalone
- `app.jsx` — Root component con routing manual y localStorage persistence
- `components/shared.jsx` — Icon, Modal, Btn, AppBar, Badge, Alert, Divider, SLabel
- `components/screens-1-2.jsx` — WelcomeScreen, ItemScreen, TShirtSVG
- `components/editor.jsx` — EditorScreen con Fabric.js (upload, mover, escalar, deteccion de colores)
- `components/quote.jsx` — QuoteScreen + ConfirmationScreen + WhatsApp
- `components/admin.jsx` — AdminLogin, AdminList, AdminDetail (datos mock)
- `esquema-de-precios.md` — Logica de precios real (tiers, color factors, multi-location discount, precios base remera)
- `project_brief.md` — Brief completo del proyecto

### Stack original
- React 18 via CDN (UMD)
- Babel standalone (transpilacion en browser)
- Fabric.js 5.3.1 via CDN
- Sin build system, sin package.json
- Componentes exportados a `window` global
- Estilos 100% inline
- maxWidth:430 hardcodeado (mobile-only, no responsive)

### Que estaba funcional
- Flujo completo de 5 pantallas (Welcome > Items > Editor > Quote > Confirm)
- Editor Fabric.js: upload PNG/SVG, mover, escalar, multi-area (frente/espalda/mangas)
- Deteccion de colores por area (Canvas API con cuantizacion)
- Persistencia en localStorage
- Generacion de mensaje WhatsApp con codigo de cotizacion
- Admin con datos mock (login, lista, detalle, cambio de estado)

### Que faltaba
- Precios placeholder (no usan la logica real de esquema-de-precios.md)
- Sin Supabase (DB, Auth, Storage)
- Sin Cloudinary
- Sin responsive real (solo mobile fijo a 430px)

---

## Decisiones de arquitectura

### Vite + React en vez de Next.js
- La app es 100% client-side, no necesita SSR
- Vite es mas simple, rapido, y suficiente para un SPA
- Next.js seria overengineering

### Tailwind CSS en vez de inline styles
- Los inline styles originales son ~1500 lineas de objetos JS
- Tailwind permite mantener el mismo design system pero de forma mantenible

### Sin shadcn/ui por ahora
- Los componentes custom (Btn, Modal, Alert) ya estan bien diseñados
- Se adaptan a Tailwind sin necesidad de meter otra dependencia

### Fabric.js se mantiene
- Ya funciona bien para el editor
- Es la libreria mas madura para canvas interactivo

---

## Sesion 1 — 2026-04-25

### Trabajo realizado
- Analisis completo del repo existente
- Plan de 5 fases definido y aprobado
- Fase 1 completada: migracion a Vite + React + Tailwind
  - Vite 6 (v8 requiere Node 20.19+, el usuario tiene 20.16)
  - React 19, Tailwind CSS 4
  - Fabric.js 7.3.1 (upgrade desde 5.3.1 que usaba el CDN)
  - Todos los componentes migrados de scripts globales a modulos ES
  - Inline styles convertidos a clases Tailwind
  - Theme custom con variables CSS para el design system existente
  - `lib/pricing.js` implementado con la logica real de esquema-de-precios.md
  - `lib/constants.js` centraliza todas las constantes
  - `lib/dateUtils.js` para logica de fechas de entrega
  - `lib/colorDetection.js` para deteccion de colores en canvas
  - Build exitoso (533KB JS, 54KB CSS — Fabric.js es el bulk)

### Problemas conocidos
- Fabric.js v7 tiene API diferente a v5 (FabricImage vs Image.fromURL callback)
  - Ya se ajusto a Promise-based API en EditorScreen
  - colorDetection.js puede necesitar ajustes si loadFromJSON cambio
- Chunk size warning por Fabric.js — se puede resolver con dynamic import despues
- Node 20.16 no soporta Vite 8, estamos en Vite 6
