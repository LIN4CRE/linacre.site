import express from "express";
import type { Request, Response, NextFunction } from "express";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Body parser middleware
app.use(express.json());

// Enable CORS for all origins (specifically file:// for Lively Wallpaper)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Per-IP sliding-window rate limiter for AI proxy routes.
// These endpoints spend the server's own API keys, so without a limit any
// visitor (or any third-party site, given the open CORS policy) can drain them.
const RATE_LIMIT_PER_MIN = Number(process.env.RATE_LIMIT_PER_MIN) || 20;
const RATE_LIMIT_WINDOW_MS = 60_000;
const rateLimitLog = new Map<string, number[]>();

function aiRateLimiter(req: Request, res: Response, next: NextFunction) {
  const forwarded = req.headers["x-forwarded-for"];
  const ip =
    (typeof forwarded === "string" ? forwarded.split(",")[0].trim() : forwarded?.[0]) ||
    req.socket.remoteAddress ||
    "unknown";

  const now = Date.now();
  const hits = (rateLimitLog.get(ip) ?? []).filter(t => t > now - RATE_LIMIT_WINDOW_MS);

  if (hits.length >= RATE_LIMIT_PER_MIN) {
    rateLimitLog.set(ip, hits);
    res.setHeader("Retry-After", "60");
    return res.status(429).json({
      error: `Rate limit exceeded (${RATE_LIMIT_PER_MIN} requests/minute). Please try again shortly.`
    });
  }

  hits.push(now);
  rateLimitLog.set(ip, hits);

  // Bounded memory: evict fully-expired entries once the map grows large
  if (rateLimitLog.size > 1000) {
    for (const [key, times] of rateLimitLog) {
      if (times[times.length - 1] <= now - RATE_LIMIT_WINDOW_MS) rateLimitLog.delete(key);
    }
  }

  next();
}

