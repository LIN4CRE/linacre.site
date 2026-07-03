import { useState, useEffect, useRef, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Send, Plus, Bot, Coffee, Shield, Database, LayoutGrid, Award, Server, Pause, Play, Trash2, Edit2, AlertTriangle, Info } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  role: 'Dev' | 'DevOps' | 'Security' | 'Librarian';
  personality: 'focused' | 'caffeinated' | 'chaotic' | 'pragmatic';
  color: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  status: string;
  task: string;
  isPaused: boolean;
  roboticTraits: string;
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
  { name: 'Mainframe Node', x: 1, y: 1, icon: Server, color: 'text-amber-color border-amber-color/30 bg-[#161310]/80 shadow-[0_0_10px_rgba(251,191,36,0.15)]' },
  { name: 'Git Repository', x: 1, y: 8, icon: LayoutGrid, color: 'text-cyan border-cyan/30 bg-[#0d161a]/80 shadow-[0_0_10px_rgba(92,207,230,0.15)]' },
  { name: 'Database Cluster', x: 8, y: 1, icon: Database, color: 'text-purple-color border-purple-color/30 bg-[#140f1a]/80 shadow-[0_0_10px_rgba(168,85,247,0.15)]' },
  { name: 'Edge Server', x: 8, y: 8, icon: Award, color: 'text-emerald-color border-emerald-color/30 bg-[#0d1a12]/80 shadow-[0_0_10px_rgba(127,216,143,0.15)]' },
  { name: 'Game Corner Cafe', x: 5, y: 5, icon: Coffee, color: 'text-rose-400 border-rose-400/30 bg-[#1a0f12]/80 shadow-[0_0_10px_rgba(248,113,113,0.15)]' }
];

const isPathTile = (x: number, y: number): boolean => {
  if (x === 1 && y >= 1 && y <= 8) return true;
  if (x === 8 && y >= 1 && y <= 8) return true;
  if (y === 5 && x >= 1 && x <= 8) return true;
  return false;
};

// Robot SVG art components showing details like arms, legs, antennas
const DevOpsRobotSVG = ({ color }: { color: string }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    {/* Antennas */}
    <line x1="50" y1="20" x2="50" y2="5" stroke={color} strokeWidth="3" strokeLinecap="round" />
    <circle cx="50" cy="5" r="4" fill={color} />
    {/* Robotic Arms */}
    <path d="M 15 50 Q 5 40 10 30" fill="none" stroke={color} strokeWidth="4.5" strokeLinecap="round" />
    <path d="M 85 50 Q 95 40 90 30" fill="none" stroke={color} strokeWidth="4.5" strokeLinecap="round" />
    {/* Mechanical Claw Hands */}
    <path d="M 6 30 Q 10 20 15 30" fill="none" stroke={color} strokeWidth="3" />
    <path d="M 94 30 Q 90 20 85 30" fill="none" stroke={color} strokeWidth="3" />
    {/* Body chassis */}
    <rect x="25" y="35" width="50" height="45" rx="10" fill="#0d1117" stroke={color} strokeWidth="4" />
    {/* Screen Face */}
    <rect x="33" y="43" width="34" height="22" rx="4" fill="#1f2937" stroke={color} strokeWidth="2" />
    <circle cx="43" cy="54" r="3" fill={color} />
    <circle cx="57" cy="54" r="3" fill={color} />
    {/* Hydraulic Tread Legs */}
    <rect x="20" y="80" width="60" height="12" rx="6" fill="#111827" stroke={color} strokeWidth="3.5" />
    <line x1="30" y1="86" x2="70" y2="86" stroke={color} strokeWidth="2" strokeDasharray="5 4" />
  </svg>
);

