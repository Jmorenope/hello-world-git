import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import type {Broll} from '../schema';

/** Acercamientos de cámara virtuales sobre cualquier contenido. */
export const ZoomLayer: React.FC<{zoom: Broll['zoom']; children: React.ReactNode}> = ({zoom, children}) => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();
	const progress = interpolate(frame, [0, durationInFrames], [0, 1], {
		extrapolateRight: 'clamp',
		easing: Easing.inOut(Easing.cubic),
	});

	let transform = 'none';
	switch (zoom) {
		case 'zoom-in':
			transform = `scale(${1 + 0.18 * progress})`;
			break;
		case 'zoom-out':
			transform = `scale(${1.18 - 0.18 * progress})`;
			break;
		case 'punch-in': {
			// Golpe de zoom rápido al inicio, típico de shorts/reels.
			const s = spring({frame, fps, config: {damping: 12, stiffness: 180}});
			transform = `scale(${1 + 0.22 * s})`;
			break;
		}
		case 'pan-left':
			transform = `scale(1.2) translateX(${interpolate(progress, [0, 1], [4, -4])}%)`;
			break;
		case 'pan-right':
			transform = `scale(1.2) translateX(${interpolate(progress, [0, 1], [-4, 4])}%)`;
			break;
	}

	return <AbsoluteFill style={{transform, transformOrigin: 'center center'}}>{children}</AbsoluteFill>;
};
