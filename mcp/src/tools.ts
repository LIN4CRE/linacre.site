/**
 * Linacre Tool Box — pure, deterministic tool implementations.
 *
 * Every function here is self-contained: no network, no filesystem, no clock
 * dependency beyond what a tool explicitly needs (timestamp tools take input).
 * This mirrors the privacy-first, browser-local tools on linacre.site so the
 * exact same utilities are callable by any AI client over MCP.
 */

import { createHash, randomUUID, randomInt } from 'node:crypto';

export type ToolResult = { ok: true; value: string } | { ok: false; error: string };

const ok = (value: string): ToolResult => ({ ok: true, value });
const err = (error: string): ToolResult => ({ ok: false, error });

/* ------------------------------- JSON ---------------------------------- */

export function jsonFormat(input: string, mode: 'pretty' | 'minify' | 'validate' = 'pretty', indent = 2): ToolResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(input);
  } catch (e) {
    return err(`Invalid JSON: ${(e as Error).message}`);
  }
  if (mode === 'validate') return ok('Valid JSON.');
  if (mode === 'minify') return ok(JSON.stringify(parsed));
  return ok(JSON.stringify(parsed, null, Math.max(0, Math.min(8, indent))));
}

/* ------------------------------ Base64 --------------------------------- */

export function base64(input: string, mode: 'encode' | 'decode' = 'encode', urlSafe = false): ToolResult {
  try {
    if (mode === 'encode') {
      let out = Buffer.from(input, 'utf8').toString('base64');
      if (urlSafe) out = out.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      return ok(out);
    }
    let normalized = input.replace(/-/g, '+').replace(/_/g, '/');
    while (normalized.length % 4) normalized += '=';
    const decoded = Buffer.from(normalized, 'base64').toString('utf8');
    return ok(decoded);
  } catch (e) {
    return err(`Base64 ${mode} failed: ${(e as Error).message}`);
  }
}

/* ------------------------------- JWT ----------------------------------- */

export function jwtDecode(token: string): ToolResult {
  const parts = token.trim().split('.');
  if (parts.length !== 3) return err('Not a well-formed JWT (expected 3 dot-separated segments).');
  const decodeSeg = (seg: string) => {
    let s = seg.replace(/-/g, '+').replace(/_/g, '/');
    while (s.length % 4) s += '=';
    return Buffer.from(s, 'base64').toString('utf8');
  };
  try {
    const header = JSON.parse(decodeSeg(parts[0]));
    const payload = JSON.parse(decodeSeg(parts[1]));
    const notes: string[] = [];
    if (typeof payload.exp === 'number') {
      const expMs = payload.exp * 1000;
      notes.push(`exp: ${new Date(expMs).toISOString()} (${expMs < Date.now() ? 'EXPIRED' : 'valid'})`);
    }
    if (typeof payload.iat === 'number') notes.push(`iat: ${new Date(payload.iat * 1000).toISOString()}`);
    return ok(
      JSON.stringify(
        {
          header,
          payload,
          signature: `${parts[2].slice(0, 12)}… (not verified — decode only)`,
          notes,
        },
        null,
        2,
      ),
    );
  } catch (e) {
    return err(`Could not decode JWT: ${(e as Error).message}`);
  }
}

/* ------------------------------ RegEx ---------------------------------- */

export function regexTest(pattern: string, input: string, flags = 'g'): ToolResult {
  let re: RegExp;
  try {
    // dedupe flags, always include 'g' so we can enumerate matches
    const safeFlags = Array.from(new Set((flags + 'g').split(''))).join('').replace(/[^gimsuy]/g, '');
    re = new RegExp(pattern, safeFlags);
  } catch (e) {
    return err(`Invalid regular expression: ${(e as Error).message}`);
  }
  const matches: Array<{ match: string; index: number; groups?: Record<string, string> }> = [];
  let m: RegExpExecArray | null;
  let guard = 0;
  while ((m = re.exec(input)) !== null) {
    matches.push({ match: m[0], index: m.index, groups: m.groups ? { ...m.groups } : undefined });
    if (m.index === re.lastIndex) re.lastIndex++; // avoid zero-width infinite loop
    if (++guard > 10000) break;
  }
  return ok(JSON.stringify({ count: matches.length, matches: matches.slice(0, 500) }, null, 2));
}

/* ------------------------------- Hash ---------------------------------- */

export function hash(input: string, algorithm: 'sha256' | 'sha1' | 'sha512' | 'md5' = 'sha256'): ToolResult {
  try {
    return ok(createHash(algorithm).update(input, 'utf8').digest('hex'));
  } catch (e) {
    return err(`Hashing failed: ${(e as Error).message}`);
  }
}

/* ------------------------------- UUID ---------------------------------- */

export function uuid(count = 1): ToolResult {
  const n = Math.max(1, Math.min(100, Math.floor(count)));
  return ok(Array.from({ length: n }, () => randomUUID()).join('\n'));
}

/* ----------------------------- Password -------------------------------- */

