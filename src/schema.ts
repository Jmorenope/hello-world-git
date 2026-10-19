import {z} from 'zod';

// Todos los tiempos van en SEGUNDOS, contados desde el inicio del reel ya recortado.

export const brollSchema = z.object({
	// Grabación de pantalla, clip o imagen dentro de /public (p. ej. "media/terminal.mp4").
	src: z.string(),
	atSeconds: z.number().min(0),
	durationSeconds: z.number().positive(),
	// full: tapa todo · split: pantalla arriba y tu cara abajo · pip: pantalla completa con tu cara en un círculo.
	layout: z.enum(['full', 'split', 'pip']).default('split'),
	transition: z.enum(['glitch', 'slide', 'zoom', 'wipe', 'flash']).default('glitch'),
	zoom: z.enum(['none', 'zoom-in', 'zoom-out', 'punch-in', 'pan-left', 'pan-right']).default('zoom-in'),
	// Para videos: segundo del clip desde el que empieza.
	sourceStartSeconds: z.number().min(0).default(0),
});

export const textSchema = z.object({
	text: z.string(),
	atSeconds: z.number().min(0),
	durationSeconds: z.number().positive().default(2.5),
	// headline: texto grande animado · label: etiqueta estilo terminal abajo.
	style: z.enum(['headline', 'label']).default('headline'),
});

export const zoomSchema = z.object({
	atSeconds: z.number().min(0),
	durationSeconds: z.number().positive().default(1.5),
	scale: z.number().min(1).max(2).default(1.35),
});

export const manualLogoSchema = z.object({
	// Nombre del tema (como en src/topics.json), p. ej. "Kali Linux".
	topic: z.string(),
	atSeconds: z.number().min(0),
	durationSeconds: z.number().positive().default(2.2),
});

export const reelSchema = z.object({
	// Tu video hablando a cámara (con su audio), dentro de /public.
	videoSrc: z.string().default(''),
	// Recorta el inicio del video (segundos).
	trimStartSeconds: z.number().min(0).default(0),
	// Duración del reel. Si se deja en 0, se usa todo el video.
	durationSeconds: z.number().min(0).default(0),
	// Subtítulos generados con "npm run transcribe".
	captionsSrc: z.string().default(''),
	// Frase gancho en los primeros segundos (vacío = sin gancho).
	hook: z.string().default(''),
	// Zoom automático de la cámara cada cierto tiempo (alterna cerca y lejos).
	autoZoom: z.boolean().default(true),
	autoZoomEverySeconds: z.number().min(1).default(3),
	autoZoomScale: z.number().min(1).max(1.6).default(1.15),
	// Acercamientos extra para remarcar momentos.
	zooms: z.array(zoomSchema).default([]),
	// Pantallas / clips de las herramientas.
	broll: z.array(brollSchema).default([]),
	// Textos animados.
	texts: z.array(textSchema).default([]),
	// Logos automáticos al mencionar herramientas (requiere subtítulos).
	autoLogos: z.boolean().default(true),
	// Logos puestos a mano.
	logos: z.array(manualLogoSchema).default([]),
	musicSrc: z.string().default(''),
	musicVolume: z.number().min(0).max(1).default(0.25),
	// Volumen de la música mientras hablas.
	musicDuckedVolume: z.number().min(0).max(1).default(0.08),
	// Sonidos de "whoosh" y "pop" en transiciones y logos.
	soundEffects: z.boolean().default(true),
	showProgressBar: z.boolean().default(true),
	// Llamada a la acción en los últimos segundos (vacío = sin cierre).
	ctaText: z.string().default('Sígueme para más'),
});

export type Broll = z.infer<typeof brollSchema>;
export type ReelProps = z.infer<typeof reelSchema>;