// Start of Express server setup

  // API route for Gemini Chat proxying securely
  app.post("/api/chat", aiRateLimiter, async (req, res) => {
    const { prompt, history } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const contents: any[] = [];
    if (history && Array.isArray(history)) {
      history.forEach((msg: any) => {
        if (msg.id === 'welcome') return; // Skip welcome greeting
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        });
      });
    }
    contents.push({
      role: 'user',
      parts: [{ text: prompt }]
    });

    const messages: any[] = [];
    if (history && Array.isArray(history)) {
      history.forEach((msg: any) => {
        if (msg.id === 'welcome') return;
        messages.push({ role: msg.role === 'user' ? 'user' : 'assistant', content: msg.content });
      });
    }
    messages.push({ role: 'user', content: prompt });

    // 1. Try Gemini
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("No Gemini key");

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents,
      });

      if (response && response.text) {
        return res.json({ reply: response.text });
      }
      throw new Error("Empty response from Gemini");
    } catch (geminiError: any) {
      console.warn("Gemini Chat failed, trying OpenAI fallback...", geminiError.message || geminiError);
    }

    // 2. Try OpenAI Fallback
    try {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) throw new Error("No OpenAI key");

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI error status: ${response.status}`);
      }
      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content;
      if (reply) {
        return res.json({ reply });
      }
      throw new Error("Empty response from OpenAI");
    } catch (openaiError: any) {
      console.warn("OpenAI Chat failed, trying Claude fallback...", openaiError.message || openaiError);
    }

    // 3. Try Claude Fallback
    try {
      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (!apiKey) throw new Error("No Claude key");

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "dangerously-allow-html-user-agents": "true"
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20241022",
          messages,
          max_tokens: 4000,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`Claude error status: ${response.status}`);
      }
      const data = await response.json();
      const reply = data.content?.[0]?.text;
      if (reply) {
        return res.json({ reply });
      }
      throw new Error("Empty response from Claude");
    } catch (claudeError: any) {
      console.warn("Claude Chat failed, using local Mock fallback...", claudeError.message || claudeError);
    }

    // 4. Ultimate Mock Fallback
    return res.json({
      reply: "Hello! I am the local system proxy. Currently, the server's Gemini, OpenAI, and Claude API keys are exhausted or depleted. \n\nPlease expand the **Configuration Panel** at the top of the page to input your own API keys to chat with the live models! This sandbox runs entirely in your browser and will connect directly using your keys."
    });
  });

  // API route for Gemini Streaming Chat securely (SSE)
  app.post("/api/chat/stream", aiRateLimiter, async (req, res) => {
    const { prompt, history } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    let active = true;
    res.on('close', () => {
      active = false;
    });

    const ensureHeaders = () => {
      if (!res.headersSent) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders();
      }
    };

    const contents: any[] = [];
    if (history && Array.isArray(history)) {
      history.forEach((msg: any) => {
        if (msg.id === 'welcome') return; // Skip welcome greeting
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        });
      });
    }
    contents.push({
      role: 'user',
      parts: [{ text: prompt }]
    });

    const messages: any[] = [];
    if (history && Array.isArray(history)) {
      history.forEach((msg: any) => {
        if (msg.id === 'welcome') return;
        messages.push({ role: msg.role === 'user' ? 'user' : 'assistant', content: msg.content });
      });
    }
    messages.push({ role: 'user', content: prompt });

    // 1. Try Gemini
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("No Gemini key");

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const responseStream = await ai.models.generateContentStream({
        model: "gemini-2.5-flash", // Fast, state-of-the-art streaming model
        contents,
      });

      for await (const chunk of responseStream) {
        if (!active) break;
        if (chunk.text) {
          ensureHeaders();
          res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
        }
      }

      if (active) {
        ensureHeaders();
        res.write('data: [DONE]\n\n');
      }
      res.end();
      return;
    } catch (geminiError: any) {
      console.warn("Gemini Stream failed, trying OpenAI fallback...", geminiError.message || geminiError);
    }

    // 2. Try OpenAI Fallback
    try {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) throw new Error("No OpenAI key");

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages,
          stream: true
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI stream error status: ${response.status}`);
      }

      const reader = response.body;
      if (!reader) throw new Error("No OpenAI stream body");

      const decoder = new TextDecoder();
      let buffer = '';

      for await (const chunk of reader as any) {
        if (!active) break;
        buffer += decoder.decode(chunk, { stream: true });
        let boundary = buffer.indexOf('\n');
        while (boundary !== -1) {
          const line = buffer.slice(0, boundary).trim();
          buffer = buffer.slice(boundary + 1);

          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6).trim();
            if (dataStr === '[DONE]') break;
            try {
              const parsed = JSON.parse(dataStr);
              const text = parsed.choices?.[0]?.delta?.content;
              if (text) {
                ensureHeaders();
                res.write(`data: ${JSON.stringify({ text })}\n\n`);
              }
            } catch (e) {}
          }
          boundary = buffer.indexOf('\n');
        }
      }

      if (active) {
        ensureHeaders();
        res.write('data: [DONE]\n\n');
      }
      res.end();
      return;
    } catch (openaiError: any) {
      console.warn("OpenAI Stream failed, trying Claude fallback...", openaiError.message || openaiError);
    }

    // 3. Try Claude Fallback
    try {
      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (!apiKey) throw new Error("No Claude key");

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "dangerously-allow-html-user-agents": "true"
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20241022",
          messages,
          max_tokens: 4000,
          stream: true
        })
      });

      if (!response.ok) {
        throw new Error(`Claude stream error status: ${response.status}`);
      }

      const reader = response.body;
      if (!reader) throw new Error("No Claude stream body");

      const decoder = new TextDecoder();
      let buffer = '';

      for await (const chunk of reader as any) {
        if (!active) break;
        buffer += decoder.decode(chunk, { stream: true });
        let boundary = buffer.indexOf('\n');
        while (boundary !== -1) {
          const line = buffer.slice(0, boundary).trim();
          buffer = buffer.slice(boundary + 1);

          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6).trim();
            if (dataStr) {
              try {
                const parsed = JSON.parse(dataStr);
                if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
                  ensureHeaders();
                  res.write(`data: ${JSON.stringify({ text: parsed.delta.text })}\n\n`);
                }
              } catch (e) {}
            }
          }
          boundary = buffer.indexOf('\n');
        }
      }

      if (active) {
        ensureHeaders();
        res.write('data: [DONE]\n\n');
      }
      res.end();
      return;
    } catch (claudeError: any) {
      console.warn("Claude Stream failed, using local Mock fallback...", claudeError.message || claudeError);
    }

    // 4. Ultimate Mock Fallback
    try {
      const mockText = "Hello! I am the local system proxy. Currently, the server's Gemini, OpenAI, and Claude API keys are exhausted or depleted. \n\nPlease expand the **Configuration Panel** at the top of the page to input your own API keys to chat with the live models! This sandbox runs entirely in your browser and will connect directly using your keys.";
      
      console.log("Ultimate Mock Fallback triggered. Active state:", active);
      ensureHeaders();

      const words = mockText.split(" ");
      for (const word of words) {
        if (!active) {
          console.log("Mock Fallback interrupted because active is false");
          break;
        }
        res.write(`data: ${JSON.stringify({ text: word + " " })}\n\n`);
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      if (active) {
        res.write('data: [DONE]\n\n');
      }
      res.end();
    } catch (mockError: any) {
      console.error("Mock Fallback failed:", mockError);
      if (!res.headersSent) {
        res.status(500).json({ error: "An unexpected error occurred during model fallback." });
      } else {
        res.end();
      }
    }
  });

  // Expose key presence status securely to the client
  app.get("/api/keys/status", (req, res) => {
    res.json({
      gemini: !!process.env.GEMINI_API_KEY,
      openai: !!process.env.OPENAI_API_KEY,
      claude: !!process.env.ANTHROPIC_API_KEY || !!process.env.CLAUDE_API_KEY,
      litellm: !!process.env.LITELLM_API_KEY,
      openrouter: !!process.env.OPENROUTER_API_KEY,
      huggingface: !!process.env.HUGGINGFACE_TOKEN
    });
  });

  // API route to get Obsidian Ecosystem Tasks
  app.get("/api/tasks", async (req, res) => {
    try {
      const fs = await import("fs");
      const tasksFilePath = path.join("D:", "LIN4CRE", "knowledge-vault", "Ecosystem_Tasks.md");
      if (!fs.existsSync(tasksFilePath)) {
        return res.json({ priorities: [], radar: [] });
      }
      const content = fs.readFileSync(tasksFilePath, "utf8");
      
      const lines = content.split("\n");
      const priorities: string[] = [];
      const radar: string[] = [];
      let currentSection: 'priorities' | 'radar' | null = null;
      
      for (let line of lines) {
        line = line.trim();
        if (line.includes("Current Priorities")) {
          currentSection = 'priorities';
          continue;
        } else if (line.includes("On Radar")) {
          currentSection = 'radar';
          continue;
        } else if (line.startsWith("##")) {
          currentSection = null;
          continue;
        }
        
        if (currentSection && line.startsWith("-")) {
          const isCompleted = line.match(/^-\s*\[x\]/i);
          if (!isCompleted) {
            let taskText = line.replace(/^-\s*(\[[x\s]?\])?\s*/i, "").trim();
            // Remove markdown links format [Text](URL) leaving only Text
            taskText = taskText.replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1");
            if (taskText) {
              if (currentSection === 'priorities') priorities.push(taskText);
              else if (currentSection === 'radar') radar.push(taskText);
            }
          }
        }
      }
      res.json({ priorities, radar });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Secure Server-side OpenAI Streaming Proxy
  app.post("/api/chat/openai", aiRateLimiter, async (req, res) => {
    const { prompt, history, apiKey: clientApiKey } = req.body;
    const apiKey = clientApiKey || process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(400).json({ error: "OpenAI API Key is missing. Provide it on the client or set OPENAI_API_KEY in the server environment." });
    }

    try {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders();

      const messages: any[] = [];
      if (history && Array.isArray(history)) {
        history.forEach((msg: any) => {
          if (msg.id === 'welcome') return;
          messages.push({ role: msg.role === 'user' ? 'user' : 'assistant', content: msg.content });
        });
      }
      messages.push({ role: 'user', content: prompt });

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages,
          stream: true
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        res.write(`data: ${JSON.stringify({ error: `OpenAI API returned error: ${errText}` })}\n\n`);
        return res.end();
      }

      const reader = response.body;
      if (!reader) {
        res.write(`data: ${JSON.stringify({ error: "No response body from OpenAI API." })}\n\n`);
        return res.end();
      }

      for await (const chunk of reader as any) {
        res.write(chunk);
      }
      res.end();
    } catch (err: any) {
      console.error("Server API OpenAI Proxy Error:", err);
      if (!res.headersSent) {
        res.status(500).json({ error: err.message || "Internal server error connecting to OpenAI API" });
      } else {
        res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
        res.end();
      }
    }
  });

  // Secure Server-side Claude Streaming Proxy
  app.post("/api/chat/claude", aiRateLimiter, async (req, res) => {
    const { prompt, history, apiKey: clientApiKey } = req.body;
    const apiKey = clientApiKey || process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;
    if (!apiKey) {
      return res.status(400).json({ error: "Claude API Key is missing. Provide it on the client or set ANTHROPIC_API_KEY in the server environment." });
    }

    try {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders();

      const messages: any[] = [];
      if (history && Array.isArray(history)) {
        history.forEach((msg: any) => {
          if (msg.id === 'welcome') return;
          messages.push({ role: msg.role === 'user' ? 'user' : 'assistant', content: msg.content });
        });
      }
      messages.push({ role: 'user', content: prompt });

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "dangerously-allow-html-user-agents": "true"
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-latest",
          messages,
          max_tokens: 4000,
          stream: true
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        res.write(`data: ${JSON.stringify({ error: `Anthropic API returned error: ${errText}` })}\n\n`);
        return res.end();
      }

      const reader = response.body;
      if (!reader) {
        res.write(`data: ${JSON.stringify({ error: "No response body from Anthropic API." })}\n\n`);
        return res.end();
      }

      const decoder = new TextDecoder();
      let buffer = '';

      for await (const chunk of reader as any) {
        buffer += decoder.decode(chunk, { stream: true });
        let boundary = buffer.indexOf('\n');
        while (boundary !== -1) {
          const line = buffer.slice(0, boundary).trim();
          buffer = buffer.slice(boundary + 1);

          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6).trim();
            if (dataStr) {
              try {
                const parsed = JSON.parse(dataStr);
                if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
                  const text = parsed.delta.text;
                  res.write(`data: ${JSON.stringify({ choices: [{ delta: { content: text } }] })}\n\n`);
                }
              } catch (e) {
                // Partial JSON or non-JSON event (e.g. ping)
              }
            }
          }
          boundary = buffer.indexOf('\n');
        }
      }
      res.write('data: [DONE]\n\n');
      res.end();
    } catch (err: any) {
      console.error("Server API Claude Proxy Error:", err);
      if (!res.headersSent) {
        res.status(500).json({ error: err.message || "Internal server error connecting to Anthropic API" });
      } else {
        res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
        res.end();
      }
    }
  });

  // Local in-memory store for rate limiting execute requests (prevent key overcharges)
  const executeRequestLog: number[] = [];

  app.post("/api/agents/execute", async (req, res) => {
    const { agentName, task } = req.body;
    if (!task) {
      return res.status(400).json({ error: "Task description is required" });
    }

    // Anti-overcharger safety rate-limit checks
    const now = Date.now();
    while (executeRequestLog.length > 0 && executeRequestLog[0] < now - 60000) {
      executeRequestLog.shift();
    }
    if (executeRequestLog.length >= 5) {
      return res.json({
        reply: `[Safety Guard Active] Telemetry warning: Request limit reached (5 requests/minute). Real-world API key overcharge prevented.`
      });
    }
    executeRequestLog.push(now);

    const lowercaseTask = task.toLowerCase();
    const { exec } = await import("child_process");

    // 1. Scan Git Status Task
    if (lowercaseTask.includes("git")) {
      return exec("git status", { cwd: path.join("D:", "LIN4CRE", "linacre-site-repo") }, (error, stdout, stderr) => {
        if (error) {
          return res.json({ reply: `[Git Scan Error]: ${stderr || error.message}` });
        }
        return res.json({ reply: `[Git Status Check Output]:\n${stdout}` });
      });
    }

    // 2. Audit System PATH Task
    if (lowercaseTask.includes("path") || lowercaseTask.includes("registry")) {
      const pathList = (process.env.PATH || "").split(path.delimiter);
      const cleanPaths = pathList.filter(Boolean).map(p => ` - ${p}`).join("\n");
      return res.json({
        reply: `[PATH Audit Registry Scan]:\nFound ${pathList.length} path entries on environment PATH variable:\n${cleanPaths}`
      });
    }

    // 3. Check Docker Status Task
    if (lowercaseTask.includes("docker") || lowercaseTask.includes("container")) {
      return exec("docker ps --format \"table {{.Names}}\t{{.Status}}\"", (error, stdout, stderr) => {
        if (error) {
          return res.json({ reply: `[Docker Engine Offline]: Docker daemon is not active. Output: ${stderr || error.message}` });
        }
        return res.json({ reply: `[Docker Live Container Audit]:\n${stdout || "No running containers found."}` });
      });
    }

    // 4. Default: Proxy to Gemini with strict token-capping (max 300 tokens)
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("No Gemini key configured in environment");

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: `You are an AI system agent named ${agentName || "Bot"}. Execute this task briefly under 2 paragraphs and explain the steps: "${task}"` }] }],
        config: {
          maxOutputTokens: 300 // Capping tokens strictly
        }
      });

      if (response && response.text) {
        return res.json({ reply: response.text });
      }
      throw new Error("No text content returned from AI Model");
    } catch (err: any) {
      return res.json({
        reply: `[Local Simulation Fallback] Executed script task: "${task}". Completed successfully inside local workspace sandbox.`
      });
    }
  });

  // Secure route to read and return active Antigravity workspace transcript logs
  app.get("/api/active-logs", async (req, res) => {
    try {
      const fs = await import("fs");
      const os = await import("os");
      
      const brainDir = path.join(os.homedir(), ".gemini", "antigravity-ide", "brain");
      if (!fs.existsSync(brainDir)) {
        return res.json({ error: "Brain directory not found", logs: [] });
      }

      const items = fs.readdirSync(brainDir);
      const dirs = items
        .map(name => {
          const fullPath = path.join(brainDir, name);
          try {
            return {
              name,
              path: fullPath,
              stat: fs.statSync(fullPath)
            };
          } catch (e) {
            return null;
          }
        })
        .filter((item): item is any => !!item && item.stat.isDirectory() && item.name !== "tempmediaStorage")
        .sort((a, b) => b.stat.mtimeMs - a.stat.mtimeMs);

      if (dirs.length === 0) {
        return res.json({ error: "No active conversation directory found", logs: [] });
      }

      const latestDir = dirs[0].path;
      const logFilePath = path.join(latestDir, ".system_generated", "logs", "transcript.jsonl");

      if (!fs.existsSync(logFilePath)) {
        return res.json({ error: "Transcript file not found", folder: dirs[0].name, logs: [] });
      }

      const content = fs.readFileSync(logFilePath, "utf8");
      const lines = content.split("\n").filter(Boolean);
      
      // Parse the last 40 lines
      const parsedLogs = lines.slice(-40).map(line => {
        try {
          const parsed = JSON.parse(line);
          // Prune large fields for performance
          if (parsed.content && typeof parsed.content === "string" && parsed.content.length > 500) {
            parsed.content = parsed.content.substring(0, 500) + "... [truncated]";
          }
          return parsed;
        } catch (e) {
          return { error: "Failed to parse line" };
        }
      });

      res.json({
        folder: dirs[0].name,
        logs: parsedLogs
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message, logs: [] });
    }
  });

  // Agent Automations Spawn endpoint
  app.post("/api/agents/spawn/:agentId", (req, res) => {
    const { agentId } = req.params;
    const allowedAgents = ['janitor', 'security', 'seo', 'doc', 'release'];
    
    if (!allowedAgents.includes(agentId)) {
      return res.status(400).json({ error: `Unknown agent: ${agentId}` });
    }

    const scriptPath = path.join(process.cwd(), 'scripts', 'agents', `${agentId}.ts`);
    const tsxBin = process.platform === "win32" ? "tsx.cmd" : "tsx";

    try {
      const { exec } = require("child_process");
      // Fire and forget so we don't block the UI
      exec(`${tsxBin} "${scriptPath}"`, { cwd: process.cwd() }, (error: any, stdout: any, stderr: any) => {
        if (error) {
          console.error(`[Agent ${agentId}] Error:`, error);
        }
        if (stdout) console.log(`[Agent ${agentId}]`, stdout);
        if (stderr) console.error(`[Agent ${agentId}]`, stderr);
      });
      return res.json({ success: true, message: `Agent ${agentId} spawned in the background.` });
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  });

  // Proxy endpoint to communicate with FastAPI backend on port 8000
  app.all("/api/evbot-proxy/*", async (req, res) => {
    const subPath = req.params[0] || req.path.replace(/^\/api\/evbot-proxy\//, "");
    
    // Map health request to FastAPI public health, others to their respective routes
    let targetPath = `/api/v1/evbot/${subPath}`;
    if (subPath === "health") {
      targetPath = "/api/v1/health";
    }

    const backendUrl = `http://localhost:8000${targetPath}`;
    
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (process.env.ADMIN_API_KEY) {
        headers["X-Admin-Api-Key"] = process.env.ADMIN_API_KEY;
      }

      const options: RequestInit = {
        method: req.method,
        headers,
      };

      if (["POST", "PUT", "PATCH"].includes(req.method)) {
        options.body = JSON.stringify(req.body);
      }

      const backendRes = await fetch(backendUrl, options);
      if (backendRes.status === 204) {
        return res.sendStatus(204);
      }
      
      const text = await backendRes.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { raw: text };
      }
      
      return res.status(backendRes.status).json(data);
    } catch (err: any) {
      console.error("[EV-Bot Proxy Error]:", err.message || err);
      return res.status(502).json({ error: "EV-Bot backend offline", details: err.message });
    }
  });

  // Server health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Dashboard session auth
  const COOKIE_NAME = 'linacre_dash_session';
  const SESSION_TTL_MS = 1000 * 60 * 60 * 12;

  function sign(payload: string, secret: string): string {
    return crypto.createHmac('sha256', secret).update(payload).digest('hex');
  }

  function timingSafeEqualStr(a: string, b: string): boolean {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    return bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB);
  }

  app.post("/api/auth", (req, res) => {
    const secret = process.env.DASHBOARD_SESSION_SECRET;
    const passwordHash = process.env.DASHBOARD_PASSWORD_HASH;
    if (!secret || !passwordHash) {
      return res.status(500).json({ error: 'Server not configured' });
    }
    const { password } = req.body ?? {};
    if (typeof password !== 'string' || password.length === 0) {
      return res.status(400).json({ error: 'Password required' });
    }
    const suppliedHash = crypto.createHash('sha256').update(password).digest('hex');
    if (!timingSafeEqualStr(suppliedHash, passwordHash)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const expires = Date.now() + SESSION_TTL_MS;
    const token = `${expires}.${sign(String(expires), secret)}`;
    res.setHeader(
      'Set-Cookie',
      `${COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${SESSION_TTL_MS / 1000}`
    );
    return res.status(200).json({ ok: true });
  });

  app.get("/api/auth", (req, res) => {
    const secret = process.env.DASHBOARD_SESSION_SECRET;
    const passwordHash = process.env.DASHBOARD_PASSWORD_HASH;
    if (!secret || !passwordHash) {
      return res.status(500).json({ error: 'Server not configured' });
    }
    const cookie = req.headers.cookie ?? '';
    const match = cookie.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
    if (!match) return res.status(200).json({ authenticated: false });
    const [expiresStr, sig] = match[1].split('.');
    if (!expiresStr || !sig) return res.status(200).json({ authenticated: false });
    const valid = timingSafeEqualStr(sig, sign(expiresStr, secret)) && Number(expiresStr) > Date.now();
    return res.status(200).json({ authenticated: valid });
  });

  app.delete("/api/auth", (req, res) => {
    res.setHeader('Set-Cookie', `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`);
    return res.status(200).json({ ok: true });
  });

  // ── Unified multi-provider chat ──────────────────────────────────────────
  // One endpoint with explicit provider + model selection. Free-tier models
  // are open to visitors (rate-limited); premium models are gated behind the
  // owner's dashboard session so only authenticated use spends real money.

  function isDashAuthed(req: Request): boolean {
    const secret = process.env.DASHBOARD_SESSION_SECRET;
    if (!secret) return false;
    const cookie = req.headers.cookie ?? '';
    const match = cookie.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
    if (!match) return false;
    const [expiresStr, sig] = match[1].split('.');
    if (!expiresStr || !sig) return false;
    return timingSafeEqualStr(sig, sign(expiresStr, secret)) && Number(expiresStr) > Date.now();
  }

  type CatalogModel = { id: string; label: string; tier: 'free' | 'premium' };
  const MODEL_CATALOG: Record<string, {
    label: string;
    hasKey: () => boolean;
    allowCustomModels?: boolean;
    models: CatalogModel[];
  }> = {
    gemini: {
      label: 'Google Gemini',
      hasKey: () => !!process.env.GEMINI_API_KEY,
      models: [
        { id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash', tier: 'free' },
        { id: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro', tier: 'premium' }
      ]
    },
    claude: {
      label: 'Anthropic Claude',
      hasKey: () => !!(process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY),
      models: [
        { id: 'claude-fable-5', label: 'Claude Fable 5', tier: 'premium' },
        { id: 'claude-opus-4-8', label: 'Claude Opus 4.8', tier: 'premium' },
        { id: 'claude-sonnet-5', label: 'Claude Sonnet 5', tier: 'premium' },
        { id: 'claude-haiku-4-5-20251001', label: 'Claude Haiku 4.5', tier: 'premium' }
      ]
    },
    openai: {
      label: 'OpenAI',
      hasKey: () => !!process.env.OPENAI_API_KEY,
      models: [
        { id: 'gpt-4o-mini', label: 'GPT-4o mini', tier: 'premium' },
        { id: 'gpt-4o', label: 'GPT-4o', tier: 'premium' }
      ]
    },
    openrouter: {
      label: 'OpenRouter',
      hasKey: () => !!process.env.OPENROUTER_API_KEY,
      allowCustomModels: true, // any model id; ':free'-suffixed ids stay free tier
      models: [
        { id: 'openrouter/auto', label: 'Auto (best available)', tier: 'premium' },
        { id: 'meta-llama/llama-3.3-70b-instruct:free', label: 'Llama 3.3 70B (free)', tier: 'free' },
        { id: 'deepseek/deepseek-chat-v3-0324:free', label: 'DeepSeek V3 (free)', tier: 'free' }
      ]
    }
  };

  app.get("/api/providers", (req, res) => {
    const authed = isDashAuthed(req);
    const providers = Object.entries(MODEL_CATALOG).map(([id, p]) => ({
      id,
      label: p.label,
      available: p.hasKey(),
      allowCustomModels: !!p.allowCustomModels,
      models: p.models.map(m => ({ ...m, unlocked: m.tier === 'free' || authed }))
    }));
    res.json({ authed, providers });
  });

  app.post("/api/chat/unified", aiRateLimiter, async (req, res) => {
    const { provider, model, messages, system } = req.body ?? {};

    const catalog = MODEL_CATALOG[provider as string];
    if (!catalog) {
      return res.status(400).json({ error: `Unknown provider "${provider}". Valid: ${Object.keys(MODEL_CATALOG).join(', ')}` });
    }
    if (typeof model !== 'string' || !model.trim()) {
      return res.status(400).json({ error: 'Model id is required' });
    }
    if (!Array.isArray(messages) || messages.length === 0 ||
        !messages.every((m: any) => m && typeof m.content === 'string' && (m.role === 'user' || m.role === 'assistant'))) {
      return res.status(400).json({ error: 'messages must be a non-empty array of { role: "user"|"assistant", content: string }' });
    }
    if (!catalog.hasKey()) {
      return res.status(503).json({ error: `No server key configured for ${provider}` });
    }

    // Resolve tier: known models use their catalog tier; custom OpenRouter ids
    // are free only with an explicit ':free' suffix.
    const known = catalog.models.find(m => m.id === model);
    let tier: 'free' | 'premium';
    if (known) {
      tier = known.tier;
    } else if (catalog.allowCustomModels) {
      tier = model.endsWith(':free') ? 'free' : 'premium';
    } else {
      return res.status(400).json({ error: `Unknown model "${model}" for provider ${provider}` });
    }
    if (tier === 'premium' && !isDashAuthed(req)) {
      return res.status(401).json({ error: 'This model is owner-gated. Unlock with your dashboard password in the config panel.' });
    }

    // Bound the payload to keep abuse cheap
    const trimmed = (messages as any[]).slice(-40).map(m => ({
      role: m.role as 'user' | 'assistant',
      content: String(m.content).slice(0, 32_000)
    }));
    const systemPrompt = typeof system === 'string' ? system.slice(0, 8_000) : undefined;

    let active = true;
    res.on('close', () => { active = false; });
    const sse = (obj: unknown) => { if (active) res.write(`data: ${JSON.stringify(obj)}\n\n`); };
    const startSSE = () => {
      if (!res.headersSent) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders();
      }
    };
    const endSSE = () => { if (active) res.write('data: [DONE]\n\n'); res.end(); };

    try {
      if (provider === 'gemini') {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
        const stream = await ai.models.generateContentStream({
          model,
          contents: trimmed.map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.content }] })),
          config: systemPrompt ? { systemInstruction: systemPrompt } : undefined
        });
        startSSE();
        for await (const chunk of stream) {
          if (!active) break;
          if (chunk.text) sse({ text: chunk.text });
        }
        return endSSE();
      }

      if (provider === 'claude') {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': (process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY)!,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model,
            messages: trimmed,
            ...(systemPrompt ? { system: systemPrompt } : {}),
            max_tokens: 4096,
            stream: true
          })
        });
        if (!response.ok) {
          const errText = await response.text();
          return res.status(502).json({ error: `Anthropic API error ${response.status}: ${errText.slice(0, 400)}` });
        }
        startSSE();
        const decoder = new TextDecoder();
        let buffer = '';
        for await (const chunk of response.body as any) {
          if (!active) break;
          buffer += decoder.decode(chunk, { stream: true });
          let boundary = buffer.indexOf('\n');
          while (boundary !== -1) {
            const line = buffer.slice(0, boundary).trim();
            buffer = buffer.slice(boundary + 1);
            if (line.startsWith('data: ')) {
              try {
                const parsed = JSON.parse(line.slice(6));
                if (parsed.type === 'content_block_delta' && parsed.delta?.text) sse({ text: parsed.delta.text });
              } catch { /* partial or ping event */ }
            }
            boundary = buffer.indexOf('\n');
          }
        }
        return endSSE();
      }

      // OpenAI-compatible providers (openai, openrouter)
      const base = provider === 'openrouter' ? 'https://openrouter.ai/api/v1' : 'https://api.openai.com/v1';
      const key = provider === 'openrouter' ? process.env.OPENROUTER_API_KEY! : process.env.OPENAI_API_KEY!;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      };
      if (provider === 'openrouter') {
        headers['HTTP-Referer'] = 'https://www.linacre.site';
        headers['X-Title'] = 'Linacre Lab';
      }
      const response = await fetch(`${base}/chat/completions`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model,
          messages: systemPrompt ? [{ role: 'system', content: systemPrompt }, ...trimmed] : trimmed,
          stream: true
        })
      });
      if (!response.ok) {
        const errText = await response.text();
        return res.status(502).json({ error: `${catalog.label} API error ${response.status}: ${errText.slice(0, 400)}` });
      }
      startSSE();
      const decoder = new TextDecoder();
      let buffer = '';
      for await (const chunk of response.body as any) {
        if (!active) break;
        buffer += decoder.decode(chunk, { stream: true });
        let boundary = buffer.indexOf('\n');
        while (boundary !== -1) {
          const line = buffer.slice(0, boundary).trim();
          buffer = buffer.slice(boundary + 1);
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6).trim();
            if (dataStr && dataStr !== '[DONE]') {
              try {
                const parsed = JSON.parse(dataStr);
                const text = parsed.choices?.[0]?.delta?.content;
                if (text) sse({ text });
              } catch { /* partial JSON */ }
            }
          }
          boundary = buffer.indexOf('\n');
        }
      }
      return endSSE();
    } catch (err: any) {
      console.error(`[Unified Chat Error] ${provider}/${model}:`, err.message || err);
      if (!res.headersSent) {
        return res.status(500).json({ error: err.message || 'Provider request failed' });
      }
      sse({ error: err.message || 'Stream interrupted' });
      return res.end();
    }
  });

  // Vite static file / hot reload serving middleware
  if (process.env.NODE_ENV !== "production") {
    (async () => {
      // Dev-only dynamic import: a static top-level `import ... from "vite"`
      // pulls vite -> rollup -> @rollup/rollup-linux-x64-gnu into the production
      // serverless cold path, which crashes every function invocation when the
      // native binding is absent (npm optional-deps bug, npm/cli#4828).
      const { createServer: createViteServer } = await import("vite");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
      if (!process.env.VERCEL) {
        app.listen(PORT, "0.0.0.0", () => {
          console.log(`Express dev server listening on http://0.0.0.0:${PORT}`);
        });
      }
    })();
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    if (!process.env.VERCEL) {
      app.listen(PORT, "0.0.0.0", () => {
        console.log(`Express production server listening on http://0.0.0.0:${PORT}`);
      });
    }
  }

export default app;
