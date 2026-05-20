import { Link } from 'wouter';

export default function NotFound() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-4xl font-bold mb-4">404 — Stránka nenalezena</h1>
      <p className="text-zinc-400 mb-8">Tato stránka neexistuje.</p>
      <Link href="/">
        <a className="text-purple-400 hover:text-purple-300">← Zpět na dashboard</a>
      </Link>
    </div>
  );
}
