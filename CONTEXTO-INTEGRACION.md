# Contexto: integración del portal UNICAH

> Documento para retomar el trabajo en una sesión nueva.
> Última actualización: 8 de agosto de 2026, madrugada.

## Quién es quién

- **Fernando (RedFer855)** — dueño de las páginas **02 (Sobre la carrera)** y **05 (Vida Estudiantil)**.
- Compañeros: Kevin (`Kev_02332`), Eduin (`Edun_gutierrez`), Byron (`Byron-Ing`), Stefany (`stenpastranaa23-cell`, dueña del repo).
- Repo: `https://github.com/stenpastranaa23-cell/portal-ingenieria-ambiental-unicah`
- Es un proyecto de clase. Se entrega con GitHub Pages + un video de 15 min.

## Reglas de trabajo con Fernando

1. **Podés editar los archivos directamente** con Edit/Write. Eso está acordado.
2. **Nunca corras `git commit` ni `git push`.** Fernando los ejecuta él. Dale los comandos en un bloque ` ```bash ` para que los copie.
3. Él pidió que los mensajes de commit no lleven la línea `Co-Authored-By: Claude`. Por eso **no escribas mensajes de commit**: entregale el comando y que él ponga el mensaje. Si insiste en que vos commitees, explicale en una frase que no podés omitir esa línea y ofrecele el comando.
4. Explicale **qué cambiaste y por qué**, en español, sin tecnicismos innecesarios. Él está aprendiendo.
5. **Verificá en el navegador**, no asumas. Hay un servidor de vista previa configurado (ver más abajo).

## El problema de fondo

El equipo tiene **un solo `css/styles.css` compartido entre 11 páginas y 17 ramas**. Cada merge choca en ese archivo, y alguien lo resolvía tomando un lado entero — perdiendo el trabajo del otro. Resultado: `main` tenía los bloques de CSS **vacíos** para casi todas las páginas (solo el comentario `/* PÁGINA 08 */` y nada dentro).

Faltaban ~3.300 líneas de CSS y 4 HTML eran cascarones de 11 líneas.

## Qué se hizo

Se creó la rama **`integracion-final`** (desde `main`). En vez de mergear rama por rama —que vuelve a pisar el CSS— se **reconstruyó** el archivo por partes:

- Base: el `styles.css` de la rama de Fernando (estructura válida, 3.764 líneas).
- Encima se agregaron, de cada rama, **solo los selectores que faltaban**.
- Después, a pedido de Fernando, se reemplazaron bloques enteros por la versión "buena" de commits específicos que él fue indicando.

`css/styles.css` pasó de 3.154 a ~9.800 líneas. Llaves balanceadas, sin bloques atrapados en `@media`.

## Commits de referencia que dio Fernando

Cada uno es la versión que él considera correcta para esa página:

| Página | Commit | Qué se hizo |
|---|---|---|
| 03 Plan de estudio | `13b44e5` | Se reemplazaron las 110 reglas `.plan` por las 97 del commit |
| 11 Docentes | `c93c269` | 65 reglas `.docentes` idénticas + foto del decano + 5 docentes exactos |
| 06 Galería | `6478379` | Se recuperaron 31 imágenes + se quitó regla basura |
| 07 Blog | `f30301a` | HTML, JS y CSS reemplazados por esa versión |
| 09 Súmate | `9633141` | Solo se verificó: no falta ninguna imagen |
| 08 Contacto | `2fc3239` | Solo se verificó: no falta ninguna imagen |

## Bugs recurrentes que aparecieron (ojo con estos)

**1. `color: green` de prueba.** Apareció en `.plan__titulo`, `.docentes__titulo` y `.galeria__titulo`. Alguien la fue copiando de página en página. Si ves un `color:green` literal, es basura.

**2. Mayúsculas en nombres de archivo.** Windows no distingue mayúsculas, GitHub Pages sí (corre Linux). Rompió:
- `Js/pagina-05.js` vs `js/pagina-05.js` → la página subía sin JavaScript
- `media/docentes/IngMon.png` vs `ingMon.png`
- `Docs/folleto_ING_A.pdf` vs `Folleto_ING_A.pdf`
- Tildes en nombres (`Hidrogeología.jpeg`) — se renombraron sin acentos

Verificá siempre con `git ls-files | grep '^Js/'` (sensible a mayúsculas).

**3. `../css/styles.css`.** Siete páginas lo tenían. En Pages resuelve fuera del repo y quedan sin estilos. Debe ser `css/styles.css`.

**4. Llaves mal cerradas.** `main` tenía 4 errores de estructura: dos `}` de más y dos `@media` sin cerrar. Eso dejaba bloques enteros atrapados dentro de un `@media (max-width: 480px)`. Se repararon. **Al reparar, cerrá el bloque en el lugar correcto, no al final del archivo** — ese error se cometió una vez y dejó todo el CSS de la página 5 atrapado.

## Estado actual (rama `integracion-final`, sin commitear)

Las 11 páginas cargan con su CSS y su JS. Hecho además:

- **Loader de la flor en las 11 páginas**, con el nombre de cada página en vez de "Cargando…". La función `vidaIniciarCarga()` se movió a `js/funciones-compartidas.js`.
- **Página 04 (Instalaciones) eliminada** y quitada de todos los menús, a pedido de Fernando. Respaldo en el scratchpad.
- **Menú de contacto**: se le quitó `overflow: hidden` al hero y el `max-height` pasó de `calc(100% - 5.5rem)` a `calc(100vh - 7rem)`, porque el desplegable quedaba recortado al tamaño del hero.
- **Accesibilidad página 05**: contraste de etiquetas doradas 2.67 → 4.95 (variable `--vida-dorado-texto: #8d6135`), `title` en el iframe de Instagram, `role="dialog"` → `role="region"`.
- Página 05 tiene: acordeón de giras, enredaderas SVG que crecen con el scroll, recorrido guiado automático de 9 paradas.

