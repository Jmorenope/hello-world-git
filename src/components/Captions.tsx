import React, {useMemo} from 'react';
import {AbsoluteFill, Sequence, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {createTikTokStyleCaptions, type Caption, type TikTokPage} from '@remotion/captions';
import {brand} from '../brand';

// Cuántos ms caben en una misma "página" de subtítulos. Más alto = más palabras por pantalla.
const COMBINE_TOKENS_WITHIN_MS = 1200;

const Page: React.FC<{page: TikTokPage; lift: number}> = ({page, lift}) => {
	const frame = useCurrentFrame();
	const {fps, width, height} = useVideoConfig();
	const timeMs = page.startMs + (frame / fps) * 1000;
	const pop = spring({frame, fps, config: {damping: 10, stiffness: 200}, durationInFrames: 8});

	return (
		<AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: height * ((height > width ? 0.26 : 0.08) + lift * 0.18), zIndex: 4}}>
			<div
				style={{
					fontFamily: brand.fonts.title,
					fontSize: width * brand.captions.size,
					textTransform: 'uppercase',
					textAlign: 'center',
					maxWidth: '86%',
					lineHeight: 1.1,
					transform: `scale(${0.85 + 0.15 * pop})`,
					WebkitTextStroke: `${width * brand.captions.size * 0.07}px ${brand.colors.dark}`,
					paintOrder: 'stroke',
					textShadow: `0 ${width * brand.captions.size * 0.07}px 0 ${brand.colors.dark}`,
					whiteSpace: 'pre-wrap',
				}}
			>
				{page.tokens.map((t) => {
					const active = t.fromMs <= timeMs && t.toMs > timeMs;
					return (
						<span
							key={t.fromMs}
							style={{
								color: active ? brand.colors.primary : brand.colors.light,
								display: 'inline-block',
								margin: '0 0.14em',
								transform: active ? 'scale(1.06)' : 'none',
							}}
						>
							{t.text.trim()}
						</span>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};

/** Subtítulos estilo TikTok/Reels con la palabra activa resaltada. */
/** lift: 0 → abajo; 1 → sube hacia la línea central (modo split). */
export const Captions: React.FC<{captions: Caption[]; lift?: number}> = ({captions, lift = 0}) => {
	const {fps} = useVideoConfig();
	const pages = useMemo(
		() => createTikTokStyleCaptions({captions, combineTokensWithinMilliseconds: COMBINE_TOKENS_WITHIN_MS}).pages,
		[captions],
	);

	return (
		<AbsoluteFill style={{zIndex: 4}}>
			{pages.map((page, i) => {
				const next = pages[i + 1];
				const from = Math.round((page.startMs / 1000) * fps);
				const endMs = next ? next.startMs : page.startMs + page.durationMs;
				const duration = Math.max(1, Math.round((endMs / 1000) * fps) - from);
				return (
					<Sequence key={i} from={from} durationInFrames={duration} layout="none">
						<Page page={page} lift={lift} />
					</Sequence>
				);
			})}
		</AbsoluteFill>
	);
};

/** true si en este instante (ms) hay alguna palabra hablada; se usa para bajar la música. */
export const isSpeaking = (captions: Caption[], ms: number) =>
	captions.some((c) => c.startMs - 150 <= ms && c.endMs + 250 >= ms);
