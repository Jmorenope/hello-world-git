import React from 'react';
import {AbsoluteFill, Img, staticFile, useVideoConfig} from 'remotion';
import {z} from 'zod';
import {brand} from './brand';
import {BrandBackground} from './components/BrandBackground';
import {findTopic, getIcon} from './topics';

export const coverSchema = z.object({
	line1: z.string(),
	line2: z.string(),
	// Foto tuya (o un fotograma del video) dentro de /public. Vacío = fondo de marca.
	imageSrc: z.string().default(''),
	// Tema cuyo logo aparece en la portada (de src/topics.json). Vacío = sin logo.
	topic: z.string().default(''),
});

/**
 * Portada del reel (1080x1920). Instagram la recorta a 4:5 en el perfil,
 * por eso todo lo importante va en el centro.
 */
export const Cover: React.FC<z.infer<typeof coverSchema>> = ({line1, line2, imageSrc, topic}) => {
	const {width} = useVideoConfig();
	const t = topic ? findTopic(topic) : undefined;
	const icon = getIcon(t?.icon);
	const logo = width * 0.26;
	return (
		<AbsoluteFill>
			{imageSrc ? <Img src={staticFile(imageSrc)} style={{width: '100%', height: '100%', objectFit: 'cover'}} /> : <BrandBackground />}
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(7,9,13,0) 30%, rgba(7,9,13,0.85) 75%)'}} />
			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', gap: width * 0.03, paddingTop: '20%'}}>
				{t ? (
					<div style={{width: logo, height: logo, borderRadius: logo * 0.22, background: brand.colors.light, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 0 ${width * 0.008}px ${icon ? `#${icon.hex}` : brand.colors.primary}, 0 0 ${width * 0.08}px ${brand.colors.primary}`, transform: 'rotate(-6deg)'}}>
						{t.image ? <Img src={staticFile(t.image)} style={{width: '72%'}} /> : icon ? <svg viewBox="0 0 24 24" style={{width: '62%'}}><path d={icon.path} fill={`#${icon.hex}`} /></svg> : <span style={{fontFamily: brand.fonts.mono, fontWeight: 800, fontSize: logo * 0.34}}>{'>_'}</span>}
					</div>
				) : null}
				<div style={{fontFamily: brand.fonts.title, fontSize: width * 0.13, lineHeight: 1, color: brand.colors.light, textTransform: 'uppercase', textAlign: 'center', maxWidth: '90%', textShadow: `0.05em 0.05em 0 ${brand.colors.dark}`}}>{line1}</div>
				<div style={{fontFamily: brand.fonts.title, fontSize: width * 0.11, lineHeight: 1.05, color: brand.colors.dark, background: brand.colors.primary, padding: '0 0.2em', textTransform: 'uppercase', transform: 'rotate(-2deg)', textAlign: 'center', boxShadow: `0 0 ${width * 0.05}px ${brand.colors.primary}`}}>{line2}</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
