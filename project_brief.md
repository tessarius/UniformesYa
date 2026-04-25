# UniformesYa — Project Brief para Claude Code

## 0. Antes de empezar (LEÉ ESTO PRIMERO)

**Tarea inicial obligatoria:** Creá un archivo llamado `notes.md` en la raíz del proyecto y guardá ahí cada decisión importante, elección de arquitectura, dependencia agregada, problema conocido o trade-off que surja **cada vez que trabajemos**. Tratá ese archivo como la memoria viva del proyecto: si tomamos una decisión, va ahí; si encontramos un bug que no resolvemos en el momento, va ahí; si elegís una librería sobre otra, explicá por qué en una línea.

**Punto de partida del repo:** ya existen archivos generados con Claude Design (al menos un `App.jsx` y un archivo HTML). **No asumas nada sobre su contenido.** Antes de escribir código:

1. Listá la estructura del proyecto (`ls -la`, `tree` o equivalente).
2. Leé los archivos existentes (`App.jsx`, el `.html`, `package.json` si existe, configs).
3. Identificá: qué framework está usando, qué dependencias hay instaladas, qué componentes ya están construidos, qué pantallas están armadas vs. cuáles faltan.
4. Documentá ese estado inicial en `notes.md` bajo una sección "Estado inicial del repo".
5. **Adaptate a lo que ya existe.** Si el código está en Vite + React puro y este brief asume Next.js, priorizá no romper lo existente y proponeme la migración solo si es estrictamente necesaria.
6. Antes de hacer cambios estructurales grandes, preguntame.

---

## 1. Qué es UniformesYa

Herramienta web de cotización y diseño para un negocio de serigrafía en Asunción, Paraguay. Los clientes suben sus diseños, los ubican sobre el lienzo 2D de una remera, y obtienen una cotización automática basada en área impresa, cantidad de colores, calidad, cantidad y tiempo de entrega. La cotización se cierra por WhatsApp.

**Alcance del MVP:** flujo completo solo para **remeras**. Otros items (tote bags, hoodies, gorras, bolígrafos) aparecen como "Próximamente" en la UI pero no son funcionales.

---

## 2. Stack técnico objetivo

> Si el repo actual ya tiene un stack distinto, primero verificá y avisame antes de cambiar nada.

- **Frontend:** Next.js 14 (App Router) + Tailwind CSS + shadcn/ui
- **Editor de lienzo:** Fabric.js
- **Backend / DB / Auth / Storage:** Supabase
- **Imágenes optimizadas:** Cloudinary
- **Mobile-first:** la mayoría de usuarios entra desde celular

---

## 3. Flujo de pantallas (cliente)

### Pantalla 1 — Bienvenida
- Hero con propuesta de valor: "Diseñá tu remera personalizada y cotizá al instante"
- Explicación visual en 3-4 pasos del funcionamiento
- CTA principal: "Empezar"
- Footer mínimo con contacto / redes

### Pantalla 2 — Selección de item
- Grid: Remera, Tote Bag, Hoodie, Gorra, Bolígrafo
- Solo Remera está habilitada; el resto con badge "Próximamente" deshabilitado visualmente
- Seleccionar Remera → avanza a Pantalla 3

### Pantalla 3 — Editor de personalización
La pantalla más compleja. Debe incluir:

**Configuración del item:**
- Selector de color de remera (chips: blanco, negro, gris, azul marino, rojo, verde — listado final lo confirmo yo)
- Tabs de vista: **Frente | Espalda | Manga Izq. | Manga Der.**

**Lienzo central:**
- Silueta 2D de remera en el color seleccionado (vista correspondiente al tab)
- Área imprimible delimitada con guía visual (línea punteada u overlay sutil):
  - **A3 (29.7 × 42 cm)** en Frente y Espalda
  - **A7 (7.4 × 10.5 cm)** en Mangas
- Si un diseño se sale del área → resaltar el límite con color de advertencia y mostrar warning

**Acciones del editor:**
- Botón "Subir diseño" (acepta solo PNG y SVG)
- Antes del **primer** upload, modal secuencial con dos mensajes:
  1. *"Para que la remera sea de la mejor calidad posible, asegurate de subir tus archivos en la mejor calidad."*
  2. *"No te preocupes si las ubicaciones no quedan perfectas. Te enviaremos un diseño final para que lo aceptes antes de pasar a producción."*
- Validación de resolución mínima al subir: sugerir ≈150 DPI al tamaño final del área. Si no alcanza → warning **no bloqueante** ("Tu diseño podría verse pixelado al imprimirlo")
- Cliente puede **mover** y **escalar** los diseños (NO rotar en el MVP)
- **Múltiples diseños por área** permitidos
- Cambiar de tab preserva los diseños ya colocados en cada zona
- Lista lateral de diseños subidos con opción de eliminar individualmente

**Botón "Confirmar diseño":**
- Se habilita solo si hay al menos 1 diseño colocado
- Al hacer click → modal con conteo automático de colores detectados:
  - "Detectamos que tu diseño tiene **X colores**. ¿Es correcto?"
  - Opciones: "Sí, es correcto" / "No, tiene ___ colores" (input numérico)
- Tras confirmar → avanza a Pantalla 4

### Pantalla 4 — Cotización
- Resumen visual del diseño confirmado (thumbnail por vista con diseños colocados)
- **Selector de calidad:** Económica / Superior / Premium (con descripción breve de cada una)
- **Cantidad por talle:** inputs numéricos para S, M, L, XL, XXL
  - Validación: total mínimo **10 unidades**
