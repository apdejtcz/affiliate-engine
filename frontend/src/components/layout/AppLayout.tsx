import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import Sidebar from './Sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<'online' | 'offline'>('online');

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const data = await apiFetch<any>('/healthz');
        setMode(data.mode || 'online');
      } catch {
        setMode('offline');
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen bg-zinc-950">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        {mode === 'offline' && (
          <div className="bg-yellow-500/20 border-b border-yellow-500/30 px-4 py-2 text-sm text-yellow-400">
            ⚠️ Offline režim — zobrazují se mock/uložená data
          </div>
        )}
        <div className="flex-1 overflow-auto">{children}</div>
      </main>
    </div>
  );
}
