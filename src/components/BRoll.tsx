import React from 'react';
import {AbsoluteFill, Img, interpolate, OffthreadVideo, random, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {brand} from '../brand';
import type {Broll} from '../schema';
import {ZoomLayer} from './ZoomLayer';

const isVideo = (src: string) => /\.(mp4|mov|webm|mkv|m4v)$/i.test(src);

/** Cuánto está "dentro" la pantalla (0 → fuera, 1 → completamente visible). */
export const brollVisibility = (frame: number, durationInFrames: number, transitionFrames: number) =>
	Math.min(
		interpolate(frame, [0, transitionFrames], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
		interpolate(frame, [durationInFrames - transitionFrames, durationInFrames], [1, 0], {
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}),
	);

/** Barras de colores y desplazamientos aleatorios: efecto glitch "hacker". */
const GlitchBars: React.FC<{amount: number; seed: number}> = ({amount, seed}) => {
	const frame = useCurrentFrame();
	if (amount <= 0) return null;
	const colors = [brand.colors.primary, brand.colors.accent, brand.colors.secondary];
	return (
		<AbsoluteFill style={{mixBlendMode: 'screen', pointerEvents: 'none'}}>
			{Array.from({length: 7}, (_, i) => {
				const r = (k: string) => random(`${seed}-${frame}-${i}-${k}`);
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: `${(r('x') - 0.5) * 30}%`,
							top: `${r('y') * 100}%`,
							width: '130%',
							height: `${2 + r('h') * 9}%`,
							background: colors[i % colors.length],
							opacity: amount * (0.35 + r('o') * 0.5),
						}}
					/>
				);
			})}
		</AbsoluteFill>
	);
};

/** Pantalla / clip de herramienta con su transición de entrada y salida. */
export const BRoll: React.FC<{item: Broll; index: number}> = ({item, index}) => {
	const frame = useCurrentFrame();
	const {fps, width, height, durationInFrames} = useVideoConfig();
	const v = brollVisibility(frame, durationInFrames, brand.motion.transitionFrames);
	const hidden = 1 - v;

	let transform = 'none';
	let clipPath: string | undefined;
	let opacity = 1;
	let glitch = 0;
	let flash = 0;
	switch (item.transition) {
		case 'slide':
			transform = `translateY(${hidden * 100}%)`;
			break;
		case 'zoom':
			transform = `scale(${1.6 - 0.6 * v})`;
			opacity = v;
			break;
		case 'wipe':
			clipPath = `inset(0 ${hidden * 100}% 0 0)`;
			break;
		case 'flash':
			opacity = v > 0 ? 1 : 0;
			flash = hidden;
			break;
		case 'glitch': {
			glitch = hidden > 0 ? Math.max(hidden, 0.4) : 0;
			const jitter = (random(`j-${index}-${frame}`) - 0.5) * width * 0.12 * glitch;
			transform = `translateX(${jitter}px) skewX(${glitch * (random(`s-${index}-${frame}`) - 0.5) * 20}deg)`;
			opacity = v > 0.05 ? 1 : 0;
			const cut = random(`c-${index}-${frame}`) * 40 * hidden;
			clipPath = hidden > 0 ? `inset(${cut}% 0 ${40 * hidden - cut}% 0)` : undefined;
			break;
		}
	}

	// En split ocupa la mitad de arriba; en full y pip, toda la pantalla.
	const region: React.CSSProperties =
		item.layout === 'split'
			? {position: 'absolute', left: 0, top: 0, width, height: height / 2}
			: {position: 'absolute', inset: 0};

	const media = isVideo(item.src) ? (
		<OffthreadVideo
			src={staticFile(item.src)}
			trimBefore={Math.round(item.sourceStartSeconds * fps)}
			muted
			style={{width: '100%', height: '100%', objectFit: 'cover'}}
		/>
	) : (
		<Img src={staticFile(item.src)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
	);

	return (
		<AbsoluteFill style={{zIndex: item.layout === 'full' ? 3 : 1}}>
			<div style={{...region, overflow: 'hidden', background: brand.colors.dark}}>
				<div style={{position: 'absolute', inset: 0, transform, clipPath, opacity, filter: glitch ? `hue-rotate(${glitch * 90}deg) contrast(1.4)` : undefined}}>
					<ZoomLayer zoom={item.zoom}>{media}</ZoomLayer>
				</div>
				<GlitchBars amount={glitch} seed={index} />
				{flash > 0 ? <AbsoluteFill style={{background: brand.colors.light, opacity: flash}} /> : null}
				{/* línea neón que separa la pantalla de la cara en modo split */}
				{item.layout === 'split' ? (
					<div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: width * 0.006, background: brand.colors.primary, boxShadow: `0 0 ${width * 0.03}px ${brand.colors.primary}`, opacity: v}} />
				) : null}
			</div>
		</AbsoluteFill>
	);
};
