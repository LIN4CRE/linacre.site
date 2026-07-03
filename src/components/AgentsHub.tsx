import { useState, useEffect, useRef, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Send, Plus, Bot, Coffee, Shield, Database, LayoutGrid, Award, Server, Pause, Play, Trash2, AlertTriangle, Info, Cpu, Activity, Zap, Layers, Volume2, VolumeX, Sparkles } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  role: 'Dev' | 'DevOps' | 'Security' | 'Librarian';
  spriteName: string; // Pokémon Showdown gif name
  personality: 'focused' | 'caffeinated' | 'chaotic' | 'pragmatic';
  color: string;
  x: number;
  y: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  status: string;
  task: string;
  taskQueue: string[]; // Sequential task queuing
  isPaused: boolean;
  roboticTraits: string;
  cpu: number;
  ram: number;
}

interface LogMessage {
  id: string;
  timestamp: string;
  agentName: string;
  message: string;
  type: 'info' | 'success' | 'warning';
}

interface WalkingParticle {
  id: string;
  x: number;
  y: number;
}

interface AgentSuggestion {
  name: string;
  role: 'Dev' | 'DevOps' | 'Security' | 'Librarian';
  spriteName: string;
  personality: 'focused' | 'caffeinated' | 'chaotic' | 'pragmatic';
  concept: string;
  detailedPrompt: string;
  steps: string[];
}

const GRID_SIZE = 10;

// Pokémon Showdown Sprite Database URL
const SPRITE_BASE_URL = 'https://play.pokemonshowdown.com/sprites/ani/';

const AVAILABLE_POKEMON = [
  { name: 'Rotom-Wash', file: 'rotom-wash', description: 'Plasma mechanical appliance robot. Fits DevOps/Networking.' },
  { name: 'Magnezone', file: 'magnezone', description: 'Triple magnetic eye robot drone. Ideal for Security scans.' },
  { name: 'Porygon2', file: 'porygon2', description: 'Fully virtual digital construct robot. Best for Code Development.' },
  { name: 'Slowking', file: 'slowking', description: 'Shellder-crowned royal writer. Great for library documentation.' },
  { name: 'Metagross', file: 'metagross', description: 'Four-legged steel supercomputer mech. Heavy data compute.' },
  { name: 'Aegislash', file: 'aegislash-blade', description: 'Steel floating shield and sword construct. Perimeter defenses.' },
  { name: 'Genesect', file: 'genesect', description: 'Ancient insectoid cyborg with back-mounted cannon. Speed builds.' },
  { name: 'Pikachu', file: 'pikachu', description: 'Electric rodent dynamo. Ideal for powering grids.' },
  { name: 'Mewtwo', file: 'mewtwo', description: 'Genetically modified ultimate cybernetic psychic.' },
  { name: 'Scizor', file: 'scizor', description: 'Metallic scissor-claw developer. Fast compiler.' }
];

const WORKSTATIONS = [
  { name: 'Mainframe Node', x: 1, y: 1, icon: Server, color: 'text-amber-color border-amber-color/30 bg-[#161310]/80 shadow-[0_0_10px_rgba(251,191,36,0.15)]', rgb: '251, 191, 36' },
  { name: 'Git Repository', x: 1, y: 8, icon: LayoutGrid, color: 'text-cyan border-cyan/30 bg-[#0d161a]/80 shadow-[0_0_10px_rgba(92,207,230,0.15)]', rgb: '92, 207, 230' },
  { name: 'Database Cluster', x: 8, y: 1, icon: Database, color: 'text-purple-color border-purple-color/30 bg-[#140f1a]/80 shadow-[0_0_10px_rgba(168,85,247,0.15)]', rgb: '168, 85, 247' },
  { name: 'Edge Server', x: 8, y: 8, icon: Award, color: 'text-emerald-color border-emerald-color/30 bg-[#0d1a12]/80 shadow-[0_0_10px_rgba(127,216,143,0.15)]', rgb: '127, 216, 143' },
  { name: 'Game Corner Cafe', x: 5, y: 5, icon: Coffee, color: 'text-rose-400 border-rose-400/30 bg-[#1a0f12]/80 shadow-[0_0_10px_rgba(248,113,113,0.15)]', rgb: '248, 113, 113' }
];

const isPathTile = (x: number, y: number): boolean => {
  if (x === 1 && y >= 1 && y <= 8) return true;
  if (x === 8 && y >= 1 && y <= 8) return true;
  if (y === 5 && x >= 1 && x <= 8) return true;
  return false;
};

// Web Audio API Retro Sound Synthesizer
const playSynthSound = (type: 'click' | 'success' | 'error', isMuted: boolean) => {
  if (isMuted) return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'click') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.08);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } else if (type === 'success') {
      // RPG Chiptune Level-Up fanfare arpeggio
      osc.type = 'triangle';
      const now = ctx.currentTime;
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.4);
      
      const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5 -> E5 -> G5 -> C6
      osc.start(now);
      freqs.forEach((freq, idx) => {
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      });
      osc.stop(now + 0.4);
    } else if (type === 'error') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(60, ctx.currentTime + 0.22);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.005, ctx.currentTime + 0.22);
      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    }
  } catch (e) {
    // Audio Context blocked by browser autoplay settings
  }
};

const DevOpsRobotSVG = ({ color }: { color: string }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <line x1="50" y1="20" x2="50" y2="5" stroke={color} strokeWidth="3" />
    <circle cx="50" cy="5" r="4" fill={color} />
    <path d="M 15 50 Q 5 40 10 30" fill="none" stroke={color} strokeWidth="4.5" />
    <path d="M 85 50 Q 95 40 90 30" fill="none" stroke={color} strokeWidth="4.5" />
    <rect x="25" y="35" width="50" height="45" rx="10" fill="#0d1117" stroke={color} strokeWidth="4" />
    <rect x="33" y="43" width="34" height="22" rx="4" fill="#1f2937" stroke={color} strokeWidth="2" />
    <circle cx="43" cy="54" r="3" fill={color} />
    <circle cx="57" cy="54" r="3" fill={color} />
    <rect x="20" y="80" width="60" height="12" rx="6" fill="#111827" stroke={color} strokeWidth="3.5" />
  </svg>
);

const SecurityRobotSVG = ({ color }: { color: string }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <line x1="35" y1="20" x2="25" y2="8" stroke={color} strokeWidth="3" />
    <line x1="65" y1="20" x2="75" y2="8" stroke={color} strokeWidth="3" />
    <circle cx="25" cy="8" r="3.5" fill={color} />
    <circle cx="75" cy="8" r="3.5" fill={color} />
    <path d="M 12 45 L 8 65 L 20 75 L 24 55 Z" fill="#1f2937" stroke={color} strokeWidth="3" />
    <circle cx="50" cy="48" r="28" fill="#0d1117" stroke={color} strokeWidth="4.5" />
    <rect x="35" y="40" width="30" height="8" rx="2" fill="#ef4444" className="animate-pulse" />
    <path d="M 38 74 L 32 92 L 24 92" fill="none" stroke={color} strokeWidth="4" />
    <path d="M 62 74 L 68 92 L 76 92" fill="none" stroke={color} strokeWidth="4" />
  </svg>
);

