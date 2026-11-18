# Dependencias Locales Embebidas (vendor/) — MateTic

Todos los recursos matemáticos tipográficos se sirven de forma **100 % local y sin peticiones externas** dentro de `vendor/`.

- **Fecha de empaquetado**: 2026-11-17
- **Método de obtención**: `npm pack katex@0.16.9 mathlive@0.101.2` en carpeta temporal fuera del proyecto.
- **Peso total de `vendor/`**: 1622839 bytes (1.55 MiB) en 46 archivos.

## Paquetes incluidos

| Paquete | Versión | Licencia | Origen | Notas de empaquetado |
| :--- | :--- | :--- | :--- | :--- |
| `katex` | `0.16.9` | MIT | Registro npm oficial (`registry.npmjs.org`) | Incluye `katex.min.js`, `katex.min.css` (editado para conservar únicamente reglas `woff2`) y las 20 fuentes `.woff2` en `fonts/`. |
| `mathlive` | `0.101.2` | MIT | Registro npm oficial (`registry.npmjs.org`) | Incluye `mathlive.min.js` (sanitizados 2 literales informativos en mensajes de consola hacia unpkg/npmjs sin alterar lógica), `mathlive-static.css` y las 20 fuentes `.woff2` en `fonts/`. Sonidos excluidos y deshabilitados. |

## Inventario de archivos y hashes SHA-256