## Lo que queda pendiente

**1. Menú de galería — SIN RESOLVER.**
Se quitó el manejador duplicado (`galeriaIniciarMenu` en `js/pagina-06.js`) que competía con `sitioIniciarMenu` del JS compartido. Ahora la clase `menu-panel--abierto` sí se aplica al hacer clic, pero el panel seguía midiendo `opacity: 0` en las mediciones.

Se agregó una regla al final de `styles.css` para que gane por orden de cascada. **No se pudo confirmar si funciona** porque el panel de vista previa dejó de renderizar (`the Browser pane is not displayed`) y las mediciones podían estar desactualizadas. **Probalo primero abriendo la galería a mano.** Hay 4 definiciones de `.menu-panel` heredadas de distintas ramas; si sigue fallando, conviene dejar una sola.

**2. 11 imágenes del blog que no existen en ningún lado.**
Se buscaron en los 6 commits que dio Fernando y en las 17 ramas. No están:
`img/blog/dato-ambiental.jpg`, `ig-1-choluteca.jpg`, `ig-2-reforestacion.jpg`, `ig-3-laboratorio.jpg`, `ig-4-rio-platano.jpg`, `ig-5-graduacion.jpg`, `portada-articulo-1.jpg`, `portada-articulo-2.jpg`, `portada-articulo-7.jpg`, `portada-articulo-9.jpg`, `portada-maria-jose.jpg`

Eduin escribió el HTML pero nunca subió las imágenes. **Hay que pedírselas a él.**

**3. Página 03 no es responsive en celular.**
La versión del commit `13b44e5` no tiene reglas `@media` para la malla curricular. A 375px los números de semestre se salen 56px por la izquierda. Se dejó así a propósito porque Fernando pidió esa versión exacta. **Preguntarle si quiere que se agregue un `@media` mínimo** — el rubro exige que el sitio sea responsive.

**4. Copia anidada del sitio dentro del repo.**
Existe `portal-ingenieria-ambiental-unicah/` con 14 archivos duplicados y un `styles.css` de 86 líneas. Viene de `main`. **Confundió a Fernando**: abrió esa copia y creyó que los cambios no se aplicaban. Conviene borrarla, pero no se hizo porque es de los compañeros:
```
git rm -r --cached portal-ingenieria-ambiental-unicah -q && rm -rf portal-ingenieria-ambiental-unicah
```

**5. Otros puntos del rubro que faltan:**
- 9 páginas sin `meta description` (solo 02 y 05 la tienen)
- Páginas 09 y 10 con `lang="en"` en un sitio en español
- Estilos en línea: 8 en la 07, 5 en index, 3 en la 03
- `integrantes.txt` incompleto: ningún número de cuenta, 4 de 5 sin usuario de GitHub
- Imágenes pesadas sin optimizar (el hero de la 05 pesa 412 KB)

**6. Ramas con trabajo sin integrar a `main`:**
`pagina-09-sumate` (49 commits) y `pagina-10-preguntas` (41) tienen mucho trabajo que nunca llegó a main. Avisarle al equipo.

## Cómo probar

Hay dos servidores configurados en `D:/Plan de estudio/.claude/launch.json`:

- **`portal-unicah`** → puerto 8931, sirve el repo real. **Usá este.**
- `integracion` → puerto 8944, sirve una copia de trabajo en el scratchpad (ya no hace falta).

Arrancalo con `preview_start` usando el nombre `portal-unicah`.

**Importante:** el navegador cachea `styles.css` y los `.js` de forma agresiva. Si un cambio no aparece, forzá la recarga:
```js
await fetch('css/styles.css', { cache: 'reload' }); location.reload(true);
```
Esto pasó varias veces y hizo perder tiempo diagnosticando problemas que ya estaban resueltos.

## Comandos para cerrar

```bash
git add -A -- . ':!PW'
git commit -m "<mensaje que escriba Fernando>"
git push -u origin integracion-final
```

`PW/` es otro repo git anidado y no debe subirse. `temp_css2.txt` ya se eliminó.
