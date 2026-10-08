import React from 'react';
import {AbsoluteFill, Img, staticFile, useVideoConfig} from 'remotion';
import {brand} from '../brand';

/** Logo + usuario fijos en una esquina durante todo el video. */
export const Watermark: React.FC = () => {
	const {width} = useVideoConfig();
	const size = width * 0.09;
	return (
		<AbsoluteFill style={{alignItems: 'flex-end', padding: width * 0.035}}>
			<div style={{display: 'flex', alignItems: 'center', gap: size * 0.2, opacity: 0.9}}>
				<span
					style={{
						fontFamily: brand.fonts.body,
						fontWeight: 800,
						fontSize: size * 0.32,
						color: brand.colors.light,
						textShadow: '0 2px 8px rgba(0,0,0,0.6)',
					}}
				>
					{brand.handle}
				</span>
				<Img src={staticFile(brand.logo)} style={{width: size, height: size}} />
			</div>
		</AbsoluteFill>
	);
};
