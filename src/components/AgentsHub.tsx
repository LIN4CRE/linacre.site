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

// Pokémon retro styled workstation locations
const WORKSTATIONS = [
  { name: 'Mainframe Gym', x: 1, y: 1, icon: Server, color: 'text-amber-color border-amber-color/30 bg-[#161310]/80 shadow-[0_0_10px_rgba(251,191,36,0.15)]' },
  { name: 'Code PokéCenter', x: 1, y: 8, icon: LayoutGrid, color: 'text-cyan border-cyan/30 bg-[#0d161a]/80 shadow-[0_0_10px_rgba(92,207,230,0.15)]' },
  { name: 'Data Lab', x: 8, y: 1, icon: Database, color: 'text-purple-color border-purple-color/30 bg-[#140f1a]/80 shadow-[0_0_10px_rgba(168,85,247,0.15)]' },
  { name: 'Edge Power Plant', x: 8, y: 8, icon: Award, color: 'text-emerald-color border-emerald-color/30 bg-[#0d1a12]/80 shadow-[0_0_10px_rgba(127,216,143,0.15)]' },
  { name: 'Game Corner Cafe', x: 5, y: 5, icon: Coffee, color: 'text-rose-400 border-rose-400/30 bg-[#1a0f12]/80 shadow-[0_0_10px_rgba(248,113,113,0.15)]' }
];

