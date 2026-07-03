import { useState, useEffect, useRef, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Send, Plus, Bot, Coffee, Shield, Database, LayoutGrid, Award, Server } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  emoji: string;
  role: 'Dev' | 'DevOps' | 'Security' | 'Librarian';
  personality: 'focused' | 'caffeinated' | 'chaotic' | 'pragmatic';
  color: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  status: string;
  task: string;
  speed: number;
}

interface LogMessage {
  id: string;
  timestamp: string;
  agentName: string;
  message: string;
  type: 'info' | 'success' | 'warning';
}

const GRID_SIZE = 10;

// Locations of workstations on the 10x10 grid
const WORKSTATIONS = [
  { name: 'Central Mainframe', x: 1, y: 1, icon: Server, color: 'text-amber-color border-amber-color/30 bg-amber-color/5' },
  { name: 'Git Repository', x: 1, y: 8, icon: LayoutGrid, color: 'text-cyan border-cyan/30 bg-cyan/5' },
  { name: 'Database Cluster', x: 8, y: 1, icon: Database, color: 'text-purple-color border-purple-color/30 bg-purple-color/5' },
  { name: 'Vercel Edge CDN', x: 8, y: 8, icon: Award, color: 'text-emerald-color border-emerald-color/30 bg-emerald-color/5' },
  { name: 'Coffee Lounge', x: 5, y: 5, icon: Coffee, color: 'text-rose-400 border-rose-400/30 bg-rose-400/5' }
];

