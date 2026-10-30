import { useEffect } from 'react';

/**
 * Tabulous Games Portal Gateway
 *
 * linacre.site/games is a standalone, performance-optimized, zero-latency gaming portal.
 * If navigated within the React SPA, this component instantly redirects to the native /games portal.
 */
export default function Games() {
  useEffect(() => {
    window.location.replace('/games');
  }, []);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4 text-center font-mono">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
      <p className="text-sm text-slate-300">Launching Tabulous Games...</p>
      <a
        href="/games"
        className="rounded-lg border border-purple-500/40 bg-purple-500/10 px-4 py-2 text-xs font-semibold text-purple-200 transition-colors hover:bg-purple-500/20"
      >
        Click here if not redirected automatically
      </a>
    </div>
  );
}
