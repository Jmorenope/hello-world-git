import {brand} from './brand';
import type {Scene} from './schema';

const overlap = (t: Scene['transition']) => (t === 'none' ? 0 : brand.motion.transitionFrames);

/** Calcula la duración total y el frame donde empieza el contenido (voz + subtítulos). */
export const getTimeline = (scenes: Scene[]) => {
	const {introFrames, outroFrames, transitionFrames} = brand.motion;
	const sceneFrames = scenes.reduce((sum, s) => sum + s.durationInFrames, 0);
	const overlaps = scenes.reduce((sum, s) => sum + overlap(s.transition), 0) + transitionFrames; // + entrada del outro
	return {
		durationInFrames: introFrames + sceneFrames + outroFrames - overlaps,
		contentStart: introFrames - overlap(scenes[0].transition),
	};
};