- **Tiempo de envío:** opciones radio (Estándar / Rápido / Express — días por confirmar)
- **Resumen de cotización en tiempo real:**
  - Subtotal por unidad
  - Cantidad total
  - Recargo por colores
  - Recargo por tiempo de envío
  - **Total**
- Botón "Continuar" se habilita al cumplir mínimo de 10 unidades

### Pantalla 5 — Confirmación y solicitud por WhatsApp
- Resumen completo: item, color, diseños (thumbnails), calidad, talles, tiempo de envío, total
- **Formulario de captura:**
  - Nombre completo (requerido)
  - Teléfono / WhatsApp (requerido, validación de formato paraguayo)
- Al enviar:
  1. Guarda toda la cotización en Supabase
  2. Genera un **código único** (formato `UY-2026-0042`)
  3. Sube imágenes a Cloudinary
  4. Abre WhatsApp con mensaje pre-armado que incluye el código y los detalles del pedido
- Mensaje post-envío en pantalla: "¡Tu cotización está lista! Te contactaremos por WhatsApp."

---

## 4. Vista Admin (interna)

Acceso protegido por login (Supabase Auth).

**Listado de cotizaciones:**
- Tabla: Código, Fecha, Cliente, Teléfono, Total, Estado
- Filtros por estado y por rango de fechas
- Búsqueda por código o nombre

**Detalle de cotización:**
- Datos del cliente y contacto
- Item, color, calidad, tiempo de envío
- Talles y cantidades
- Diseños subidos (originales) + render del lienzo por cada vista
- Cantidad de colores confirmada por el cliente
- Total cotizado
- **Selector de estado:** Nuevo / Contactado / En producción / Completado / Cancelado
- Notas internas (textarea libre)

---

## 5. Modelo de datos (referencial)

```
cotizaciones
  id, codigo, cliente_nombre, cliente_telefono,
  item_tipo, item_color, calidad, tiempo_envio,
  cantidad_total, precio_total, estado, notas_internas, created_at

diseños
  id, cotizacion_id, area (frente/espalda/manga_izq/manga_der),
  imagen_url, posicion_x, posicion_y, escala_x, escala_y,
  ancho_px, alto_px, colores_detectados, colores_confirmados

talles
  id, cotizacion_id, talle (S/M/L/XL/XXL), cantidad
```

> Si proponés cambios al esquema, justificá en `notes.md`.

---

## 6. Lógica de precios

**Yo (Nacho) ya tengo la lógica de precios definida.** No la inventes. Cuando llegue el momento de implementarla, voy a pasártela. Por ahora, dejá la función de cálculo como un módulo aislado (`lib/pricing.ts` o equivalente) con una firma clara que reciba: área impresa por zona, cantidad de colores, calidad, cantidad por talle y tiempo de envío, y devuelva el desglose. Los valores numéricos pueden ser placeholders por ahora.

---

## 7. Validaciones, estados y microcopy

- Persistencia del progreso en `localStorage` para no perder trabajo al recargar
- Botón "Volver" entre pantallas sin perder datos
- Validación de archivos: solo PNG/SVG, máximo 10 MB
- Loading states claros en uploads y al generar cotización final
- Mensajes de error empáticos, no técnicos
- Todo el copy en **español rioplatense / paraguayo** (vos, no tú)

---

## 8. Consideraciones técnicas clave

- **Mobile-first real:** Fabric.js tiene que ser usable con los dedos. Botones grandes, pinch-to-zoom y arrastre fluidos. Probá en mobile antes de dar algo por terminado.
- **Responsive:** desktop puede tener panel lateral amplio; mobile el lienzo ocupa casi toda la pantalla con controles colapsables.
- **Performance:** siluetas de remera como SVG liviano; imágenes subidas pasan por Cloudinary.
- **Accesibilidad básica:** contraste, labels en inputs, focus states visibles.
- **Detección de colores:** investigá si conviene hacerlo en el cliente (Canvas API + cuantización tipo k-means) o pasar por un servicio. Documentá la decisión en `notes.md`.

---

## 9. Lo que NO entra al MVP

- Función de texto en el editor
- Items distintos a remera
- Mockups realistas (siempre lienzo 2D)
- Pago online (cierre por WhatsApp)
- Cuentas de cliente / historial del lado del cliente
- Rotación de diseños (solo mover y escalar)

---

## 10. Cómo trabajamos

1. **Antes de codear cambios grandes:** preguntá. No reescribas estructura sin confirmación.
2. **Después de cada sesión de trabajo:** actualizá `notes.md` con lo que hicimos, decisiones tomadas, problemas pendientes.
3. **Si encontrás contradicciones** entre este brief y el código existente: marcalas, no las resuelvas en silencio.
4. **Si una librería o approach que sugiero es mala idea:** decímelo. No me sigas la corriente.
5. **Commits chicos y descriptivos** si hay git inicializado. Si no hay git, sugerí inicializarlo en la primera sesión.
6. **No instales dependencias pesadas sin avisar.** Si necesitás algo grande (otra librería de UI, otro framework), preguntá primero.

---

## 11. Primer paso concreto

Cuando leas esto:

1. Verificá el estado del repo (estructura, archivos existentes, dependencias).
2. Creá `notes.md` con la sección "Estado inicial del repo" describiendo qué encontraste.
3. Comparame ese estado contra este brief y decime: qué está hecho, qué falta, qué hay que adaptar, y qué dudas tenés antes de avanzar.
4. **No escribas código todavía.** Esperá mi confirmación del plan.