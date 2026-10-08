import {z} from 'zod';

export const zoomSchema = z.enum(['none', 'zoom-in', 'zoom-out', 'punch-in', 'pan-left', 'pan-right']);
export const transitionSchema = z.enum(['fade', 'slide', 'wipe', 'flip', 'clock-wipe', 'none']);

export const sceneSchema = z.object({
	// "video" e "image" usan un archivo de /public; "color" genera un fondo de marca.
	type: z.enum(['video', 'image', 'color']),
	src: z.string().optional(),
	durationInFrames: z.number().int().positive(),
	zoom: zoomSchema.default('none'),
	// Transición para ENTRAR a esta escena (en la primera, la salida de la intro).
	transition: transitionSchema.default('fade'),
	// Texto grande animado sobre la escena (opcional).
	headline: z.string().optional(),
	// Banda inferior con nombre / dato (opcional).
	lowerThird: z.string().optional(),
	// Para videos: segundo desde el que empieza el clip.
	startFromSeconds: z.number().min(0).default(0),
	muted: z.boolean().default(true),
});

export const videoSchema = z.object({
	title: z.string(),
	subtitle: z.string(),
	scenes: z.array(sceneSchema).min(1),
	// Voz en off / audio principal (opcional), relativo a /public.
	voiceSrc: z.string().default(''),
	// Música de fondo (opcional), relativo a /public.
	musicSrc: z.string().default(''),
	musicVolume: z.number().min(0).max(1).default(0.35),
	// Volumen de la música mientras hay subtítulos activos (ducking).
	musicDuckedVolume: z.number().min(0).max(1).default(0.12),
	// Subtítulos en formato @remotion/captions (JSON), relativo a /public.
	captionsSrc: z.string().default(''),
	showWatermark: z.boolean().default(true),
	ctaText: z.string(),
});

export type Scene = z.infer<typeof sceneSchema>;
export type VideoProps = z.infer<typeof videoSchema>;
