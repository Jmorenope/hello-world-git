import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {brand} from '../brand';
import {BrandBackground} from './BrandBackground';

/** Se muestra cuando todavía no hay video (videoSrc vacío). */
export const Placeholder: React.FC = () => {
	const {width} = useVideoConfig();
	return (
		<AbsoluteFill>
			<BrandBackground />
			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
				<div
					style={{
						fontFamily: brand.fonts.mono,
						fontWeight: 700,
						fontSize: width * 0.04,
						color: brand.colors.primary,
						textAlign: 'center',
						maxWidth: '80%',
					}}
				>
					{'> pon tu video en public/media/'}
					<br />
					{'> y su ruta en "videoSrc"'}
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
