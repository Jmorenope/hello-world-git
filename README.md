# Reels de Elmackflay (Remotion)

Plantilla para editar los Reels de Elmackflay con código. Le das **tu video hablando a cámara** y se encarga de:

- **Subtítulos automáticos** palabra por palabra, con la palabra activa en verde neón.
- **Logos automáticos**: cuando dices "Kali Linux", "Nmap", "Wireshark"… aparece su logo en pantalla, con un "pop".
- **Zoom de cámara** automático cada pocos segundos (alterna cerca y lejos), más acercamientos extra donde quieras remarcar algo.
- **Pantallas de tus herramientas** (grabaciones de pantalla o capturas) con transiciones **glitch**, slide, zoom, wipe o flash, en 3 formatos:
  - `split`: la pantalla arriba y tu cara abajo
  - `pip`: la pantalla completa y tu cara en un círculo
  - `full`: la pantalla tapa todo
- **Textos animados**, una frase gancho al inicio y "Sígueme para más" al final.
- **Música de fondo** que baja sola cuando hablas, efectos de sonido y barra de progreso.
- **Portada** del reel con el logo del tema.

Formato: 1080 × 1920, 30 fps. Sirve para Instagram Reels, TikTok y YouTube Shorts.

## Instalación (una sola vez)

Necesitas [Node.js](https://nodejs.org) 18 o más reciente y [FFmpeg](https://ffmpeg.org/download.html).

```bash
npm install
npm run studio        # abre el editor con un reel de demostración
```

## Hacer un reel paso a paso

**1. Copia tu video** a `public/media/`, por ejemplo `public/media/reel1.mp4`. Pon también ahí tus grabaciones de pantalla.

**2. Genera los subtítulos.** La primera vez descarga el transcriptor (unos 500 MB, solo una vez):

```bash
npm run transcribe -- public/media/reel1.mp4 reel1
```

Esto crea `public/captions/reel1.json`. Ábrelo y corrige cualquier palabra mal escrita. El transcriptor ya conoce los nombres de todas las herramientas de `src/topics.json`, así que suele escribirlos bien.

**3. Describe el reel.** Copia `videos/reel-ejemplo.json` a `videos/reel1.json` y edítalo: el video, las pantallas, los textos y la música. Todos los tiempos van en **segundos**.

**4. Revísalo en el editor** (opcional): ejecuta `npm run studio`, elige `ElmackflayReel` y pega los valores en el panel derecho.

**5. Renderízalo:**

```bash
npm run render -- out/reel1.mp4 --props=videos/reel1.json
```

**6. Portada** (opcional):

```bash
npm run portada -- out/portada1.png --props='{"line1":"Escanea tu red","line2":"con Kali Linux","topic":"Kali Linux","imageSrc":""}'
```

## Opciones del reel

| Campo | Qué hace |
| --- | --- |
| `videoSrc` | Tu video a cámara, dentro de `public/` |
| `trimStartSeconds` | Corta los primeros segundos del video |
| `durationSeconds` | Duración del reel. `0` = todo el video |
| `captionsSrc` | Subtítulos creados con `npm run transcribe` |
| `hook` | Frase gancho de los primeros 2,5 s. Vacío = sin gancho |
| `autoZoom`, `autoZoomEverySeconds`, `autoZoomScale` | Zoom automático de cámara |
| `zooms` | Acercamientos extra: `atSeconds`, `durationSeconds`, `scale` |
| `broll` | Pantallas: `src`, `atSeconds`, `durationSeconds`, `layout` (`split`/`pip`/`full`), `transition` (`glitch`/`slide`/`zoom`/`wipe`/`flash`), `zoom`, `sourceStartSeconds` |
| `texts` | Textos: `text`, `atSeconds`, `durationSeconds`, `style` (`headline` grande, `label` etiqueta) |
| `autoLogos` | Mostrar logos al mencionar herramientas |
| `logos` | Logos puestos a mano: `topic`, `atSeconds` |
| `musicSrc`, `musicVolume`, `musicDuckedVolume` | Música de fondo y su volumen mientras hablas |
| `soundEffects` | "Whoosh" en las pantallas y "pop" en los logos |
| `showProgressBar` | Barra de progreso arriba |
| `ctaText` | Llamada a la acción en los últimos 2,5 s. Vacío = sin cierre |

## Logos de herramientas

Están en **`src/topics.json`**. Cada tema tiene:

- `name`: el nombre que se muestra y que se escribe bien en los subtítulos.
- `aliases`: cómo se puede decir, en minúsculas y sin tildes. Se toleran pequeños errores de transcripción ("cali linux" → Kali Linux).
- `icon`: el logo de [simpleicons.org](https://simpleicons.org). Usa el nombre que aparece en la URL del ícono, por ejemplo `kalilinux`.
- `image` (opcional): un logo propio dentro de `public/`, por ejemplo `logos/nmap.png`. Tiene prioridad sobre `icon`.

Si un tema no tiene ni `icon` ni `image`, se muestra una tarjeta estilo terminal `>_` con el nombre. Eso pasa hoy con **Nmap, Windows, John the Ripper, Aircrack-ng y Flipper Zero**, porque Simple Icons no los incluye. Para usar su logo real, pon el PNG en `public/logos/` y agrega `"image": "logos/nmap.png"`.

Para agregar una herramienta nueva, añade una línea, por ejemplo:

```json
{"name": "Hydra", "image": "logos/hydra.png", "aliases": ["hydra"]}
```

> Los logos pertenecen a sus dueños. Aquí se usan para identificar la herramienta de la que se habla.

## Estilo visual

Todo está en **`src/brand.ts`**: colores (verde neón, cian y magenta sobre fondo oscuro), fuentes (Anton para subtítulos y titulares, JetBrains Mono para las etiquetas estilo terminal), el usuario del cierre (`@elmackflay`) y la velocidad de las transiciones. `faceFocus` indica qué punto del video queda centrado al hacer zoom; por defecto es la zona de la cara.

## Subtítulos de otras apps

Si ya tienes un `.srt` (de CapCut, Premiere, YouTube…):

```bash
npm run captions -- subtitulos.srt reel1
```

## Estructura

```
src/
  brand.ts          ← colores, fuentes, usuario
  topics.json       ← herramientas y sus logos
  topics.ts         ← detección de temas en la voz
  schema.ts         ← opciones del reel
  Reel.tsx          ← arma todo el reel
  Cover.tsx         ← portada
  demo-reel.ts      ← reel de demostración del editor
  components/       ← MainVideo, BRoll, LogoPopup, Captions, Headline, LowerThird, EndCta, ProgressBar…
public/
  media/ music/     ← tus archivos
  captions/         ← subtítulos generados
  sfx/              ← whoosh y pop
  fonts/ demo/
scripts/
  transcribe.mjs          ← video → subtítulos (whisper.cpp)
  whisper-to-captions.mjs ← .srt o JSON de Whisper → subtítulos
videos/reel-ejemplo.json
```

El reel de demostración (`public/demo/`) usa una cámara de prueba, una voz sintética y una terminal falsa, solo para ver los efectos.

> Licencia: Remotion es gratis para personas y empresas pequeñas; las empresas más grandes necesitan una licencia de empresa. Revisa https://www.remotion.dev/license
