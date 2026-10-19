/**
 * Identidad visual de Elmackflay.
 *
 * Es el ÚNICO archivo que hay que tocar para cambiar el estilo de todos los
 * reels. Estilo actual: "hacker / ciberseguridad", con fondo oscuro, verde
 * neón y cian, y letra de terminal para las etiquetas. Ajústalo a tu gusto.
 */
import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

// Fuentes incluidas en /public/fonts (funcionan sin internet). Para cambiarlas,
// pon tus archivos .woff2/.ttf ahí y actualiza estas líneas.
const TITLE_FONT = 'Elmackflay Title';
const MONO_FONT = 'Elmackflay Mono';
loadFont({family: TITLE_FONT, url: staticFile('fonts/Anton-Regular.woff2')});
loadFont({family: MONO_FONT, url: staticFile('fonts/JetBrainsMono-Variable.woff2'), weight: '100 800'});

export const brand = {
	name: 'Elmackflay',
	// Usuario que aparece en el cierre ("Sígueme...").
	handle: '@elmackflay',
	colors: {
		primary: '#00FF85', // verde neón: palabra activa en subtítulos, acentos
		secondary: '#00C2FF', // cian: barras y detalles
		accent: '#FF2BD6', // magenta: efecto glitch
		dark: '#07090D', // fondos
		light: '#FFFFFF', // texto principal
	},
	fonts: {
		title: `'${TITLE_FONT}', Impact, sans-serif`, // subtítulos y titulares
		mono: `'${MONO_FONT}', 'Courier New', monospace`, // etiquetas estilo terminal
	},
	motion: {
		// Frames que dura cada transición (30 fps → 10 frames = 0,33 s).
		transitionFrames: 10,
		// Punto que se mantiene centrado al hacer zoom (donde suele estar la cara).
		faceFocus: '50% 35%',
	},
} as const;
