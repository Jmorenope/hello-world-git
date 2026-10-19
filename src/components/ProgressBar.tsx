import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {brand} from '../brand';

/** Barra de progreso arriba: ayuda a que la gente se quede hasta el final. */
export const ProgressBar: React.FC = () => {
	const frame = useCurrentFrame();
	const {durationInFrames, width} = useVideoConfig();
	return (
		<AbsoluteFill style={{zIndex: 7}}>
			<div
				style={{
					height: width * 0.008,
					width: `${((frame + 1) / durationInFrames) * 100}%`,
					background: brand.colors.primary,
					boxShadow: `0 0 ${width * 0.02}px ${brand.colors.primary}`,
				}}
			/>
		</AbsoluteFill>
	);
};
