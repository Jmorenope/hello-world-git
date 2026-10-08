/**
 * Identidad visual de Elmackflay.
 *
 * Este es el ÚNICO archivo que hay que tocar para cambiar el estilo de todos
 * los videos. Los valores actuales son PROVISIONALES (estilo enérgico, alto
 * contraste, tipo creador de contenido): reemplázalos por los colores, fuentes
 * y logo oficiales de Elmackflay.
 */
import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

// Fuentes incluidas en /public/fonts (funcionan sin internet). Para cambiarlas,
// pon tus archivos .woff2/.ttf ahí y actualiza estas líneas.
const TITLE_FONT = 'Elmackflay Title';
const BODY_FONT = 'Elmackflay Body';
loadFont({family: TITLE_FONT, url: staticFile('fonts/Anton-Regular.woff2')});
loadFont({family: BODY_FONT, url: staticFile('fonts/Montserrat-Variable.woff2'), weight: '100 900'});

export const brand = {
	name: 'ELMACKFLAY',
	handle: '@elmackflay',
	// Coloca aquí el logo oficial (PNG o SVG con fondo transparente).
	logo: 'brand/logo.svg',
	colors: {
		primary: '#FFE600', // amarillo neón: palabra activa en subtítulos, acentos
		secondary: '#7B2CFF', // morado eléctrico: fondos de títulos, barras
		accent: '#FF2D78', // rosa: detalles y destellos
		dark: '#0B0B12', // fondo base
		light: '#FFFFFF', // texto principal
	},
	fonts: {
		title: `'${TITLE_FONT}', Impact, sans-serif`, // títulos grandes, en mayúsculas
		body: `'${BODY_FONT}', Arial, sans-serif`, // subtítulos y textos secundarios
	},
	// Velocidad de animaciones (frames). Menos = más rápido y agresivo.
	motion: {
		transitionFrames: 12,
		introFrames: 60,
		outroFrames: 90,
	},
} as const;

export type Brand = typeof brand;
