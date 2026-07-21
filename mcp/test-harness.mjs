// Minimal MCP stdio client: initialize, list tools, call a few, assert results.
import { spawn } from 'node:child_process';

const child = spawn('node', ['dist/server.js'], { stdio: ['pipe', 'pipe', 'inherit'] });
let buf = '';
const pending = new Map();

child.stdout.on('data', (d) => {
  buf += d.toString();
  let i;
  while ((i = buf.indexOf('\n')) >= 0) {
    const line = buf.slice(0, i).trim();
    buf = buf.slice(i + 1);
    if (!line) continue;
    let msg;
    try { msg = JSON.parse(line); } catch { continue; }
    if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); }
  }
});

let id = 0;
function rpc(method, params) {
  return new Promise((resolve) => {
    const _id = ++id;
    pending.set(_id, resolve);
    child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id: _id, method, params }) + '\n');
  });
}
function notify(method, params) {
  child.stdin.write(JSON.stringify({ jsonrpc: '2.0', method, params }) + '\n');
}

const out = (r) => r?.result?.content?.[0]?.text;
let failures = 0;
function check(name, cond, detail) {
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}${cond ? '' : '  -> ' + detail}`);
  if (!cond) failures++;
}

const init = await rpc('initialize', {
  protocolVersion: '2024-11-05',
  capabilities: {},
  clientInfo: { name: 'harness', version: '0' },
});
check('initialize returns serverInfo', init?.result?.serverInfo?.name === 'linacre-toolbox', JSON.stringify(init));
notify('notifications/initialized', {});

const list = await rpc('tools/list', {});
const names = (list?.result?.tools || []).map((t) => t.name).sort();
check('lists 11 tools', names.length === 11, names.join(','));
console.log('     tools:', names.join(', '));

const call = (name, args) => rpc('tools/call', { name, arguments: args });

check('json_format minify', out(await call('json_format', { input: '{ "a":  1 }', mode: 'minify' })) === '{"a":1}');
check('json_format invalid → isError', (await call('json_format', { input: '{bad' })).result?.isError === true);
check('base64 encode', out(await call('base64', { input: 'hello', mode: 'encode' })) === 'aGVsbG8=');
check('base64 decode roundtrip', out(await call('base64', { input: 'aGVsbG8=', mode: 'decode' })) === 'hello');
{
  const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMiLCJuYW1lIjoiQXZhIn0.sig';
  const r = out(await call('jwt_decode', { token: jwt }));
  check('jwt_decode payload', r.includes('"name": "Ava"'), r);
}
{
  const r = JSON.parse(out(await call('regex_test', { pattern: '\\d+', input: 'a1b22c333', flags: 'g' })));
  check('regex_test count=3', r.count === 3, JSON.stringify(r));
}
check('hash sha256 known vector',
  out(await call('hash', { input: 'abc', algorithm: 'sha256' })) === 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
{
  const u = out(await call('uuid_generate', { count: 3 })).split('\n');
  check('uuid_generate 3 valid v4', u.length === 3 && u.every((x) => /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(x)), u.join('|'));
}
{
  const p = out(await call('password_generate', { length: 24, symbols: false }));
  check('password length 24, no symbols', p.length === 24 && /^[A-Za-z0-9]+$/.test(p), p);
}
{
  const r = JSON.parse(out(await call('uk_vat', { amount: 100, mode: 'add' })));
  check('uk_vat add 20%: gross 120', r.gross === 120 && r.vat === 20, JSON.stringify(r));
  const r2 = JSON.parse(out(await call('uk_vat', { amount: 120, mode: 'remove' })));
  check('uk_vat remove 20%: net 100', r2.net === 100, JSON.stringify(r2));
}
{
  const r = JSON.parse(out(await call('url_clean', { url: 'https://x.io/a?id=5&utm_source=n&fbclid=z' })));
  check('url_clean strips utm+fbclid keeps id', r.cleaned === 'https://x.io/a?id=5' && r.removed.includes('utm_source') && r.removed.includes('fbclid'), JSON.stringify(r));
}
{
  const r = JSON.parse(out(await call('timestamp_convert', { input: '0', direction: 'to-iso' })));
  check('timestamp 0 → epoch', r.iso === '1970-01-01T00:00:00.000Z', JSON.stringify(r));
}
check('text_tools slugify', out(await call('text_tools', { input: 'Hello, World! 2026', operation: 'slugify' })) === 'hello-world-2026');
{
  const r = JSON.parse(out(await call('text_tools', { input: 'a\nb\na', operation: 'stats' })));
  check('text_tools stats lines=3', r.lines === 3, JSON.stringify(r));
}

child.kill();
console.log(`\n${failures === 0 ? '✅ ALL PASS' : '❌ ' + failures + ' FAILURES'}`);
process.exit(failures === 0 ? 0 : 1);