const DeveloperRobotSVG = ({ color }: { color: string }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <rect x="38" y="10" width="24" height="20" rx="6" fill="#0d1117" stroke={color} strokeWidth="3.5" />
    <circle cx="50" cy="20" r="4" fill="#3b82f6" className="animate-ping" />
    <line x1="50" y1="30" x2="50" y2="38" stroke={color} strokeWidth="4" />
    <rect x="22" y="38" width="56" height="42" rx="4" fill="#0d1117" stroke={color} strokeWidth="4" />
    <circle cx="34" cy="50" r="2.5" fill="#10b981" />
    <circle cx="34" cy="60" r="2.5" fill="#f59e0b" />
    <circle cx="34" cy="70" r="2.5" fill="#ef4444" />
    <path d="M 22 45 L 8 45 L 8 65" fill="none" stroke={color} strokeWidth="3.5" />
    <path d="M 78 45 L 92 45 L 92 65" fill="none" stroke={color} strokeWidth="3.5" />
    <circle cx="35" cy="88" r="8" fill="#111827" stroke={color} strokeWidth="3" />
    <circle cx="65" cy="88" r="8" fill="#111827" stroke={color} strokeWidth="3" />
  </svg>
);

const WriterRobotSVG = ({ color }: { color: string }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <ellipse cx="50" cy="85" rx="25" ry="8" fill="none" stroke={color} strokeWidth="3" strokeDasharray="6 4" />
    <path d="M 50 72 L 46 82 L 54 82 Z" fill="#38bdf8" opacity="0.8" className="animate-pulse" />
    <rect x="30" y="25" width="40" height="45" rx="12" fill="#0d1117" stroke={color} strokeWidth="4" />
    <path d="M 36 38 Q 50 32 64 38" fill="none" stroke={color} strokeWidth="3.5" />
    <path d="M 30 55 C 15 55 18 40 10 42" fill="none" stroke={color} strokeWidth="3.5" />
    <path d="M 70 55 C 85 55 82 40 90 42" fill="none" stroke={color} strokeWidth="3.5" />
  </svg>
);

// Custom High-Resolution SVG artwork buildings
const CyberCastleSVG = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <rect x="15" y="60" width="70" height="30" rx="2" fill="#1e293b" stroke="#334155" strokeWidth="2" />
    <line x1="15" y1="75" x2="85" y2="75" stroke="#334155" strokeWidth="1.5" />
    <rect x="25" y="30" width="50" height="30" fill="#334155" stroke="#475569" strokeWidth="2" />
    <rect x="20" y="20" width="12" height="15" fill="#475569" stroke="#64748b" strokeWidth="1.5" />
    <rect x="68" y="20" width="12" height="15" fill="#475569" stroke="#64748b" strokeWidth="1.5" />
    <line x1="50" y1="30" x2="50" y2="5" stroke="#fbbf24" strokeWidth="2.5" />
    <circle cx="50" cy="5" r="4" fill="#fbbf24" className="animate-pulse" />
    <ellipse cx="50" cy="50" rx="35" ry="12" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 4" opacity="0.4" />
    <rect x="42" y="68" width="16" height="22" rx="4" fill="#0f172a" stroke="#fbbf24" strokeWidth="2" />
  </svg>
);

const PokeCenterSVG = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <rect x="15" y="35" width="70" height="55" rx="8" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2.5" />
    <path d="M 10 35 Q 50 12 90 35 Z" fill="#ef4444" stroke="#dc2626" strokeWidth="3" />
    <circle cx="50" cy="28" r="9" fill="#0f172a" stroke="#5ccfe6" strokeWidth="2" />
    <path d="M 50 23 L 50 33 M 45 28 L 55 28" fill="none" stroke="#5ccfe6" strokeWidth="2.5" />
    <rect x="38" y="60" width="24" height="30" rx="2" fill="#0f172a" stroke="#5ccfe6" strokeWidth="2" />
  </svg>
);

const FlaskLabSVG = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <rect x="20" y="40" width="60" height="50" rx="4" fill="#0f172a" stroke="#a855f7" strokeWidth="2" />
    <rect x="35" y="15" width="30" height="55" rx="15" fill="#a855f7" opacity="0.15" />
    <rect x="35" y="15" width="30" height="55" rx="15" fill="none" stroke="#a855f7" strokeWidth="2.5" />
    <path d="M 36 50 Q 50 46 64 50 L 64 68 Q 50 68 36 68 Z" fill="#c084fc" opacity="0.75" />
    <circle cx="45" cy="40" r="2.5" fill="#ffffff" className="animate-bounce" />
    <circle cx="55" cy="30" r="2" fill="#ffffff" className="animate-bounce" style={{ animationDelay: '0.4s' }} />
    <circle cx="48" cy="22" r="1.5" fill="#ffffff" className="animate-bounce" style={{ animationDelay: '0.8s' }} />
  </svg>
);

const WindmillGeneratorSVG = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <path d="M 38 90 L 46 35 L 54 35 L 62 90 Z" fill="#1e293b" stroke="#334155" strokeWidth="2.5" />
    <circle cx="50" cy="35" r="8" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
    <g className="animate-spin" style={{ transformOrigin: '50px 35px', animationDuration: '6s' }}>
      <path d="M 50 35 L 50 2 M 49 2 L 51 2" stroke="#10b981" strokeWidth="3" />
      <path d="M 50 35 L 20 52" stroke="#10b981" strokeWidth="3" />
      <path d="M 50 35 L 80 52" stroke="#10b981" strokeWidth="3" />
    </g>
  </svg>
);

const TavernCafeSVG = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <rect x="15" y="45" width="70" height="45" fill="#451a03" stroke="#78350f" strokeWidth="2.5" />
    <polygon points="10,45 50,15 90,45" fill="#fef08a" stroke="#78350f" strokeWidth="3" />
    <line x1="30" y1="45" x2="30" y2="90" stroke="#78350f" strokeWidth="2" />
    <line x1="70" y1="45" x2="70" y2="90" stroke="#78350f" strokeWidth="2" />
    <rect x="22" y="10" width="10" height="20" fill="#4b5563" stroke="#374151" strokeWidth="1.5" />
    <circle cx="27" cy="5" r="2.5" fill="#9ca3af" className="animate-ping" opacity="0.7" />
  </svg>
);

