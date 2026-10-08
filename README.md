# Plantilla de video de Elmackflay (Remotion)

Plantilla para generar videos de Elmackflay con código: **motion graphics, transiciones, acercamientos de cámara, subtítulos animados, logo, música de fondo con ducking, intro y outro de marca**. Genera:

| Composición            | Formato     | Uso                      |
| ---------------------- | ----------- | ------------------------ |
| `ElmackflayVertical`   | 1080 × 1920 | TikTok, Reels, Shorts    |
| `ElmackflayHorizontal` | 1920 × 1080 | YouTube                  |
| `ElmackflayThumbnail`  | 1280 × 720  | Miniatura de YouTube     |

## Requisitos

- Node.js 18 o más reciente
- (Opcional) [Whisper](https://github.com/openai/whisper) para generar subtítulos automáticos

## Inicio rápido

```bash
npm install
npm run studio            # editor visual en el navegador, con vista previa en vivo
npm run render:vertical   # → out/elmackflay-vertical.mp4
npm run render:horizontal # → out/elmackflay-horizontal.mp4
npm run still:thumbnail   # → out/thumbnail.png
```

En el **Studio** puedes cambiar textos, escenas, zooms y transiciones desde el panel derecho y verlo al instante.

## 1. Pon la identidad de Elmackflay (una sola vez)

Todo el estilo vive en **`src/brand.ts`**:

- `colors`: primario (palabra activa en subtítulos), secundario, acento, oscuro y claro.
- `fonts`: fuente de títulos y de textos. Vienen incluidas Anton y Montserrat en `public/fonts/`; para usar otras, pon tus archivos `.woff2` o `.ttf` ahí y cambia las rutas.
- `logo`: reemplaza `public/brand/logo.svg` por el logo oficial (PNG o SVG con fondo transparente).
- `handle`: el usuario que aparece en la marca de agua y el outro.
- `motion`: duración de la intro, el outro y las transiciones.

> ⚠️ Los colores, las fuentes y el logo actuales son **provisionales**. Reemplázalos por los oficiales.

## 2. Arma un video

1. Copia tus archivos a `public/`:
   - clips e imágenes → `public/media/`
   - música → `public/music/`
   - voz en off → `public/media/`
2. Duplica `videos/ejemplo.json` y edítalo.
3. Renderízalo:

```bash
npx remotion render ElmackflayVertical out/mi-video.mp4 --props=videos/mi-video.json
```

### Opciones de cada escena

| Campo              | Valores                                                               |
| ------------------ | --------------------------------------------------------------------- |
| `type`             | `video`, `image` o `color` (fondo animado de marca, sin archivo)      |
| `src`              | Ruta dentro de `public/`, p. ej. `media/clip1.mp4`                    |
| `durationInFrames` | Duración a 30 fps (30 = 1 s, 90 = 3 s)                                |
| `zoom`             | `none`, `zoom-in`, `zoom-out`, `punch-in`, `pan-left`, `pan-right`    |
| `transition`       | Entrada a la escena: `fade`, `slide`, `wipe`, `flip`, `clock-wipe`, `none` |
| `headline`         | Título grande animado palabra por palabra (primeros 3 s)              |
| `lowerThird`       | Banda inferior con nombre o dato                                      |
| `startFromSeconds` | En videos: segundo desde el que empieza el clip                       |
| `muted`            | `false` para conservar el audio original del clip                     |

### Opciones generales

- `title` y `subtitle`: textos de la intro.
- `voiceSrc`: voz en off. Empieza justo después de la intro, igual que los subtítulos.
- `musicSrc`, `musicVolume` y `musicDuckedVolume`: música de fondo. Se repite en bucle, entra y sale con fundido, y **baja automáticamente cuando hay voz**.
- `captionsSrc`: subtítulos (ver abajo).
- `showWatermark`: logo y usuario en la esquina.
- `ctaText`: el botón del outro.

## 3. Subtítulos automáticos

```bash
# 1. Transcribe la voz con tiempos por palabra
whisper public/media/voz.mp3 --language Spanish --word_timestamps True --output_format json

# 2. Conviértelo al formato de la plantilla
npm run captions -- voz.json mi-video   # → public/captions/mi-video.json
```

Luego pon `"captionsSrc": "captions/mi-video.json"` en tu video. También acepta archivos `.srt` exportados de CapCut, Premiere o YouTube:

```bash
npm run captions -- subtitulos.srt mi-video
```

Los subtítulos aparecen al estilo TikTok: palabra por palabra, con la palabra activa resaltada en el color primario.

## Estructura

```
src/
  brand.ts              ← identidad visual (editar aquí)
  schema.ts             ← opciones disponibles para cada video
  sample-video.ts       ← video de ejemplo del Studio
  ElmackflayVideo.tsx   ← línea de tiempo: intro → escenas → outro + audio + subtítulos
  Thumbnail.tsx         ← miniatura
  components/
    Intro.tsx, Outro.tsx, SceneView.tsx, ZoomLayer.tsx,
    Headline.tsx, LowerThird.tsx, Captions.tsx, Watermark.tsx, BrandBackground.tsx
public/
  brand/  fonts/  media/  music/  captions/
videos/ejemplo.json     ← plantilla de video para --props
scripts/whisper-to-captions.mjs
```

## Música sin problemas de derechos

YouTube Audio Library (gratis), Epidemic Sound, Artlist, o música generada con IA (Suno, ElevenLabs Music). Usa solo música que tengas derecho a publicar.

> Licencia: Remotion es gratis para personas y empresas pequeñas; las empresas más grandes necesitan una licencia de empresa. Revisa https://www.remotion.dev/license
