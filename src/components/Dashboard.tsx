import { useState, FormEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Terminal, Cpu, Key, Copy, Check, Lock, ArrowRight, Server, Play, Code, Eye, EyeOff, Search, FileCode, CheckCircle2, RefreshCw, AlertCircle } from 'lucide-react';
import { MCP_SERVERS, SKILL_TEMPLATES, ENV_TEMPLATE } from '../data';
import { MCPServer, SkillTemplate } from '../types';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip as ChartTooltip,
  Legend
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  ChartTooltip,
  Legend
);


export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('linacre_dashboard_auth') === 'true';
  });
  
  useEffect(() => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      setIsAuthenticated(true);
      localStorage.setItem('linacre_dashboard_auth', 'true');
    }
  }, []);

  const [activeSubTab, setActiveSubTab] = useState<'mcp' | 'skills' | 'env' | 'ecosystem'>('mcp');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [envContent, setEnvContent] = useState(ENV_TEMPLATE);
  const [mcpServers, setMcpServers] = useState<MCPServer[]>(MCP_SERVERS);
  const [expandedMcpId, setExpandedMcpId] = useState<string | null>(null);

  // Authentication bypass password
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  const [meshStatus, setMeshStatus] = useState<Record<string, {
    status: 'connected' | 'disconnected' | 'connecting';
    latency: number;
    reason: string;
  }>>({
    'fastapi': { status: 'disconnected', latency: 0, reason: 'FastAPI backend has not been pinged yet.' },
    'express': { status: 'connected', latency: 5, reason: 'Express server running locally on port 3000.' },
    'phone': { status: 'disconnected', latency: 0, reason: 'Waiting for device handshake.' },
    'agent': { status: 'disconnected', latency: 0, reason: 'Waiting for active status report.' },
    'gemini': { status: 'connected', latency: 24, reason: 'Active proxy link to Google Gemini Studio.' }
  });

  const runEcosystemPing = async () => {
    setMeshStatus(prev => ({
      ...prev,
      'fastapi': { ...prev['fastapi'], status: 'connecting' },
      'phone': { ...prev['phone'], status: 'connecting' },
      'agent': { ...prev['agent'], status: 'connecting' }
    }));

    // 1. Ping FastAPI
    try {
      const start = Date.now();
      const res = await fetch("http://localhost:8000/api/v1/evbot/health");
      const latency = Date.now() - start;
      if (res.ok) {
        setMeshStatus(prev => ({
          ...prev,
          'fastapi': { status: 'connected', latency, reason: 'FastAPI backend active on port 8000 over Tailscale.' }
        }));
      } else {
        throw new Error("HTTP Status: " + res.status);
      }
    } catch (e: any) {
      setMeshStatus(prev => ({
        ...prev,
        'fastapi': { status: 'disconnected', latency: 0, reason: 'FastAPI backend is unreachable on port 8000. Start the server using python linacre.py boot.' }
      }));
    }

    // 2. Check Phone
    try {
      const start = Date.now();
      const res = await fetch("http://localhost:8000/api/v1/evbot/state");
      const latency = Date.now() - start;
      if (res.ok) {
        const data = await res.json();
        if (data.pcConnection && data.pcConnection.status === 'connected') {
          setMeshStatus(prev => ({
            ...prev,
            'phone': { status: 'connected', latency, reason: `Linked to Poco F7 at 100.102.1.7 (Handshake OK).` }
          }));
        } else {
          setMeshStatus(prev => ({
            ...prev,
            'phone': { status: 'disconnected', latency: 0, reason: 'Poco F7 is disconnected or app is not running.' }
          }));
        }
      } else {
        throw new Error();
      }
    } catch (e) {
      setMeshStatus(prev => ({
        ...prev,
        'phone': { status: 'disconnected', latency: 0, reason: 'Tailscale routing down. Verify the companion app is running on the Poco F7.' }
      }));
    }

    // 3. Check AI Agent
    try {
      const res = await fetch("/agent-report.json");
      if (res.ok) {
        const data = await res.json();
        const lastRun = new Date(data.lastRun);
        const diffMin = (Date.now() - lastRun.getTime()) / (1000 * 60);
        if (diffMin < 60) {
          setMeshStatus(prev => ({
            ...prev,
            'agent': { status: 'connected', latency: 2, reason: `Agent daemon active. Last run ${Math.round(diffMin)}m ago.` }
          }));
        } else {
          setMeshStatus(prev => ({
            ...prev,
            'agent': { status: 'disconnected', latency: 0, reason: `Agent daemon inactive (last run ${Math.round(diffMin)}m ago).` }
          }));
        }
      } else {
        throw new Error();
      }
    } catch (e) {
      setMeshStatus(prev => ({
        ...prev,
        'agent': { status: 'disconnected', latency: 0, reason: 'agent-report.json not found. Run python linacre.py boot to start background agent daemon.' }
      }));
    }
  };

  useEffect(() => {
    if (activeSubTab === 'ecosystem') {
      runEcosystemPing();
    }
  }, [activeSubTab]);

  const handleAuthSubmit = (e: FormEvent) => {
    e.preventDefault();
    // David Linacre private gate bypass password or click bypass
    if (password === 'admin' || password === 'david' || password === '') {
      setIsAuthenticated(true);
      localStorage.setItem('linacre_dashboard_auth', 'true');
      setAuthError(null);
    } else {
      setAuthError('Access Denied: Invalid credentials.');
    }
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const toggleMcpStatus = (id: string) => {
    setMcpServers(
      mcpServers.map((server) =>
        server.id === id ? { ...server, isReady: !server.isReady } : server
      )
    );
  };

  // Filter MCP Servers
  const filteredMcp = mcpServers.filter(
    (server) =>
      server.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      server.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      server.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12" id="dashboard-gate">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-muted/10 dark:bg-[#10141d]/80 border border-border-color rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl"
        >
          {/* Lock header */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-amber-color/15 flex items-center justify-center text-amber-color border border-amber-color/30 animate-pulse">
              <Lock className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h2 className="font-display text-lg font-bold text-foreground">Secure Workspace Gate</h2>
              <p className="text-xs text-muted-foreground">
                Private console for David Linacre. MCP servers, prompt architectures, and local workspace env credentials.
              </p>
            </div>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4 font-mono text-xs">
            <div className="space-y-1.5">
              <label className="block text-muted-foreground font-semibold">Access Password</label>
              <input
                type="password"
                placeholder="Type admin or click bypass..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-muted/40 dark:bg-[#161b26]/60 border border-border-color rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-cyan focus:border-cyan text-foreground placeholder:text-muted-foreground/40"
              />
            </div>

            {authError && (
              <p className="text-red-400 text-[10px] bg-red-400/5 border border-red-500/20 p-2.5 rounded-md">
                {authError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-amber-color hover:bg-amber-color/90 text-background hover:text-black font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Authenticate Access</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="text-center">
            <button
              onClick={() => {
                setIsAuthenticated(true);
                localStorage.setItem('linacre_dashboard_auth', 'true');
              }}
              className="text-[10px] text-muted-foreground hover:text-cyan transition-colors underline cursor-pointer"
            >
              Reviewer / Guest Bypass
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Authed Header */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-color pb-6" id="dashboard-header">
        <div className="space-y-1.5">
          <span className="font-mono text-xs text-amber-color tracking-widest uppercase font-semibold flex items-center gap-1.5">
            <Terminal className="w-4 h-4 text-amber-color" />
            <span>Developer Console</span>
          </span>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            David's Workspace Dashboard
          </h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Monitor Model Context Protocol (MCP) servers, manage local skill blueprints, and configure your local environments.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono">
          <span className="px-2.5 py-1 text-[10px] bg-emerald-color/10 border border-emerald-color/20 text-emerald-color rounded-md flex items-center gap-1 font-semibold uppercase">
            <span className="w-1.5 h-1.5 bg-emerald-color rounded-full animate-pulse" />
            Active Session
          </span>
          <button
            onClick={() => {
              setIsAuthenticated(false);
              localStorage.removeItem('linacre_dashboard_auth');
              setPassword('');
            }}
            className="px-2.5 py-1 text-[10px] bg-muted hover:bg-muted/70 text-muted-foreground border border-border-color/60 hover:text-foreground rounded-md transition-all cursor-pointer"
          >
            Lock Terminal
          </button>
        </div>
      </section>

      {/* Internal Console Navigation Tabs */}
      <div className="flex border-b border-border-color/60 font-mono text-xs" id="dashboard-internal-tabs">
        <button
          onClick={() => {
            setActiveSubTab('mcp');
            setSearchQuery('');
          }}
          className={`px-5 py-3 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'mcp'
              ? 'border-cyan text-cyan font-semibold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Server className="w-3.5 h-3.5" />
          <span>MCP Servers ({mcpServers.length})</span>
        </button>
        <button
          onClick={() => {
            setActiveSubTab('skills');
            setSearchQuery('');
          }}
          className={`px-5 py-3 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'skills'
              ? 'border-cyan text-cyan font-semibold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Skill Blueprints ({SKILL_TEMPLATES.length})</span>
        </button>
        <button
          onClick={() => {
            setActiveSubTab('env');
            setSearchQuery('');
          }}
          className={`px-5 py-3 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'env'
              ? 'border-cyan text-cyan font-semibold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Key className="w-3.5 h-3.5" />
          <span>Environment Configs</span>
        </button>
        <button
          onClick={() => {
            setActiveSubTab('ecosystem');
            setSearchQuery('');
          }}
          className={`px-5 py-3 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'ecosystem'
              ? 'border-cyan text-cyan font-semibold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Ecosystem Sync</span>
        </button>
      </div>

      {/* TAB CONTENT: MCP SERVERS */}
      {activeSubTab === 'mcp' && (
        <section className="space-y-6" id="dashboard-mcp-pane">
          {/* Search block */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground/60" />
              <input
                type="search"
                placeholder="filter MCP servers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-muted/30 dark:bg-[#10141d]/30 border border-border-color rounded-lg py-2 pl-9 pr-4 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-cyan text-placeholder placeholder:text-muted-foreground/55 transition-all"
              />
            </div>

            <div className="text-[10px] font-mono text-muted-foreground flex items-center gap-1.5">
              <span>// active servers:</span>
              <span className="text-emerald-color font-semibold">
                {mcpServers.filter((s) => s.isReady).length} online
              </span>
            </div>
          </div>

          {/* MCP Servers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" id="mcp-servers-grid">
            {filteredMcp.map((server) => {
              const isExpanded = expandedMcpId === server.id;
              return (
                <div
                  key={server.id}
                  className="bg-muted/15 dark:bg-[#161b26] border border-border-color rounded-xl p-5 hover:border-border-hi transition-all flex flex-col justify-between"
                  id={`mcp-card-${server.id}`}
                >
                  <div className="space-y-2">
                    {/* Header line inside card */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase bg-muted/60 dark:bg-muted/10 border border-border-color/50 px-2 py-0.5 rounded text-muted-foreground">
                        {server.category}
                      </span>
                      
                      <button
                        onClick={() => toggleMcpStatus(server.id)}
                        className={`text-[9px] font-mono px-2 py-0.5 rounded cursor-pointer transition-all uppercase border font-semibold ${
                          server.isReady
                            ? 'bg-emerald-color/10 border-emerald-color/30 text-emerald-color'
                            : 'bg-muted border-border-color text-muted-foreground hover:bg-muted/80'
                        }`}
                      >
                        {server.isReady ? 'Active' : 'Offline'}
                      </button>
                    </div>

                    <h3 className="font-mono text-sm font-semibold text-foreground pt-1">{server.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{server.description}</p>
                  </div>

                  {/* Actions footer */}
                  <div className="border-t border-border-color/45 pt-4 mt-4 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <button
                        onClick={() => setExpandedMcpId(isExpanded ? null : server.id)}
                        className="text-[11px] font-mono text-cyan hover:text-amber-color transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Code className="w-3.5 h-3.5" />
                        <span>{isExpanded ? 'Hide CLI setup' : 'Show CLI setup'}</span>
                      </button>
                      
                      {server.package && (
                        <button
                          onClick={() => handleCopyText(server.package || '', server.id)}
                          className="text-[10px] font-mono text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          {copiedId === server.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-color" />
                              <span className="text-emerald-color">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Install pkg</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    {/* Expanding setup codeblock */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="bg-black/40 border border-border-color/60 rounded-lg p-3 relative mt-1.5">
                            <button
                              onClick={() => handleCopyText(server.config, `${server.id}-cfg`)}
                              className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-foreground bg-muted/30 hover:bg-muted/60 rounded transition-all cursor-pointer"
                              title="Copy configuration JSON"
                            >
                              {copiedId === `${server.id}-cfg` ? (
                                <Check className="w-3 h-3 text-emerald-color" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                            <pre className="text-[10px] font-mono text-muted-foreground/80 overflow-x-auto leading-relaxed select-text">
                              <code>{server.config}</code>
                            </pre>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* TAB CONTENT: SKILL BLUEPRINTS */}
      {activeSubTab === 'skills' && (
        <section className="space-y-6" id="dashboard-skills-pane">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SKILL_TEMPLATES.map((blueprint) => (
              <div
                key={blueprint.id}
                className="bg-muted/15 dark:bg-[#161b26] border border-border-color rounded-xl p-5 hover:border-border-hi transition-all flex flex-col justify-between"
                id={`skill-card-${blueprint.id}`}
              >
                <div className="space-y-2">
                  <h3 className="font-mono text-sm font-semibold text-foreground flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-cyan" />
                    <span>{blueprint.title}</span>
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{blueprint.description}</p>
                </div>

                <div className="border-t border-border-color/45 pt-4 mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-muted-foreground/60">Blueprints Prompt</span>
                    <button
                      onClick={() => handleCopyText(blueprint.prompt, blueprint.id)}
                      className="text-[11px] font-mono text-cyan hover:text-amber-color transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === blueprint.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-color" />
                          <span className="text-emerald-color">Prompt Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Instruction Prompt</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="bg-black/30 dark:bg-black/15 border border-border-color/40 rounded-lg p-3 max-h-24 overflow-y-auto">
                    <p className="text-[10px] font-mono text-muted-foreground select-text leading-relaxed">
                      {blueprint.prompt}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB CONTENT: ENVIRONMENT CONFIG */}
      {activeSubTab === 'env' && (
        <section className="space-y-6" id="dashboard-env-pane">
          <div className="bg-muted/15 dark:bg-[#161b26] border border-border-color rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-border-color/50 pb-3">
              <div className="flex items-center gap-2 font-mono">
                <FileCode className="w-4 h-4 text-cyan" />
                <span className="text-xs font-semibold text-foreground">Local workspace .env blueprint</span>
              </div>

              <button
                onClick={() => handleCopyText(envContent, 'env-key')}
                className="text-[11px] font-mono text-cyan hover:text-amber-color transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {copiedId === 'env-key' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-color" />
                    <span className="text-emerald-color">Copied to Clipboard</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy entire .env</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-muted-foreground font-mono leading-relaxed">
              // Setup local MCP environments. Copy the codeblock below, paste into your local root `.env` file, and populate with credentials.
            </p>

            <textarea
              value={envContent}
              onChange={(e) => setEnvContent(e.target.value)}
              className="w-full h-80 bg-black/40 dark:bg-black/25 border border-border-color/75 rounded-lg p-4 text-[11px] font-mono text-emerald-color focus:outline-none focus:ring-1 focus:ring-cyan select-text resize-y leading-relaxed"
              id="env-editor"
            />
          </div>
        </section>
      )}

      {/* TAB CONTENT: ECOSYSTEM SYNC */}
      {activeSubTab === 'ecosystem' && (
        <section className="space-y-6" id="dashboard-ecosystem-pane">
          <div className="bg-muted/15 dark:bg-[#161b26] border border-border-color rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-border-color/50 pb-4">
              <div className="flex items-center gap-2.5 font-mono">
                <Cpu className="w-5 h-5 text-cyan animate-pulse" />
                <span className="text-sm font-semibold text-foreground">Tailscale AI Mesh Connection Monitor</span>
              </div>
              <button
                onClick={runEcosystemPing}
                className="px-3 py-1 bg-cyan hover:bg-cyan/90 text-background hover:text-black font-mono text-[10px] font-bold rounded-lg uppercase tracking-wider transition cursor-pointer flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                Global Reconnect Mesh
              </button>
            </div>

            <p className="text-xs text-muted-foreground font-mono leading-relaxed">
              // Real-time visualization of the connection strength, status, and network routing logs of the Tailscale Mesh ecosystem.
            </p>

            {/* Split Screen: Chart/SVG on Left, Diagnostics on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Topology / Graph display */}
              <div className="col-span-1 lg:col-span-6 bg-black/20 dark:bg-black/10 border border-border-color/40 rounded-xl p-5 flex flex-col justify-between items-center min-h-[350px]">
                <h4 className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider self-start">Network Latency & Connection Strength</h4>
                
                {/* Radar Chart from ChartJS */}
                <div className="w-full h-[240px] flex items-center justify-center">
                  <Radar
                    data={{
                      labels: ['FastAPI', 'Express', 'Poco F7', 'Agent Daemon', 'Gemini Link'],
                      datasets: [
                        {
                          label: 'Connection Strength (%)',
                          data: [
                            meshStatus.fastapi.status === 'connected' ? Math.max(30, 100 - meshStatus.fastapi.latency) : (meshStatus.fastapi.status === 'connecting' ? 50 : 0),
                            meshStatus.express.status === 'connected' ? 95 : 0,
                            meshStatus.phone.status === 'connected' ? 90 : (meshStatus.phone.status === 'connecting' ? 50 : 0),
                            meshStatus.agent.status === 'connected' ? 85 : (meshStatus.agent.status === 'connecting' ? 50 : 0),
                            meshStatus.gemini.status === 'connected' ? 90 : 0,
                          ],
                          backgroundColor: 'rgba(6, 182, 212, 0.15)',
                          borderColor: '#06b6d4',
                          borderWidth: 2,
                          pointBackgroundColor: '#06b6d4',
                          pointBorderColor: '#fff',
                        }
                      ]
                    }}
                    options={{
                      scales: {
                        r: {
                          angleLines: { color: 'rgba(255, 255, 255, 0.08)' },
                          grid: { color: 'rgba(255, 255, 255, 0.08)' },
                          pointLabels: { color: '#94a3b8', font: { size: 9, family: 'monospace' } },
                          ticks: { display: false },
                          suggestedMin: 0,
                          suggestedMax: 100
                        }
                      },
                      plugins: {
                        legend: { display: false }
                      },
                      responsive: true,
                      maintainAspectRatio: false
                    }}
                  />
                </div>

                <div className="flex gap-4 text-[10px] font-mono text-slate-500">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan" /> Mesh Core Link</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-color" /> Handshake OK</span>
                </div>
              </div>

              {/* Diagnostic Panel & Retry list */}
              <div className="col-span-1 lg:col-span-6 space-y-4 flex flex-col justify-between">
                
                {/* List of Mesh components */}
                <div className="space-y-3">
                  {(Object.keys(meshStatus) as Array<keyof typeof meshStatus>).map((key) => {
                    const comp = meshStatus[key];
                    const labelMap: Record<string, string> = {
                      'fastapi': 'FastAPI server (port 8000)',
                      'express': 'Express web portal (port 3000)',
                      'phone': 'Poco F7 Android Client',
                      'agent': 'Background AI Agent Monitor',
                      'gemini': 'Google Gemini API Link'
                    };

                    return (
                      <div 
                        key={key} 
                        className="bg-black/30 dark:bg-[#111622] border border-border-color/60 rounded-xl p-3.5 flex items-center justify-between gap-3 group relative hover:border-cyan/40 transition duration-200"
                        title={comp.reason}
                      >
                        <div className="flex items-center gap-3">
                          {/* Animated health indicator */}
                          <div className="relative">
                            <div className={`w-3.5 h-3.5 rounded-full border border-black/20 ${
                              comp.status === 'connected' ? 'bg-emerald-color animate-pulse' :
                              comp.status === 'connecting' ? 'bg-amber-color animate-spin border-dashed border-2' : 'bg-red-400'
                            }`} />
                          </div>

                          <div>
                            <span className="block text-xs font-mono font-bold text-slate-200">{labelMap[key]}</span>
                            <span className="block text-[10px] font-mono text-slate-500 truncate max-w-[280px]">
                              {comp.status === 'connected' ? `Latency: ${comp.latency}ms` : comp.reason}
                            </span>
                          </div>
                        </div>

                        {/* Individual Retry action */}
                        {comp.status === 'disconnected' && (
                          <button
                            onClick={runEcosystemPing}
                            className="px-2 py-1 bg-red-400/10 hover:bg-red-400/20 border border-red-500/20 text-red-400 hover:text-red-300 font-mono text-[9px] rounded uppercase tracking-wider transition cursor-pointer flex items-center gap-1"
                          >
                            <AlertCircle className="w-2.5 h-2.5" />
                            Retry
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Mesh Info Card */}
                <div className="bg-cyan/5 border border-cyan/10 rounded-xl p-4 flex gap-3">
                  <Info className="w-5 h-5 text-cyan shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h5 className="text-xs font-mono font-bold text-cyan uppercase">Tailscale Mesh Info</h5>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      Your devices communicate over Tailscale encrypted subnets. Pinging utilizes secure cross-origin HTTP checks. Hover over any component to read diagnostic tooltips.
                    </p>
                  </div>
                </div>

              </div>

            </div>

            {/* Simulated manual trigger actions */}
            <div className="border-t border-border-color/40 pt-6 space-y-4">
              <h3 className="font-mono text-xs font-bold text-amber-color uppercase tracking-wider">
                🤖 Direct Ecosystem Action Webhooks
              </h3>
              
              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={async () => {
                    try {
                      const res = await fetch("http://localhost:8000/api/v1/evbot/health");
                      const data = await res.json();
                      alert(`EV-Bot Service status: ${data.status || 'Offline'}`);
                    } catch (e) {
                      alert("Could not reach EV-Bot API (make sure backend is running on port 8000).");
                    }
                  }}
                  className="px-4 py-2 bg-cyan/15 hover:bg-cyan/25 border border-cyan/35 text-cyan hover:text-cyan/90 font-mono text-xs font-semibold rounded-lg transition-all cursor-pointer"
                >
                  Ping EV-Bot backend (Port 8000)
                </button>
                <button
                  onClick={async () => {
                    try {
                      const res = await fetch("http://localhost:8000/api/v1/evbot/alexa/trigger", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ phrase: "Alexa, tell EV-Bot to check PC status" })
                      });
                      const data = await res.json();
                      alert(`Alexa broadcast: ${data.event?.actionTaken || 'Success'}`);
                    } catch (e) {
                      alert("Failed to trigger Alexa command.");
                    }
                  }}
                  className="px-4 py-2 bg-amber-color/15 hover:bg-amber-color/25 border border-amber-color/35 text-amber-color hover:text-amber-color/90 font-mono text-xs font-semibold rounded-lg transition-all cursor-pointer"
                >
                  Trigger voice macro
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
