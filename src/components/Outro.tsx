import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {brand} from '../brand';
import {BrandBackground} from './BrandBackground';

/** Cierre con llamada a la acción (seguir / suscribirse). */
export const Outro: React.FC<{ctaText: string}> = ({ctaText}) => {
	const frame = useCurrentFrame();
	const {fps, width} = useVideoConfig();
	const s = spring({frame, fps, config: {damping: 12}});
	const btn = spring({frame: frame - 15, fps, config: {damping: 8, stiffness: 150}});
	const pulse = 1 + Math.sin(frame / 5) * 0.03 * btn;
	const ring = interpolate(frame % 30, [0, 30], [1, 1.6]);
	const ringOpacity = interpolate(frame % 30, [0, 30], [0.6, 0]);
	const logoSize = width * 0.22;

	return (
		<AbsoluteFill>
			<BrandBackground variant={1} />
			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: width * 0.04}}>
				<div style={{position: 'relative', width: logoSize, height: logoSize, transform: `scale(${s})`}}>
					<div
						style={{
							position: 'absolute',
							inset: 0,
							borderRadius: '50%',
							border: `${width * 0.008}px solid ${brand.colors.primary}`,
							transform: `scale(${ring})`,
							opacity: ringOpacity,
						}}
					/>
					<Img src={staticFile(brand.logo)} style={{width: logoSize, height: logoSize}} />
				</div>
				<div style={{fontFamily: brand.fonts.title, fontSize: width * 0.08, color: brand.colors.light, opacity: s}}>
					{brand.handle}
				</div>
				<div
					style={{
						fontFamily: brand.fonts.body,
						fontWeight: 800,
						fontSize: width * 0.05,
						color: brand.colors.dark,
						background: brand.colors.primary,
						borderRadius: width * 0.02,
						padding: '0.45em 1.1em',
						textTransform: 'uppercase',
						transform: `scale(${btn * pulse})`,
						boxShadow: `0 ${width * 0.01}px 0 ${brand.colors.accent}`,
					}}
				>
					{ctaText}
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