const SecurityRobotSVG = ({ color }: { color: string }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    {/* Antennas */}
    <line x1="35" y1="20" x2="25" y2="8" stroke={color} strokeWidth="3" />
    <line x1="65" y1="20" x2="75" y2="8" stroke={color} strokeWidth="3" />
    <circle cx="25" cy="8" r="3.5" fill={color} />
    <circle cx="75" cy="8" r="3.5" fill={color} />
    {/* Heavy Shield Arm */}
    <path d="M 12 45 L 8 65 L 20 75 L 24 55 Z" fill="#1f2937" stroke={color} strokeWidth="3" />
    {/* Weapon Arm */}
    <path d="M 88 45 L 94 65 L 84 70" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" />
    {/* Core Body Sphere */}
    <circle cx="50" cy="48" r="28" fill="#0d1117" stroke={color} strokeWidth="4.5" />
    {/* Visor Eye */}
    <rect x="35" y="40" width="30" height="8" rx="2" fill="#ef4444" className="animate-pulse" />
    {/* Mech Legs */}
    <path d="M 38 74 L 32 92 L 24 92" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M 62 74 L 68 92 L 76 92" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DeveloperRobotSVG = ({ color }: { color: string }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    {/* Head unit */}
    <rect x="38" y="10" width="24" height="20" rx="6" fill="#0d1117" stroke={color} strokeWidth="3.5" />
    <circle cx="50" cy="20" r="4" fill="#3b82f6" className="animate-ping" />
    {/* Neck */}
    <line x1="50" y1="30" x2="50" y2="38" stroke={color} strokeWidth="4" />
    {/* Mainframe Rack Body */}
    <rect x="22" y="38" width="56" height="42" rx="4" fill="#0d1117" stroke={color} strokeWidth="4" />
    {/* LED Indicators */}
    <circle cx="34" cy="50" r="2.5" fill="#10b981" />
    <circle cx="34" cy="60" r="2.5" fill="#f59e0b" />
    <circle cx="34" cy="70" r="2.5" fill="#ef4444" />
    {/* Multi-joint robotic arms */}
    <path d="M 22 45 L 8 45 L 8 65" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M 78 45 L 92 45 L 92 65" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    {/* Wheels / Stabilizer base */}
    <circle cx="35" cy="88" r="8" fill="#111827" stroke={color} strokeWidth="3" />
    <circle cx="65" cy="88" r="8" fill="#111827" stroke={color} strokeWidth="3" />
    <line x1="28" y1="88" x2="72" y2="88" stroke={color} strokeWidth="3" />
  </svg>
);

const WriterRobotSVG = ({ color }: { color: string }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    {/* Floating drone rings */}
    <ellipse cx="50" cy="85" rx="25" ry="8" fill="none" stroke={color} strokeWidth="3" strokeDasharray="6 4" />
    {/* Hover thruster flame */}
    <path d="M 50 72 L 46 82 L 54 82 Z" fill="#38bdf8" opacity="0.8" className="animate-pulse" />
    {/* Cylindrical Body */}
    <rect x="30" y="25" width="40" height="45" rx="12" fill="#0d1117" stroke={color} strokeWidth="4" />
    {/* Scanner Visor */}
    <path d="M 36 38 Q 50 32 64 38" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
    {/* Mechanical document claw arms */}
    <path d="M 30 55 C 15 55 18 40 10 42" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
    <path d="M 70 55 C 85 55 82 40 90 42" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
  </svg>
);

