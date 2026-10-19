import React from 'react';
import {CalculateMetadataFunction, Composition, Still, staticFile} from 'remotion';
import type {Caption} from '@remotion/captions';
import {parseMedia} from '@remotion/media-parser';
import {Reel, type ElmackflayReelProps} from './Reel';
import {reelSchema} from './schema';
import {Cover, coverSchema} from './Cover';
import {demoReel} from './demo-reel';

const FPS = 30;

// Calcula la duración a partir del video y carga los subtítulos.
const calculateMetadata: CalculateMetadataFunction<ElmackflayReelProps> = async ({props}) => {
	let captions: Caption[] = [];
	if (props.captionsSrc) {
		const res = await fetch(staticFile(props.captionsSrc));
		const trimMs = props.trimStartSeconds * 1000;
		// Los subtítulos son del video completo: se corren para que coincidan con el recorte.
		captions = ((await res.json()) as Caption[])
			.filter((c) => c.endMs > trimMs)
			.map((c) => ({...c, startMs: Math.max(0, c.startMs - trimMs), endMs: c.endMs - trimMs, timestampMs: c.timestampMs === null ? null : c.timestampMs - trimMs}));
	}

	let seconds = props.durationSeconds;
	if (!seconds && props.videoSrc) {
		const {durationInSeconds} = await parseMedia({src: staticFile(props.videoSrc), fields: {durationInSeconds: true}});
		seconds = (durationInSeconds ?? 10) - props.trimStartSeconds;
	}
	if (!seconds) {
		seconds = captions.length ? captions[captions.length - 1].endMs / 1000 + 1 : 10;
	}

	return {
		durationInFrames: Math.max(1, Math.floor(seconds * FPS)),
		props: {...props, loadedCaptions: captions},
	};
};

export const RemotionRoot: React.FC = () => (
	<>
		{/* Reels de Instagram (también sirve para TikTok y Shorts) */}
		<Composition
			id="ElmackflayReel"
			component={Reel}
			schema={reelSchema}
			defaultProps={demoReel}
			calculateMetadata={calculateMetadata}
			fps={FPS}
			width={1080}
			height={1920}
			durationInFrames={1}
		/>
		<Still
			id="ElmackflayPortada"
			component={Cover}
			schema={coverSchema}
			defaultProps={{line1: 'Escanea tu red', line2: 'con Kali Linux', imageSrc: '', topic: 'Kali Linux'}}
			width={1080}
			height={1920}
		/>
	</>
);
