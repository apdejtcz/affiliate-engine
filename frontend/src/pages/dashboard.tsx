export default function Dashboard() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
          <div className="text-sm text-zinc-400">Celkový počet běhů</div>
          <div className="text-3xl font-bold mt-2">0</div>
        </div>
        <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
          <div className="text-sm text-zinc-400">Úspěšné běhy</div>
          <div className="text-3xl font-bold mt-2 text-green-400">0</div>
        </div>
        <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
          <div className="text-sm text-zinc-400">Chyby</div>
          <div className="text-3xl font-bold mt-2 text-red-400">0</div>
        </div>
      </div>
      <p className="text-zinc-400">Vítejte v Affiliate Engine!</p>
    </div>
  );
}