export function password(
  length = 20,
  opts: { lower?: boolean; upper?: boolean; digits?: boolean; symbols?: boolean } = {},
): ToolResult {
  const { lower = true, upper = true, digits = true, symbols = true } = opts;
  let pool = '';
  if (lower) pool += 'abcdefghijkmnpqrstuvwxyz';
  if (upper) pool += 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  if (digits) pool += '23456789';
  if (symbols) pool += '!@#$%^&*()-_=+[]{};:,.?';
  if (!pool) return err('Select at least one character class.');
  const len = Math.max(6, Math.min(256, Math.floor(length)));
  let out = '';
  for (let i = 0; i < len; i++) out += pool[randomInt(0, pool.length)];
  return ok(out);
}

/* ------------------------------ UK VAT --------------------------------- */

export function ukVat(amount: number, mode: 'add' | 'remove' = 'add', rate = 20): ToolResult {
  if (!Number.isFinite(amount)) return err('Amount must be a number.');
  const r = rate / 100;
  const round = (n: number) => Math.round(n * 100) / 100;
  if (mode === 'add') {
    const vat = round(amount * r);
    return ok(JSON.stringify({ net: round(amount), vat, gross: round(amount + vat), rate: `${rate}%` }, null, 2));
  }
  const net = round(amount / (1 + r));
  return ok(JSON.stringify({ gross: round(amount), vat: round(amount - net), net, rate: `${rate}%` }, null, 2));
}

/* ---------------------------- URL cleaner ------------------------------ */

const TRACKING_PARAMS = [
  /^utm_/i, /^fbclid$/i, /^gclid$/i, /^dclid$/i, /^gclsrc$/i, /^msclkid$/i, /^mc_(cid|eid)$/i,
  /^igshid$/i, /^ncid$/i, /^ref$/i, /^ref_src$/i, /^ref_url$/i, /^_hsenc$/i, /^_hsmi$/i,
  /^vero_(id|conv)$/i, /^oly_(anon|enc)_id$/i, /^wickedid$/i, /^yclid$/i, /^twclid$/i,
  /^_openstat$/i, /^spm$/i, /^scm$/i, /^__s$/i, /^s_kwcid$/i, /^gbraid$/i, /^wbraid$/i,
];

export function urlClean(url: string): ToolResult {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return err('Invalid URL (include the scheme, e.g. https://).');
  }
  const removed: string[] = [];
  for (const key of [...u.searchParams.keys()]) {
    if (TRACKING_PARAMS.some((re) => re.test(key))) {
      u.searchParams.delete(key);
      removed.push(key);
    }
  }
  return ok(JSON.stringify({ cleaned: u.toString(), removed }, null, 2));
}

/* --------------------------- Timestamp --------------------------------- */

export function timestamp(input: string, direction: 'to-iso' | 'to-unix' = 'to-iso'): ToolResult {
  if (direction === 'to-iso') {
    const n = Number(input);
    if (!Number.isFinite(n)) return err('Provide a Unix timestamp (seconds or ms).');
    const ms = Math.abs(n) < 1e12 ? n * 1000 : n; // heuristic: <1e12 → seconds
    const d = new Date(ms);
    if (isNaN(d.getTime())) return err('Timestamp out of range.');
    return ok(JSON.stringify({ iso: d.toISOString(), utc: d.toUTCString(), unix_s: Math.floor(ms / 1000), unix_ms: ms }, null, 2));
  }
  const d = new Date(input);
  if (isNaN(d.getTime())) return err('Provide a parseable date/time string (ISO 8601 preferred).');
  return ok(JSON.stringify({ unix_s: Math.floor(d.getTime() / 1000), unix_ms: d.getTime(), iso: d.toISOString() }, null, 2));
}

/* ---------------------------- Text tools ------------------------------- */

export function textTools(
  input: string,
  operation: 'stats' | 'uppercase' | 'lowercase' | 'title' | 'trim' | 'dedupe-lines' | 'sort-lines' | 'reverse-lines' | 'slugify',
): ToolResult {
  switch (operation) {
    case 'stats': {
      const words = (input.trim().match(/\S+/g) || []).length;
      const lines = input.length ? input.split(/\r\n|\r|\n/).length : 0;
      return ok(JSON.stringify({ characters: input.length, charactersNoSpaces: input.replace(/\s/g, '').length, words, lines }, null, 2));
    }
    case 'uppercase':
      return ok(input.toUpperCase());
    case 'lowercase':
      return ok(input.toLowerCase());
    case 'title':
      return ok(input.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()));
    case 'trim':
      return ok(input.split(/\r?\n/).map((l) => l.trim()).join('\n').trim());
    case 'dedupe-lines': {
      const seen = new Set<string>();
      const out = input.split(/\r?\n/).filter((l) => (seen.has(l) ? false : (seen.add(l), true)));
      return ok(out.join('\n'));
    }
    case 'sort-lines':
      return ok(input.split(/\r?\n/).sort((a, b) => a.localeCompare(b)).join('\n'));
    case 'reverse-lines':
      return ok(input.split(/\r?\n/).reverse().join('\n'));
    case 'slugify':
      return ok(
        input
          .normalize('NFKD')
          .replace(/[̀-ͯ]/g, '')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, ''),
      );
    default:
      return err(`Unknown operation: ${operation}`);
  }
}
