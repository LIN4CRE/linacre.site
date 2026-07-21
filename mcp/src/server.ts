#!/usr/bin/env node
/**
 * Linacre Tool Box — Model Context Protocol (MCP) server.
 *
 * Exposes the privacy-first developer utilities from linacre.site as MCP tools
 * so any MCP-capable AI client (Claude Desktop, Claude Code, Cursor, etc.) can
 * call them. Every tool is pure and offline: nothing you pass in leaves the
 * process, mirroring the "runs 100% locally in your browser" promise of the site.
 *
 * Transport: stdio (the standard for local AI-client integrations).
 *
 * Author: David Christopher Linacre — https://www.linacre.site
 * License: MIT
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import {
  jsonFormat,
  base64,
  jwtDecode,
  regexTest,
  hash,
  uuid,
  password,
  ukVat,
  urlClean,
  timestamp,
  textTools,
  type ToolResult,
} from './tools.js';

const VERSION = '1.0.0';

const server = new McpServer({
  name: 'linacre-toolbox',
  version: VERSION,
});

/** Adapt a pure ToolResult into an MCP tool response. */
function reply(result: ToolResult) {
  if (result.ok) {
    return { content: [{ type: 'text' as const, text: result.value }] };
  }
  return { content: [{ type: 'text' as const, text: `Error: ${result.error}` }], isError: true };
}

/* ----------------------------- Tool registry --------------------------- */

server.registerTool(
  'json_format',
  {
    title: 'JSON formatter',
    description: 'Validate, pretty-print, or minify a JSON string. Runs locally; nothing is uploaded.',
    inputSchema: {
      input: z.string().describe('The JSON text to process'),
      mode: z.enum(['pretty', 'minify', 'validate']).default('pretty').describe('pretty | minify | validate'),
      indent: z.number().int().min(0).max(8).default(2).describe('Indent size for pretty mode'),
    },
  },
  async ({ input, mode, indent }) => reply(jsonFormat(input, mode, indent)),
);

server.registerTool(
  'base64',
  {
    title: 'Base64 encoder / decoder',
    description: 'Encode text to Base64 or decode Base64 back to text. Supports URL-safe alphabet.',
    inputSchema: {
      input: z.string().describe('Text (to encode) or Base64 (to decode)'),
      mode: z.enum(['encode', 'decode']).default('encode'),
      urlSafe: z.boolean().default(false).describe('Use URL-safe alphabet (-_ , no padding)'),
    },
  },
  async ({ input, mode, urlSafe }) => reply(base64(input, mode, urlSafe)),
);

server.registerTool(
  'jwt_decode',
  {
    title: 'JWT inspector',
    description: 'Decode a JSON Web Token into its header and payload (does NOT verify the signature). Local only.',
    inputSchema: { token: z.string().describe('The JWT (header.payload.signature)') },
  },
  async ({ token }) => reply(jwtDecode(token)),
);

server.registerTool(
  'regex_test',
  {
    title: 'RegEx tester',
    description: 'Run a JavaScript regular expression against input text and return every match with its index and named groups.',
    inputSchema: {
      pattern: z.string().describe('The regular expression pattern (no slashes)'),
      input: z.string().describe('The text to test against'),
      flags: z.string().default('g').describe('Regex flags, e.g. gi, m, s'),
    },
  },
  async ({ pattern, input, flags }) => reply(regexTest(pattern, input, flags)),
);

server.registerTool(
  'hash',
  {
    title: 'Hash generator',
    description: 'Compute a cryptographic hash (sha256, sha1, sha512, md5) of the input text.',
    inputSchema: {
      input: z.string(),
      algorithm: z.enum(['sha256', 'sha1', 'sha512', 'md5']).default('sha256'),
    },
  },
  async ({ input, algorithm }) => reply(hash(input, algorithm)),
);

server.registerTool(
  'uuid_generate',
  {
    title: 'Secure UUID generator',
    description: 'Generate one or more cryptographically-random UUID v4 values.',
    inputSchema: { count: z.number().int().min(1).max(100).default(1) },
  },
  async ({ count }) => reply(uuid(count)),
);

server.registerTool(
  'password_generate',
  {
    title: 'Secure password generator',
    description: 'Generate a cryptographically-random password using the Web Crypto-equivalent CSPRNG. Ambiguous characters excluded.',
    inputSchema: {
      length: z.number().int().min(6).max(256).default(20),
      lower: z.boolean().default(true),
      upper: z.boolean().default(true),
      digits: z.boolean().default(true),
      symbols: z.boolean().default(true),
    },
  },
  async ({ length, lower, upper, digits, symbols }) => reply(password(length, { lower, upper, digits, symbols })),
);

server.registerTool(
  'uk_vat',
  {
    title: 'UK VAT calculator',
    description: 'Add VAT to a net amount, or remove VAT from a gross amount. Default rate 20%.',
    inputSchema: {
      amount: z.number().describe('The monetary amount'),
      mode: z.enum(['add', 'remove']).default('add'),
      rate: z.number().min(0).max(100).default(20).describe('VAT rate as a percentage'),
    },
  },
  async ({ amount, mode, rate }) => reply(ukVat(amount, mode, rate)),
);

server.registerTool(
  'url_clean',
  {
    title: 'URL tracking-parameter cleaner',
    description: 'Remove tracking parameters (utm_*, fbclid, gclid, and 25+ others) from a URL. Reports what was removed.',
    inputSchema: { url: z.string().describe('The URL to clean (include https://)') },
  },
  async ({ url }) => reply(urlClean(url)),
);

server.registerTool(
  'timestamp_convert',
  {
    title: 'Timestamp converter',
    description: 'Convert a Unix timestamp (seconds or ms) to ISO/UTC, or a date string to Unix time.',
    inputSchema: {
      input: z.string().describe('A Unix timestamp or a date string'),
      direction: z.enum(['to-iso', 'to-unix']).default('to-iso'),
    },
  },
  async ({ input, direction }) => reply(timestamp(input, direction)),
);

server.registerTool(
  'text_tools',
  {
    title: 'Text utilities',
    description: 'Count/transform text: stats, case changes, trim, dedupe-lines, sort-lines, reverse-lines, slugify.',
    inputSchema: {
      input: z.string(),
      operation: z
        .enum(['stats', 'uppercase', 'lowercase', 'title', 'trim', 'dedupe-lines', 'sort-lines', 'reverse-lines', 'slugify'])
        .default('stats'),
    },
  },
  async ({ input, operation }) => reply(textTools(input, operation)),
);

/* -------------------------------- Boot --------------------------------- */

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // MCP stdio servers must not write to stdout (it's the JSON-RPC channel).
  process.stderr.write(`linacre-toolbox MCP server v${VERSION} ready (11 tools, stdio)\n`);
}

main().catch((e) => {
  process.stderr.write(`Fatal: ${(e as Error).stack || e}\n`);
  process.exit(1);
});