| Archivo | Tamaño (bytes) | SHA-256 |
| :--- | ---: | :--- |
| `vendor/katex/fonts/KaTeX_AMS-Regular.woff2` | 28076 | `0cdd387c9590a1a9f9794560022dbb59654a7d86f187aa0c81495ad42d3a7308` |
| `vendor/katex/fonts/KaTeX_Caligraphic-Bold.woff2` | 6912 | `de7701e42cf1f4cf0b766c03fb27977207eee2f4fd5d76fa82188406da43ea4c` |
| `vendor/katex/fonts/KaTeX_Caligraphic-Regular.woff2` | 6908 | `5d53e70ad607c2352162dec9e0923fb54ecdafaccbf604cd8dcf7d00facb989b` |
| `vendor/katex/fonts/KaTeX_Fraktur-Bold.woff2` | 11348 | `74444efd593c005e3f4573b44524704c0af0a937fe911cca9e94068d0d140d3f` |
| `vendor/katex/fonts/KaTeX_Fraktur-Regular.woff2` | 11316 | `51814d270d06ff0255dba0799994fa4d8c84d11f09951d47595f4abb1f3602dc` |
| `vendor/katex/fonts/KaTeX_Main-Bold.woff2` | 25324 | `0f60d1b897938ec918c8ce073092411baf9438f6739465693ff18b0f9d20b021` |
| `vendor/katex/fonts/KaTeX_Main-BoldItalic.woff2` | 16780 | `99cd42a3c072d918f2f44984a807cf7aa16e13545fd0875fc07c6c65f99e715b` |
| `vendor/katex/fonts/KaTeX_Main-Italic.woff2` | 16988 | `97479ca6cce906abc961ecac96faa5f9ca2e61b8e7670d475826bcdee9a7c267` |
| `vendor/katex/fonts/KaTeX_Main-Regular.woff2` | 26272 | `c2342cd8b869e01752a9321dc17213fc40d4d04c79688c1d43f2cf316abd7866` |
| `vendor/katex/fonts/KaTeX_Math-BoldItalic.woff2` | 16400 | `dc47344dbb6cb5b655c8460d561f4df5f501b90c804ad3c6cec65fe322351ab1` |
| `vendor/katex/fonts/KaTeX_Math-Italic.woff2` | 16440 | `7af58c5ec8f132a2ddde9027c6d7814decce4d3b822a11192a42a20e2e973264` |
| `vendor/katex/fonts/KaTeX_SansSerif-Bold.woff2` | 12216 | `e99ae51144bf1232efcc1bfe5add36262c6866b0faab24fa75740e1b98577a62` |
| `vendor/katex/fonts/KaTeX_SansSerif-Italic.woff2` | 12028 | `00b26ac825e2095056396e0553b8ac26d3f8ad158c3826e28b4c45b385c4714a` |
| `vendor/katex/fonts/KaTeX_SansSerif-Regular.woff2` | 10344 | `68e8c73ef42afd3ccec58bf0fba302cce448938e7fc020a5e31f8a952eee1342` |
| `vendor/katex/fonts/KaTeX_Script-Regular.woff2` | 9644 | `036d4e95149b69ff9bcc0cd55771efeb25ffa3947293e69acd78d5ac328c684b` |
| `vendor/katex/fonts/KaTeX_Size1-Regular.woff2` | 5468 | `6b47c40166b6dbe21a5dfca7718413f2147fd2399be1ba605d8ad39cedf25dfe` |
| `vendor/katex/fonts/KaTeX_Size2-Regular.woff2` | 5208 | `d04c54219f9eaec6d4d4fd42dfb28785975a4794d6b2fc71e566b9cd6db842dd` |
| `vendor/katex/fonts/KaTeX_Size3-Regular.woff2` | 3624 | `73d591271b1604960cb10bb90fee021670af7297017e0e98480b332d11f51995` |
| `vendor/katex/fonts/KaTeX_Size4-Regular.woff2` | 4928 | `a4af7d414440a1c1790825cfb700cf9cf43b0f2c4b04f0ebc523011ad9853ec0` |
| `vendor/katex/fonts/KaTeX_Typewriter-Regular.woff2` | 13568 | `71d517d67827787cfabdf186914cc3358eda539e37931941f2b2fd4a21f68c0b` |
| `vendor/katex/katex.min.css` | 21062 | `c7c428bc728dc8b818e6e2562aadf26b01e64ad435611fe845152d84bfbd0654` |
| `vendor/katex/katex.min.js` | 277038 | `dc84b296ec3e884de093158f760fd9d45b6c7abe58b5381557f4e138f46a58ae` |
| `vendor/katex/LICENSE` | 1107 | `766ccc1f306c885aa45542a9846bbd0a505b27a0374f146778171c2254ce18e3` |
| `vendor/mathlive/fonts/KaTeX_AMS-Regular.woff2` | 28076 | `0cdd387c9590a1a9f9794560022dbb59654a7d86f187aa0c81495ad42d3a7308` |
| `vendor/mathlive/fonts/KaTeX_Caligraphic-Bold.woff2` | 6912 | `de7701e42cf1f4cf0b766c03fb27977207eee2f4fd5d76fa82188406da43ea4c` |
| `vendor/mathlive/fonts/KaTeX_Caligraphic-Regular.woff2` | 6908 | `5d53e70ad607c2352162dec9e0923fb54ecdafaccbf604cd8dcf7d00facb989b` |
| `vendor/mathlive/fonts/KaTeX_Fraktur-Bold.woff2` | 11348 | `74444efd593c005e3f4573b44524704c0af0a937fe911cca9e94068d0d140d3f` |
| `vendor/mathlive/fonts/KaTeX_Fraktur-Regular.woff2` | 11316 | `51814d270d06ff0255dba0799994fa4d8c84d11f09951d47595f4abb1f3602dc` |
| `vendor/mathlive/fonts/KaTeX_Main-Bold.woff2` | 25324 | `0f60d1b897938ec918c8ce073092411baf9438f6739465693ff18b0f9d20b021` |
| `vendor/mathlive/fonts/KaTeX_Main-BoldItalic.woff2` | 16780 | `99cd42a3c072d918f2f44984a807cf7aa16e13545fd0875fc07c6c65f99e715b` |
| `vendor/mathlive/fonts/KaTeX_Main-Italic.woff2` | 16988 | `97479ca6cce906abc961ecac96faa5f9ca2e61b8e7670d475826bcdee9a7c267` |
| `vendor/mathlive/fonts/KaTeX_Main-Regular.woff2` | 26272 | `c2342cd8b869e01752a9321dc17213fc40d4d04c79688c1d43f2cf316abd7866` |
| `vendor/mathlive/fonts/KaTeX_Math-BoldItalic.woff2` | 16400 | `dc47344dbb6cb5b655c8460d561f4df5f501b90c804ad3c6cec65fe322351ab1` |
| `vendor/mathlive/fonts/KaTeX_Math-Italic.woff2` | 16440 | `7af58c5ec8f132a2ddde9027c6d7814decce4d3b822a11192a42a20e2e973264` |
| `vendor/mathlive/fonts/KaTeX_SansSerif-Bold.woff2` | 12216 | `e99ae51144bf1232efcc1bfe5add36262c6866b0faab24fa75740e1b98577a62` |
| `vendor/mathlive/fonts/KaTeX_SansSerif-Italic.woff2` | 12028 | `00b26ac825e2095056396e0553b8ac26d3f8ad158c3826e28b4c45b385c4714a` |
| `vendor/mathlive/fonts/KaTeX_SansSerif-Regular.woff2` | 10344 | `68e8c73ef42afd3ccec58bf0fba302cce448938e7fc020a5e31f8a952eee1342` |
| `vendor/mathlive/fonts/KaTeX_Script-Regular.woff2` | 9644 | `036d4e95149b69ff9bcc0cd55771efeb25ffa3947293e69acd78d5ac328c684b` |
| `vendor/mathlive/fonts/KaTeX_Size1-Regular.woff2` | 5468 | `6b47c40166b6dbe21a5dfca7718413f2147fd2399be1ba605d8ad39cedf25dfe` |
| `vendor/mathlive/fonts/KaTeX_Size2-Regular.woff2` | 5208 | `d04c54219f9eaec6d4d4fd42dfb28785975a4794d6b2fc71e566b9cd6db842dd` |
| `vendor/mathlive/fonts/KaTeX_Size3-Regular.woff2` | 3624 | `73d591271b1604960cb10bb90fee021670af7297017e0e98480b332d11f51995` |
| `vendor/mathlive/fonts/KaTeX_Size4-Regular.woff2` | 4928 | `a4af7d414440a1c1790825cfb700cf9cf43b0f2c4b04f0ebc523011ad9853ec0` |
| `vendor/mathlive/fonts/KaTeX_Typewriter-Regular.woff2` | 13568 | `71d517d67827787cfabdf186914cc3358eda539e37931941f2b2fd4a21f68c0b` |
| `vendor/mathlive/LICENSE` | 1099 | `3caebd18611959ca725ab976a004d408017eb1d7093d6c9b9b09c5a4790eaff8` |
| `vendor/mathlive/mathlive-static.css` | 12330 | `009f8e0903d7f5e78584cdfdcb05aca593677322504fc6d7c044de3081c8ef34` |
| `vendor/mathlive/mathlive.min.js` | 790619 | `90eecdd28e0a97a03522ca9cad9f46e8b06dd6d7d9057c0dbe7226cd20e217b5` |