export default function AgentsHub() {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: 'agent-devops',
      name: 'DevOps Bot',
      role: 'DevOps',
      personality: 'focused',
      color: '#5ccfe6',
      x: 1,
      y: 8,
      targetX: 1,
      targetY: 8,
      status: 'Awaiting tasks',
      task: 'Idle',
      isPaused: false,
      roboticTraits: 'Equipped with dual multi-joint hydraulic tread legs, high-speed claw collectors, and custom antenna signal boosters.'
    },
    {
      id: 'agent-security',
      name: 'SecShield',
      role: 'Security',
      personality: 'pragmatic',
      color: '#fbbf24',
      x: 1,
      y: 1,
      targetX: 1,
      targetY: 1,
      status: 'Monitoring registry integrity',
      task: 'Ecosystem guard duty',
      isPaused: false,
      roboticTraits: 'Forged with reinforced titanium alloy shielding, active red laser scanning visor, and stabilizing mechanical walking pads.'
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

  // Master Actions Database
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

  const consoleEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Main Simulation Loop (moves agents every 1.5 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents((prevAgents) =>
        prevAgents.map((agent) => {
          let { x, y, targetX, targetY, personality, name, isPaused } = agent;

          // Paused agents freeze completely
          if (isPaused) return agent;

          // Arrived
          if (x === targetX && y === targetY) {
            if (personality === 'caffeinated' && Math.random() < 0.25 && (x !== 5 || y !== 5)) {
              addLog(name, 'Low batteries. Relocating to Game Corner Cafe for recharging.', 'info');
              return { ...agent, targetX: 5, targetY: 5, status: 'Charging at Cafe' };
            }
            
            if (personality === 'chaotic' && Math.random() < 0.2 && agent.task === 'Idle') {
              const nextStation = WORKSTATIONS[Math.floor(Math.random() * WORKSTATIONS.length)];
              addLog(name, `Random matrix sweep to ${nextStation.name} triggered.`, 'warning');
              return { ...agent, targetX: nextStation.x, targetY: nextStation.y, status: `Roaming to ${nextStation.name}` };
            }

            if (agent.task !== 'Idle' && x !== 5 && y !== 5) {
              addLog(name, `Task complete: "${agent.task}". Delivery successful!`, 'success');
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

          return {
            ...agent,
            x: nextX,
            y: nextY,
            status: `Navigating road map (${nextX}, ${nextY})`
          };
        })
      );
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  // Update selected agent ID if agents array changes
  useEffect(() => {
    if (agents.length > 0 && !agents.some(a => a.id === selectedAgentId)) {
      setSelectedAgentId(agents[0].id);
    }
  }, [agents]);

  const addLog = (agentName: string, message: string, type: 'info' | 'success' | 'warning' = 'info') => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs((prev) => [
      ...prev,
      { id: `log-${Date.now()}-${Math.random()}`, timestamp, agentName, message, type }
    ]);
  };

  const handleAssignAction = (e: FormEvent) => {
    e.preventDefault();
    const finalActionText = customActionText.trim() || selectedAction;
    if (!finalActionText) return;

    const targetStation = WORKSTATIONS[Math.floor(Math.random() * (WORKSTATIONS.length - 1))];

    setAgents((prev) =>
      prev.map((agent) => {
        if (agent.id === selectedAgentId) {
          if (agent.isPaused) {
            addLog('System', `Cannot assign task to ${agent.name}. The agent is paused.`, 'warning');
            return agent;
          }
          addLog(agent.name, `Task assigned: "${finalActionText}". Transporting package to ${targetStation.name}...`, 'info');
          
          const updated = {
            ...agent,
            task: finalActionText,
            targetX: targetStation.x,
            targetY: targetStation.y,
            status: `Delivering cargo: ${finalActionText}`
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
  };

  const handleAddNewAction = (e: FormEvent) => {
    e.preventDefault();
    if (!newActionText.trim()) return;
    if (predefinedActions.includes(newActionText.trim())) {
      alert('Action already exists.');
      return;
    }
    setPredefinedActions((prev) => [...prev, newActionText.trim()]);
    setSelectedAction(newActionText.trim());
    addLog('System', `New action script registered: "${newActionText.trim()}"`, 'success');
    setNewActionText('');
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

    const traits = {
      Dev: 'Built with carbon-stabilized rolling wheel modules, server mainframe chassis, and precise binary scanning eyes.',
      DevOps: 'Assembled with high-torque track legs, twin mechanic claw hand grips, and an omnidirectional radar antenna.',
      Security: 'Constructed using heavy-armor alloy plating, visor sweep sensors, and mechanical multi-joint walking pads.',
      Librarian: 'Engineered as a hover drone equipped with twin stabilizer thrusters, document claw clips, and circular scanning visors.'
    };

    const newAgent: Agent = {
      id: `agent-${Date.now()}`,
      name: newAgentName.trim(),
      role: newAgentRole,
      personality: newAgentPersonality,
      color: colors[newAgentRole],
      x: 5,
      y: 5,
      targetX: 5,
      targetY: 5,
      status: 'Ready at Corner Cafe',
      task: 'Idle',
      isPaused: false,
      roboticTraits: traits[newAgentRole]
    };

    setAgents((prev) => [...prev, newAgent]);
    addLog('System', `Spawner created new agent: ${newAgent.name}`, 'success');
    setNewAgentName('');
  };

  const handleDecommissionAgent = (id: string) => {
    const targetAgent = agents.find(a => a.id === id);
    if (!targetAgent) return;
    
    if (confirm(`Decommission ${targetAgent.name} and remove from simulation grid?`)) {
      setAgents((prev) => prev.filter((a) => a.id !== id));
      addLog('System', `Agent ${targetAgent.name} successfully decommissioned and removed.`, 'warning');
      if (inspectingAgent?.id === id) {
        setInspectingAgent(null);
      }
    }
  };

  const handleTogglePauseAgent = (id: string) => {
    setAgents((prev) =>
      prev.map((agent) => {
        if (agent.id === id) {
          const updatedState = !agent.isPaused;
          addLog(agent.name, updatedState ? 'Agent paused. Grid simulation suspended.' : 'Agent resumed simulation activity.', 'info');
          const updated = {
            ...agent,
            isPaused: updatedState,
            status: updatedState ? '[PAUSED] Standing by' : 'Resuming activities'
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

  const renderAgentSVG = (role: 'Dev' | 'DevOps' | 'Security' | 'Librarian', color: string) => {
    if (role === 'DevOps') return <DevOpsRobotSVG color={color} />;
    if (role === 'Security') return <SecurityRobotSVG color={color} />;
    if (role === 'Dev') return <DeveloperRobotSVG color={color} />;
    return <WriterRobotSVG color={color} />;
  };

  return (
    <div className="space-y-12 animate-fade-in">
      {/* NO-SPEND GUARD: Prominent Billing Alert Warning Sign */}
      <div className="flex items-center gap-3 p-4 rounded-xl border border-amber-color/30 bg-[#161310] text-amber-color font-mono text-xs shadow-md">
        <AlertTriangle className="w-5 h-5 flex-shrink-0 animate-pulse text-amber-color" />
        <div className="space-y-0.5">
          <div className="font-bold uppercase tracking-wider">Simulated Sandbox Sandbox Guard</div>
          <p className="text-muted-foreground text-[10px] leading-relaxed">
            All agent activities, movements, and actions are executed in local memory simulation. The sandbox prevents the allocation of credit and protects your API keys from incurring any real-world cloud spend.
          </p>
        </div>
      </div>

      {/* Grid & Control Panel Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: 2-D Grid Simulation Card (No emulator borders, clean visuals) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="relative p-6 rounded-2xl bg-muted/10 dark:bg-[#10141d]/30 border border-border-color shadow-xl overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808007_1px,transparent_1px),linear-gradient(to_bottom,#80808007_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
            
            {/* Clean Simulation Screen */}
            <div className="relative aspect-square w-full grid grid-cols-10 border border-border-color/60 bg-[#090d14]/75 rounded-xl overflow-hidden p-1 shadow-inner">
              
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

                const station = WORKSTATIONS.find(w => w.x === cellX && w.y === cellY);
                const Icon = station?.icon;
                const isRoad = isPathTile(cellX, cellY);

                return (
                  <div
                    key={index}
                    className={`relative aspect-square flex items-center justify-center transition-all ${
                      station 
                        ? 'bg-[#1b2c1f]/40 border border-[#3e684a]/50 shadow-md' 
                        : isRoad 
                        ? 'bg-[#d2b48c]/10 border-[0.5px] border-[#c2a47c]/10' // Clean path styling
                        : 'bg-[#182315]/10 border-[0.5px] border-border-color/5' // Grass matrix style
                    }`}
                  >
                    {station && Icon && (
                      <div className={`flex flex-col items-center justify-center p-1 rounded border text-center ${station.color} w-11/12 h-11/12 scale-95`}>
                        <Icon className="w-3.5 h-3.5 mb-0.5" />
                        <span className="text-[4px] leading-tight font-mono font-bold scale-90 truncate max-w-full">
                          {station.name}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Render Animated Agent Nodes */}
              {agents.map((agent) => {
                const leftPos = `calc(${agent.x * 10}% + 5% - 18px)`;
                const topPos = `calc(${agent.y * 10}% + 5% - 18px)`;

                const isCarrying = agent.task !== 'Idle';
                const isMoving = !agent.isPaused && (agent.x !== agent.targetX || agent.y !== agent.targetY);

                return (
                  <motion.div
                    key={agent.id}
                    layout
                    onClick={() => setInspectingAgent(agent)}
                    className={`absolute w-9 h-9 rounded-full flex items-center justify-center z-20 cursor-pointer shadow-lg select-none ${
                      isMoving ? 'agent-walk-bounce' : ''
                    }`}
                    style={{
                      left: leftPos,
                      top: topPos,
                      backgroundColor: '#0c101a',
                      border: `2px solid ${agent.isPaused ? '#6b7280' : agent.color}`,
                      boxShadow: `0 0 10px ${agent.isPaused ? 'transparent' : agent.color + '40'}`,
                      opacity: agent.isPaused ? 0.6 : 1,
                      transition: { type: 'spring', stiffness: 130, damping: 14 }
                    }}
                  >
                    {/* Speech Bubble above carrying box */}
                    <div className="absolute bottom-[135%] left-1/2 transform -translate-x-1/2 bg-[#0c101a]/95 border border-border-color rounded px-2.5 py-1 text-[7px] font-mono text-foreground font-semibold leading-normal w-24 shadow-2xl pointer-events-none z-30 transition-all duration-200">
                      <div className="relative text-center">
                        I'm just doing this job
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-t-[3.5px] border-t-border-color mt-[1px]" />
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[3px] border-t-[#0c101a]" />
                      </div>
                    </div>

                    {/* Cargo Carrying Animation */}
                    {isCarrying && !agent.isPaused && (
                      <div className="absolute bottom-[75%] left-1/2 transform -translate-x-1/2 text-xs cargo-box z-30">
                        📦
                      </div>
                    )}

                    {/* Robotic SVG Sprite */}
                    <div className="w-7 h-7 p-0.5">
                      {renderAgentSVG(agent.role, agent.isPaused ? '#6b7280' : agent.color)}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Control Panels & Inspector */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Panel 1: Agent Inspector (Opens on Click) */}
          <AnimatePresence>
            {inspectingAgent ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="p-5 rounded-2xl bg-muted/15 border border-border-color/60 shadow-lg space-y-4"
              >
                <div className="flex items-center justify-between border-b border-border-color/40 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6">
                      {renderAgentSVG(inspectingAgent.role, inspectingAgent.color)}
                    </div>
                    <span className="font-mono text-xs font-bold text-foreground uppercase tracking-wider">
                      🔧 Inspector: {inspectingAgent.name}
                    </span>
                  </div>
                  <button
                    onClick={() => setInspectingAgent(null)}
                    className="text-muted-foreground hover:text-foreground text-xs font-mono"
                  >
                    [Close]
                  </button>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="p-2 rounded bg-background/50 border border-border-color/30 text-[10px] text-muted-foreground leading-relaxed">
                    <span className="text-foreground font-bold uppercase block mb-1">Robotic Hardware Details:</span>
                    {inspectingAgent.roboticTraits}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] text-muted-foreground">
                    <div><strong>Role:</strong> {inspectingAgent.role}</div>
                    <div><strong>Personality:</strong> {inspectingAgent.personality}</div>
                    <div><strong>Coordinate:</strong> ({inspectingAgent.x}, {inspectingAgent.y})</div>
                    <div><strong>Destination:</strong> ({inspectingAgent.targetX}, {inspectingAgent.targetY})</div>
                    <div className="col-span-2 text-amber-color font-bold"><strong>Current Task:</strong> {inspectingAgent.task}</div>
                    <div className="col-span-2"><strong>Status:</strong> {inspectingAgent.status}</div>
                  </div>

                  {/* Actions inside inspector */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-border-color/30">
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
                <span>Click on a robot on the grid to inspect details and pause or decommission it.</span>
              </div>
            )}
          </AnimatePresence>

          {/* Panel 2: Task Dispatcher & Predefined Actions */}
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
                      {agent.emoji} {agent.name} {agent.isPaused ? '[PAUSED]' : ''}
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

          {/* Panel 3: Add Predefined Actions Form */}
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

          {/* Panel 4: Agent Factory (Spawn Polished Agent) */}
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
                  <label className="block text-[10px] text-muted-foreground uppercase font-bold">Role & Artwork</label>
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
