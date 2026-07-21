# Linacre Tool Box — MCP Server

Exposes the privacy‑first developer utilities from **[linacre.site](https://www.linacre.site)** as
[Model Context Protocol](https://modelcontextprotocol.io) tools, so any MCP‑capable AI client
(Claude Desktop, Claude Code, Cursor, Windsurf, …) can call them directly.

Every tool is **pure and offline** — no network, no filesystem, deterministic output. Nothing you
pass in leaves the process, mirroring the "runs 100% locally in your browser" promise of the site.

## Tools (11)

| Tool | What it does |
|------|--------------|
| `json_format` | Validate / pretty‑print / minify JSON |
| `base64` | Encode & decode Base64 (URL‑safe optional) |
| `jwt_decode` | Decode a JWT's header + payload (no signature verify) |
| `regex_test` | Run a regex over text; return matches, indices, named groups |
| `hash` | sha256 / sha1 / sha512 / md5 of input |
| `uuid_generate` | 1–100 cryptographically‑random UUID v4s |
| `password_generate` | CSPRNG password, configurable character classes |
| `uk_vat` | Add or remove UK VAT (default 20%) |
| `url_clean` | Strip `utm_*`, `fbclid`, `gclid`, +25 tracking params |
| `timestamp_convert` | Unix ⇄ ISO/UTC |
| `text_tools` | stats, case, trim, dedupe/sort/reverse lines, slugify |

## Install & build

```bash
cd mcp
npm install
npm run build     # → dist/server.js
```

## Use it from Claude Desktop

Add to your `claude_desktop_config.json`
(macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`,
Windows: `%APPDATA%\Claude\claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "linacre-toolbox": {
      "command": "node",
      "args": ["D:\\LIN4CRE\\linacre-site-repo\\mcp\\dist\\server.js"]
    }
  }
}
```

Restart Claude Desktop. You'll see the 11 tools under the 🔌 menu.

## Use it from Claude Code / Cowork

```bash
claude mcp add linacre-toolbox -- node /absolute/path/to/mcp/dist/server.js
```

Or drop a `.mcp.json` in your project root (see `mcp/claude/.mcp.json` in this repo).

## Publish (optional)

The package is set up to publish to npm as `@linacre/toolbox-mcp` with a `bin`, so anyone could run
it with `npx -y @linacre/toolbox-mcp`. Run `npm publish --access public` from `mcp/` when ready.

## Verify

```bash
node test-harness.mjs   # 18 assertions across all 11 tools
```

## License

MIT © David Christopher Linacre
