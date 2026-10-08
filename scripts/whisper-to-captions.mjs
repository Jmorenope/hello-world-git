#!/usr/bin/env node
/**
 * Convierte una transcripción a subtítulos de Remotion (public/captions/*.json).
 *
 * Entradas aceptadas:
 *  - JSON de Whisper con tiempos por palabra:
 *      whisper voz.mp3 --language Spanish --word_timestamps True --output_format json
 *  - Archivo .srt (de CapCut, Premiere, YouTube, etc.)
 *
 * Uso: npm run captions -- <entrada.json|entrada.srt> <nombre-salida>
 * Ej.:  npm run captions -- voz.json mi-video   →  public/captions/mi-video.json
 */
import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';
import {extname, join} from 'node:path';
import {parseSrt} from '@remotion/captions';

const [input, name] = process.argv.slice(2);
if (!input || !name) {
	console.error('Uso: npm run captions -- <entrada.json|entrada.srt> <nombre-salida>');
	process.exit(1);
}

const raw = readFileSync(input, 'utf8');
let captions;

if (extname(input).toLowerCase() === '.srt') {
	// Espacio inicial para que cada bloque se separe bien de la palabra anterior.
	captions = parseSrt({input: raw}).captions.map((c, i) => ({...c, text: i === 0 ? c.text : ` ${c.text}`}));
} else {
	const data = JSON.parse(raw);
	const words = (data.segments ?? []).flatMap((s) => s.words ?? []);
	if (words.length === 0) {
		console.error('El JSON no tiene tiempos por palabra. Ejecuta Whisper con --word_timestamps True.');
		process.exit(1);
	}
	captions = words.map((w) => {
		const startMs = Math.round(w.start * 1000);
		const endMs = Math.round(w.end * 1000);
		return {
			// Whisper ya incluye el espacio inicial en cada palabra.
			text: w.word,
			startMs,
			endMs,
			timestampMs: Math.round((startMs + endMs) / 2),
			confidence: w.probability ?? null,
		};
	});
}

const outDir = join('public', 'captions');
mkdirSync(outDir, {recursive: true});
const outPath = join(outDir, `${name}.json`);
writeFileSync(outPath, JSON.stringify(captions, null, 1));
console.log(`✔ ${captions.length} subtítulos → ${outPath}`);
console.log(`  Úsalo en tu video con "captionsSrc": "captions/${name}.json"`);