export default function AgentsHub() {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: 'agent-devops',
      name: 'DevOps Bot',
      emoji: '🤖',
      role: 'DevOps',
      personality: 'focused',
      color: '#5ccfe6',
      x: 1,
      y: 8,
      targetX: 1,
      targetY: 8,
      status: 'Awaiting tasks',
      task: 'Idle',
      speed: 1
    },
    {
      id: 'agent-security',
      name: 'SecShield',
      emoji: '🛡️',
      role: 'Security',
      personality: 'pragmatic',
      color: '#fbbf24',
      x: 1,
      y: 1,
      targetX: 1,
      targetY: 1,
      status: 'Monitoring registry integrity',
      task: 'Ecosystem guard duty',
      speed: 1
    }
  ]);

  const [logs, setLogs] = useState<LogMessage[]>([
    {
      id: 'log-initial-1',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      agentName: 'System',
      message: 'Autonomous simulation grid initialized. Standing by.',
      type: 'info'
    }
  ]);

  // Form states
  const [selectedAgentId, setSelectedAgentId] = useState(agents[0].id);
  const [taskText, setTaskText] = useState('');
  
  // Factory Form states
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentRole, setNewAgentRole] = useState<'Dev' | 'DevOps' | 'Security' | 'Librarian'>('Dev');
  const [newAgentPersonality, setNewAgentPersonality] = useState<'focused' | 'caffeinated' | 'chaotic' | 'pragmatic'>('focused');
  const [newAgentEmoji, setNewAgentEmoji] = useState('🦊');

  const consoleEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs
  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Main Simulation Loop (runs movement every 2.5 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents((prevAgents) =>
        prevAgents.map((agent) => {
          let { x, y, targetX, targetY, personality, name } = agent;

          // If arrived at destination, decide next steps based on personality
          if (x === targetX && y === targetY) {
            // Caffeinated agents randomly walk to coffee lounge
            if (personality === 'caffeinated' && Math.random() < 0.25 && (x !== 5 || y !== 5)) {
              addLog(name, 'Feeling low on energy. Navigating to Coffee Lounge...', 'info');
              return { ...agent, targetX: 5, targetY: 5, status: 'Heading to Coffee Station' };
            }
            
            // Chaotic agents randomly walk to any node
            if (personality === 'chaotic' && Math.random() < 0.2 && agent.task === 'Idle') {
              const nextStation = WORKSTATIONS[Math.floor(Math.random() * WORKSTATIONS.length)];
              addLog(name, `Triggered random sweep to: ${nextStation.name}`, 'warning');
              return { ...agent, targetX: nextStation.x, targetY: nextStation.y, status: `Exploring ${nextStation.name}` };
            }

            // Normal idle behavior
            if (agent.task !== 'Idle' && x !== 5 && y !== 5) {
              // Mark task as done
              addLog(name, `Task complete: "${agent.task}". Resuming idle monitoring.`, 'success');
              return { ...agent, task: 'Idle', status: 'Monitoring network integrity' };
            }

            return agent;
          }

          // Step closer to target
          let nextX = x;
          let nextY = y;

          if (x < targetX) nextX = x + 1;
          else if (x > targetX) nextX = x - 1;
          
          if (y < targetY) nextY = y + 1;
          else if (y > targetY) nextY = y - 1;

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
  }, []);

  const addLog = (agentName: string, message: string, type: 'info' | 'success' | 'warning' = 'info') => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs((prev) => [
      ...prev,
      { id: `log-${Date.now()}-${Math.random()}`, timestamp, agentName, message, type }
    ]);
  };

  const handleAssignTask = (e: FormEvent) => {
    e.preventDefault();
    if (!taskText.trim()) return;

    // Pick a workstation randomly to "do the work"
    const targetStation = WORKSTATIONS[Math.floor(Math.random() * (WORKSTATIONS.length - 1))]; // avoid coffee lounge for task destination

    setAgents((prev) =>
      prev.map((agent) => {
        if (agent.id === selectedAgentId) {
          addLog(agent.name, `Received Task: "${taskText}". Navigating to ${targetStation.name}...`, 'info');
          return {
            ...agent,
            task: taskText,
            targetX: targetStation.x,
            targetY: targetStation.y,
            status: `Working on: ${taskText}`
          };
        }
        return agent;
      })
    );

    setTaskText('');
  };

  const handleCreateAgent = (e: FormEvent) => {
    e.preventDefault();
    if (!newAgentName.trim()) return;

    const colors = {
      Dev: '#5ccfe6',
      DevOps: '#7fd88f',
      Security: '#fbbf24',
      Librarian: '#f87171'
    };

    const newAgent: Agent = {
      id: `agent-${Date.now()}`,
      name: newAgentName.trim(),
      emoji: newAgentEmoji,
      role: newAgentRole,
      personality: newAgentPersonality,
      color: colors[newAgentRole],
      x: 5,
      y: 5,
      targetX: 5,
      targetY: 5,
      status: 'Online and idling',
      task: 'Idle',
      speed: 1
    };

    setAgents((prev) => [...prev, newAgent]);
    addLog('System', `New agent spawned: ${newAgent.name} [Role: ${newAgent.role}, Personality: ${newAgent.personality}]`, 'success');
    
    setNewAgentName('');
  };

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Title & Info */}
      <section className="text-center md:text-left space-y-4 max-w-3xl" id="agents-hero">
        <span className="font-mono text-xs text-amber-color tracking-widest uppercase font-semibold">
          Gamified Sandbox Environment
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          AI Autonomous <span className="text-amber-color">Agents Hub</span>
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          Create, coordinate, and assign tasks to autonomous agents. Watch their live pathfinding movements on the local 2-D network matrix and monitor their reasoning streams via the thought terminal below.
        </p>
      </section>

      {/* Main Grid & Controllers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: 2-D Grid Simulation (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="relative p-6 rounded-2xl bg-muted/10 dark:bg-[#10141d]/30 border border-border-color shadow-xl overflow-hidden">
            {/* Grid Container */}
            <div className="relative aspect-square w-full grid grid-cols-10 border border-border-color/60 bg-[#090d14]/70 rounded-xl overflow-hidden p-1">
              {/* Draw 100 tiles */}
              {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
                const cellX = index % GRID_SIZE;
                const cellY = Math.floor(index / GRID_SIZE);

                // Find if workstation matches
                const station = WORKSTATIONS.find(w => w.x === cellX && w.y === cellY);
                const Icon = station?.icon;

                return (
                  <div
                    key={index}
                    className={`relative aspect-square border border-border-color/10 flex items-center justify-center font-mono text-[8px] text-muted-foreground/35 select-none ${
                      station ? 'bg-muted/10 border-border-color/40 shadow-inner' : ''
                    }`}
                  >
                    {/* Render Workstation */}
                    {station && Icon && (
                      <div className={`flex flex-col items-center justify-center p-0.5 rounded border text-center ${station.color} w-11/12 h-11/12`}>
                        <Icon className="w-4 h-4 mb-0.5" />
                        <span className="text-[5px] leading-tight font-bold scale-90 truncate max-w-full">
                          {station.name.split(' ')[0]}
                        </span>
                      </div>
                    )}
                    
                    {/* Render grid coordinates for corners */}
                    {!station && (cellX === 0 || cellX === 9) && (cellY === 0 || cellY === 9) && (
                      <span>{cellX},{cellY}</span>
                    )}
                  </div>
                );
              })}

              {/* Render Animated Agent Nodes */}
              {agents.map((agent) => {
                // Calculate percentage positions for CSS rendering
                const leftPos = `calc(${agent.x * 10}% + 5% - 16px)`;
                const topPos = `calc(${agent.y * 10}% + 5% - 16px)`;

                return (
                  <motion.div
                    key={agent.id}
                    layout
                    className="absolute w-8 h-8 rounded-full flex items-center justify-center text-lg z-20 cursor-pointer shadow-lg select-none"
                    style={{
                      left: leftPos,
                      top: topPos,
                      backgroundColor: `${agent.color}20`,
                      border: `2.5px solid ${agent.color}`,
                      boxShadow: `0 0 10px ${agent.color}40`,
                      transition: { type: 'spring', stiffness: 100, damping: 12 }
                    }}
                    title={`${agent.name} (${agent.role}) - ${agent.status}`}
                  >
                    {agent.emoji}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Controllers (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Panel 1: Task Assigner */}
          <div className="p-5 rounded-2xl bg-muted/15 border border-border-color space-y-4">
            <h3 className="font-mono text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-cyan" />
              <span>Coordinated Task Assigner</span>
            </h3>

            <form onSubmit={handleAssignTask} className="space-y-4">
              <div className="space-y-1">
                <label className="block font-mono text-[10px] text-muted-foreground uppercase font-bold">Select Active Agent</label>
                <select
                  value={selectedAgentId}
                  onChange={(e) => setSelectedAgentId(e.target.value)}
                  className="w-full bg-background border border-border-color rounded-lg px-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-amber-color"
                >
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.emoji} {agent.name} ({agent.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block font-mono text-[10px] text-muted-foreground uppercase font-bold">Task Script / Job</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Audit PATH registers, Optimize CSS margin"
                    value={taskText}
                    onChange={(e) => setTaskText(e.target.value)}
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

          {/* Panel 2: Agent Factory (Creator) */}
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
                  <label className="block text-[10px] text-muted-foreground uppercase font-bold">Role</label>
                  <select
                    value={newAgentRole}
                    onChange={(e: any) => setNewAgentRole(e.target.value)}
                    className="w-full bg-background border border-border-color rounded-lg px-2 py-1.5 text-xs text-foreground"
                  >
                    <option value="Dev">Developer (Blue)</option>
                    <option value="DevOps">DevOps (Green)</option>
                    <option value="Security">Security (Gold)</option>
                    <option value="Librarian">Doc Writer (Red)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] text-muted-foreground uppercase font-bold">Personality</label>
                  <select
                    value={newAgentPersonality}
                    onChange={(e: any) => setNewAgentPersonality(e.target.value)}
                    className="w-full bg-background border border-border-color rounded-lg px-2 py-1.5 text-xs text-foreground"
                  >
                    <option value="focused">focused (moves direct)</option>
                    <option value="caffeinated">caffeinated (breaks often)</option>
                    <option value="chaotic">chaotic (sweeps randomly)</option>
                    <option value="pragmatic">pragmatic (slow & steady)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] text-muted-foreground uppercase font-bold">Agent Appearance</label>
                <div className="flex gap-2">
                  {['🦊', '🐵', '🦉', '💻', '🧠', '⚙️', '🕷️'].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setNewAgentEmoji(emoji)}
                      className={`w-7 h-7 rounded border flex items-center justify-center text-md transition-all ${
                        newAgentEmoji === emoji ? 'border-amber-color bg-amber-color/10' : 'border-border-color hover:border-border-hi'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
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

      {/* Thought Terminal / Console Logs Stream */}
      <div className="p-5 rounded-2xl bg-muted/15 border border-border-color space-y-4">
        <h3 className="font-mono text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
          <Terminal className="w-4 h-4 text-amber-color" />
          <span>Agent Logs & Reasonings</span>
        </h3>
        
        <div className="h-60 bg-[#070b12] rounded-xl border border-border-color/60 p-4 font-mono text-[11px] overflow-y-auto space-y-2 select-text selection:bg-amber-color/30 scrollbar-thin">
          {logs.map((log) => (
            <div key={log.id} className="flex items-start gap-2 leading-relaxed">
              <span className="text-muted-foreground/60">{log.timestamp}</span>
              <span className="text-cyan font-bold">[{log.agentName}]</span>
              <span className={
                log.type === 'success' ? 'text-emerald-color' : 
                log.type === 'warning' ? 'text-amber-color' : 'text-foreground/90'
              }>
                {log.message}
              </span>
            </div>
          ))}
          <div ref={consoleEndRef} />
        </div>
      </div>
    </div>
  );
}
