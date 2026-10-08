import type {VideoProps} from './schema';

/**
 * Video de ejemplo. Para un video nuevo, copia este objeto (o un JSON en
 * /videos) y cambia escenas, textos y archivos.
 * Duraciones en frames (30 fps → 30 frames = 1 segundo).
 */
export const sampleVideo: VideoProps = {
	title: 'Bienvenidos al canal',
	subtitle: 'Nuevo video',
	scenes: [
		{type: 'color', durationInFrames: 90, zoom: 'punch-in', transition: 'wipe', headline: 'Esto va a cambiar todo', startFromSeconds: 0, muted: true},
		{type: 'color', durationInFrames: 90, zoom: 'zoom-in', transition: 'slide', lowerThird: 'Elmackflay', startFromSeconds: 0, muted: true},
		{type: 'color', durationInFrames: 90, zoom: 'pan-right', transition: 'flip', headline: 'Quédate hasta el final', startFromSeconds: 0, muted: true},
	],
	voiceSrc: '',
	musicSrc: '',
	musicVolume: 0.35,
	musicDuckedVolume: 0.12,
	captionsSrc: 'captions/ejemplo.json',
	showWatermark: true,
	ctaText: 'Sígueme para más',
};
