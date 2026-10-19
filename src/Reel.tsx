import React, {useMemo} from 'react';
import {AbsoluteFill, Audio, Easing, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Caption} from '@remotion/captions';
import {brand} from './brand';
import type {ReelProps} from './schema';
import {detectTopics, findTopic, scheduleLogos, type TopicHit} from './topics';
import {MainVideo, type MainLayout} from './components/MainVideo';
import {BRoll, brollVisibility} from './components/BRoll';
import {Captions, isSpeaking} from './components/Captions';
import {Headline} from './components/Headline';
import {LowerThird} from './components/LowerThird';
import {LogoPopup} from './components/LogoPopup';
import {EndCta} from './components/EndCta';
import {ProgressBar} from './components/ProgressBar';

export type ElmackflayReelProps = ReelProps & {
	// Lo rellena calculateMetadata a partir de captionsSrc (ya ajustado al recorte).
	loadedCaptions?: Caption[];
};

const HOOK_SECONDS = 2.5;
const CTA_SECONDS = 2.5;

export const Reel: React.FC<ElmackflayReelProps> = (props) => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();
	const sec = (s: number) => Math.round(s * fps);
	const T = brand.motion.transitionFrames;

	// Temas mencionados → logos, y subtítulos con los nombres corregidos.
	const {captions, logos} = useMemo(() => {
		const raw = props.loadedCaptions ?? [];
		const detected = props.autoLogos ? detectTopics(raw) : {hits: [], captions: raw};
		const manual: TopicHit[] = props.logos.flatMap((l) => {
			const topic = findTopic(l.topic) ?? {name: l.topic, aliases: []};
			return [{topic, startMs: l.atSeconds * 1000, durationMs: l.durationSeconds * 1000}];
		});
		return {captions: detected.captions, logos: scheduleLogos([...detected.hits, ...manual])};
	}, [props.loadedCaptions, props.autoLogos, props.logos]);

	// Zoom automático: alterna cerca/lejos, siempre al empezar una palabra para que se sienta natural.
	const zoomPoints = useMemo(() => {
		if (!props.autoZoom) return [];
		const every = props.autoZoomEverySeconds * fps;
		const starts = captions.length ? captions.map((c) => Math.round((c.startMs / 1000) * fps)) : Array.from({length: Math.ceil(durationInFrames / every)}, (_, i) => i * every);
		const points: number[] = [];
		let last = 0;
		for (const s of starts) {
			if (s - last >= every) {
				points.push(s);
				last = s;
			}
		}
		return points;
	}, [captions, props.autoZoom, props.autoZoomEverySeconds, fps, durationInFrames]);

	const cameraScale = useMemo(() => {
		const idx = zoomPoints.filter((p) => p <= frame).length;
		const zoomed = (i: number) => (i % 2 === 1 ? props.autoZoomScale : 1);
		const since = idx > 0 ? frame - zoomPoints[idx - 1] : Infinity;
		const t = interpolate(since, [0, 4], [0, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
		let scale = idx > 0 ? interpolate(t, [0, 1], [zoomed(idx - 1), zoomed(idx)]) : 1;
		for (const z of props.zooms) {
			const start = sec(z.atSeconds);
			const end = start + sec(z.durationSeconds);
			const inS = spring({frame: frame - start, fps, config: {damping: 14, stiffness: 160}});
			const outS = spring({frame: frame - end, fps, config: {damping: 200}});
			scale *= 1 + (z.scale - 1) * inS * (1 - outS);
		}
		return scale;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [frame, zoomPoints, props.autoZoomScale, props.zooms, fps]);

	// ¿Hay una pantalla en split o pip ahora mismo? La cara se acomoda según eso.
	const layout: MainLayout = useMemo(() => {
		for (const b of props.broll) {
			if (b.layout === 'full') continue;
			const local = frame - sec(b.atSeconds);
			const dur = sec(b.durationSeconds);
			if (local >= 0 && local < dur) {
				return {mode: b.layout, progress: Easing.inOut(Easing.cubic)(brollVisibility(local, dur, T))};
			}
		}
		return {mode: 'none', progress: 0};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [frame, props.broll, fps, T]);

	const musicVolume = (f: number) => {
		const fade = interpolate(f, [0, fps * 0.5, durationInFrames - fps, durationInFrames], [0, 1, 1, 0], {
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		});
		return (isSpeaking(captions, (f / fps) * 1000) ? props.musicDuckedVolume : props.musicVolume) * fade;
	};

	const sfx = (name: string, from: number, volume: number, key: string) =>
		props.soundEffects ? (
			<Sequence key={key} from={from} durationInFrames={sec(1)} layout="none">
				<Audio src={staticFile(`sfx/${name}.mp3`)} volume={volume} />
			</Sequence>
		) : null;

	return (
		<AbsoluteFill style={{background: brand.colors.dark}}>
			<MainVideo src={props.videoSrc} trimStartFrames={sec(props.trimStartSeconds)} scale={cameraScale} layout={layout} />

			{props.broll.map((b, i) => (
				<Sequence key={`b${i}`} from={sec(b.atSeconds)} durationInFrames={sec(b.durationSeconds)} layout="none">
					<BRoll item={b} index={i} />
				</Sequence>
			))}
			{props.broll.map((b, i) => sfx('whoosh', sec(b.atSeconds), 0.5, `bw${i}`))}

			<Captions captions={captions} lift={layout.mode === 'split' ? layout.progress : 0} />

			{logos.map((l, i) => (
				<Sequence key={`l${i}`} from={sec(l.startMs / 1000)} durationInFrames={Math.max(1, sec(l.durationMs / 1000))} layout="none">
					<LogoPopup topic={l.topic} />
				</Sequence>
			))}
			{logos.map((l, i) => sfx('pop', sec(l.startMs / 1000), 0.6, `lp${i}`))}

			{props.texts.map((t, i) => (
				<Sequence key={`t${i}`} from={sec(t.atSeconds)} durationInFrames={sec(t.durationSeconds)} layout="none">
					<AbsoluteFill style={{zIndex: 5}}>
						{t.style === 'label' ? <LowerThird text={t.text} /> : <Headline text={t.text} position="top" />}
					</AbsoluteFill>
				</Sequence>
			))}

			{props.hook ? (
				<Sequence durationInFrames={sec(HOOK_SECONDS)} layout="none">
					<AbsoluteFill style={{zIndex: 5}}>
						<Headline text={props.hook} position="top" />
					</AbsoluteFill>
				</Sequence>
			) : null}

			{props.ctaText ? (
				<Sequence from={durationInFrames - sec(CTA_SECONDS)} layout="none">
					<EndCta text={props.ctaText} />
				</Sequence>
			) : null}
			{props.ctaText ? sfx('pop', durationInFrames - sec(CTA_SECONDS), 0.6, 'cta') : null}

			{props.showProgressBar ? <ProgressBar /> : null}

			{props.musicSrc ? <Audio src={staticFile(props.musicSrc)} volume={musicVolume} loop /> : null}
		</AbsoluteFill>
	);
};