// Helper to determine if a tile is part of the H-shaped road network
const isPathTile = (x: number, y: number): boolean => {
  // Column 1 connects Mainframe and PokéCenter
  if (x === 1 && y >= 1 && y <= 8) return true;
  // Column 8 connects Data Lab and Power Plant
  if (x === 8 && y >= 1 && y <= 8) return true;
  // Row 5 acts as the cross-street connecting the columns and Coffee Cafe
  if (y === 5 && x >= 1 && x <= 8) return true;
  return false;
};

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
      message: 'Autonomous GBA simulation grid initialized. Standing by.',
      type: 'info'
    }
  ]);

  const [selectedAgentId, setSelectedAgentId] = useState(agents[0].id);
  const [taskText, setTaskText] = useState('');
  
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentRole, setNewAgentRole] = useState<'Dev' | 'DevOps' | 'Security' | 'Librarian'>('Dev');
  const [newAgentPersonality, setNewAgentPersonality] = useState<'focused' | 'caffeinated' | 'chaotic' | 'pragmatic'>('focused');
  const [newAgentEmoji, setNewAgentEmoji] = useState('🦊');

  const consoleEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Movement & Pathfinding Logic: Forces characters to walk down the dirt roads
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents((prevAgents) =>
        prevAgents.map((agent) => {
          let { x, y, targetX, targetY, personality, name } = agent;

          // Arrived
          if (x === targetX && y === targetY) {
            if (personality === 'caffeinated' && Math.random() < 0.25 && (x !== 5 || y !== 5)) {
              addLog(name, 'Low battery. Navigating to Game Corner Cafe for charge break...', 'info');
              return { ...agent, targetX: 5, targetY: 5, status: 'Charging at Cafe' };
            }
            
            if (personality === 'chaotic' && Math.random() < 0.2 && agent.task === 'Idle') {
              const nextStation = WORKSTATIONS[Math.floor(Math.random() * WORKSTATIONS.length)];
              addLog(name, `Random sweep triggered: traveling to ${nextStation.name}`, 'warning');
              return { ...agent, targetX: nextStation.x, targetY: nextStation.y, status: `Roaming to ${nextStation.name}` };
            }

            if (agent.task !== 'Idle' && x !== 5 && y !== 5) {
              addLog(name, `Task complete: "${agent.task}". Delivery successful!`, 'success');
              return { ...agent, task: 'Idle', status: 'Idle guarding' };
            }

            return agent;
          }

          // Path routing calculations: Follows roads (Column 1, Column 8, and Row 5)
          let nextX = x;
          let nextY = y;

          // Case 1: If not on Row 5 and not on target column, first move vertically to the Row 5 cross-street
          if (y !== 5 && x !== targetX) {
            if (y < 5) nextY = y + 1;
            else nextY = y - 1;
          }
          // Case 2: On Row 5, walk horizontally to the target column
          else if (y === 5 && x !== targetX) {
            if (x < targetX) nextX = x + 1;
            else nextX = x - 1;
          }
          // Case 3: On target column, walk vertically to the target row
          else if (x === targetX && y !== targetY) {
            if (y < targetY) nextY = y + 1;
            else nextY = y - 1;
          }

          return {
            ...agent,
            x: nextX,
            y: nextY,
            status: `Walking coordinates (${nextX}, ${nextY})`
          };
        })
      );
    }, 1200); // 1.2s ticks for slightly faster pacing

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

    // Pick workstation destination
    const targetStation = WORKSTATIONS[Math.floor(Math.random() * (WORKSTATIONS.length - 1))];

    setAgents((prev) =>
      prev.map((agent) => {
        if (agent.id === selectedAgentId) {
          addLog(agent.name, `Carrying box with task: "${taskText}" to ${targetStation.name}`, 'info');
          return {
            ...agent,
            task: taskText,
            targetX: targetStation.x,
            targetY: targetStation.y,
            status: `Transporting cargo to ${targetStation.name}`
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
      status: 'Ready at Coffee Lounge',
      task: 'Idle',
      speed: 1
    };

    setAgents((prev) => [...prev, newAgent]);
    addLog('System', `New bot spawned: ${newAgent.name}`, 'success');
    
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

      {/* Classic RPG CSS Animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes rpg-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .agent-walk-bounce {
          animation: rpg-bounce 0.4s infinite ease-in-out;
        }
        @keyframes carry-float {
          0%, 100% { transform: translate(-50%, -4px); }
          50% { transform: translate(-50%, -8px); }
        }
        .cargo-box {
          animation: carry-float 0.4s infinite ease-in-out;
        }
        .pixel-borders {
          border: 4px solid #161b26;
          border-image: stretch;
        }
      `}} />

      {/* Main Grid & Controllers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Gameboy Console + 2-D Grid Simulation (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Gameboy Handheld Frame */}
          <div className="relative mx-auto max-w-[420px] bg-[#2d3748] dark:bg-[#1a202c] border-[12px] border-[#4a5568] dark:border-[#2d3748] rounded-[36px] p-6 shadow-2xl flex flex-col items-center">
            
            {/* Screen Border with classic text */}
            <div className="w-full bg-[#1a202c] border-[8px] border-[#0f172a] rounded-xl p-3 flex flex-col items-center shadow-inner relative">
              <span className="font-mono text-[7px] text-muted-foreground/60 absolute top-1 uppercase tracking-widest">
                MATRIX SCREEN COLOR · DOT MATRIX LINK
              </span>
              
              {/* Actual Game Screen */}
              <div className="relative aspect-square w-full grid grid-cols-10 border-2 border-[#161a22] bg-[#2e522e] rounded overflow-hidden mt-3 shadow-inner">
                
                {/* Render path tiles (brown roads) and grass tiles (green RPG turf) */}
                {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
                  const cellX = index % GRID_SIZE;
                  const cellY = Math.floor(index / GRID_SIZE);

                  const station = WORKSTATIONS.find(w => w.x === cellX && w.y === cellY);
                  const Icon = station?.icon;
                  const isRoad = isPathTile(cellX, cellY);

                  return (
                    <div
                      key={index}
                      className={`relative aspect-square flex items-center justify-center transition-all ${
                        station 
                          ? 'bg-[#1b2c1f] border border-[#3e684a]' 
                          : isRoad 
                          ? 'bg-[#d2b48c] border-[0.5px] border-[#c2a47c]/30 shadow-inner' // Sand/dirt path
                          : 'bg-[#407a46] border-[0.5px] border-[#37693c]/20' // Green grass
                      }`}
                    >
                      {/* Workstation Building Sprite representation */}
                      {station && Icon && (
                        <div className={`flex flex-col items-center justify-center p-0.5 rounded border text-center ${station.color} w-11/12 h-11/12 scale-95`}>
                          <Icon className="w-3.5 h-3.5 mb-0.5" />
                          <span className="text-[4px] leading-tight font-mono font-bold scale-90 truncate max-w-full">
                            {station.name.split(' ')[0]}
                          </span>
                        </div>
                      )}

                      {/* Small flower or path detail */}
                      {!station && !isRoad && (index % 13 === 0) && (
                        <span className="text-[6px] opacity-25">✿</span>
                      )}
                    </div>
                  );
                })}

                {/* Render Game Characters & Box carrying animations */}
                {agents.map((agent) => {
                  const leftPos = `calc(${agent.x * 10}% + 5% - 15px)`;
                  const topPos = `calc(${agent.y * 10}% + 5% - 15px)`;

                  const isCarrying = agent.task !== 'Idle';
                  const isMoving = agent.x !== agent.targetX || agent.y !== agent.targetY;

                  return (
                    <motion.div
                      key={agent.id}
                      layout
                      className={`absolute w-7 h-7 rounded-full flex items-center justify-center text-md z-20 select-none ${
                        isMoving ? 'agent-walk-bounce' : ''
                      }`}
                      style={{
                        left: leftPos,
                        top: topPos,
                        backgroundColor: '#162217',
                        border: `1.5px solid ${agent.color}`,
                        boxShadow: `0 0 8px ${agent.color}60`,
                        transition: { type: 'spring', stiffness: 140, damping: 13 }
                      }}
                      title={`${agent.name} (${agent.role})`}
                    >
                      {/* speech bubble above carrying box */}
                      <div className="absolute bottom-[130%] left-1/2 transform -translate-x-1/2 bg-[#0c101a]/95 border border-[#3e684a] rounded-md px-1.5 py-0.5 text-[6px] font-mono text-foreground font-semibold leading-normal w-24 shadow-2xl pointer-events-none z-30">
                        <div className="relative text-center">
                          I'm just doing this job
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[3px] border-t-[#0c101a]" />
                        </div>
                      </div>

                      {/* Render Box carried over head */}
                      {isCarrying && (
                        <div className="absolute bottom-[80%] left-1/2 transform -translate-x-1/2 text-xs cargo-box z-30">
                          📦
                        </div>
                      )}

                      <span className="relative z-10">{agent.emoji}</span>
                    </motion.div>
                  );
                })}
              </div>

              {/* Power LED Indicator */}
              <div className="absolute left-2.5 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ef4444] animate-pulse shadow-[0_0_8px_#ef4444]" />
                <span className="font-mono text-[5px] text-muted-foreground/60">POWER</span>
              </div>
            </div>

            {/* Handheld D-Pad and Buttons control mockup */}
            <div className="w-full flex items-center justify-between mt-6 px-2">
              {/* D-Pad */}
              <div className="relative w-16 h-16 flex items-center justify-center">
                <div className="absolute w-16 h-5 bg-[#718096] rounded-sm" />
                <div className="absolute h-16 w-5 bg-[#718096] rounded-sm" />
                <div className="absolute w-3.5 h-3.5 bg-[#4a5568] rounded-full" />
              </div>

              {/* Speaker Grids */}
              <div className="flex flex-col gap-1 opacity-20 transform -rotate-25">
                <div className="w-10 h-1 bg-black rounded" />
                <div className="w-10 h-1 bg-black rounded" />
                <div className="w-10 h-1 bg-black rounded" />
              </div>

              {/* A & B Buttons */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-[#9b2c2c] active:bg-[#c53030] shadow border border-black/30 flex items-center justify-center font-bold text-xs text-white/50 select-none cursor-pointer">B</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-[#9b2c2c] active:bg-[#c53030] shadow border border-black/30 flex items-center justify-center font-bold text-xs text-white/50 select-none cursor-pointer">A</div>
                </div>
              </div>
            </div>

            {/* Start & Select buttons */}
            <div className="flex gap-4 mt-4 font-mono text-[7px] text-muted-foreground/70">
              <div className="flex flex-col items-center">
                <div className="w-8 h-2 bg-[#718096] rounded transform -rotate-15 cursor-pointer" />
                <span className="mt-1">SELECT</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-2 bg-[#718096] rounded transform -rotate-15 cursor-pointer" />
                <span className="mt-1">START</span>
              </div>
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
