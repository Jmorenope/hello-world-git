import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {brand} from '../brand';

/** Fondo animado de marca (degradado + formas) para escenas sin metraje. */
export const BrandBackground: React.FC<{variant?: number}> = ({variant = 0}) => {
	const frame = useCurrentFrame();
	const angle = 135 + frame * 0.4 + variant * 60;
	const {primary, secondary, accent, dark} = brand.colors;
	const blob = (color: string, x: number, y: number, size: number, speed: number) => (
		<div
			style={{
				position: 'absolute',
				left: `${x + Math.sin(frame / speed) * 6}%`,
				top: `${y + Math.cos(frame / speed) * 6}%`,
				width: size,
				height: size,
				borderRadius: '50%',
				background: color,
				filter: 'blur(120px)',
				opacity: 0.55,
			}}
		/>
	);
	return (
		<AbsoluteFill style={{background: `linear-gradient(${angle}deg, ${dark} 0%, ${secondary} 140%)`, overflow: 'hidden'}}>
			{blob(secondary, 10, 10, 700, 30)}
			{blob(accent, 60, 55, 600, 40)}
			{blob(primary, 30 + variant * 10, 70, 300, 25)}
			{/* Rayas diagonales sutiles */}
			<AbsoluteFill
				style={{
					backgroundImage: `repeating-linear-gradient(45deg, rgba(255,255,255,0.04) 0 2px, transparent 2px 40px)`,
					transform: `translateX(${interpolate(frame % 120, [0, 120], [0, 56])}px)`,
				}}
			/>
		</AbsoluteFill>
	);
};
