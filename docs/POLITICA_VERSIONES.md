# Política de Versionado Único y Automático — MateTic

Este documento establece la regla obligatoria de versionado para cualquier cambio realizado en **MateTic**.

## Regla obligatoria

Todo cambio que modifique comportamiento, contenido, diseño o recursos de la app DEBE (1) subir la versión en `js/version.js` con SemVer (parche: correcciones/ajustes de texto; menor: funciones nuevas; mayor: cambios incompatibles o rediseños grandes), (2) añadir una entrada en `RELEASE_NOTES` con lo que cambió en lenguaje de usuario, (3) registrar el cambio en `docs/CAMBIOS.md`, (4) si agregó, quitó o renombró archivos de la app, ejecutar `node scripts/update-precache.mjs`, y (5) ejecutar `node --test tests/` antes de cerrar.

## Fuente única de verdad (`js/version.js`)

- El archivo `js/version.js` expone sus constantes a través de `globalThis` (`globalThis.MatInteractivaVersion` y `globalThis.MatInteractiva.Version`), de modo que funciona exactamente igual en el navegador (`index.html`) y dentro del Service Worker (`sw.js` vía `importScripts('js/version.js', 'js/precache-manifest.js')`).
- De `js/version.js` se derivan automáticamente:
  - El nombre mostrado de la aplicación (`APP_NAME = "MateTic"`) y subtítulo (`APP_TAGLINE`).
  - La versión visible en el panel de **Ajustes** (`MateTic vX.Y.Z`).
  - El aviso emergente de actualización (`"Novedades de MateTic vX.Y.Z"`) y su historial de notas (`RELEASE_NOTES`, ordenado de la versión más nueva a la más antigua).
  - El nombre del caché del Service Worker en `sw.js` (`matetic-vX.Y.Z`), invalidando automáticamente los cachés de versiones anteriores al activar la nueva versión.
- **Prohibición**: NO se debe escribir el número de versión ni el nombre de la aplicación a mano en ningún otro archivo de `js/`, `css/` o `index.html` (salvo los textos estáticos iniciales de `index.html` y `manifest.webmanifest`, los cuales están verificados por `tests/version-consistency.test.js` y `tests/branding.test.js`).

## Script auxiliar `scripts/bump-version.mjs`

Para subir la versión de forma segura sin romper el formato de `js/version.js`:

```powershell
node scripts/bump-version.mjs <patch|minor|major> "Primera novedad para el usuario" "Segunda novedad"
```

Ejemplos:
```powershell
node scripts/bump-version.mjs patch "Corrección en el cálculo de ejes del graficador móvil"
node scripts/bump-version.mjs minor "Nuevo módulo de prácticas guiadas offline"
node scripts/bump-version.mjs major "Nueva arquitectura de almacenamiento local v2"
```

El script incrementa `APP_VERSION`, actualiza `APP_RELEASE_DATE` con la fecha actual (`YYYY-MM-DD`), inserta la nueva entrada al inicio de `RELEASE_NOTES` y ejecuta automáticamente `node scripts/update-precache.mjs`.
