import React from 'react';
import {CalculateMetadataFunction, Composition, Still, staticFile} from 'remotion';
import type {Caption} from '@remotion/captions';
import {ElmackflayVideo, type ElmackflayVideoProps} from './ElmackflayVideo';
import {videoSchema} from './schema';
import {getTimeline} from './timeline';
import {Thumbnail, thumbnailSchema} from './Thumbnail';
import {sampleVideo} from './sample-video';

const FPS = 30;

// Calcula la duración según las escenas y carga el JSON de subtítulos.
const calculateMetadata: CalculateMetadataFunction<ElmackflayVideoProps> = async ({props}) => {
	let loadedCaptions: Caption[] = [];
	if (props.captionsSrc) {
		const res = await fetch(staticFile(props.captionsSrc));
		loadedCaptions = (await res.json()) as Caption[];
	}
	return {
		durationInFrames: getTimeline(props.scenes).durationInFrames,
		props: {...props, loadedCaptions},
	};
};

export const RemotionRoot: React.FC = () => (
	<>
		{/* TikTok, Reels, Shorts */}
		<Composition
			id="ElmackflayVertical"
			component={ElmackflayVideo}
			schema={videoSchema}
			defaultProps={sampleVideo}
			calculateMetadata={calculateMetadata}
			fps={FPS}
			width={1080}
			height={1920}
			durationInFrames={1}
		/>
		{/* YouTube */}
		<Composition
			id="ElmackflayHorizontal"
			component={ElmackflayVideo}
			schema={videoSchema}
			defaultProps={sampleVideo}
			calculateMetadata={calculateMetadata}
			fps={FPS}
			width={1920}
			height={1080}
			durationInFrames={1}
		/>
		<Still
			id="ElmackflayThumbnail"
			component={Thumbnail}
			schema={thumbnailSchema}
			defaultProps={{line1: 'Esto no', line2: 'te lo esperas', imageSrc: ''}}
			width={1280}
			height={720}
		/>
	</>
);
