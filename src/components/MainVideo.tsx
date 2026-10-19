import React from 'react';
import {AbsoluteFill, interpolate, OffthreadVideo, staticFile, useVideoConfig} from 'remotion';
import {brand} from '../brand';
import type {Broll} from '../schema';
import {Placeholder} from './Placeholder';

export type MainLayout = {mode: Broll['layout'] | 'none'; progress: number};

/** Tu video a cámara. Se acomoda solo cuando entra una pantalla en modo split o pip. */
export const MainVideo: React.FC<{
	src: string;
	trimStartFrames: number;
	scale: number;
	layout: MainLayout;
}> = ({src, trimStartFrames, scale, layout}) => {
	const {width: W, height: H} = useVideoConfig();
	const p = layout.progress;
	const pipSize = W * 0.38;
	const target =
		layout.mode === 'split'
			? {x: 0, y: H / 2, w: W, h: H / 2, r: 0}
			: layout.mode === 'pip'
				? {x: W - pipSize - W * 0.05, y: H * 0.4, w: pipSize, h: pipSize, r: pipSize / 2}
				: {x: 0, y: 0, w: W, h: H, r: 0};
	const lerp = (a: number, b: number) => interpolate(p, [0, 1], [a, b]);
	const ring = layout.mode === 'pip' ? p : 0;

	return (
		<div
			style={{
				position: 'absolute',
				left: lerp(0, target.x),
				top: lerp(0, target.y),
				width: lerp(W, target.w),
				height: lerp(H, target.h),
				borderRadius: lerp(0, target.r),
				overflow: 'hidden',
				zIndex: 2,
				boxShadow: ring ? `0 0 0 ${W * 0.008 * ring}px ${brand.colors.primary}, 0 0 ${W * 0.04 * ring}px ${brand.colors.primary}` : 'none',
				background: brand.colors.dark,
			}}
		>
			<AbsoluteFill style={{transform: `scale(${scale})`, transformOrigin: brand.motion.faceFocus}}>
				{src ? (
					<OffthreadVideo
						src={staticFile(src)}
						trimBefore={trimStartFrames}
						style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 30%'}}
					/>
				) : (
					<Placeholder />
				)}
			</AbsoluteFill>
		</div>
	);
};
