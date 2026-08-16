# DailyFlow

Sitio web de recordatorios diarios que lee `reminders.json` automáticamente cada 2 segundos.

## Archivos

- `index.html` — estructura de la página.
- `styles.css` — diseño responsive y animaciones.
- `app.js` — lectura del JSON, botón "Hecho hoy", rachas y almacenamiento local.
- `reminders.json` — configuración de todos los dailies.

## Configurar un daily

Añade objetos dentro de `reminders`:

```json
{
  "id": "mi-daily",
  "title": "Leer 20 páginas",
  "description": "Leer un poco todos los días.",
  "durationDays": 21,
  "startDate": "2026-08-15",
  "endDate": "2026-09-04"
}
```

`id` debe ser único.

## Importante

Como el navegador normalmente no puede modificar un archivo JSON del servidor, el progreso de "Hecho hoy" y las rachas se guardan en `localStorage` del navegador. El JSON sirve para configurar los dailies.

Para probarlo localmente, usa un servidor web (por ejemplo VS Code Live Server). Abrir `index.html` directamente con `file://` puede impedir `fetch()` de `reminders.json`.

La página añade `?t=timestamp` y `cache: no-store` para forzar una lectura nueva del JSON cada 2 segundos.
