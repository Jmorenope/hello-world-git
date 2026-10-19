import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {brand} from '../brand';

/** Llamada a la acción sobre el video en los últimos segundos. */
export const EndCta: React.FC<{text: string}> = ({text}) => {
	const frame = useCurrentFrame();
	const {fps, width, height} = useVideoConfig();
	const s = spring({frame, fps, config: {damping: 9, stiffness: 160}});
	const handle = spring({frame: frame - 8, fps, config: {damping: 14}});
	const pulse = 1 + Math.sin(frame / 4) * 0.03 * s;

	return (
		<AbsoluteFill style={{alignItems: 'center', paddingTop: height * 0.4, zIndex: 6}}>
			<div
				style={{
					fontFamily: brand.fonts.title,
					fontSize: width * 0.1,
					textTransform: 'uppercase',
					color: brand.colors.dark,
					background: brand.colors.primary,
					padding: '0.05em 0.35em',
					transform: `scale(${s * pulse}) rotate(-2deg)`,
					boxShadow: `0 0 ${width * 0.06}px ${brand.colors.primary}`,
				}}
			>
				{text}
			</div>
			<div
				style={{
					marginTop: width * 0.04,
					fontFamily: brand.fonts.mono,
					fontWeight: 800,
					fontSize: width * 0.055,
					color: brand.colors.light,
					background: 'rgba(7, 9, 13, 0.85)',
					padding: '0.2em 0.6em',
					borderRadius: width * 0.015,
					opacity: handle,
					transform: `translateY(${interpolate(handle, [0, 1], [40, 0])}px)`,
				}}
			>
				<span style={{color: brand.colors.primary}}>{'> '}</span>
				{brand.handle}
			</div>
		</AbsoluteFill>
	);
};
