import { Link } from 'wouter';
import {
  LayoutDashboard,
  Zap,
  History,
  Globe,
  Plug,
  GitBranch,
  FileText,
  Settings,
  Download,
} from 'lucide-react';

const nav = [
  { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/scan', icon: Zap, label: 'Deep Scan' },
  { href: '/scan-history', icon: History, label: 'Historie scanů' },
  { href: '/domeny', icon: Globe, label: 'Portfolio domén' },
  { href: '/integrations', icon: Plug, label: 'Integrace' },
  { href: '/pipeline', icon: GitBranch, label: 'Pipeline' },
  { href: '/prompt', icon: FileText, label: 'Prompt Viewer' },
  { href: '/configure', icon: Settings, label: 'Konfigurace' },
  { href: '/install', icon: Download, label: 'Instalace' },
];

export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-zinc-800 bg-zinc-900 p-4 overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-purple-400">Affiliate Engine</h1>
        <p className="text-xs text-zinc-500 mt-1">v1.0.0</p>
      </div>

      <nav className="space-y-2">
        {nav.map(({ href, icon: Icon, label }) => (
          <Link key={href} href={href}>
            <a className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-zinc-800 transition text-zinc-300 hover:text-white text-sm">
              <Icon size={18} />
              {label}
            </a>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
