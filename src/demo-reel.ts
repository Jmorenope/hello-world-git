import type {ReelProps} from './schema';

/**
 * Reel de demostración (archivos en public/demo/). Para un reel real copia
 * videos/reel-ejemplo.json y renderízalo con --props.
 */
export const demoReel: ReelProps = {
	videoSrc: 'demo/facecam.mp4',
	trimStartSeconds: 0,
	durationSeconds: 0,
	captionsSrc: 'demo/captions.json',
	hook: '',
	autoZoom: true,
	autoZoomEverySeconds: 3,
	autoZoomScale: 1.15,
	zooms: [{atSeconds: 13.8, durationSeconds: 1.2, scale: 1.35}],
	broll: [
		{src: 'demo/terminal.mp4', atSeconds: 6.6, durationSeconds: 2.6, layout: 'split', transition: 'glitch', zoom: 'zoom-in', sourceStartSeconds: 0},
		{src: 'demo/terminal.mp4', atSeconds: 9.6, durationSeconds: 3, layout: 'pip', transition: 'slide', zoom: 'pan-right', sourceStartSeconds: 0},
	],
	texts: [{text: 'Tutorial rápido', atSeconds: 0.2, durationSeconds: 2, style: 'label'}],
	autoLogos: true,
	logos: [],
	musicSrc: '',
	musicVolume: 0.25,
	musicDuckedVolume: 0.08,
	soundEffects: true,
	showProgressBar: true,
	ctaText: 'Sígueme para más',
};
