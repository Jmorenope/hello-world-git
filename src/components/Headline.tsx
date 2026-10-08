import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {brand} from '../brand';

/** Título grande con entrada palabra por palabra y fondo de marca. */
export const Headline: React.FC<{text: string; position?: 'center' | 'top'}> = ({text, position = 'center'}) => {
	const frame = useCurrentFrame();
	const {fps, width, durationInFrames} = useVideoConfig();
	const words = text.split(' ');
	const fontSize = Math.round(width * 0.11);
	const exit = interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill
			style={{
				justifyContent: position === 'center' ? 'center' : 'flex-start',
				alignItems: 'center',
				paddingTop: position === 'top' ? '12%' : 0,
				opacity: exit,
			}}
		>
			<div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.1em 0.3em', maxWidth: '88%'}}>
				{words.map((word, i) => {
					const s = spring({frame: frame - i * 4, fps, config: {damping: 11, stiffness: 160}});
					const highlighted = i % 3 === 1;
					return (
						<span
							key={i}
							style={{
								fontFamily: brand.fonts.title,
								fontSize,
								lineHeight: 1.05,
								textTransform: 'uppercase',
								color: highlighted ? brand.colors.dark : brand.colors.light,
								background: highlighted ? brand.colors.primary : 'transparent',
								padding: highlighted ? '0 0.12em' : 0,
								transform: `translateY(${(1 - s) * 60}px) scale(${0.6 + 0.4 * s}) rotate(${(1 - s) * -6}deg)`,
								opacity: s,
								display: 'inline-block',
								textShadow: highlighted ? 'none' : `0.06em 0.06em 0 ${brand.colors.secondary}`,
							}}
						>
							{word}
						</span>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};
