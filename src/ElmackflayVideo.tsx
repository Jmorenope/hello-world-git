import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useVideoConfig} from 'remotion';
import {linearTiming, springTiming, TransitionSeries, type TransitionPresentation} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {slide} from '@remotion/transitions/slide';
import {wipe} from '@remotion/transitions/wipe';
import {flip} from '@remotion/transitions/flip';
import {clockWipe} from '@remotion/transitions/clock-wipe';
import type {Caption} from '@remotion/captions';
import {brand} from './brand';
import type {Scene, VideoProps} from './schema';
import {getTimeline} from './timeline';
import {Intro} from './components/Intro';
import {Outro} from './components/Outro';
import {SceneView} from './components/SceneView';
import {Captions, isSpeaking} from './components/Captions';
import {Watermark} from './components/Watermark';

export type ElmackflayVideoProps = VideoProps & {
	// Lo rellena calculateMetadata a partir de captionsSrc.
	loadedCaptions?: Caption[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getPresentation = (t: Scene['transition'], width: number, height: number): TransitionPresentation<any> => {
	switch (t) {
		case 'slide':
			return slide({direction: 'from-right'});
		case 'wipe':
			return wipe({direction: 'from-left'});
		case 'flip':
			return flip({direction: 'from-right'});
		case 'clock-wipe':
			return clockWipe({width, height});
		default:
			return fade();
	}
};

export const ElmackflayVideo: React.FC<ElmackflayVideoProps> = (props) => {
	const {fps, width, height, durationInFrames} = useVideoConfig();
	const {introFrames, outroFrames, transitionFrames} = brand.motion;
	const {contentStart} = getTimeline(props.scenes);
	const captions = props.loadedCaptions ?? [];

	const timing = (t: Scene['transition']) =>
		t === 'slide' || t === 'flip'
			? springTiming({config: {damping: 200}, durationInFrames: transitionFrames})
			: linearTiming({durationInFrames: transitionFrames});

	const musicVolume = (f: number) => {
		const fadeInOut = interpolate(f, [0, fps, durationInFrames - fps * 1.5, durationInFrames], [0, 1, 1, 0], {
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		});
		const ms = ((f - contentStart) / fps) * 1000;
		const base = isSpeaking(captions, ms) ? props.musicDuckedVolume : props.musicVolume;
		return base * fadeInOut;
	};

	return (
		<AbsoluteFill style={{background: brand.colors.dark}}>
			<TransitionSeries>
				<TransitionSeries.Sequence durationInFrames={introFrames}>
					<Intro title={props.title} subtitle={props.subtitle} />
				</TransitionSeries.Sequence>
				{props.scenes.map((scene, i) => (
					<React.Fragment key={i}>
						{scene.transition !== 'none' ? (
							<TransitionSeries.Transition
								presentation={getPresentation(scene.transition, width, height)}
								timing={timing(scene.transition)}
							/>
						) : null}
						<TransitionSeries.Sequence durationInFrames={scene.durationInFrames}>
							<SceneView scene={scene} index={i} />
						</TransitionSeries.Sequence>
					</React.Fragment>
				))}
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: transitionFrames})} />
				<TransitionSeries.Sequence durationInFrames={outroFrames}>
					<Outro ctaText={props.ctaText} />
				</TransitionSeries.Sequence>
			</TransitionSeries>

			{/* Voz y subtítulos arrancan cuando empieza el contenido (tras la intro) */}
			<Sequence from={contentStart} durationInFrames={durationInFrames - contentStart - outroFrames}>
				{props.voiceSrc ? <Audio src={staticFile(props.voiceSrc)} /> : null}
				<Captions captions={captions} />
			</Sequence>

			{props.showWatermark ? (
				<Sequence from={introFrames} durationInFrames={durationInFrames - introFrames - outroFrames}>
					<Watermark />
				</Sequence>
			) : null}

			{props.musicSrc ? <Audio src={staticFile(props.musicSrc)} volume={musicVolume} loop /> : null}
		</AbsoluteFill>
	);
};
