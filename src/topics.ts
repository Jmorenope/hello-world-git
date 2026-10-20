import type {Caption} from '@remotion/captions';
import * as simpleIcons from 'simple-icons';
import data from './topics.json';

export type Topic = {name: string; icon?: string; image?: string; aliases: string[]};
export type SimpleIcon = {title: string; slug: string; hex: string; path: string};

export type TopicHit = {
	topic: Topic;
	startMs: number;
	durationMs: number;
};

export const topics: Topic[] = data.topics;

// Cuánto dura en pantalla cada logo y cada cuánto puede repetirse el mismo.
const POPUP_MS = 2200;
const SAME_TOPIC_COOLDOWN_MS = 8000;
// Aparece un poquito antes de la palabra para que "aterrice" justo al decirla.
const LEAD_MS = 150;

const iconsBySlug = new Map<string, SimpleIcon>(
	Object.values(simpleIcons as Record<string, unknown>)
		.filter((i): i is SimpleIcon => typeof i === 'object' && i !== null && 'slug' in i && 'path' in i)
		.map((i) => [i.slug, i]),
);

export const getIcon = (slug?: string) => (slug ? iconsBySlug.get(slug) : undefined);

export const findTopic = (nameOrIcon: string) => {
	const n = normalize(nameOrIcon);
	return topics.find((t) => normalize(t.name) === n || t.icon === n || t.aliases.some((a) => normalize(a) === n));
};

/** minúsculas, sin tildes ni signos: "¡Kali Linux!" → "kali linux" */
export const normalize = (s: string) =>
	s
		.toLowerCase()
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.replace(/[^a-z0-9]+/g, ' ')
		.trim();

const levenshtein = (a: string, b: string) => {
	const row = Array.from({length: b.length + 1}, (_, i) => i);
	for (let i = 1; i <= a.length; i++) {
		let prev = row[0];
		row[0] = i;
		for (let j = 1; j <= b.length; j++) {
			const tmp = row[j];
			row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
			prev = tmp;
		}
	}
	return row[b.length];
};

// Tolera errores típicos de la transcripción ("Calilinux", "Metasploid") en nombres largos.
const sounds = (heard: string, target: string) => {
	if (heard === target) return true;
	if (target.length < 6 || Math.abs(heard.length - target.length) > 1) return false;
	return levenshtein(heard, target) <= (target.length >= 9 ? 2 : 1);
};

const squash = (s: string) => normalize(s).replace(/ /g, '');

const aliases = topics
	.flatMap((topic) =>
		topic.aliases.map((a) => ({
			topic,
			squashed: squash(a),
			words: normalize(a).split(' ').length,
			// ¿Es el nombre completo? Solo entonces se reescribe en los subtítulos ("Kalilinux" → "Kali Linux").
			isFullName: squash(a) === squash(topic.name),
		})),
	)
	.sort((a, b) => b.squashed.length - a.squashed.length);

/**
 * Busca los temas mencionados en los subtítulos. Devuelve:
 * - hits: cuándo mostrar cada logo
 * - captions: subtítulos con los nombres corregidos ("cali linux" → "Kali Linux")
 */
export const detectTopics = (captions: Caption[]): {hits: TopicHit[]; captions: Caption[]} => {
	const words = captions.map((c) => normalize(c.text));
	const found: {topic: Topic; index: number; count: number; rename: boolean}[] = [];

	for (let i = 0; i < words.length; ) {
		let match: (typeof found)[number] | null = null;
		for (const alias of aliases) {
			for (let n = 1; n <= 3 && i + n <= words.length; n++) {
				const heard = words.slice(i, i + n).join('');
				// Con errores de transcripción solo se aceptan tantas palabras como tiene el nombre,
				// para no "comerse" palabras vecinas ("de Kali Linux").
				const exact = heard === alias.squashed;
				if (exact || (n <= alias.words && sounds(heard, alias.squashed))) {
					match = {topic: alias.topic, index: i, count: n, rename: alias.isFullName || !exact};
					break;
				}
			}
			if (match) break;
		}
		if (match) {
			found.push(match);
			i += match.count;
		} else {
			i++;
		}
	}

	// Subtítulos corregidos: las palabras del tema se funden en una con el nombre oficial.
	const corrected: Caption[] = [];
	let f = 0;
	for (let i = 0; i < captions.length; i++) {
		const m = found[f];
		if (m && m.index === i && m.rename) {
			const first = captions[i];
			const last = captions[i + m.count - 1];
			const lead = first.text.match(/^\s*/)?.[0] ?? '';
			const trail = last.text.match(/[^\p{L}\p{N}]*$/u)?.[0] ?? '';
			corrected.push({...first, text: `${lead}${m.topic.name}${trail}`, endMs: last.endMs});
			i += m.count - 1;
			f++;
		} else {
			if (m && m.index === i) f++;
			corrected.push(captions[i]);
		}
	}

	const lastShown = new Map<string, number>();
	const hits: TopicHit[] = [];
	for (const m of found) {
		const startMs = Math.max(0, captions[m.index].startMs - LEAD_MS);
		const prev = lastShown.get(m.topic.name);
		if (prev !== undefined && startMs - prev < SAME_TOPIC_COOLDOWN_MS) continue;
		lastShown.set(m.topic.name, startMs);
		hits.push({topic: m.topic, startMs, durationMs: POPUP_MS});
	}
	return {hits, captions: corrected};
};

/** Une logos automáticos y manuales, y recorta los que se pisan para que salgan de a uno. */
export const scheduleLogos = (hits: TopicHit[]) => {
	const sorted = [...hits].sort((a, b) => a.startMs - b.startMs);
	return sorted.map((h, i) => {
		const next = sorted[i + 1];
		return next ? {...h, durationMs: Math.max(400, Math.min(h.durationMs, next.startMs - h.startMs))} : h;
	});
};
