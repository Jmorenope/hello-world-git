import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {brand} from '../brand';

/** Banda inferior con barra de color que se desliza. */
export const LowerThird: React.FC<{text: string}> = ({text}) => {
	const frame = useCurrentFrame();
	const {fps, width, durationInFrames} = useVideoConfig();
	const enter = spring({frame: frame - 6, fps, config: {damping: 14}});
	const exit = interpolate(frame, [durationInFrames - 10, durationInFrames], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const x = (1 - enter + exit) * -110;

	return (
		<AbsoluteFill style={{justifyContent: 'flex-end', padding: '0 0 22% 6%'}}>
			<div style={{transform: `translateX(${x}%)`, display: 'flex', alignItems: 'stretch'}}>
				<div style={{width: width * 0.012, background: brand.colors.primary}} />
				<div
					style={{
						background: brand.colors.secondary,
						color: brand.colors.light,
						fontFamily: brand.fonts.body,
						fontWeight: 800,
						fontSize: width * 0.04,
						padding: '0.35em 0.7em',
						textTransform: 'uppercase',
						letterSpacing: '0.04em',
					}}
				>
					{text}
				</div>
			</div>
		</AbsoluteFill>
	);
};
