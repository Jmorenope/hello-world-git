import React from 'react';
import {AbsoluteFill, Img, staticFile, useVideoConfig} from 'remotion';
import {z} from 'zod';
import {brand} from './brand';
import {BrandBackground} from './components/BrandBackground';

export const thumbnailSchema = z.object({
	line1: z.string(),
	line2: z.string(),
	// Imagen opcional (p. ej. tu cara recortada con fondo transparente), relativa a /public.
	imageSrc: z.string().default(''),
});

/** Miniatura 1280x720 para YouTube con el estilo de la marca. */
export const Thumbnail: React.FC<z.infer<typeof thumbnailSchema>> = ({line1, line2, imageSrc}) => {
	const {width} = useVideoConfig();
	return (
		<AbsoluteFill>
			<BrandBackground />
			{imageSrc ? (
				<Img src={staticFile(imageSrc)} style={{position: 'absolute', right: 0, bottom: 0, height: '100%'}} />
			) : null}
			<AbsoluteFill style={{justifyContent: 'center', paddingLeft: width * 0.05, maxWidth: '65%'}}>
				<div style={{fontFamily: brand.fonts.title, fontSize: width * 0.1, lineHeight: 1, color: brand.colors.light, textTransform: 'uppercase', textShadow: `0.05em 0.05em 0 ${brand.colors.secondary}`}}>
					{line1}
				</div>
				<div style={{alignSelf: 'flex-start', marginTop: width * 0.015, fontFamily: brand.fonts.title, fontSize: width * 0.085, lineHeight: 1.05, color: brand.colors.dark, background: brand.colors.primary, padding: '0 0.15em', textTransform: 'uppercase', transform: 'rotate(-2deg)'}}>
					{line2}
				</div>
			</AbsoluteFill>
			<Img src={staticFile(brand.logo)} style={{position: 'absolute', left: width * 0.03, top: width * 0.03, width: width * 0.09}} />
		</AbsoluteFill>
	);
};
