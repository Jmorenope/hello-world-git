import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {brand} from '../brand';
import {BrandBackground} from './BrandBackground';

/** Intro de marca: el logo entra girando, luego aparece el título. */
export const Intro: React.FC<{title: string; subtitle: string}> = ({title, subtitle}) => {
	const frame = useCurrentFrame();
	const {fps, width} = useVideoConfig();
	const logo = spring({frame, fps, config: {damping: 9, stiffness: 120}});
	const titleIn = spring({frame: frame - 14, fps, config: {damping: 13}});
	const subIn = spring({frame: frame - 24, fps, config: {damping: 14}});
	const flash = interpolate(frame, [0, 4, 10], [0, 0.8, 0], {extrapolateRight: 'clamp'});
	const logoSize = width * 0.32;

	return (
		<AbsoluteFill>
			<BrandBackground />
			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: width * 0.03}}>
				<Img
					src={staticFile(brand.logo)}
					style={{
						width: logoSize,
						height: logoSize,
						transform: `scale(${logo}) rotate(${(1 - logo) * -180}deg)`,
						filter: `drop-shadow(0 0 ${width * 0.03}px ${brand.colors.primary}88)`,
					}}
				/>
				<div
					style={{
						fontFamily: brand.fonts.title,
						fontSize: width * 0.1,
						color: brand.colors.light,
						textTransform: 'uppercase',
						textAlign: 'center',
						maxWidth: '90%',
						lineHeight: 1,
						transform: `translateY(${(1 - titleIn) * 80}px)`,
						opacity: titleIn,
						textShadow: `0.05em 0.05em 0 ${brand.colors.secondary}`,
					}}
				>
					{title}
				</div>
				<div
					style={{
						fontFamily: brand.fonts.body,
						fontWeight: 800,
						fontSize: width * 0.04,
						color: brand.colors.dark,
						background: brand.colors.primary,
						padding: '0.2em 0.6em',
						textTransform: 'uppercase',
						transform: `scaleX(${subIn})`,
					}}
				>
					{subtitle}
				</div>
			</AbsoluteFill>
			<AbsoluteFill style={{background: brand.colors.light, opacity: flash}} />
		</AbsoluteFill>
	);
};