export default function AgentsHub() {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: 'agent-architect',
      name: 'Agent Architect',
      role: 'Dev',
      spriteName: 'mewtwo',
      personality: 'focused',
      color: '#c084fc',
      x: 5,
      y: 5,
      startX: 5,
      startY: 5,
      targetX: 5,
      targetY: 5,
      status: 'Generating ideas...',
      task: 'Idle',
      taskQueue: [],
      isPaused: false,
      roboticTraits: 'Equipped with cognitive neural synapses, deep model synthesis logic, and auto-spawner subassemblies.',
      cpu: 12,
      ram: 256
    },
    {
      id: 'agent-devops',
      name: 'DevOps Rotom',
      role: 'DevOps',
      spriteName: 'rotom-wash',
      personality: 'focused',
      color: '#5ccfe6',
      x: 1,
      y: 8,
      startX: 1,
      startY: 8,
      targetX: 1,
      targetY: 8,
      status: 'Awaiting tasks',
      task: 'Idle',
      taskQueue: [],
      isPaused: false,
      roboticTraits: 'Forged from plasma coils, hydraulic washers, and dual high-frequency wifi antennas. Specialized in container pipelines.',
      cpu: 18,
      ram: 242
    },
    {
      id: 'agent-security',
      name: 'SecMagnezone',
      role: 'Security',
      spriteName: 'magnezone',
      personality: 'pragmatic',
      color: '#fbbf24',
      x: 1,
      y: 1,
      startX: 1,
      startY: 1,
      targetX: 1,
      targetY: 1,
      status: 'Monitoring registry integrity',
      task: 'Ecosystem guard duty',
      taskQueue: [],
      isPaused: false,
      roboticTraits: 'Equipped with heavy magnetic shielding plating, triple-lens focal visors, and high-entropy security scanners.',
      cpu: 32,
      ram: 512
    }
  ]);

  const [logs, setLogs] = useState<LogMessage[]>([
    {
      id: 'log-initial-1',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      agentName: 'System',
      message: 'Welcome to the Autonomous Pokémon Simulation Grid! Dispatch a command to start.',
      type: 'info'
    }
  ]);

  const addLog = (agentName: string, message: string, type: 'info' | 'success' | 'warning' = 'info') => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs((prev) => [
      ...prev,
      { id: `log-${Date.now()}-${Math.random()}`, timestamp, agentName, message, type }
    ]);
    setCurrentDialogMessage(`${agentName}: ${message}`);
  };

  // Global Telemetry Metrics
  const [telemetry, setTelemetry] = useState({
    bandwidth: 12.4,
    load: 22,
    jobsCompleted: 0,
    powerDraw: 85
  });

  // Sound Engine mute/unmute state
  const [isMuted, setIsMuted] = useState(false);

  // Spend/Rate limits budget slider control
  const [spendLimit, setSpendLimit] = useState(0.00);

  // Historical lists for live plotting
  const [bandwidthHistory, setBandwidthHistory] = useState<number[]>([12, 15, 10, 8, 14, 18, 11, 13, 16, 12]);
  const [loadHistory, setLoadHistory] = useState<number[]>([20, 25, 22, 18, 24, 28, 21, 23, 26, 22]);

  // Footprint / Dust particle tracking for 60fps movement trail
  const [particles, setParticles] = useState<WalkingParticle[]>([]);

  // Showdown GIF load failures tracking
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Dialog Typing effect state
  const [typedDialogText, setTypedDialogText] = useState('');
  const [typingIndex, setTypingIndex] = useState(0);
  const [currentDialogMessage, setCurrentDialogMessage] = useState('System: Welcome to the Autonomous Pokémon Simulation Grid! Dispatch a command to start.');

  // Pre-coded agent suggestions database
  const ARCHITECT_SUGGESTIONS: AgentSuggestion[] = [
    {
      name: 'Git-Sentinel',
      role: 'Security',
      spriteName: 'scizor',
      personality: 'focused',
      concept: 'Staged Version Control & Push Sentinel',
      detailedPrompt: 'Crawl staging indices, compile diff reports, and push to GitHub automatically using AI commits.',
      steps: [
        '1. Inspects modified file headers.',
        '2. Generates conventional commit logs.',
        '3. Sweeps code branches and pushes changes to Git.'
      ]
    },
    {
      name: 'SysEnv-Healer',
      role: 'DevOps',
      spriteName: 'metagross',
      personality: 'pragmatic',
      concept: 'Windows PATH Registry Sweeper',
      detailedPrompt: 'Inspect Windows system environment PATH variables, eliminate redundant/broken link paths, and synchronize SDK runtimes.',
      steps: [
        '1. Crawls system PATH variables.',
        '2. Checks for dead binary executables.',
        '3. Flushes invalid paths to heal build commands.'
      ]
    },
    {
      name: 'Query-Optimizer',
      role: 'Dev',
      spriteName: 'genesect',
      personality: 'focused',
      concept: 'Database Query Optimizer',
      detailedPrompt: 'Scan SQL tables, inspect key references, run execution EXPLAIN statements, and automatically build optimal indexes.',
      steps: [
        '1. Intercepts local DB queries.',
        '2. Assesses table structures.',
        '3. Injects Postgres index proposals.'
      ]
    },
    {
      name: 'Style-Guard',
      role: 'Dev',
      spriteName: 'pikachu',
      personality: 'chaotic',
      concept: 'CSS margin & mobile flexbox healer',
      detailedPrompt: 'Review CSS styles, repair flexbox alignments, remove redundant spacing, and optimize responsive mobile layout rules.',
      steps: [
        '1. Scans styles sheet files.',
        '2. Validates alignment parameters.',
        '3. Heals flexbox bugs.'
      ]
    },
    {
      name: 'Doc-Writer',
      role: 'Librarian',
      spriteName: 'slowking',
      personality: 'caffeinated',
      concept: 'Sitemap XML & Walkthrough compiler',
      detailedPrompt: 'Scan file tree additions, document component relationships, and automatically generate sitemaps or walkthrough logs.',
      steps: [
        '1. Indexes file structural modifications.',
        '2. Writes walkthrough updates.',
        '3. Keeps sitemap xml directories synchronized.'
      ]
    }
  ];

  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0);
  const activeSuggestion = ARCHITECT_SUGGESTIONS[currentSuggestionIndex];

  const [predefinedActions, setPredefinedActions] = useState<string[]>([
    'Audit PATH registry keys',
    'Optimize CSS styles',
    'Version local git files',
    'Prune redundant downloads',
    'Scan credentials environment',
    'Check docker container states'
  ]);

  const [newActionText, setNewActionText] = useState('');
  const [selectedAgentId, setSelectedAgentId] = useState(agents[0]?.id || '');
  const [selectedAction, setSelectedAction] = useState(predefinedActions[0]);
  const [customActionText, setCustomActionText] = useState('');
  const [inspectingAgent, setInspectingAgent] = useState<Agent | null>(null);
  
  // Factory Form states
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentRole, setNewAgentRole] = useState<'Dev' | 'DevOps' | 'Security' | 'Librarian'>('Dev');
  const [newAgentPersonality, setNewAgentPersonality] = useState<'focused' | 'caffeinated' | 'chaotic' | 'pragmatic'>('focused');
  const [newAgentSprite, setNewAgentSprite] = useState('porygon2');

  const consoleEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Dialog typewriter effect loop
  useEffect(() => {
    setTypedDialogText('');
    setTypingIndex(0);
  }, [currentDialogMessage]);

  useEffect(() => {
    if (typingIndex < currentDialogMessage.length) {
      const timeout = setTimeout(() => {
        setTypedDialogText((prev) => prev + currentDialogMessage[typingIndex]);
        setTypingIndex((prev) => prev + 1);
      }, 25);
      return () => clearTimeout(timeout);
    }
  }, [typingIndex, currentDialogMessage]);

  // Telemetry fluctuation loop to make passive watching enjoyable
  useEffect(() => {
    const interval = setInterval(() => {
      const activeMovingCount = agents.filter(a => !a.isPaused && (a.x !== a.targetX || a.y !== a.targetY)).length;
      
      setTelemetry((prev) => {
        const bandwidthChange = activeMovingCount > 0 ? (Math.random() * 15 + 15) : (Math.random() * 2 + 1);
        const loadChange = Math.min(95, Math.max(5, (activeMovingCount * 22) + Math.floor(Math.random() * 10)));
        const powerChange = Math.max(45, 60 + (activeMovingCount * 30) + Math.floor(Math.random() * 10));

        // Update charts history
        setBandwidthHistory((prevHist) => [...prevHist.slice(1), Number(bandwidthChange.toFixed(1))]);
        setLoadHistory((prevHist) => [...prevHist.slice(1), loadChange]);

        return {
          ...prev,
          bandwidth: Number(bandwidthChange.toFixed(1)),
          load: loadChange,
          powerDraw: powerChange
        };
      });

      // Fluctuating individual agent CPU & RAM
      setAgents((prevAgents) =>
        prevAgents.map((a) => {
          if (a.isPaused) return { ...a, cpu: 0 };
          const isWorking = a.x !== a.targetX || a.y !== a.targetY;
          const cpuLoad = isWorking ? Math.floor(Math.random() * 45 + 50) : Math.floor(Math.random() * 10 + 5);
          const ramFootprint = Math.min(1024, Math.max(128, a.ram + Math.floor(Math.random() * 20 - 10)));
          
          const updated = { ...a, cpu: cpuLoad, ram: ramFootprint };
          if (inspectingAgent?.id === a.id) {
            setInspectingAgent(updated);
          }
          return updated;
        })
      );

    }, 2000);

    return () => clearInterval(interval);
  }, [agents, inspectingAgent]);

  // Main Simulation Loop (moves agents every 1.5 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents((prevAgents) =>
        prevAgents.map((agent) => {
          let { x, y, targetX, targetY, personality, name, isPaused, taskQueue } = agent;

          if (isPaused) return agent;

          // Arrived
          if (x === targetX && y === targetY) {
            if (personality === 'caffeinated' && Math.random() < 0.25 && (x !== 5 || y !== 5)) {
              addLog(name, 'Feeling low on charge. Relocating to Game Corner Cafe for quick power recharge.', 'info');
              return { ...agent, startX: x, startY: y, targetX: 5, targetY: 5, status: 'Charging at Cafe' };
            }
            
            if (personality === 'chaotic' && Math.random() < 0.2 && agent.task === 'Idle') {
              const nextStation = WORKSTATIONS[Math.floor(Math.random() * WORKSTATIONS.length)];
              addLog(name, `Matrix anomaly triggered. Routing chaotic sweep to: ${nextStation.name}`, 'warning');
              return { ...agent, startX: x, startY: y, targetX: nextStation.x, targetY: nextStation.y, status: `Sweeping ${nextStation.name}` };
            }

            if (agent.task !== 'Idle' && x !== 5 && y !== 5) {
              addLog(name, `Completed data cargo delivery: "${agent.task}". Status returns to ready.`, 'success');
              playSynthSound('success', isMuted);
              setTelemetry(prev => ({ ...prev, jobsCompleted: prev.jobsCompleted + 1 }));

              // Task Queue Handler
              if (taskQueue.length > 0) {
                const nextTask = taskQueue[0];
                const newQueue = taskQueue.slice(1);
                const nextStation = WORKSTATIONS[Math.floor(Math.random() * (WORKSTATIONS.length - 1))];
                addLog(name, `Dequeued next script: "${nextTask}". Routing to ${nextStation.name}...`, 'info');
                
                return {
                  ...agent,
                  task: nextTask,
                  taskQueue: newQueue,
                  startX: x,
                  startY: y,
                  targetX: nextStation.x,
                  targetY: nextStation.y,
                  status: `Processing queue: ${nextTask}`
                };
              }

              return { ...agent, task: 'Idle', status: 'Idling' };
            }

            return agent;
          }

          // Path routing calculations: Follows H-shaped dirt roads
          let nextX = x;
          let nextY = y;

          if (y !== 5 && x !== targetX) {
            if (y < 5) nextY = y + 1;
            else nextY = y - 1;
          } else if (y === 5 && x !== targetX) {
            if (x < targetX) nextX = x + 1;
            else nextX = x - 1;
          } else if (x === targetX && y !== targetY) {
            if (y < targetY) nextY = y + 1;
            else nextY = y - 1;
          }

          // Spawn footprint particle at current coordinate before moving
          const particleId = `part-${Date.now()}-${Math.random()}`;
          setParticles((prev) => [...prev, { id: particleId, x, y }]);
          setTimeout(() => {
            setParticles((prev) => prev.filter(p => p.id !== particleId));
          }, 1100);

          return {
            ...agent,
            x: nextX,
            y: nextY,
            status: `Moving to node (${targetX}, ${targetY})...`
          };
        })
      );
    }, 1500);

    return () => clearInterval(interval);
  }, [isMuted]);

  useEffect(() => {
    if (agents.length > 0 && !agents.some(a => a.id === selectedAgentId)) {
      setSelectedAgentId(agents[0].id);
    }
  }, [agents]);

  // Periodically cycle Architect recommendations (every 16 seconds if no manual click)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSuggestionIndex((prev) => (prev + 1) % ARCHITECT_SUGGESTIONS.length);
    }, 16000);
    return () => clearInterval(interval);
  }, []);

  const handleAssignAction = async (e: FormEvent) => {
    e.preventDefault();
    const finalActionText = customActionText.trim() || selectedAction;
    if (!finalActionText) return;

    const targetAgent = agents.find(a => a.id === selectedAgentId);
    if (!targetAgent) return;

    if (targetAgent.isPaused) {
      addLog('System', `Cannot dispatch task. ${targetAgent.name} is currently suspended.`, 'warning');
      playSynthSound('error', isMuted);
      return;
    }

    playSynthSound('click', isMuted);
    const targetStation = WORKSTATIONS[Math.floor(Math.random() * (WORKSTATIONS.length - 1))];

    if (targetAgent.task !== 'Idle') {
      if (targetAgent.taskQueue.length >= 3) {
        addLog('System', `Request rejected: ${targetAgent.name}'s task pipeline queue is full (max 3 queued jobs).`, 'warning');
        playSynthSound('error', isMuted);
        return;
      }
      setAgents((prev) =>
        prev.map((agent) => {
          if (agent.id === selectedAgentId) {
            const newQueue = [...agent.taskQueue, finalActionText];
            addLog(agent.name, `Task Queued: "${finalActionText}" (Position: ${newQueue.length})`, 'info');
            const updated = { ...agent, taskQueue: newQueue };
            if (inspectingAgent?.id === agent.id) {
              setInspectingAgent(updated);
            }
            return updated;
          }
          return agent;
        })
      );
      setCustomActionText('');
      return;
    }

    setAgents((prev) =>
      prev.map((agent) => {
        if (agent.id === selectedAgentId) {
          addLog(agent.name, `Cargo Assigned: "${finalActionText}". Transporting packet to ${targetStation.name}...`, 'info');
          
          const updated = {
            ...agent,
            task: finalActionText,
            startX: agent.x,
            startY: agent.y,
            targetX: targetStation.x,
            targetY: targetStation.y,
            status: `Active load: ${finalActionText}`
          };
          
          if (inspectingAgent?.id === agent.id) {
            setInspectingAgent(updated);
          }
          return updated;
        }
        return agent;
      })
    );

    setCustomActionText('');

    try {
      const response = await fetch('/api/agents/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentName: targetAgent.name, task: finalActionText })
      });
      const data = await response.json();
      if (data.reply) {
        addLog(targetAgent.name, data.reply, 'success');
      } else {
        throw new Error("Invalid reply");
      }
    } catch (err) {
      setTimeout(() => {
        addLog(targetAgent.name, `[Local Simulation Fallback] Executed script task: "${finalActionText}". Completed successfully inside local workspace sandbox.`, 'success');
      }, 3000);
    }
  };

  const handleAddNewAction = (e: FormEvent) => {
    e.preventDefault();
    if (!newActionText.trim()) return;
    if (predefinedActions.includes(newActionText.trim())) {
      alert('Action already exists.');
      return;
    }
    playSynthSound('click', isMuted);
    setPredefinedActions((prev) => [...prev, newActionText.trim()]);
    setSelectedAction(newActionText.trim());
    addLog('System', `New pre-defined action loaded: "${newActionText.trim()}"`, 'success');
    setNewActionText('');
  };

  const handleCreateAgent = (e: FormEvent) => {
    e.preventDefault();
    if (!newAgentName.trim()) return;

    playSynthSound('click', isMuted);
    const colors = {
      Dev: '#5ccfe6',
      DevOps: '#7fd88f',
      Security: '#fbbf24',
      Librarian: '#f87171'
    };

    const targetSprite = AVAILABLE_POKEMON.find(p => p.file === newAgentSprite);
    const details = targetSprite ? targetSprite.description : 'Equipped with cybernetic interfaces and local micro-computational chips.';

    const newAgent: Agent = {
      id: `agent-${Date.now()}`,
      name: newAgentName.trim(),
      role: newAgentRole,
      spriteName: newAgentSprite,
      personality: newAgentPersonality,
      color: colors[newAgentRole],
      x: 5,
      y: 5,
      startX: 5,
      startY: 5,
      targetX: 5,
      targetY: 5,
      status: 'Initial boot success',
      task: 'Idle',
      taskQueue: [],
      isPaused: false,
      roboticTraits: details,
      cpu: 10,
      ram: 256
    };

    setAgents((prev) => [...prev, newAgent]);
    addLog('System', `Spawned autonomous Pokémon agent: ${newAgent.name} [Model: ${newAgent.spriteName}]`, 'success');
    setNewAgentName('');
  };

  // Build recommendation spawner automatically
  const handleBuildArchitectSuggestion = () => {
    if (agents.some(a => a.name.toLowerCase() === activeSuggestion.name.toLowerCase())) {
      alert('This recommended agent is already synthesized and active on the grid!');
      return;
    }

    playSynthSound('success', isMuted);
    const colors = {
      Dev: '#5ccfe6',
      DevOps: '#7fd88f',
      Security: '#fbbf24',
      Librarian: '#f87171'
    };

    const newAgent: Agent = {
      id: `agent-${Date.now()}`,
      name: activeSuggestion.name,
      role: activeSuggestion.role,
      spriteName: activeSuggestion.spriteName,
      personality: activeSuggestion.personality,
      color: colors[activeSuggestion.role],
      x: 5,
      y: 5,
      startX: 5,
      startY: 5,
      targetX: 5,
      targetY: 5,
      status: 'Booted by Architect',
      task: 'Idle',
      taskQueue: [],
      isPaused: false,
      roboticTraits: activeSuggestion.detailedPrompt,
      cpu: 15,
      ram: 256
    };

    setAgents((prev) => [...prev, newAgent]);
    addLog('Agent Architect', `Successfully compiled and spawned recommended bot: ${newAgent.name}!`, 'success');
    
    // Auto-advance suggestion index
    setCurrentSuggestionIndex((prev) => (prev + 1) % ARCHITECT_SUGGESTIONS.length);
  };

  const handleDecommissionAgent = (id: string) => {
    const targetAgent = agents.find(a => a.id === id);
    if (!targetAgent) return;
    
    if (confirm(`Are you sure you want to decommission and remove ${targetAgent.name}?`)) {
      playSynthSound('click', isMuted);
      setAgents((prev) => prev.filter((a) => a.id !== id));
      addLog('System', `Agent ${targetAgent.name} successfully removed.`, 'warning');
      if (inspectingAgent?.id === id) {
        setInspectingAgent(null);
      }
    }
  };

  const handleTogglePauseAgent = (id: string) => {
    playSynthSound('click', isMuted);
    setAgents((prev) =>
      prev.map((agent) => {
        if (agent.id === id) {
          const updatedState = !agent.isPaused;
          addLog(agent.name, updatedState ? 'Agent suspended.' : 'Agent resumed.', 'info');
          const updated = {
            ...agent,
            isPaused: updatedState,
            status: updatedState ? '[SUSPENDED]' : 'Ready'
          };
          if (inspectingAgent?.id === id) {
            setInspectingAgent(updated);
          }
          return updated;
        }
        return agent;
      })
    );
  };

  // Helper to generate coordinates path for line chart
  const generatePathData = (history: number[], maxVal: number) => {
    const width = 120;
    const height = 24;
    const step = width / (history.length - 1);
    return history.map((val, i) => {
      const x = i * step;
      const y = height - (val / maxVal) * height;
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(' ');
  };

  const getPathProgress = (agent: Agent) => {
    const totalDist = Math.abs(agent.startX - agent.targetX) + Math.abs(agent.startY - agent.targetY);
    if (totalDist === 0) return 100;
    const currDist = Math.abs(agent.x - agent.targetX) + Math.abs(agent.y - agent.targetY);
    return Math.floor(((totalDist - currDist) / totalDist) * 100);
  };

  const renderAgentSVG = (role: 'Dev' | 'DevOps' | 'Security' | 'Librarian', color: string) => {
    if (role === 'DevOps') return <DevOpsRobotSVG color={color} />;
    if (role === 'Security') return <SecurityRobotSVG color={color} />;
    if (role === 'Dev') return <DeveloperRobotSVG color={color} />;
    return <WriterRobotSVG color={color} />;
  };

  return (
    <div className="space-y-12 animate-fade-in text-foreground">
      {/* NO-SPEND GUARD: Prominent Billing Alert Warning Sign */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border border-amber-color/30 bg-[#161310] text-amber-color font-mono text-xs shadow-md">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 animate-pulse text-amber-color" />
          <div className="space-y-0.5">
            <div className="font-bold uppercase tracking-wider">Simulated Sandbox Sandbox Guard</div>
            <p className="text-muted-foreground text-[10px] leading-relaxed">
              All agent activities are executed in local memory simulation. The sandbox prevents credit allocation and blocks external real-world cloud spend.
            </p>
          </div>
        </div>

        {/* Interactive Spend limit Budget controller */}
        <div className="flex items-center gap-3 border-t md:border-t-0 md:border-l border-amber-color/20 pt-3 md:pt-0 md:pl-4">
          <div className="text-right">
            <span className="block text-[9px] uppercase text-muted-foreground font-bold">Anti-Overcharge Budget</span>
            <span className="font-bold text-foreground text-xs">${spendLimit.toFixed(2)} / Session</span>
          </div>
          <input
            type="range"
            min="0"
            max="5.0"
            step="0.5"
            value={spendLimit}
            onChange={(e) => {
              playSynthSound('click', isMuted);
              setSpendLimit(parseFloat(e.target.value));
            }}
            className="w-24 accent-amber-color cursor-pointer"
          />
        </div>
      </div>

      {/* Header bar controls: Sound Toggle */}
      <div className="flex justify-end pr-1">
        <button
          onClick={() => {
            setIsMuted(!isMuted);
            playSynthSound('click', !isMuted);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-color bg-muted/10 hover:bg-muted/20 text-muted-foreground hover:text-foreground text-xs font-mono transition-colors cursor-pointer"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan" />}
          <span>{isMuted ? 'Unmute SFX' : 'Mute SFX'}</span>
        </button>
      </div>

      {/* Global Telemetry Metrics Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in animate-duration-300" id="telemetry-dashboard">
        <div className="bg-muted/15 border border-border-color p-4 rounded-xl flex flex-col justify-between space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-muted-foreground text-[10px] font-mono uppercase tracking-wider">
            <span>Matrix Load</span>
            <Cpu className="w-3.5 h-3.5 text-amber-color" />
          </div>
          <div className="flex items-baseline gap-1 relative z-10">
            <span className="font-display text-2xl font-bold text-foreground">{telemetry.load}</span>
            <span className="font-mono text-xs text-muted-foreground">%</span>
          </div>
          
          <div className="absolute right-2 bottom-1 w-28 h-6 opacity-35">
            <svg viewBox="0 0 120 24" className="w-full h-full">
              <path
                d={generatePathData(loadHistory, 100)}
                fill="none"
                stroke="#fbbf24"
                strokeWidth="1.5"
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
          </div>
        </div>

        <div className="bg-muted/15 border border-border-color p-4 rounded-xl flex flex-col justify-between space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-muted-foreground text-[10px] font-mono uppercase tracking-wider">
            <span>Bandwidth Transfer</span>
            <Activity className="w-3.5 h-3.5 text-cyan" />
          </div>
          <div className="flex items-baseline gap-1 relative z-10">
            <span className="font-display text-2xl font-bold text-foreground">{telemetry.bandwidth}</span>
            <span className="font-mono text-xs text-muted-foreground">MB/s</span>
          </div>
          
          <div className="absolute right-2 bottom-1 w-28 h-6 opacity-35">
            <svg viewBox="0 0 120 24" className="w-full h-full">
              <path
                d={generatePathData(bandwidthHistory, 40)}
                fill="none"
                stroke="#5ccfe6"
                strokeWidth="1.5"
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
          </div>
        </div>

        <div className="bg-muted/15 border border-border-color p-4 rounded-xl flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-muted-foreground text-[10px] font-mono uppercase tracking-wider">
            <span>Active Power</span>
            <Zap className="w-3.5 h-3.5 text-emerald-color" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-2xl font-bold text-foreground">{telemetry.powerDraw}</span>
            <span className="font-mono text-xs text-muted-foreground">Watts</span>
          </div>
          <div className="w-full bg-muted-foreground/10 h-1 rounded overflow-hidden">
            <div className="bg-emerald-color h-full transition-all duration-500" style={{ width: `${Math.min(100, (telemetry.powerDraw / 200) * 100)}%` }} />
          </div>
        </div>

        <div className="bg-muted/15 border border-border-color p-4 rounded-xl flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-muted-foreground text-[10px] font-mono uppercase tracking-wider">
            <span>Completed Deliveries</span>
            <Layers className="w-3.5 h-3.5 text-purple-color" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-2xl font-bold text-foreground">{telemetry.jobsCompleted}</span>
            <span className="font-mono text-xs text-muted-foreground">Jobs</span>
          </div>
          <div className="w-full bg-muted-foreground/10 h-1 rounded overflow-hidden">
            <div className="bg-purple-color h-full transition-all duration-500" style={{ width: `${Math.min(100, telemetry.jobsCompleted * 10)}%` }} />
          </div>
        </div>
      </div>

      {/* Grid & Control Panel Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Game Screen Simulation Grid (60 FPS Visuals) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="relative p-6 rounded-2xl bg-muted/10 dark:bg-[#10141d]/30 border border-border-color shadow-xl overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808007_1px,transparent_1px),linear-gradient(to_bottom,#80808007_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
            
            {/* Clean Simulation Screen */}
            <div className="relative aspect-square w-full grid grid-cols-10 border border-border-color/60 bg-[#090d14]/75 rounded-xl overflow-hidden p-1 shadow-inner select-none">
              
              {/* Target lines vector paths for active agents */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                {agents.map((agent) => {
                  if (agent.isPaused || (agent.x === agent.targetX && agent.y === agent.targetY)) return null;
                  
                  const startX = `${agent.x * 10 + 5}%`;
                  const startY = `${agent.y * 10 + 5}%`;
                  const endX = `${agent.targetX * 10 + 5}%`;
                  const endY = `${agent.targetY * 10 + 5}%`;

                  return (
                    <line
                      key={agent.id}
                      x1={startX}
                      y1={startY}
                      x2={endX}
                      y2={endY}
                      stroke={agent.color}
                      strokeWidth="1.5"
                      strokeDasharray="4 3"
                      opacity="0.5"
                    />
                  );
                })}
              </svg>

              {/* Draw 100 cells */}
              {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
                const cellX = index % GRID_SIZE;
                const cellY = Math.floor(index / GRID_SIZE);

                const isRoad = isPathTile(cellX, cellY);

                const hasMainframe = cellX === 1 && cellY === 1;
                const hasGit = cellX === 1 && cellY === 8;
                const hasFlask = cellX === 8 && cellY === 1;
                const hasWindmill = cellX === 8 && cellY === 8;
                const hasTavern = cellX === 5 && cellY === 5;

                const stationRGB = 
                  hasMainframe ? '251, 191, 36' :
                  hasGit ? '92, 207, 230' :
                  hasFlask ? '168, 85, 247' :
                  hasWindmill ? '127, 216, 143' :
                  hasTavern ? '248, 113, 113' : '';

                const isOccupied = agents.some(a => !a.isPaused && a.x === cellX && a.y === cellY && (a.x !== a.targetX || a.y !== a.targetY || a.task !== 'Idle'));

                return (
                  <div
                    key={index}
                    className={`relative aspect-square flex items-center justify-center transition-all ${
                      hasMainframe || hasGit || hasFlask || hasWindmill || hasTavern
                        ? 'bg-[#1b2c1f]/40 border border-[#3e684a]/50 shadow-md' 
                        : isRoad 
                        ? 'bg-[#d2b48c]/10 border-[0.5px] border-[#c2a47c]/10' // Clean path styling
                        : 'bg-[#182315]/10 border-[0.5px] border-border-color/5' // Grass matrix style
                    }`}
                  >
                    {isOccupied && stationRGB && (
                      <div 
                        className="absolute w-full h-full rounded-full opacity-60 pointer-events-none scale-110 animate-ping z-0"
                        style={{ border: `1.5px solid rgba(${stationRGB}, 0.6)` }}
                      />
                    )}

                    {hasMainframe && <div className="w-11/12 h-11/12 z-10"><CyberCastleSVG /></div>}
                    {hasGit && <div className="w-11/12 h-11/12 z-10"><PokeCenterSVG /></div>}
                    {hasFlask && <div className="w-11/12 h-11/12 z-10"><FlaskLabSVG /></div>}
                    {hasWindmill && <div className="w-11/12 h-11/12 z-10"><WindmillGeneratorSVG /></div>}
                    {hasTavern && <div className="w-11/12 h-11/12 z-10"><TavernCafeSVG /></div>}
                  </div>
                );
              })}

              {/* Render 60fps Walk Footprint/Dust Particles */}
              {particles.map((part) => {
                const partLeft = `calc(${part.x * 10}% + 5% - 4px)`;
                const partTop = `calc(${part.y * 10}% + 5% - 4px)`;
                return (
                  <div 
                    key={part.id}
                    className="absolute w-2 h-2 rounded-full bg-slate-500/30 blur-[0.5px] animate-ping"
                    style={{ left: partLeft, top: partTop }}
                  />
                );
              })}

              {/* Render Animated Pokémon Agents with detailed Game HUD */}
              {agents.map((agent) => {
                const leftPos = `calc(${agent.x * 10}% + 5% - 20px)`;
                const topPos = `calc(${agent.y * 10}% + 5% - 20px)`;

                const isCarrying = agent.task !== 'Idle';
                const isMoving = !agent.isPaused && (agent.x !== agent.targetX || agent.y !== agent.targetY);
                const progress = getPathProgress(agent);
                const hasImageError = imageErrors[agent.id];

                return (
                  <motion.div
                    key={agent.id}
                    layout
                    onClick={() => {
                      playSynthSound('click', isMuted);
                      setInspectingAgent(agent);
                    }}
                    className={`absolute w-10 h-10 flex flex-col items-center justify-center z-20 cursor-pointer ${
                      isMoving ? 'agent-walk-bounce' : ''
                    }`}
                    style={{
                      left: leftPos,
                      top: topPos,
                      filter: agent.isPaused ? 'grayscale(100%) opacity(0.5)' : 'none',
                      transition: { type: 'spring', stiffness: 130, damping: 14 }
                    }}
                  >
                    {/* Floating RPG HUD Panel (Lvl 99, HP, EXP) */}
                    <div className="absolute bottom-[110%] w-24 bg-[#0a0f1d]/95 border border-border-color rounded p-1 shadow-2xl space-y-1 text-[6px] font-mono pointer-events-none z-30">
                      
                      <div className="flex justify-between text-foreground font-bold">
                        <span className="truncate max-w-[55%]">{agent.name}</span>
                        <span className="text-amber-color">
                          {agent.taskQueue.length > 0 ? `+${agent.taskQueue.length}Q` : 'Lv99'}
                        </span>
                      </div>

                      {/* HP Bar */}
                      <div className="space-y-0.5">
                        <div className="flex justify-between text-[4px] text-muted-foreground uppercase">
                          <span>HP</span>
                          <span>100%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1 rounded overflow-hidden">
                          <div className="bg-emerald-color h-full" style={{ width: '100%' }} />
                        </div>
                      </div>

                      {/* EXP Bar (Visible during active tasks) */}
                      {isCarrying && (
                        <div className="space-y-0.5">
                          <div className="flex justify-between text-[4px] text-muted-foreground uppercase">
                            <span>EXP</span>
                            <span>{progress}%</span>
                          </div>
                          <div className="w-full bg-slate-800 h-1 rounded overflow-hidden">
                            <div className="bg-cyan h-full transition-all duration-500" style={{ width: `${progress}%` }} />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Cargo Carrying Animation */}
                    {isCarrying && !agent.isPaused && (
                      <div className="absolute bottom-[65%] left-1/2 transform -translate-x-1/2 text-xs cargo-box z-30">
                        📦
                      </div>
                    )}

                    {/* Shadow underneath sprite */}
                    <div 
                      className="absolute bottom-0 w-6 h-1 rounded-full bg-black/40 blur-[1px] transition-transform"
                      style={{ transform: isMoving ? 'scale(0.85)' : 'scale(1)' }}
                    />

                    {/* Bulletproof image load fallback */}
                    {hasImageError ? (
                      <div className="w-8 h-8 p-0.5 z-10">
                        {renderAgentSVG(agent.role, agent.color)}
                      </div>
                    ) : (
                      <img 
                        src={`${SPRITE_BASE_URL}${agent.spriteName}.gif`}
                        alt={agent.name}
                        className="w-8 h-8 object-contain drop-shadow-[0_0_4px_rgba(255,255,255,0.2)] z-10"
                        onError={() => {
                          setImageErrors(prev => ({ ...prev, [agent.id]: true }));
                        }}
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Control Panels & Inspector */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Panel 1: AI Agent Architect Suggestions Card */}
          <div className="p-5 rounded-2xl bg-purple-color/5 border-2 border-purple-color/40 shadow-[0_0_15px_rgba(168,85,247,0.15)] space-y-4 animate-fade-in relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-20 h-20 bg-purple-color/10 rounded-full blur-xl pointer-events-none" />
            
            <h3 className="font-mono text-xs font-bold text-purple-color uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-color animate-pulse" />
              <span>🧠 Agent Architect Recommendations</span>
            </h3>

            {activeSuggestion ? (
              <div className="space-y-3 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-purple-color/20 text-purple-color rounded text-[10px] font-bold">
                    Concept Suggestion
                  </span>
                  <span className="font-bold text-foreground">{activeSuggestion.concept}</span>
                </div>

                <div className="p-3 rounded-lg bg-background/50 border border-purple-color/20 space-y-2">
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <strong>Recommended Name:</strong> <span className="text-foreground font-bold">{activeSuggestion.name}</span>
                    <strong className="ml-2">Sprite:</strong> <span className="text-foreground capitalize">{activeSuggestion.spriteName}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    <span className="text-purple-color font-bold">Prompt Function: </span>
                    {activeSuggestion.detailedPrompt}
                  </p>
                </div>

                {/* Step by step guide */}
                <div className="space-y-1 p-2.5 rounded bg-[#090d14]/70 border border-border-color/40 text-[9px] text-muted-foreground leading-relaxed">
                  <span className="text-foreground font-bold uppercase block mb-1">Step-by-Step Deployment:</span>
                  {activeSuggestion.steps.map((step, idx) => (
                    <div key={idx}>{step}</div>
                  ))}
                </div>

                {/* Auto build click button */}
                <button
                  onClick={handleBuildArchitectSuggestion}
                  className="w-full py-2 bg-purple-color hover:bg-purple-color/90 text-white font-bold rounded-lg transition-colors cursor-pointer text-center text-xs flex items-center justify-center gap-1.5 shadow"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Accept Concept & Build Agent</span>
                </button>
              </div>
            ) : (
              <div className="text-center text-xs font-mono text-muted-foreground py-4">
                No active concepts in memory.
              </div>
            )}
          </div>
          
          {/* Panel 2: Agent Inspector */}
          <AnimatePresence>
            {inspectingAgent ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="p-5 rounded-2xl bg-muted/15 border border-border-color/60 shadow-lg space-y-4"
              >
                <div className="flex items-center justify-between border-b border-border-color/40 pb-2 font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground uppercase tracking-wider">
                      🔧 Inspector: {inspectingAgent.name}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      playSynthSound('click', isMuted);
                      setInspectingAgent(null);
                    }}
                    className="text-muted-foreground hover:text-foreground text-[10px]"
                  >
                    [Close]
                  </button>
                </div>

                <div className="space-y-4 font-mono text-xs">
                  <div className="space-y-3 p-3 rounded-lg bg-background/40 border border-border-color/30">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] uppercase tracking-wider text-muted-foreground">
                        <span>CPU Usage</span>
                        <span className="font-bold text-foreground">{inspectingAgent.cpu}%</span>
                      </div>
                      <div className="w-full bg-muted-foreground/10 h-1.5 rounded overflow-hidden">
                        <div className="bg-amber-color h-full transition-all duration-300" style={{ width: `${inspectingAgent.cpu}%` }} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] uppercase tracking-wider text-muted-foreground">
                        <span>RAM Footprint</span>
                        <span className="font-bold text-foreground">{inspectingAgent.ram} MB</span>
                      </div>
                      <div className="w-full bg-muted-foreground/10 h-1.5 rounded overflow-hidden">
                        <div className="bg-cyan h-full transition-all duration-300" style={{ width: `${(inspectingAgent.ram / 1024) * 100}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded bg-background/30 border border-border-color/20 text-[10px] text-muted-foreground leading-relaxed">
                    <span className="text-foreground font-bold uppercase block mb-1">Robotic Hardware Details:</span>
                    {inspectingAgent.roboticTraits}
                  </div>

                  {inspectingAgent.taskQueue.length > 0 && (
                    <div className="p-2.5 rounded bg-[#0f172a] border border-cyan/20 text-[10px] text-cyan leading-relaxed">
                      <span className="text-foreground font-bold uppercase block mb-1">Pending Task Queue:</span>
                      {inspectingAgent.taskQueue.map((t, idx) => (
                        <div key={idx}>- [{idx + 1}] {t}</div>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 text-[10px] text-muted-foreground border-t border-border-color/20 pt-2.5">
                    <div><strong>Role:</strong> {inspectingAgent.role}</div>
                    <div><strong>Personality:</strong> {inspectingAgent.personality}</div>
                    <div><strong>Coordinate:</strong> ({inspectingAgent.x}, {inspectingAgent.y})</div>
                    <div><strong>Destination:</strong> ({inspectingAgent.targetX}, {inspectingAgent.targetY})</div>
                    <div className="col-span-2 text-amber-color font-bold"><strong>Current Task:</strong> {inspectingAgent.task}</div>
                    <div className="col-span-2"><strong>Status:</strong> {inspectingAgent.status}</div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2.5 border-t border-border-color/30">
                    <button
                      onClick={() => handleTogglePauseAgent(inspectingAgent.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-colors cursor-pointer ${
                        inspectingAgent.isPaused
                          ? 'bg-emerald-color/10 hover:bg-emerald-color/20 text-emerald-color border-emerald-color/30'
                          : 'bg-amber-color/10 hover:bg-amber-color/20 text-amber-color border-amber-color/30'
                      }`}
                    >
                      {inspectingAgent.isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                      <span>{inspectingAgent.isPaused ? 'Resume Bot' : 'Pause Bot'}</span>
                    </button>

                    <button
                      onClick={() => handleDecommissionAgent(inspectingAgent.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Decommission</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="p-5 rounded-2xl bg-muted/5 border border-dashed border-border-color/40 text-center text-xs font-mono text-muted-foreground py-8">
                <Info className="w-6 h-6 mx-auto mb-2 text-muted-foreground/40" />
                <span>Click on a Pokémon bot on the grid to inspect real-time CPU/RAM telemetry, robotic build details, and toggle pause/decommission states.</span>
              </div>
            )}
          </AnimatePresence>

          {/* Panel 3: Task Dispatcher & Predefined Actions */}
          <div className="p-5 rounded-2xl bg-muted/15 border border-border-color space-y-4">
            <h3 className="font-mono text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-cyan" />
              <span>Coordinated Task Assigner</span>
            </h3>

            <form onSubmit={handleAssignAction} className="space-y-4">
              <div className="space-y-1">
                <label className="block font-mono text-[10px] text-muted-foreground uppercase font-bold">Select Active Agent</label>
                <select
                  value={selectedAgentId}
                  onChange={(e) => setSelectedAgentId(e.target.value)}
                  className="w-full bg-background border border-border-color rounded-lg px-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-amber-color"
                >
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name} {agent.isPaused ? '[PAUSED]' : ''} {agent.taskQueue.length > 0 ? `(${agent.taskQueue.length} queued)` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* add actions - Predefined database dropdown */}
              <div className="space-y-1">
                <label className="block font-mono text-[10px] text-muted-foreground uppercase font-bold">Predefined Actions Database</label>
                <select
                  value={selectedAction}
                  onChange={(e) => {
                    setSelectedAction(e.target.value);
                    setCustomActionText('');
                  }}
                  className="w-full bg-background border border-border-color rounded-lg px-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-amber-color"
                >
                  {predefinedActions.map((action, idx) => (
                    <option key={idx} value={action}>
                      {action}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block font-mono text-[10px] text-muted-foreground uppercase font-bold">Or Dispatch Custom Task</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Write a custom script task..."
                    value={customActionText}
                    onChange={(e) => setCustomActionText(e.target.value)}
                    className="w-full bg-background/50 border border-border-color rounded-lg pl-3 pr-10 py-2 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-amber-color"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 p-1 bg-amber-color text-black rounded-md hover:bg-amber-color/90 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Panel 4: Add Predefined Actions Form */}
          <div className="p-5 rounded-2xl bg-muted/15 border border-border-color space-y-4">
            <h3 className="font-mono text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-purple-color" />
              <span>Create New Action Script</span>
            </h3>

            <form onSubmit={handleAddNewAction} className="space-y-3 font-mono text-xs">
              <div className="space-y-1">
                <label className="block text-[10px] text-muted-foreground uppercase font-bold">Action Name / Task Description</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g., Flush Postgres cache"
                    value={newActionText}
                    onChange={(e) => setNewActionText(e.target.value)}
                    className="w-full bg-background border border-border-color rounded-lg pl-3 pr-10 py-1.5 text-xs text-foreground focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 p-1 bg-purple-color text-white rounded hover:bg-purple-color/90 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Panel 5: Agent Spawner Factory */}
          <div className="p-5 rounded-2xl bg-muted/15 border border-border-color space-y-4">
            <h3 className="font-mono text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-emerald-color" />
              <span>Spawn New Agent</span>
            </h3>

            <form onSubmit={handleCreateAgent} className="space-y-3 font-mono text-xs">
              <div className="space-y-1">
                <label className="block text-[10px] text-muted-foreground uppercase font-bold">Agent Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DocBot, CleanMonkey"
                  value={newAgentName}
                  onChange={(e) => setNewAgentName(e.target.value)}
                  className="w-full bg-background border border-border-color rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] text-muted-foreground uppercase font-bold">Role & Type</label>
                  <select
                    value={newAgentRole}
                    onChange={(e: any) => setNewAgentRole(e.target.value)}
                    className="w-full bg-background border border-border-color rounded-lg px-2 py-1.5 text-xs text-foreground"
                  >
                    <option value="Dev">Developer Unit</option>
                    <option value="DevOps">DevOps Unit</option>
                    <option value="Security">Security Guard Unit</option>
                    <option value="Librarian">Librarian Unit</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] text-muted-foreground uppercase font-bold">Personality</label>
                  <select
                    value={newAgentPersonality}
                    onChange={(e: any) => setNewAgentPersonality(e.target.value)}
                    className="w-full bg-background border border-border-color rounded-lg px-2 py-1.5 text-xs text-foreground"
                  >
                    <option value="focused">focused (direct path)</option>
                    <option value="caffeinated">caffeinated (cafe break)</option>
                    <option value="chaotic">chaotic (roams grid)</option>
                    <option value="pragmatic">pragmatic (stable pace)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] text-muted-foreground uppercase font-bold">Select Pokémon Sprite</label>
                <select
                  value={newAgentSprite}
                  onChange={(e) => setNewAgentSprite(e.target.value)}
                  className="w-full bg-background border border-border-color rounded-lg px-2 py-1.5 text-xs text-foreground"
                >
                  {AVAILABLE_POKEMON.map((pokemon, idx) => (
                    <option key={idx} value={pokemon.file}>
                      {pokemon.name} - {pokemon.description.split('.')[0]}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-emerald-color hover:bg-emerald-color/90 text-black font-bold rounded-lg transition-colors cursor-pointer text-center text-xs mt-2"
              >
                Spawn Agent
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* Retro RPG Dialogue Box */}
      <div className="p-5 rounded-2xl bg-[#080d16] border-4 border-amber-color shadow-[0_0_15px_rgba(251,191,36,0.2)] space-y-2 relative font-mono text-xs text-foreground selection:bg-amber-color/30 animate-fade-in">
        
        <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t-2 border-l-2 border-amber-color/50" />
        <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t-2 border-r-2 border-amber-color/50" />
        <div className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 border-b-2 border-l-2 border-amber-color/50" />
        <div className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-b-2 border-r-2 border-amber-color/50" />

        <div className="flex items-center gap-1.5 border-b border-border-color/30 pb-1.5 text-[10px] text-amber-color font-bold tracking-widest uppercase">
          <span>Active RPG Dialog Log</span>
        </div>

        <div className="h-20 flex flex-col justify-between py-1 leading-relaxed selection:bg-amber-color/20 text-foreground/90 font-semibold select-text">
          <div>
            {typedDialogText}
            {typingIndex < currentDialogMessage.length && (
              <span className="w-1.5 h-3 bg-foreground inline-block ml-0.5 animate-pulse" />
            )}
          </div>

          {typingIndex >= currentDialogMessage.length && (
            <div className="flex justify-end animate-bounce">
              <span className="text-[10px] text-amber-color font-bold">▼</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
