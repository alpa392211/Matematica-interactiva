# Instrucciones para Agentes y Colaboradores — MateTic

Este repositorio contiene **MateTic** (*Matemáticas Interactivas*, por **ALPA Studio**): una aplicación web educativa estática en JavaScript puro (`window.MatInteractiva`), sin frameworks ni bundlers en tiempo de ejecución.

## Regla de versionado obligatorio

Todo cambio que modifique comportamiento, contenido, diseño o recursos de la app DEBE (1) subir la versión en `js/version.js` con SemVer (parche: correcciones/ajustes de texto; menor: funciones nuevas; mayor: cambios incompatibles o rediseños grandes), (2) añadir una entrada en `RELEASE_NOTES` con lo que cambió en lenguaje de usuario, (3) registrar el cambio en `docs/CAMBIOS.md`, (4) si agregó, quitó o renombró archivos de la app, ejecutar `node scripts/update-precache.mjs`, y (5) ejecutar `node --test tests/` antes de cerrar.

Consulta la guía completa en `docs/POLITICA_VERSIONES.md` o usa el script auxiliar:

```powershell
node scripts/bump-version.mjs <patch|minor|major> "Nota breve para el usuario"
```

## Reglas técnicas del repositorio

1. **Fuente única de verdad (`js/version.js`)**:
   - El nombre de la app (`APP_NAME`), subtítulo (`APP_TAGLINE`), versión (`APP_VERSION`), estudio (`STUDIO_NAME`), notas (`RELEASE_NOTES`) y nombre de caché del Service Worker se derivan automáticamente de `js/version.js`.
   - NO escribas números de versión ni el nombre de la aplicación a mano en otros archivos (salvo las etiquetas HTML iniciales de `index.html` y `manifest.webmanifest`, protegidas por tests automáticos).
2. **Almacenamiento local**:
   - Conserva intactos el namespace interno `window.MatInteractiva`, las claves `matematica_interactiva_progreso_v1`, `matematica_interactiva_tema_v1` y `matematica_interactiva_preferencias_v1` (en preferencias solo agrega campos opcionales con respaldo por defecto).
3. **Sin dependencias ni recursos externos en tiempo de ejecución**:
   - KaTeX y MathLive viven localmente en `vendor/`. El único enlace externo permitido en el código servido es el enlace `<a id="btn-kofi-support">` hacia `https://ko-fi.com/edrx_ngl`.
4. **Verificación obligatoria**:
   - Ejecuta `node --test tests/` antes de finalizar cualquier cambio y asegúrate de que pasen `version-consistency.test.js`, `branding.test.js`, `no-external-requests.test.js`, `pwa-offline.test.js` y toda la suite matemática.
