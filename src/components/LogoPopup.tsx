import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {brand} from '../brand';
import {getIcon, type Topic} from '../topics';

/** Tarjeta con el logo de la herramienta que se está mencionando. */
export const LogoPopup: React.FC<{topic: Topic}> = ({topic}) => {
	const frame = useCurrentFrame();
	const {fps, width, height, durationInFrames} = useVideoConfig();
	const icon = getIcon(topic.icon);
	const glow = icon ? `#${icon.hex}` : brand.colors.primary;

	const enter = spring({frame, fps, config: {damping: 10, stiffness: 170}});
	const exit = interpolate(frame, [durationInFrames - 6, durationInFrames], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const s = enter * exit;
	const float = Math.sin(frame / 8) * width * 0.006;
	const card = width * 0.3;
	// El nombre se "escribe" letra por letra, como en una terminal.
	const typed = topic.name.slice(0, Math.floor(interpolate(frame, [4, 4 + topic.name.length * 1.5], [0, topic.name.length], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})));
	const cursor = Math.floor(frame / 8) % 2 === 0 ? '▌' : ' ';

	return (
		<AbsoluteFill style={{alignItems: 'center', paddingTop: height * 0.12, zIndex: 5}}>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: width * 0.025,
					transform: `translateY(${float}px) scale(${s}) rotate(${(1 - enter) * -18}deg)`,
					opacity: exit,
				}}
			>
				<div
					style={{
						width: card,
						height: card,
						borderRadius: card * 0.22,
						background: brand.colors.light,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						boxShadow: `0 0 0 ${width * 0.008}px ${glow}, 0 0 ${width * 0.08}px ${glow}, 0 ${width * 0.02}px ${width * 0.05}px rgba(0,0,0,0.5)`,
					}}
				>
					{topic.image ? (
						<Img src={staticFile(topic.image)} style={{width: '72%', height: '72%', objectFit: 'contain'}} />
					) : icon ? (
						<svg viewBox="0 0 24 24" style={{width: '62%', height: '62%'}}>
							<path d={icon.path} fill={glow} />
						</svg>
					) : (
						<div style={{fontFamily: brand.fonts.mono, fontWeight: 800, fontSize: card * 0.34, color: brand.colors.dark}}>{'>_'}</div>
					)}
				</div>
				<div
					style={{
						fontFamily: brand.fonts.mono,
						fontWeight: 800,
						fontSize: width * 0.045,
						color: brand.colors.light,
						background: 'rgba(7, 9, 13, 0.85)',
						border: `${width * 0.003}px solid ${brand.colors.primary}`,
						borderRadius: width * 0.015,
						padding: '0.25em 0.6em',
						whiteSpace: 'pre',
					}}
				>
					<span style={{color: brand.colors.primary}}>{'> '}</span>
					{typed}
					<span style={{color: brand.colors.primary}}>{cursor}</span>
				</div>
			</div>
		</AbsoluteFill>
	);
};
