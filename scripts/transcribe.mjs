#!/usr/bin/env node
/**
 * Transcribe la voz de un video y crea los subtítulos (con tiempos por palabra).
 * La primera vez descarga whisper.cpp y el modelo en la carpeta .whisper/ (solo una vez).
 *
 * Uso:   npm run transcribe -- <video-o-audio> <nombre> [modelo]
 * Ej.:   npm run transcribe -- public/media/reel1.mp4 reel1
 *        → public/captions/reel1.json   (úsalo con "captionsSrc": "captions/reel1.json")
 *
 * Modelos: tiny, base, small (por defecto), medium, large-v3-turbo.
 * Más grande = más preciso pero más lento. Requiere ffmpeg instalado.
 */
import {execFileSync} from 'node:child_process';
import {mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {join, resolve} from 'node:path';
import {downloadWhisperModel, installWhisperCpp, toCaptions, transcribe} from '@remotion/install-whisper-cpp';

const WHISPER_CPP_VERSION = '1.7.4';
const WHISPER_DIR = resolve('.whisper');
const WHISPER_PATH = join(WHISPER_DIR, 'whisper.cpp');
const MODEL_DIR = join(WHISPER_DIR, 'models');

// Pista de vocabulario: el nombre del canal + todas las herramientas de src/topics.json.
const {topics} = JSON.parse(readFileSync(new URL('../src/topics.json', import.meta.url), 'utf8'));
const VOCABULARY = ['Elmackflay', ...topics.map((t) => t.name)].join(', ') + '.';

const [input, name, model = 'small'] = process.argv.slice(2);
if (!input || !name) {
	console.error('Uso: npm run transcribe -- <video-o-audio> <nombre> [modelo]');
	process.exit(1);
}

mkdirSync(MODEL_DIR, {recursive: true});
await installWhisperCpp({to: WHISPER_PATH, version: WHISPER_CPP_VERSION, printOutput: false});
await downloadWhisperModel({model, folder: MODEL_DIR, printOutput: true});

// whisper.cpp necesita WAV mono a 16 kHz.
const wav = join(WHISPER_DIR, `${name}.wav`);
console.log('Extrayendo audio...');
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', input, '-ar', '16000', '-ac', '1', '-c:a', 'pcm_s16le', wav]);

console.log(`Transcribiendo con el modelo "${model}"...`);
const output = await transcribe({
	inputPath: wav,
	whisperPath: WHISPER_PATH,
	whisperCppVersion: WHISPER_CPP_VERSION,
	model,
	modelFolder: MODEL_DIR,
	tokenLevelTimestamps: true,
	language: 'es',
	splitOnWord: true,
	// Pista de vocabulario: ayuda a que escriba bien los nombres de herramientas.
	additionalArgs: [['--prompt', VOCABULARY]],
});
const {captions} = toCaptions({whisperCppOutput: output});

const outDir = join('public', 'captions');
mkdirSync(outDir, {recursive: true});
const outPath = join(outDir, `${name}.json`);
writeFileSync(outPath, JSON.stringify(captions, null, 1));
console.log(`✔ ${captions.length} palabras → ${outPath}`);
console.log('  Revisa el texto: corrige ahí cualquier palabra mal escrita antes de renderizar.');
