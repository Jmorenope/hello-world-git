import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useVideoConfig} from 'remotion';
import type {Scene} from '../schema';
import {BrandBackground} from './BrandBackground';
import {Headline} from './Headline';
import {LowerThird} from './LowerThird';
import {ZoomLayer} from './ZoomLayer';

export const SceneView: React.FC<{scene: Scene; index: number}> = ({scene, index}) => {
	const {fps} = useVideoConfig();
	const media =
		scene.type === 'video' && scene.src ? (
			<OffthreadVideo
				src={staticFile(scene.src)}
				trimBefore={Math.round(scene.startFromSeconds * fps)}
				muted={scene.muted}
				style={{width: '100%', height: '100%', objectFit: 'cover'}}
			/>
		) : scene.type === 'image' && scene.src ? (
			<Img src={staticFile(scene.src)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
		) : (
			<BrandBackground variant={index} />
		);

	return (
		<AbsoluteFill style={{overflow: 'hidden'}}>
			<ZoomLayer zoom={scene.zoom}>{media}</ZoomLayer>
			{/* Viñeta para que textos y subtítulos siempre se lean */}
			<AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.55) 100%)'}} />
			{scene.headline ? (
				<Sequence durationInFrames={Math.min(scene.durationInFrames, 3 * fps)} layout="none">
					<Headline text={scene.headline} position={scene.type === 'color' ? 'center' : 'top'} />
				</Sequence>
			) : null}
			{scene.lowerThird ? (
				<Sequence from={Math.round(0.3 * fps)} durationInFrames={Math.min(scene.durationInFrames, 4 * fps)} layout="none">
					<LowerThird text={scene.lowerThird} />
				</Sequence>
			) : null}
		</AbsoluteFill>
	);
};
