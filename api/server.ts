import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
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

async function startServer() {

  // API route for Gemini Chat proxying securely
  app.post("/api/chat", async (req, res) => {
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
  app.post("/api/chat/stream", async (req, res) => {
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
      litellm: !!process.env.LITELLM_API_KEY
    });
  });

  // Secure Server-side OpenAI Streaming Proxy
  app.post("/api/chat/openai", async (req, res) => {
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
  app.post("/api/chat/claude", async (req, res) => {
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

  // Server health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite static file / hot reload serving middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Express full-stack server listening on http://0.0.0.0:${PORT}`);
    });
  }
}

startServer();

export default app;
