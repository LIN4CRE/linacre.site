import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Braces, 
  Copy, 
  Check, 
  Sliders, 
  Search, 
  Key, 
  Sparkles, 
  AlertCircle, 
  CheckCircle, 
  RefreshCw,
  HelpCircle,
  Code,
  Lock,
  Compass
} from 'lucide-react';

interface DevPlaygroundProps {
  theme?: 'dark' | 'light';
}

export default function DevPlayground({ theme = 'dark' }: DevPlaygroundProps) {
  const [activeTool, setActiveTool] = useState<'jwt' | 'glass' | 'regex' | 'gen'>('jwt');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Sync identity parameters for active theme colors
  const [activeColor, setActiveColor] = useState({
    primary: '#f59e0b',
    secondary: '#fbbf24',
    glow: 'rgba(245, 158, 11, 0.25)',
    text: 'text-amber-color',
    bg: 'bg-amber-color/10'
  });

  const syncBrandColors = () => {
    const brandColor = localStorage.getItem('linacre_brand_color') || 'amber';
    if (brandColor === 'cyan') {
      setActiveColor({ primary: '#06b6d4', secondary: '#22d3ee', glow: 'rgba(6, 182, 212, 0.25)', text: 'text-cyan', bg: 'bg-cyan/10' });
    } else if (brandColor === 'emerald') {
      setActiveColor({ primary: '#10b981', secondary: '#34d399', glow: 'rgba(16, 185, 129, 0.25)', text: 'text-emerald-color', bg: 'bg-emerald-color/10' });
    } else if (brandColor === 'crimson') {
      setActiveColor({ primary: '#ef4444', secondary: '#f87171', glow: 'rgba(239, 68, 68, 0.25)', text: 'text-rose-500', bg: 'bg-rose-500/10' });
    } else if (brandColor === 'mono') {
      setActiveColor({ primary: '#e2e8f0', secondary: '#94a3b8', glow: 'rgba(226, 232, 240, 0.15)', text: 'text-slate-200', bg: 'bg-slate-800/40' });
    } else {
      // Amber default
      setActiveColor({ primary: '#f59e0b', secondary: '#fbbf24', glow: 'rgba(245, 158, 11, 0.25)', text: 'text-amber-color', bg: 'bg-amber-color/10' });
    }
  };

  useEffect(() => {
    syncBrandColors();
    window.addEventListener('linacre-identity-updated', syncBrandColors);
    return () => window.removeEventListener('linacre-identity-updated', syncBrandColors);
  }, []);

  const triggerCopyFeedback = (type: string) => {
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  // ==========================================
  // UTILITY 1: JWT DECODER & INSPECTOR STATE
  // ==========================================
  const defaultJwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkRhdmlkIExpbmFjcmUiLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MTc1MTYyMzkwMiwiYWRtaW4iOnRydWUsInJvbGVzIjpbIkRldmVsb3BlciIsIkRldk9wcyJdfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
  const [jwtInput, setJwtInput] = useState(defaultJwt);
  const [jwtHeader, setJwtHeader] = useState('');
  const [jwtPayload, setJwtPayload] = useState('');
  const [jwtError, setJwtError] = useState<string | null>(null);
  const [jwtExpiryStatus, setJwtExpiryStatus] = useState<'valid' | 'expired' | 'none'>('none');

  useEffect(() => {
    if (!jwtInput.trim()) {
      setJwtHeader('');
      setJwtPayload('');
      setJwtError(null);
      setJwtExpiryStatus('none');
      return;
    }

    const parts = jwtInput.split('.');
    if (parts.length !== 3) {
      setJwtError('Invalid JWT: A token must consist of 3 base64url-encoded parts separated by dots (.)');
      setJwtHeader('');
      setJwtPayload('');
      setJwtExpiryStatus('none');
      return;
    }

    try {
      const base64UrlDecode = (str: string) => {
        let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4) {
          base64 += '=';
        }
        return decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
      };

      const decodedHeader = JSON.parse(base64UrlDecode(parts[0]));
      const decodedPayload = JSON.parse(base64UrlDecode(parts[1]));

      setJwtHeader(JSON.stringify(decodedHeader, null, 2));
      setJwtPayload(JSON.stringify(decodedPayload, null, 2));
      setJwtError(null);

      // Check Expiration (exp claim)
      if (decodedPayload.exp) {
        const currentTime = Math.floor(Date.now() / 1000);
        if (decodedPayload.exp > currentTime) {
          setJwtExpiryStatus('valid');
        } else {
          setJwtExpiryStatus('expired');
        }
      } else {
        setJwtExpiryStatus('none');
      }
    } catch (e: any) {
      setJwtError(`Failed to decode JWT payload: ${e.message || 'Malformed base64 string'}`);
      setJwtHeader('');
      setJwtPayload('');
      setJwtExpiryStatus('none');
    }
  }, [jwtInput]);

  // ==========================================
  // UTILITY 2: GLASSMORPHISM BUILDER STATE
  // ==========================================
  const [glassBlur, setGlassBlur] = useState(12);
  const [glassOpacity, setGlassOpacity] = useState(25);
  const [glassBorder, setGlassBorder] = useState(1);
  const [glassGlow, setGlassGlow] = useState(4);
  const [glassColor, setGlassColor] = useState('dark'); // dark, light, brand

  const getGlassStyle = () => {
    let bg = 'rgba(16, 20, 29, 0.25)';
    let border = 'rgba(38, 45, 59, 0.4)';
    
    if (glassColor === 'light') {
      bg = `rgba(255, 255, 255, ${glassOpacity / 100})`;
      border = `rgba(228, 228, 230, ${Math.min((glassOpacity + 15) / 100, 0.8)})`;
    } else if (glassColor === 'brand') {
      // Map hex primary color to rgba
      const hexToRgb = (hex: string) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `${r}, ${g}, ${b}`;
      };
      const rgbStr = hexToRgb(activeColor.primary);
      bg = `rgba(${rgbStr}, ${glassOpacity / 250})`; // diluted so brand doesn't overwhelm
      border = `rgba(${rgbStr}, ${Math.min((glassOpacity + 20) / 100, 0.65)})`;
    } else {
      // Dark
      bg = `rgba(16, 20, 29, ${glassOpacity / 100})`;
      border = `rgba(56, 66, 79, ${Math.min((glassOpacity + 10) / 100, 0.7)})`;
    }

    return {
      background: bg,
      backdropFilter: `blur(${glassBlur}px)`,
      WebkitBackdropFilter: `blur(${glassBlur}px)`,
      border: `${glassBorder}px solid ${border}`,
      boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.37), 0 0 ${glassGlow * 4}px ${glassGlow > 0 ? '1px' : '0px'} ${activeColor.primary}${Math.floor(glassGlow * 20).toString(16).padStart(2, '0')}`
    };
  };

  const getGlassCssString = () => {
    const style = getGlassStyle();
    return `/* CSS Glassmorphism */
background: ${style.background};
backdrop-filter: ${style.backdropFilter};
-webkit-backdrop-filter: ${style.WebkitBackdropFilter};
border: ${style.border};
box-shadow: ${style.boxShadow};
border-radius: 12px;`;
  };

  const getGlassTailwindString = () => {
    let bgClass = 'bg-[#10141d]/25';
    let borderClass = 'border-border-color/40';
    if (glassColor === 'light') {
      bgClass = `bg-white/[0.${glassOpacity}]`;
      borderClass = `border-black/[0.${glassOpacity + 15}]`;
    } else if (glassColor === 'brand') {
      bgClass = `bg-[${activeColor.primary}]/[0.${Math.floor(glassOpacity / 2.5)}]`;
      borderClass = `border-[${activeColor.primary}]/[0.${glassOpacity + 20}]`;
    } else {
      bgClass = `bg-black/[0.${glassOpacity}]`;
      borderClass = `border-[#38424f]/[0.${glassOpacity + 10}]`;
    }

    return `<div className="backdrop-blur-[${glassBlur}px] ${bgClass} border-[${glassBorder}px] ${borderClass} rounded-xl shadow-lg shadow-black/35">\n  <!-- Glass Content -->\n</div>`;
  };

  // ==========================================
  // UTILITY 3: REGEX TESTER STATE
  // ==========================================
  const [regexPattern, setRegexPattern] = useState('(\\w+)@(\\w+)\\.(\\w+)');
  const [regexText, setRegexText] = useState('Contact us at david@linacre.site or engineering@linacre.site for inquiries.');
  const [regexFlags, setRegexFlags] = useState('g');
  const [regexMatches, setRegexMatches] = useState<any[]>([]);
  const [regexError, setRegexError] = useState<string | null>(null);

  useEffect(() => {
    if (!regexPattern) {
      setRegexMatches([]);
      setRegexError(null);
      return;
    }

    try {
      const re = new RegExp(regexPattern, regexFlags);
      const matches: any[] = [];
      
      if (regexFlags.includes('g')) {
        let match;
        let iteration = 0;
        re.lastIndex = 0; // reset
        
        while ((match = re.exec(regexText)) !== null) {
          iteration++;
          if (iteration > 200) {
            // Anti-infinite loop / regex DDoS safeguard
            break;
          }
          matches.push({
            index: match.index,
            value: match[0],
            groups: match.slice(1)
          });
          
          if (match[0] === '') {
            re.lastIndex++; // Avoid zero-width match infinite loops
          }
        }
      } else {
        const match = re.exec(regexText);
        if (match) {
          matches.push({
            index: match.index,
            value: match[0],
            groups: match.slice(1)
          });
        }
      }
      
      setRegexMatches(matches);
      setRegexError(null);
    } catch (e: any) {
      setRegexError(e.message || 'Invalid regular expression');
      setRegexMatches([]);
    }
  }, [regexPattern, regexText, regexFlags]);

  // Highlighting helper for Regex matches
  const renderRegexHighlightedText = () => {
    if (regexError || !regexPattern || regexMatches.length === 0) {
      return regexText;
    }

    try {
      const re = new RegExp(regexPattern, regexFlags);
      let output = '';
      let lastIndex = 0;
      let match;
      let count = 0;
      re.lastIndex = 0;

      while ((match = re.exec(regexText)) !== null) {
        count++;
        if (count > 200) break;

        const matchedText = match[0];
        const matchIndex = match.index;
        
        // Append text preceding match
        output += regexText.slice(lastIndex, matchIndex)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');

        // Append highlighted match
        output += `<span class="bg-amber-color/25 text-amber-color font-bold border-b border-amber-color/60 px-0.5 rounded px-1" title="Match ${count}">${matchedText}</span>`;
        
        lastIndex = re.lastIndex;
        if (matchedText === '') {
          re.lastIndex++;
        }
      }

      // Append remaining text
      output += regexText.slice(lastIndex)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      return output;
    } catch (e) {
      return regexText;
    }
  };

  // ==========================================
  // UTILITY 4: UUID & PASSWORD GENERATOR STATE
  // ==========================================
  const [genType, setGenType] = useState<'uuid' | 'password'>('uuid');
  const [uuidResult, setUuidResult] = useState('');
  const [passLength, setPassLength] = useState(16);
  const [passUpper, setPassUpper] = useState(true);
  const [passLower, setPassLower] = useState(true);
  const [passNumbers, setPassNumbers] = useState(true);
  const [passSymbols, setPassSymbols] = useState(true);
  const [passwordResult, setPasswordResult] = useState('');

  const generateUuid = () => {
    // Cryptographically safe UUID v4
    try {
      const cryptoObj = window.crypto;
      const uuid = '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c: any) =>
        (c ^ cryptoObj.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      );
      setUuidResult(uuid);
    } catch (e) {
      // Fallback
      const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
      setUuidResult(uuid);
    }
  };

  const generatePassword = () => {
    let charset = '';
    if (passUpper) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (passLower) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (passNumbers) charset += '0123456789';
    if (passSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!charset) {
      setPasswordResult('Please select at least one character type.');
      return;
    }

    let pass = '';
    const array = new Uint32Array(passLength);
    try {
      window.crypto.getRandomValues(array);
      for (let i = 0; i < passLength; i++) {
        pass += charset[array[i] % charset.length];
      }
    } catch (e) {
      // Fallback random
      for (let i = 0; i < passLength; i++) {
        pass += charset.charAt(Math.floor(Math.random() * charset.length));
      }
    }
    setPasswordResult(pass);
  };

  // Generate initial results
  useEffect(() => {
    generateUuid();
    generatePassword();
  }, []);

  const getPasswordStrength = () => {
    if (!passwordResult || passwordResult.includes(' ')) return { label: 'Weak', percent: 20, color: 'bg-rose-500' };
    
    let score = 0;
    if (passwordResult.length >= 8) score++;
    if (passwordResult.length >= 12) score++;
    if (passUpper) score++;
    if (passLower) score++;
    if (passNumbers) score++;
    if (passSymbols) score++;

    if (score <= 3) return { label: 'Weak', percent: 30, color: 'bg-rose-500' };
    if (score === 4 || score === 5) return { label: 'Medium', percent: 65, color: 'bg-amber-color' };
    return { label: 'Strong', percent: 100, color: 'bg-emerald-color' };
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <section className="space-y-2 animate-fade-in" id="playground-hero">
        <span className="font-mono text-xs text-amber-color tracking-widest uppercase font-semibold flex items-center gap-1.5">
          <Sliders className="w-4 h-4" />
          <span>Interactive Playground</span>
        </span>
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
          Developer Utility Suite
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-3xl">
          Clean, client-side developer tools for daily execution. Fully integrated with your active visual brand configurations, responsive, and secure.
        </p>
      </section>

      {/* Main Tabbed Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-1.5" id="playground-tabs-nav">
          <button
            onClick={() => setActiveTool('jwt')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left font-mono text-xs cursor-pointer transition-all ${
              activeTool === 'jwt'
                ? 'bg-amber-color/10 border-amber-color text-amber-color font-semibold'
                : 'bg-muted/15 dark:bg-[#10141d]/30 border-border-color/60 text-muted-foreground hover:text-foreground'
            }`}
          >
            <Braces className="w-4 h-4 text-cyan" />
            <div className="flex-1">
              <div>JWT Decoder</div>
              <div className="text-[10px] text-muted-foreground/60 font-normal leading-normal mt-0.5">Parse, decode & verify</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTool('glass')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left font-mono text-xs cursor-pointer transition-all ${
              activeTool === 'glass'
                ? 'bg-amber-color/10 border-amber-color text-amber-color font-semibold'
                : 'bg-muted/15 dark:bg-[#10141d]/30 border-border-color/60 text-muted-foreground hover:text-foreground'
            }`}
          >
            <Sparkles className="w-4 h-4 text-cyan" />
            <div className="flex-1">
              <div>Glassmorphism Builder</div>
              <div className="text-[10px] text-muted-foreground/60 font-normal leading-normal mt-0.5">Visual UI CSS generator</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTool('regex')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left font-mono text-xs cursor-pointer transition-all ${
              activeTool === 'regex'
                ? 'bg-amber-color/10 border-amber-color text-amber-color font-semibold'
                : 'bg-muted/15 dark:bg-[#10141d]/30 border-border-color/60 text-muted-foreground hover:text-foreground'
            }`}
          >
            <Search className="w-4 h-4 text-cyan" />
            <div className="flex-1">
              <div>RegEx Matcher</div>
              <div className="text-[10px] text-muted-foreground/60 font-normal leading-normal mt-0.5">Real-time matching engine</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTool('gen')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left font-mono text-xs cursor-pointer transition-all ${
              activeTool === 'gen'
                ? 'bg-amber-color/10 border-amber-color text-amber-color font-semibold'
                : 'bg-muted/15 dark:bg-[#10141d]/30 border-border-color/60 text-muted-foreground hover:text-foreground'
            }`}
          >
            <Key className="w-4 h-4 text-cyan" />
            <div className="flex-1">
              <div>Secure Generator</div>
              <div className="text-[10px] text-muted-foreground/60 font-normal leading-normal mt-0.5">UUID v4 & password keys</div>
            </div>
          </button>
        </div>

        {/* Action Canvas */}
        <div className="lg:col-span-3 border border-border-color bg-muted/10 dark:bg-[#10141d]/20 rounded-xl overflow-hidden min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTool}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.18 }}
              className="p-5 sm:p-6"
            >
              {/* JWT DECODER VIEW */}
              {activeTool === 'jwt' && (
                <div className="space-y-5" id="jwt-tool-canvas">
                  <div className="flex items-center justify-between border-b border-border-color/50 pb-3">
                    <div className="flex items-center gap-2">
                      <Braces className="w-4 h-4 text-amber-color" />
                      <h2 className="font-display text-base font-bold text-foreground">JWT Decoder & Inspector</h2>
                    </div>
                    <button
                      onClick={() => setJwtInput(defaultJwt)}
                      className="text-[10px] font-mono text-cyan hover:text-amber-color transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Reset to Sample Token</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* Input Area */}
                    <div className="space-y-2">
                      <label className="block text-xs font-mono font-semibold text-muted-foreground">Encoded JWT Token</label>
                      <textarea
                        value={jwtInput}
                        onChange={(e) => setJwtInput(e.target.value)}
                        placeholder="Paste your encoded JWT here..."
                        className="w-full h-80 p-3 bg-[#090b0f] text-xs font-mono rounded-lg border border-border-color focus:border-amber-color focus:outline-none resize-none scrollbar-thin text-[#ff79c6] break-all leading-normal"
                        id="jwt-textarea-input"
                      />
                      
                      {jwtExpiryStatus !== 'none' && (
                        <div className={`p-2.5 rounded-md border text-xs font-mono flex items-center gap-2 ${
                          jwtExpiryStatus === 'valid' 
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-color'
                            : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                        }`}>
                          {jwtExpiryStatus === 'valid' ? (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              <span>Token Expiry claim (exp) is valid & verified in future</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-4 h-4" />
                              <span>Token Expired (exp time has elapsed)</span>
                            </>
                          )}
                        </div>
                      )}

                      {jwtError && (
                        <div className="p-2.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-xs font-mono text-rose-500 flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <span>{jwtError}</span>
                        </div>
                      )}
                    </div>

                    {/* Output Code Area */}
                    <div className="space-y-4">
                      {/* Header block */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-mono font-semibold text-muted-foreground text-cyan">Decoded Header (algorithm & type)</label>
                          {jwtHeader && (
                            <button
                              onClick={() => { navigator.clipboard.writeText(jwtHeader); triggerCopyFeedback('header'); }}
                              className="text-[10px] font-mono text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer"
                            >
                              {copiedType === 'header' ? <Check className="w-3 h-3 text-emerald-color" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedType === 'header' ? 'Copied' : 'Copy JSON'}</span>
                            </button>
                          )}
                        </div>
                        <pre className="w-full h-24 p-3 bg-[#090b0f] text-[11px] font-mono rounded-lg border border-border-color overflow-y-auto scrollbar-thin text-amber-color">
                          {jwtHeader ? jwtHeader : <span className="text-muted-foreground/40">// waiting for input...</span>}
                        </pre>
                      </div>

                      {/* Payload block */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-mono font-semibold text-muted-foreground text-purple-color">Decoded Payload (claims & roles)</label>
                          {jwtPayload && (
                            <button
                              onClick={() => { navigator.clipboard.writeText(jwtPayload); triggerCopyFeedback('payload'); }}
                              className="text-[10px] font-mono text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer"
                            >
                              {copiedType === 'payload' ? <Check className="w-3 h-3 text-emerald-color" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedType === 'payload' ? 'Copied' : 'Copy JSON'}</span>
                            </button>
                          )}
                        </div>
                        <pre className="w-full h-44 p-3 bg-[#090b0f] text-[11px] font-mono rounded-lg border border-border-color overflow-y-auto scrollbar-thin text-cyan">
                          {jwtPayload ? jwtPayload : <span className="text-muted-foreground/40">// waiting for input...</span>}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* GLASSMORPHISM GENERATOR VIEW */}
              {activeTool === 'glass' && (
                <div className="space-y-5" id="glass-tool-canvas">
                  <div className="flex items-center justify-between border-b border-border-color/50 pb-3">
                    <div className="flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-amber-color" />
                      <h2 className="font-display text-base font-bold text-foreground">Glassmorphism & Shadow Builder</h2>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Controls */}
                    <div className="space-y-4 font-mono text-xs">
                      {/* Blur Slider */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between font-semibold">
                          <span className="text-muted-foreground">Backdrop Blur</span>
                          <span className="text-cyan">{glassBlur}px</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="40"
                          value={glassBlur}
                          onChange={(e) => setGlassBlur(Number(e.target.value))}
                          className="w-full accent-cyan bg-[#090b0f] h-1.5 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      {/* Opacity Slider */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between font-semibold">
                          <span className="text-muted-foreground">Glass Opacity</span>
                          <span className="text-cyan">{glassOpacity}%</span>
                        </div>
                        <input
                          type="range"
                          min="5"
                          max="90"
                          value={glassOpacity}
                          onChange={(e) => setGlassOpacity(Number(e.target.value))}
                          className="w-full accent-cyan bg-[#090b0f] h-1.5 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      {/* Border Width */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between font-semibold">
                          <span className="text-muted-foreground">Border Stroke</span>
                          <span className="text-cyan">{glassBorder}px</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="5"
                          value={glassBorder}
                          onChange={(e) => setGlassBorder(Number(e.target.value))}
                          className="w-full accent-cyan bg-[#090b0f] h-1.5 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      {/* Glow Slider */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between font-semibold">
                          <span className="text-muted-foreground">Ambient Glow Size</span>
                          <span className="text-cyan">{glassGlow}px</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="12"
                          value={glassGlow}
                          onChange={(e) => setGlassGlow(Number(e.target.value))}
                          className="w-full accent-cyan bg-[#090b0f] h-1.5 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      {/* Glass Color Tone selector */}
                      <div className="space-y-1.5">
                        <span className="block font-semibold text-muted-foreground">Background Color Tone</span>
                        <div className="flex gap-2">
                          {(['dark', 'light', 'brand'] as const).map((color) => (
                            <button
                              key={color}
                              onClick={() => setGlassColor(color)}
                              className={`flex-1 py-1 px-3 border rounded text-[10px] uppercase font-bold transition-all cursor-pointer ${
                                glassColor === color
                                  ? 'border-amber-color text-amber-color bg-amber-color/10'
                                  : 'border-border-color/60 text-muted-foreground hover:text-foreground'
                              }`}
                            >
                              {color}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Preview Panel */}
                    <div className="flex flex-col space-y-4">
                      <div className="relative h-44 rounded-xl overflow-hidden border border-border-color flex items-center justify-center bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] bg-[#090b0f]">
                        {/* Decorative floating balls behind card */}
                        <div className="absolute top-6 left-8 w-20 h-20 rounded-full bg-cyan/30 blur-md animate-pulse" />
                        <div className="absolute bottom-6 right-8 w-20 h-20 rounded-full bg-purple-color/30 blur-md animate-pulse" style={{ animationDuration: '4s' }} />

                        {/* Interactive Glass Card preview */}
                        <div
                          style={getGlassStyle()}
                          className="w-72 p-5 rounded-xl transition-all duration-150 z-10 flex flex-col justify-between"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground font-bold">Emblem Node Preview</span>
                            <Sparkles className="w-3.5 h-3.5 text-amber-color animate-spin-slow" />
                          </div>
                          <div className="space-y-1.5 my-3">
                            <div className="font-display font-bold text-xs text-foreground uppercase tracking-wide">David Christopher Linacre</div>
                            <div className="font-mono text-[9px] text-muted-foreground leading-relaxed">Adjust controls to generate code dynamically.</div>
                          </div>
                          <div className="flex items-center gap-1.5 text-[9px] font-mono text-cyan">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-color animate-ping" />
                            <span>System active</span>
                          </div>
                        </div>
                      </div>

                      {/* Code Export block */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[10px] font-mono">
                          <span className="text-muted-foreground">Output Settings</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => { navigator.clipboard.writeText(getGlassCssString()); triggerCopyFeedback('css'); }}
                              className="text-cyan hover:text-amber-color flex items-center gap-1 cursor-pointer"
                            >
                              {copiedType === 'css' ? <Check className="w-3 h-3 text-emerald-color" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedType === 'css' ? 'Copied CSS' : 'Copy CSS'}</span>
                            </button>
                            <span className="text-muted-foreground/30">|</span>
                            <button
                              onClick={() => { navigator.clipboard.writeText(getGlassTailwindString()); triggerCopyFeedback('tw'); }}
                              className="text-cyan hover:text-amber-color flex items-center gap-1 cursor-pointer"
                            >
                              {copiedType === 'tw' ? <Check className="w-3 h-3 text-emerald-color" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedType === 'tw' ? 'Copied HTML' : 'Copy Tailwind'}</span>
                            </button>
                          </div>
                        </div>
                        <pre className="p-3 bg-[#090b0f] text-[10px] font-mono rounded-lg border border-border-color h-24 overflow-y-auto scrollbar-thin text-muted-foreground select-text">
                          {getGlassCssString()}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* REGEX MATCHER VIEW */}
              {activeTool === 'regex' && (
                <div className="space-y-5" id="regex-tool-canvas">
                  <div className="flex items-center justify-between border-b border-border-color/50 pb-3">
                    <div className="flex items-center gap-2">
                      <Search className="w-4 h-4 text-amber-color" />
                      <h2 className="font-display text-base font-bold text-foreground">RegEx Matcher & Highlighting Engine</h2>
                    </div>
                  </div>

                  <div className="space-y-4 text-xs font-mono">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                      {/* Pattern */}
                      <div className="md:col-span-3 space-y-1">
                        <label className="block text-xs font-semibold text-muted-foreground">Regular Expression Pattern</label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-muted-foreground/50">/</span>
                          <input
                            type="text"
                            value={regexPattern}
                            onChange={(e) => setRegexPattern(e.target.value)}
                            placeholder="Enter regex pattern..."
                            className="w-full pl-5 pr-5 py-2 bg-[#090b0f] text-xs font-mono rounded-lg border border-border-color focus:border-amber-color focus:outline-none text-[#ffb454]"
                            id="regex-pattern-input"
                          />
                          <span className="absolute right-3 top-2.5 text-muted-foreground/50">/</span>
                        </div>
                      </div>

                      {/* Flags */}
                      <div className="md:col-span-1 space-y-1">
                        <label className="block text-xs font-semibold text-muted-foreground">Flags</label>
                        <input
                          type="text"
                          value={regexFlags}
                          onChange={(e) => setRegexFlags(e.target.value)}
                          placeholder="g, i, m..."
                          className="w-full px-3 py-2 bg-[#090b0f] text-xs font-mono rounded-lg border border-border-color focus:border-amber-color focus:outline-none text-cyan"
                          id="regex-flags-input"
                        />
                      </div>
                    </div>

                    {regexError && (
                      <div className="p-2.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-xs font-mono text-rose-500 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        <span>{regexError}</span>
                      </div>
                    )}

                    {/* Test Text */}
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-muted-foreground">Test Text String</label>
                      <textarea
                        value={regexText}
                        onChange={(e) => setRegexText(e.target.value)}
                        placeholder="Type or paste string to test regex matches..."
                        className="w-full h-24 p-3 bg-[#090b0f] text-xs font-mono rounded-lg border border-border-color focus:border-amber-color focus:outline-none resize-none scrollbar-thin text-foreground leading-relaxed"
                        id="regex-test-textarea"
                      />
                    </div>

                    {/* Highlights Output */}
                    <div className="space-y-1.5">
                      <span className="block text-xs font-semibold text-muted-foreground text-cyan">Real-Time Match Highlights</span>
                      <div 
                        className="w-full min-h-16 p-3.5 bg-[#090b0f]/50 border border-border-color/60 rounded-lg text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap select-text"
                        dangerouslySetInnerHTML={{ __html: renderRegexHighlightedText() }}
                      />
                    </div>

                    {/* Match List details */}
                    <div className="space-y-2">
                      <span className="block text-xs font-semibold text-muted-foreground">
                        Matches Found ({regexMatches.length})
                      </span>
                      <div className="max-h-36 overflow-y-auto scrollbar-thin border border-border-color/40 rounded-lg bg-[#090b0f]/20">
                        {regexMatches.map((m, idx) => (
                          <div
                            key={idx}
                            className="px-3.5 py-2 border-b border-border-color/30 flex items-center justify-between hover:bg-muted/10"
                          >
                            <span className="font-bold text-[10px] text-amber-color bg-amber-color/5 border border-amber-color/15 px-1.5 py-0.5 rounded">Match {idx + 1}</span>
                            <span className="text-[11px] text-[#ff79c6] font-semibold select-text">"{m.value}"</span>
                            <span className="text-[10px] text-muted-foreground/60">Index: {m.index}</span>
                            {m.groups.length > 0 && (
                              <span className="text-[9px] text-cyan">Groups: {JSON.stringify(m.groups)}</span>
                            )}
                          </div>
                        ))}

                        {regexMatches.length === 0 && (
                          <div className="text-center py-6 text-muted-foreground/50 text-[11px]">
                            No matches found. Adjust pattern/flags to test.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* KEYS/UUID GENERATOR VIEW */}
              {activeTool === 'gen' && (
                <div className="space-y-5" id="generator-tool-canvas">
                  <div className="flex items-center justify-between border-b border-border-color/50 pb-3">
                    <div className="flex items-center gap-2">
                      <Key className="w-4 h-4 text-amber-color" />
                      <h2 className="font-display text-base font-bold text-foreground">Secure UUID & Password Generator</h2>
                    </div>
                    {/* Inner Tabs */}
                    <div className="flex gap-1 border border-border-color/60 rounded-lg p-0.5 bg-[#090b0f]">
                      <button
                        onClick={() => setGenType('uuid')}
                        className={`px-3 py-1 font-mono text-[10px] rounded uppercase cursor-pointer font-bold ${
                          genType === 'uuid'
                            ? 'bg-amber-color/10 border border-amber-color/15 text-amber-color'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        UUID v4
                      </button>
                      <button
                        onClick={() => setGenType('password')}
                        className={`px-3 py-1 font-mono text-[10px] rounded uppercase cursor-pointer font-bold ${
                          genType === 'password'
                            ? 'bg-amber-color/10 border border-amber-color/15 text-amber-color'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        Password
                      </button>
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {genType === 'uuid' ? (
                      <motion.div
                        key="uuid"
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 6 }}
                        className="space-y-4"
                      >
                        <div className="p-5 rounded-lg border border-border-color bg-[#090b0f] flex items-center justify-between relative group">
                          <code className="text-sm font-mono font-semibold text-cyan break-all select-all pr-8" id="uuid-output-text">
                            {uuidResult}
                          </code>
                          <div className="flex gap-2 flex-shrink-0">
                            <button
                              onClick={() => { navigator.clipboard.writeText(uuidResult); triggerCopyFeedback('uuid'); }}
                              className="p-1.5 rounded hover:bg-muted/30 text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                              title="Copy UUID"
                            >
                              {copiedType === 'uuid' ? <Check className="w-4 h-4 text-emerald-color" /> : <Copy className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={generateUuid}
                              className="p-1.5 rounded hover:bg-muted/30 text-cyan hover:text-amber-color transition-all cursor-pointer"
                              title="Regenerate UUID"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="text-[11px] font-mono text-muted-foreground/60 leading-normal flex items-start gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-cyan flex-shrink-0 mt-0.5" />
                          <p>
                            Generates random UUIDs conforming to RFC 4122. Generated using cryptographically secure random number generators (`window.crypto.getRandomValues`) locally in your browser.
                          </p>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="password"
                        initial={{ opacity: 0, x: 6 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -6 }}
                        className="space-y-4 font-mono text-xs"
                      >
                        <div className="p-5 rounded-lg border border-border-color bg-[#090b0f] flex items-center justify-between relative">
                          <code className="text-sm font-mono font-semibold text-cyan break-all select-all pr-8" id="password-output-text">
                            {passwordResult}
                          </code>
                          <div className="flex gap-2 flex-shrink-0">
                            <button
                              onClick={() => { navigator.clipboard.writeText(passwordResult); triggerCopyFeedback('password'); }}
                              className="p-1.5 rounded hover:bg-muted/30 text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                              title="Copy Password"
                            >
                              {copiedType === 'password' ? <Check className="w-4 h-4 text-emerald-color" /> : <Copy className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={generatePassword}
                              className="p-1.5 rounded hover:bg-muted/30 text-cyan hover:text-amber-color transition-all cursor-pointer"
                              title="Regenerate Password"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Password strength meter */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-semibold text-muted-foreground">
                            <span>Password Strength</span>
                            <span className={getPasswordStrength().color.replace('bg-', 'text-')}>{getPasswordStrength().label}</span>
                          </div>
                          <div className="w-full h-1.5 bg-[#090b0f] rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-300 ${getPasswordStrength().color}`}
                              style={{ width: `${getPasswordStrength().percent}%` }}
                            />
                          </div>
                        </div>

                        {/* Parameter Controls */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                          <div className="space-y-1">
                            <div className="flex justify-between font-semibold">
                              <span className="text-muted-foreground">Password Length</span>
                              <span className="text-cyan">{passLength} chars</span>
                            </div>
                            <input
                              type="range"
                              min="8"
                              max="64"
                              value={passLength}
                              onChange={(e) => setPassLength(Number(e.target.value))}
                              className="w-full accent-cyan bg-[#090b0f] h-1.5 rounded-lg appearance-none cursor-pointer"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold">
                            <button
                              onClick={() => setPassUpper(!passUpper)}
                              className={`py-1.5 px-2 border rounded flex items-center justify-between cursor-pointer ${
                                passUpper ? 'border-amber-color text-amber-color bg-amber-color/10' : 'border-border-color/60 text-muted-foreground'
                              }`}
                            >
                              <span>A-Z (Uppercase)</span>
                              {passUpper ? <CheckCircle className="w-3.5 h-3.5" /> : null}
                            </button>

                            <button
                              onClick={() => setPassLower(!passLower)}
                              className={`py-1.5 px-2 border rounded flex items-center justify-between cursor-pointer ${
                                passLower ? 'border-amber-color text-amber-color bg-amber-color/10' : 'border-border-color/60 text-muted-foreground'
                              }`}
                            >
                              <span>a-z (Lowercase)</span>
                              {passLower ? <CheckCircle className="w-3.5 h-3.5" /> : null}
                            </button>

                            <button
                              onClick={() => setPassNumbers(!passNumbers)}
                              className={`py-1.5 px-2 border rounded flex items-center justify-between cursor-pointer ${
                                passNumbers ? 'border-amber-color text-amber-color bg-amber-color/10' : 'border-border-color/60 text-muted-foreground'
                              }`}
                            >
                              <span>0-9 (Numbers)</span>
                              {passNumbers ? <CheckCircle className="w-3.5 h-3.5" /> : null}
                            </button>

                            <button
                              onClick={() => setPassSymbols(!passSymbols)}
                              className={`py-1.5 px-2 border rounded flex items-center justify-between cursor-pointer ${
                                passSymbols ? 'border-amber-color text-amber-color bg-amber-color/10' : 'border-border-color/60 text-muted-foreground'
                              }`}
                            >
                              <span>!@#$ (Symbols)</span>
                              {passSymbols ? <CheckCircle className="w-3.5 h-3.5" /> : null}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
